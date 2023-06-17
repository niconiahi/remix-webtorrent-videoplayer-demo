enum BencodeError {
  InvalidList = "INVALID_LIST",
  InvalidString = "INVALID_STRING",
  InvalidNumber = "INVALID_NUMBER",
}
enum BencodeType {
  List = "LIST",
  Number = "NUMBER",
  String = "STRING",
}

type BencodeList = {
  type: BencodeType.List;
  value: Array<BencodeUnit>;
  index: number;
};
type BencodeUnit = BencodeList | BencodeNumber | BencodeString;
type BencodeNumber = { type: BencodeType.Number; value: number; index: number };
type BencodeString = { type: BencodeType.String; value: string; index: number };
type BencodeStringGroup = {
  type: BencodeType.String;
  value: string;
  index: number;
};

export function decodeBencodedString(bencodedString: string) {
  const STRING_REGEX = /^(\d+):(.*)$/;
  const match = STRING_REGEX.exec(bencodedString);

  if (!match || match.length < 3) {
    throw new Error(BencodeError.InvalidString);
  }

  if (Number(match[1]) !== match[2].length) {
    throw new Error(BencodeError.InvalidString);
  }

  return match[2];
}

export function decodeBencodedNumber(bencodedNumber: string) {
  const NUMBER_REGEX = /^i(-?\d+)e$/;
  const match = NUMBER_REGEX.exec(bencodedNumber);

  if (!match || match.length < 2) {
    throw new Error(BencodeError.InvalidNumber);
  }

  return Number(match[1]);
}

function getStringsFromStringGroup(
  stringGroup: BencodeStringGroup,
  strings: BencodeString[]
) {
  const bencodedStringGroup = stringGroup.value;

  if (bencodedStringGroup.length === 0) {
    return strings;
  }

  const length = Number(bencodedStringGroup[0]);
  const bencodedString = bencodedStringGroup.slice(0, length + 2);
  const [, remainingStrings] = bencodedStringGroup.split(bencodedString);
  const nextGroup: BencodeStringGroup = {
    index: stringGroup.index + length,
    type: BencodeType.String,
    value: remainingStrings,
  };
  const string: BencodeString = {
    index: stringGroup.index,
    type: BencodeType.String,
    value: decodeBencodedString(bencodedString),
  };
  const nextStrings: BencodeString[] = [...strings, string];

  return getStringsFromStringGroup(nextGroup, nextStrings);
}

export function decodeBencodedList(
  bencodedList: string
): Array<string | number> | null {
  const LIST_REGEX = /^l(.*)e$/s;
  const NUMBER_REGEX = /i(-?\d+)e/g;
  const STRING_REGEX = /(\d+):([^i]*)/g;
  const match = LIST_REGEX.exec(bencodedList);

  if (!match || match.length < 2) {
    throw new Error(BencodeError.InvalidList);
  }
  const list = match[1];
  const numbers = [...list.matchAll(NUMBER_REGEX)].reduce(
    (prevNumbers: Array<BencodeNumber>, match) => {
      const number: BencodeNumber = {
        type: BencodeType.Number,
        index: match.index ?? 0,
        value: Number(match[1]),
      };
      const nextNumbers = [...prevNumbers, number];
      return nextNumbers;
    },
    []
  );
  const stringGroups = [...list.matchAll(STRING_REGEX)].map(
    (match) =>
      ({
        value: match[0],
        index: match.index ?? 0,
        type: BencodeType.String,
      } as BencodeString)
  );
  const strings = stringGroups.flatMap((group) =>
    getStringsFromStringGroup(group, [])
  );
  const units = [...strings, ...numbers];

  return units.sort((a, b) => a.index - b.index).map((unit) => unit.value);
}
