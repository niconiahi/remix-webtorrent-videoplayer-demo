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
