const ALPHABET = "0123456789abcdef";

export function hexToUint8Array(str: string) {
  const sizeof = str.length >> 1;
  const lookup = createDecodingLookup();
  const array = Array.from(
    { length: sizeof },
    (_, index) =>
      (lookup[str.charCodeAt(index * 2)] << 4) |
      lookup[str.charCodeAt(index * 2 + 1)]
  );
  return new Uint8Array(array);
}

export function uint8ArrayToHex(data: Uint8Array) {
  const lookup = createEncodingLookup();
  const hexArray = Array.from(data, (value) => lookup[value]);
  return hexArray.join("");
}

export function createDecodingLookup() {
  const decodeLookup = [...Array(256)].reduce((lookup, _, i) => {
    if (i < 16) {
      if (i < 10) {
        return { ...lookup, [0x30 + i]: i };
      } else {
        return { ...lookup, [0x61 - 10 + i]: i };
      }
    }
    return lookup;
  }, {});

  return decodeLookup;
}

export function createEncodingLookup() {
  const encodeLookup = [...Array(256)].map((_, i) => {
    return ALPHABET[(i >> 4) & 0xf] + ALPHABET[i & 0xf];
  });

  return encodeLookup;
}
