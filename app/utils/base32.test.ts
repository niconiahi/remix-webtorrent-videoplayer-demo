import {
  asciiToBinary,
  asciiToString,
  binaryToAscii,
  binaryToDecimal,
  createBitsGroup,
  createGroupsOfEight,
  createGroupsOfEightFromFive,
  createGroupsOfFive,
  decimalToBinary,
  decimalToSymbol,
  decodeBase32,
  deleteEmptyChunks,
  encodeBase32,
  replaceEmptyBitsWithZeroes,
  replaceZeroesWithEmptyBits,
  stringToAscii,
  symbolToDecimal,
} from "~/utils/base32";

describe("encodeBase32", () => {
  test('encodes "Cat" correctly', () => {
    expect(encodeBase32("Cat")).toBe("INQXI===");
  });

  test('encodes "Hello World" correctly', () => {
    expect(encodeBase32("Hello World")).toBe("JBSWY3DPEBLW64TMMQ======");
  });

  test('encodes "Qwik is amazing!" correctly', () => {
    expect(encodeBase32("Qwik is amazing!")).toBe(
      "KF3WS2ZANFZSAYLNMF5GS3THEE======"
    );
  });

  test('encodes "A new web application for torrents is coming, just wait for it" correctly', () => {
    expect(
      encodeBase32(
        "A new web application for torrents is coming, just wait for it"
      )
    ).toBe(
      "IEQG4ZLXEB3WKYRAMFYHA3DJMNQXI2LPNYQGM33SEB2G64TSMVXHI4ZANFZSAY3PNVUW4ZZMEBVHK43UEB3WC2LUEBTG64RANF2A===="
    );
  });
});

describe("stringToAscii", () => {
  test('encodes "Cat" correctly', () => {
    expect(stringToAscii("Cat")).toStrictEqual([67, 97, 116]);
  });

  test('encodes "Hello World" correctly', () => {
    expect(stringToAscii("Hello World")).toStrictEqual([
      72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
    ]);
  });
});

describe("asciiToBinary", () => {
  test("encodes [67, 97, 116] correctly", () => {
    expect(asciiToBinary([67, 97, 116])).toStrictEqual([
      "01000011",
      "01100001",
      "01110100",
    ]);
  });

  test("encodes [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100] correctly", () => {
    expect(
      asciiToBinary([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    ).toStrictEqual([
      "01001000",
      "01100101",
      "01101100",
      "01101100",
      "01101111",
      "00100000",
      "01010111",
      "01101111",
      "01110010",
      "01101100",
      "01100100",
    ]);
  });
});

describe("createGroupsOfFive", () => {
  test(`creates the group for ["01000011", "01100001", "01110100"] correctly`, () => {
    expect(
      createGroupsOfFive(["01000011", "01100001", "01110100"])
    ).toStrictEqual([
      ["01000011", "01100001", "01110100", "xxxxxxxx", "xxxxxxxx"],
    ]);
  });

  test(`creates the group for ["01001000", "01100101", "01101100", "01101100", "01101111", "00100000", "01010111", "01101111", "01110010", "01101100", "01100100"] correctly`, () => {
    expect(
      createGroupsOfFive([
        "01001000",
        "01100101",
        "01101100",
        "01101100",
        "01101111",
        "00100000",
        "01010111",
        "01101111",
        "01110010",
        "01101100",
        "01100100",
      ])
    ).toStrictEqual([
      ["01001000", "01100101", "01101100", "01101100", "01101111"],
      ["00100000", "01010111", "01101111", "01110010", "01101100"],
      ["01100100", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
    ]);
  });
});

describe("createBitsGroup", () => {
  test(`creates group ["01000011", "01100001", "01110100", "xxxxxxxx", "xxxxxxxx"] correctly`, () => {
    expect(
      createBitsGroup([
        ["01000011", "01100001", "01110100", "xxxxxxxx", "xxxxxxxx"],
      ])
    ).toStrictEqual([
      ["01000", "01101", "10000", "10111", "0100x", "xxxxx", "xxxxx", "xxxxx"],
    ]);
  });

  test(`creates group ["01000011", "01100001", "01110100", "xxxxxxxx", "xxxxxxxx"] correctly`, () => {
    expect(
      createBitsGroup([
        ["01001000", "01100101", "01101100", "01101100", "01101111"],
        ["00100000", "01010111", "01101111", "01110010", "01101100"],
        ["01100100", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
      ])
    ).toStrictEqual([
      ["01001", "00001", "10010", "10110", "11000", "11011", "00011", "01111"],
      ["00100", "00001", "01011", "10110", "11110", "11100", "10011", "01100"],
      ["01100", "100xx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
    ]);
  });
});

describe("replaceEmptyBitsWithZeroes", () => {
  test(`replaces zeroes for ["01000", "01101", "10000", "10111", "0100x", "xxxxx", "xxxxx", "xxxxx"] correctly`, () => {
    expect(
      replaceEmptyBitsWithZeroes([
        [
          "01000",
          "01101",
          "10000",
          "10111",
          "0100x",
          "xxxxx",
          "xxxxx",
          "xxxxx",
        ],
      ])
    ).toStrictEqual([
      ["01000", "01101", "10000", "10111", "01000", "xxxxx", "xxxxx", "xxxxx"],
    ]);
  });

  test(`replaces zeroes for ["01000", "01101", "10000", "10111", "0100x", "xxxxx", "xxxxx", "xxxxx"] correctly`, () => {
    expect(
      replaceEmptyBitsWithZeroes([
        [
          "01001",
          "00001",
          "10010",
          "10110",
          "11000",
          "11011",
          "00011",
          "01111",
        ],
        [
          "00100",
          "00001",
          "01011",
          "10110",
          "11110",
          "11100",
          "10011",
          "01100",
        ],
        [
          "01100",
          "100xx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
        ],
      ])
    ).toStrictEqual([
      ["01001", "00001", "10010", "10110", "11000", "11011", "00011", "01111"],
      ["00100", "00001", "01011", "10110", "11110", "11100", "10011", "01100"],
      ["01100", "10000", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
    ]);
  });
});

describe("binaryToDecimal", () => {
  test(`replaces zeroes for ["01000", "01101", "10000", "10111", "01000", "xxxxx", "xxxxx", "xxxxx"] correctly`, () => {
    expect(
      binaryToDecimal([
        [
          "01000",
          "01101",
          "10000",
          "10111",
          "01000",
          "xxxxx",
          "xxxxx",
          "xxxxx",
        ],
      ])
    ).toStrictEqual([[8, 13, 16, 23, 8, "=", "=", "="]]);
  });

  test(`replaces zeroes for ["01000", "01101", "10000", "10111", "01000", "xxxxx", "xxxxx", "xxxxx"] correctly`, () => {
    expect(
      binaryToDecimal([
        [
          "01001",
          "00001",
          "10010",
          "10110",
          "11000",
          "11011",
          "00011",
          "01111",
        ],
        [
          "00100",
          "00001",
          "01011",
          "10110",
          "11110",
          "11100",
          "10011",
          "01100",
        ],
        [
          "01100",
          "10000",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
        ],
      ])
    ).toStrictEqual([
      [9, 1, 18, 22, 24, 27, 3, 15],
      [4, 1, 11, 22, 30, 28, 19, 12],
      [12, 16, "=", "=", "=", "=", "=", "="],
    ]);
  });
});

describe("decimalToSymbol", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(decimalToSymbol([[8, 13, 16, 23, 8, "=", "=", "="]])).toStrictEqual([
      ["I", "N", "Q", "X", "I", "=", "=", "="],
    ]);
  });

  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      decimalToSymbol([
        [9, 1, 18, 22, 24, 27, 3, 15],
        [4, 1, 11, 22, 30, 28, 19, 12],
        [12, 16, "=", "=", "=", "=", "=", "="],
      ])
    ).toStrictEqual([
      ["J", "B", "S", "W", "Y", "3", "D", "P"],
      ["E", "B", "L", "W", "6", "4", "T", "M"],
      ["M", "Q", "=", "=", "=", "=", "=", "="],
    ]);
  });
});

describe("decodeBase32", () => {
  test('decodes "JBSWY3DPEBLW64TMMQ======" correctly', () => {
    expect(decodeBase32("JBSWY3DPEBLW64TMMQ======")).toBe("Hello World");
  });

  test('decodes "IEQG4ZLXEB3WKYRAMFYHA3DJMNQXI2LPNYQGM33SEB2G64TSMVXHI4ZANFZSAY3PNVUW4ZZMEBVHK43UEB3WC2LUEBTG64RANF2A====" correctly', () => {
    expect(
      decodeBase32(
        "IEQG4ZLXEB3WKYRAMFYHA3DJMNQXI2LPNYQGM33SEB2G64TSMVXHI4ZANFZSAY3PNVUW4ZZMEBVHK43UEB3WC2LUEBTG64RANF2A===="
      )
    ).toBe("A new web application for torrents is coming, just wait for it");
  });
});

describe("createGroupsOfEight", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(createGroupsOfEight("JBSWY3DPEBLW64TMMQ======")).toStrictEqual([
      ["J", "B", "S", "W", "Y", "3", "D", "P"],
      ["E", "B", "L", "W", "6", "4", "T", "M"],
      ["M", "Q", "=", "=", "=", "=", "=", "="],
    ]);
  });
});

describe("createGroupsOfEight", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(createGroupsOfEight("JBSWY3DPEBLW64TMMQ======")).toStrictEqual([
      ["J", "B", "S", "W", "Y", "3", "D", "P"],
      ["E", "B", "L", "W", "6", "4", "T", "M"],
      ["M", "Q", "=", "=", "=", "=", "=", "="],
    ]);
  });
});

describe("symbolToDecimal", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      symbolToDecimal([
        ["J", "B", "S", "W", "Y", "3", "D", "P"],
        ["E", "B", "L", "W", "6", "4", "T", "M"],
        ["M", "Q", "=", "=", "=", "=", "=", "="],
      ])
    ).toStrictEqual([
      [9, 1, 18, 22, 24, 27, 3, 15],
      [4, 1, 11, 22, 30, 28, 19, 12],
      [12, 16, "=", "=", "=", "=", "=", "="],
    ]);
  });
});

describe("decimalToBinary", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      decimalToBinary([
        [9, 1, 18, 22, 24, 27, 3, 15],
        [4, 1, 11, 22, 30, 28, 19, 12],
        [12, 16, "=", "=", "=", "=", "=", "="],
      ])
    ).toStrictEqual([
      ["01001", "00001", "10010", "10110", "11000", "11011", "00011", "01111"],
      ["00100", "00001", "01011", "10110", "11110", "11100", "10011", "01100"],
      ["01100", "10000", "=", "=", "=", "=", "=", "="],
    ]);
  });
});

describe("replaceZeroesWithEmptyBits", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      replaceZeroesWithEmptyBits([
        [
          "01001",
          "00001",
          "10010",
          "10110",
          "11000",
          "11011",
          "00011",
          "01111",
        ],
        [
          "00100",
          "00001",
          "01011",
          "10110",
          "11110",
          "11100",
          "10011",
          "01100",
        ],
        [
          "01100",
          "10000",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
        ],
      ])
    ).toStrictEqual([
      ["01001", "00001", "10010", "10110", "11000", "11011", "00011", "01111"],
      ["00100", "00001", "01011", "10110", "11110", "11100", "10011", "01100"],
      ["01100", "100xx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
    ]);
  });
});

describe("replaceZeroesWithEmptyBits", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      createGroupsOfEightFromFive([
        [
          "01001",
          "00001",
          "10010",
          "10110",
          "11000",
          "11011",
          "00011",
          "01111",
        ],
        [
          "00100",
          "00001",
          "01011",
          "10110",
          "11110",
          "11100",
          "10011",
          "01100",
        ],
        [
          "01100",
          "100xx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
          "xxxxx",
        ],
      ])
    ).toStrictEqual([
      ["01001000", "01100101", "01101100", "01101100", "01101111"],
      ["00100000", "01010111", "01101111", "01110010", "01101100"],
      ["01100100", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
    ]);
  });
});

describe("deleteEmptyChunks", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      deleteEmptyChunks([
        ["01001000", "01100101", "01101100", "01101100", "01101111"],
        ["00100000", "01010111", "01101111", "01110010", "01101100"],
        ["01100100", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
      ])
    ).toStrictEqual([
      "01001000",
      "01100101",
      "01101100",
      "01101100",
      "01101111",
      "00100000",
      "01010111",
      "01101111",
      "01110010",
      "01101100",
      "01100100",
    ]);
  });
});

describe("binaryToAscii", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      binaryToAscii([
        "01001000",
        "01100101",
        "01101100",
        "01101100",
        "01101111",
        "00100000",
        "01010111",
        "01101111",
        "01110010",
        "01101100",
        "01100100",
      ])
    ).toStrictEqual([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]);
  });
});

describe("binaryToAscii", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(
      asciiToString([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    ).toStrictEqual(["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]);
  });
});
