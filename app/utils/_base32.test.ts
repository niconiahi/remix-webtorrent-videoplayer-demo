import {
  asciiToBinary,
  binaryToDecimal,
  createBitsGroup,
  createGroupsOfFive,
  decimalToSymbol,
  encodeBase32,
  replaceEmptyBitsWithZeroes,
  stringToAscii,
} from "./_base32";

describe("encodeBase32", () => {
  test('encodes "Cat" correctly', () => {
    expect(encodeBase32("Cat")).toBe("INQXI===");
  });

  // test('encodes "Hello World" correctly', () => {
  //   expect(encodeBase32("Hello World")).toBe("JBSWY3DPEBLW64TMMQ======");
  // });
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
      "01000011",
      "01100001",
      "01110100",
      "xxxxxxxx",
      "xxxxxxxx",
    ]);
  });

  // test.only(`creates the group for ["01001000", "01100101", "01101100", "01101100", "01101111", "00100000", "01010111", "01101111", "01110010", "01101100", "01100100"] correctly`, () => {
  //   expect(
  //     createGroupsOfFive([
  //       "01001000",
  //       "01100101",
  //       "01101100",
  //       "01101100",
  //       "01101111",
  //       "00100000",
  //       "01010111",
  //       "01101111",
  //       "01110010",
  //       "01101100",
  //       "01100100",
  //     ])
  //   ).toStrictEqual([
  //     ["01001000", "01100101", "01101100", "01101100", "01101111"],
  //     ["00100000", "01010111", "01101111", "01110010", "01101100"],
  //     ["01100100", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
  //   ]);
  // });
});

describe("createBitsGroup", () => {
  test(`creates group ["01000011", "01100001", "01110100", "xxxxxxxx", "xxxxxxxx"] correctly`, () => {
    expect(
      createBitsGroup([
        "01000011",
        "01100001",
        "01110100",
        "xxxxxxxx",
        "xxxxxxxx",
      ])
    ).toStrictEqual([
      "01000",
      "01101",
      "10000",
      "10111",
      "0100x",
      "xxxxx",
      "xxxxx",
      "xxxxx",
    ]);
  });
});

describe("replaceEmptyBitsWithZeroes", () => {
  test(`replaces zeroes for ["01000", "01101", "10000", "10111", "0100x", "xxxxx", "xxxxx", "xxxxx"] correctly`, () => {
    expect(
      replaceEmptyBitsWithZeroes([
        "01000",
        "01101",
        "10000",
        "10111",
        "0100x",
        "xxxxx",
        "xxxxx",
        "xxxxx",
      ])
    ).toStrictEqual([
      "01000",
      "01101",
      "10000",
      "10111",
      "01000",
      "xxxxx",
      "xxxxx",
      "xxxxx",
    ]);
  });
});

describe("binaryToDecimal", () => {
  test(`replaces zeroes for ["01000", "01101", "10000", "10111", "01000", "xxxxx", "xxxxx", "xxxxx"] correctly`, () => {
    expect(
      binaryToDecimal([
        "01000",
        "01101",
        "10000",
        "10111",
        "01000",
        "xxxxx",
        "xxxxx",
        "xxxxx",
      ])
    ).toStrictEqual([8, 13, 16, 23, 8, "=", "=", "="]);
  });
});

describe("decimalToSymbol", () => {
  test(`replaces zeroes for [8, 13, 16, 23, 8, "=", "=", "="] correctly`, () => {
    expect(decimalToSymbol([8, 13, 16, 23, 8, "=", "=", "="])).toStrictEqual([
      "I",
      "N",
      "Q",
      "X",
      "I",
      "=",
      "=",
      "=",
    ]);
  });
});
