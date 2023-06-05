import { decodeBase32, encodeBase32 } from "~/utils/base32";

describe("Base32 Encoding and Decoding", () => {
  describe("encode", () => {
    it.only("should encode a buffer", () => {
      const buffer = Buffer.from("Hello, World!", "utf8");
      const encoded = encodeBase32(buffer);
      const expected = "JBSWY3DPFQQFO33SNRSCC===";
      expect(encoded.toString()).toEqual(expected);
    });
    it("should encode a string", () => {
      const text = "Hello, World!";
      const encoded = encodeBase32(text);
      const expected = "JBSWY3DPFQQFO33SNRSCC===";
      expect(encoded.toString()).toEqual(expected);
    });
  });

  // describe("decode", () => {
  //   it("should decode an encoded buffer", () => {
  //     const encoded = Buffer.from("JBSWY3DPFQQFO33SNRSCC===", "utf8");
  //     const decoded = decodeBase32(encoded);
  //     const expected = Buffer.from("Hello, World!", "utf8");

  //     expect(decoded.toString()).toEqual(expected.toString());
  //   });

  //   it("should decode an encoded string", () => {
  //     const encoded = "JBSWY3DPFQQFO33SNRSCC===";
  //     const decoded = decodeBase32(encoded);
  //     const expected = Buffer.from("Hello, World!", "utf8");

  //     expect(decoded.toString()).toEqual(expected.toString());
  //   });
  // });
});
