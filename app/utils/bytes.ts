export function convertHexToUrlEncodedBytes(hex: string): string {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));

  for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
    const pair = hex.substring(i, i + 2);
    bytes[j] = parseInt(pair, 16);
  }

  let urlEncoded = "";
  for (let byte of bytes) {
    urlEncoded += "%" + byte.toString(16).padStart(2, "0");
  }

  return urlEncoded;
}
