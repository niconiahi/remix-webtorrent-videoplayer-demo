export function encodeBase32(string: string) {
  // word is "Cat"
  //
  // 1. convert each character into ASCII decimal values
  // [67, 97, 116]
  const ascii = stringToAscii(string);
  //
  // 2.	convert each ASCII decimal value into bytes
  // [01000011, 01100001, 01110100]
  const bytes = asciiToBinary(ascii);
  //
  // 3. convert the bytes stream into groups of 5
  // const group = [01000011, 01100001, 01110100, xxxxxxxx, xxxxxxxx]
  const chunks = createGroupsOfFive(bytes);
  //
  // 4. divide group into 8 chunks of 5 bits
  // const chunks = [01000, 01101, 10000, 10111, 0100x, xxxxx, xxxxx, xxxxx]
  const nextChunks = createBitsGroup(chunks);
  //
  // 5. if a chunk has both bits and empty bits, replace the empty bits with 0's (zeros)
  // const chunks = [01000, 01101, 10000, 10111, 01000, xxxxx, xxxxx, xxxxx]
  const filledChunks = replaceEmptyBitsWithZeroes(nextChunks);
  //
  // 6. convert each 5 bits chunk to its decimal value (0-31),
  //    if a chunk contains empty bits, replace with character "="
  // const chunks = [8, 13, 16, 23, 8, =, =, =]
  const decimals = binaryToDecimal(filledChunks);
  //
  // 7. in the base-32 symbol chart, map each decimal value to its corresponding character
  // const chunks = [I, N, Q, X, I, =, =, =]
  const symbols = decimalToSymbol(decimals);
  // excellent explanatory video
  // https://www.youtube.com/watch?v=Va8FLD-iuTg
  //
  // 8. join the symbols to conform the encoded string
  const encodedString = composeEncodedString(symbols);

  return encodedString;
}

function composeEncodedString(symbols: string[][]) {
  return symbols.flatMap((symbol) => symbol.join("")).join("");
}

// 1
export function stringToAscii(string: string): number[] {
  return [...string].map((c) => c.charCodeAt(0));
}

// 2
export function asciiToBinary(asciis: number[]): string[] {
  return asciis.map((num) => num.toString(2).padStart(8, "0"));
}

// 3
export function createGroupsOfFive(binaries: string[]): string[][] {
  const groups = binaries
    .reduce<string[][]>((prevGroups, c) => {
      const lastChunk = prevGroups[prevGroups.length - 1] ?? [];

      if (lastChunk.length === 5) {
        return [...prevGroups, [c]];
      } else {
        return [...prevGroups.slice(0, -1), [...lastChunk, c]];
      }
    }, [])
    .map((group) => {
      return Array.from({ length: 5 }).map((_, i) => group[i] ?? "xxxxxxxx");
    });

  return groups;
}

// 4
export function createBitsGroup(groups: string[][]): string[][] {
  const chunks = groups.map((group) => {
    return [...group.join("")]
      .reduce<string[][]>((prevChunks, c) => {
        const lastChunk = prevChunks[prevChunks.length - 1] ?? [];

        if (lastChunk.length === 5) {
          return [...prevChunks, [c]];
        } else {
          return [...prevChunks.slice(0, -1), [...lastChunk, c]];
        }
      }, [])
      .map((chunk) => {
        if (chunk.length === 5) {
          return chunk;
        } else {
          return Array.from({ length: 5 }).map((_, i) => chunk[i] ?? "x");
        }
      })
      .map((chunk) => chunk.join(""));
  });

  return chunks;
}

// 5
export function replaceEmptyBitsWithZeroes(chunks: string[][]): string[][] {
  return chunks.map((_chunk) => {
    return _chunk.map((chunk) => {
      if (chunk[0] === "x") {
        return chunk;
      } else {
        return Array.from({ length: 5 })
          .map((_, i) => (chunk[i] !== "x" ? chunk[i] : "0"))
          .join("");
      }
    });
  });
}

// 6
export function binaryToDecimal(chunks: string[][]): (number | string)[][] {
  return chunks.map((_chunk) => {
    return _chunk.map((chunk) => {
      if (chunk[0] === "x") {
        return "=";
      } else {
        return parseInt(chunk, 2);
      }
    });
  });
}

// 7
export function decimalToSymbol(decimals: (number | string)[][]): string[][] {
  return decimals.map((_decimal) => {
    return _decimal.map((decimal) => {
      if (decimal === "=") {
        return decimal;
      } else {
        return BASE_32_SYMBOLS[decimal as number];
      }
    });
  });
}

const BASE_32_SYMBOLS: { [key: number]: string } = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "I",
  9: "J",
  10: "K",
  11: "L",
  12: "M",
  13: "N",
  14: "O",
  15: "P",
  16: "Q",
  17: "R",
  18: "S",
  19: "T",
  20: "U",
  21: "V",
  22: "W",
  23: "X",
  24: "Y",
  25: "Z",
  26: "2",
  27: "3",
  28: "4",
  29: "5",
  30: "6",
  31: "7",
};

export function decodeBase32(encodedString: string) {
  // encoded string is "JBSWY3DPEBLW64TMMQ======"
  //
  // 1. convert the encoded string into an array of arrays of 8 elements
  const chunks = createGroupsOfEight(encodedString);
  // const chunks = [
  //   ["J", "B", "S", "W", "Y", "3", "D", "P"],
  //   ["E", "B", "L", "W", "6", "4", "T", "M"],
  //   ["M", "Q", "=", "=", "=", "=", "=", "="],
  // ]
  //
  // 2. convert the base-32 symbols back to its decimal representation
  //    if a chunk contains empty bits, replace with character "="
  const _chunks = symbolToDecimal(chunks);
  // const chunks = [
  //   [9, 1, 18, 22, 24, 27, 3, 15],
  //   [4, 1, 11, 22, 30, 28, 19, 12],
  //   [12, 16, "=", "=", "=", "=", "=", "="],
  // ];
  //
  // 3. convert each decimal representation to binary, if it's '=', replace it with "xxxxx"
  const __chunks = decimalToBinary(_chunks);
  // const chunks = [
  //   ["01001", "00001", "10010", "10110", "11000", "11011", "00011", "01111"],
  //   ["00100", "00001", "01011", "10110", "11110", "11100", "10011", "01100"],
  //   ["01100", "10000", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
  // ];
  //
  // 4. divide group into 8 chunks of 5 bits
  const ___chunks = replaceZeroesWithEmptyBits(__chunks);
  // const chunks = [
  //   ["01001", "00001", "10010", "10110", "11000", "11011", "00011", "01111"],
  //   ["00100", "00001", "01011", "10110", "11110", "11100", "10011", "01100"],
  //   ["01100", "100xx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
  // ];
  //
  // 5. convert the bytes stream into groups of 5
  const ____chunks = createGroupsOfEightFromFive(___chunks);
  // const groups = [
  //   ["01001000", "01100101", "01101100", "01101100", "01101111"],
  //   ["00100000", "01010111", "01101111", "01110010", "01101100"],
  //   ["01100100", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
  // ];
  //
  // 6.	convert each byte into ASCII decimal value
  const _____chunks = deleteEmptyChunks(____chunks);
  // const bytes = [
  //   "01001000",
  //   "01100101",
  //   "01101100",
  //   "01101100",
  //   "01101111",
  //   "00100000",
  //   "01010111",
  //   "01101111",
  //   "01110010",
  //   "01101100",
  //   "01100100",
  // ];
  //
  const ______chunks = binaryToAscii(_____chunks);
  // 7. convert each ASCII decimal into its character value
  const _______chunks = asciiToString(______chunks);
  // const asciis = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];

  return _______chunks.join("");
}

// 1
export function createGroupsOfEight(encodedString: string): string[][] {
  const groups = encodedString
    .split("")
    .reduce<string[][]>((prevGroups, c) => {
      const lastChunk = prevGroups[prevGroups.length - 1] ?? [];

      if (lastChunk.length === 8) {
        return [...prevGroups, [c]];
      } else {
        return [...prevGroups.slice(0, -1), [...lastChunk, c]];
      }
    }, [])
    .map((group) => {
      return Array.from({ length: 8 }).map((_, i) => group[i] ?? "=");
    });

  return groups;
}

// 2
export function symbolToDecimal(symbols: string[][]): (number | string)[][] {
  return symbols.map((_symbol) => {
    return _symbol.map((symbol) => {
      if (symbol === "=") {
        return symbol;
      } else {
        return SWAPPED_BASE_32_SYMBOLS[symbol];
      }
    });
  });
}

// 3
export function decimalToBinary(decimals: (number | string)[][]): string[][] {
  return decimals.map((_decimal) => {
    return _decimal.map((decimal) => {
      return decimal === "=" ? "=" : decimal.toString(2).padStart(5, "0");
    });
  });
}

// 4
export function replaceZeroesWithEmptyBits(chunks: string[][]): string[][] {
  const string = chunksToString(chunks);
  const limit = getNearestMultipleOfEight(string.replace(/x/g, "").length);
  const nextString = string.slice(0, limit).padEnd(string.length, "x");

  return _createGroupsOfFive(nextString);
}

function _createGroupsOfFive(input: string): string[][] {
  const limit = Math.ceil(input.length / 40) * 40;
  const groups = Array.from({ length: limit / 40 }, (_, i) =>
    Array.from({ length: 8 }, (_, j) =>
      input.slice(i * 40 + j * 5, i * 40 + j * 5 + 5)
    )
  );

  return groups;
}

function chunksToString(chunks: string[][]) {
  return chunks.flatMap((_chunk) => _chunk.flatMap((chunk) => chunk)).join("");
}

function getNearestMultipleOfEight(n: number): number {
  const lower = Math.floor(n / 8) * 8;
  const upper = Math.ceil(n / 8) * 8;

  return n - lower < upper - n ? lower : upper;
}

// 5
export function createGroupsOfEightFromFive(chunks: string[][]): string[][] {
  const string = chunksToString(chunks);
  const groups = _createGroupsOfEight(string);

  return groups;
}

function _createGroupsOfEight(input: string): string[][] {
  const limit = Math.ceil(input.length / 40) * 40;
  const groups = Array.from({ length: limit / 40 }, (_, i) =>
    Array.from({ length: 5 }, (_, j) =>
      input.slice(i * 40 + j * 8, i * 40 + j * 8 + 8)
    )
  );

  return groups;
}

// 6
export function deleteEmptyChunks(chunks: string[][]): string[] {
  const string = chunksToString(chunks);
  const groups = _createGroupsOfEight(string.replace(/x/g, ""))
    .flat()
    .filter(Boolean);

  return groups;
}

// 7
export function binaryToAscii(binaries: string[]): number[] {
  return binaries.map((binaryString) => parseInt(binaryString, 2));
}

// 8
export function asciiToString(asciis: number[]): string[] {
  return asciis.filter(Boolean).map((ascii) => String.fromCharCode(ascii));
}

const SWAPPED_BASE_32_SYMBOLS: { [key: string]: number } = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  "2": 26,
  "3": 27,
  "4": 28,
  "5": 29,
  "6": 30,
  "7": 31,
};
