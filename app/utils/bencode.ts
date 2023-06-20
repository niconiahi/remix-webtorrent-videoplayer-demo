function decodeString(bdata: string) {
  if (isNaN(Number(bdata[0]))) {
    throw new Error("invalid string identifier, it should start with a number");
  }

  let delimPos = bdata.indexOf(":");
  let length = parseInt(bdata.slice(0, delimPos));

  const start = delimPos + 1;
  let string = bdata.slice(start, start + length);
  bdata = bdata.slice(start + length);

  if (string.length != length) {
    throw new Error("Incorrect bencoded string length");
  }

  return [string, bdata];
}

function decodeNumber(bdata: string) {
  if (bdata[0] !== "i") {
    throw new Error('invalid number identifier, it should start with "i"');
  }

  const end = bdata.indexOf("e");
  const number = bdata.slice(1, end);
  bdata = bdata.slice(end + 1);

  return [Number(number), bdata];
}

function decodeList(bdata: string) {
  if (bdata[0] !== "l") {
    throw new Error('invalid list identifier, it should start with "l"');
  }

  let list: any[] = [];
  bdata = bdata.slice(1);

  while (bdata[0] !== "" && bdata[0] !== "e" && bdata[0] !== undefined) {
    const decoder = getDecoder(bdata[0]);
    const [item, remaining] = decoder(bdata);

    list.push(item);
    bdata = remaining;
  }

  return [list, bdata.slice(1)];
}

function decodeDictionary(bdata: string) {
  if (bdata[0] !== "d") {
    throw new Error('invalid dictionary identifier, it should start with "d"');
  }

  let dictionary: { [key: string]: any } = {};
  bdata = bdata.slice(1);

  while (bdata[0] != "" && bdata[0] != "e") {
    const decoder = getDecoder(bdata[0]);
    let [key, remaining] = decoder(bdata);
    let value: any;

    if (
      (remaining[0] as unknown as string) === "" ||
      remaining[0] === "e" ||
      remaining[0] === undefined
    ) {
      value = null;
    } else {
      const decoder = getDecoder(remaining[0]);
      [value, remaining] = decoder(remaining);
    }

    if (key in dictionary) {
      throw new Error(
        "there are repeated keys in this object. That is not valid"
      );
    }

    dictionary[key] = value;
    bdata = remaining;
  }

  return [dictionary, bdata.slice(1)];
}

const types = {
  l: decodeList,
  i: decodeNumber,
  d: decodeDictionary,
  // or any interger
};

function getDecoder(type: string) {
  return types[type as "l" | "i" | "d"] ?? decodeString;
}

export function decodeBencodedData(bdata: string) {
  if (
    Object.keys(types).every((possibleType) => possibleType !== bdata[0]) &&
    isNaN(Number(bdata[0]))
  ) {
    throw new Error("invalid encoded value");
  }
  const decoder = getDecoder(bdata[0]);

  return decoder(bdata)[0];
}
