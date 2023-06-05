import { test } from "vitest";
import { uint8ArrayToHex, hexToUint8Array } from "~/utils/uint8";

test("hexToArray function", () => {
  const hex = "48656c6c6f20776f726c64"; // "Hello world" in hexadecimal
  const expected = new Uint8Array([
    72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
  ]);
  expect(hexToUint8Array(hex)).toEqual(expected);
});

test("arrayToHex function", () => {
  const input = new Uint8Array([
    72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
  ]);
  const expected = "48656c6c6f20776f726c64"; // "Hello world" in hexadecimal
  expect(uint8ArrayToHex(input)).toEqual(expected);
});
