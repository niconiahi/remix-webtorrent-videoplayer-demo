import { test } from "vitest";
import { encodeUint8, decodeUint8 } from "~/utils/uint8";

test("hexToArray function", () => {
  const hex = "48656c6c6f20776f726c64"; // "Hello world" in hexadecimal
  expect(decodeUint8(hex)).toEqual(
    new Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])
  );
});

test("arrayToHex function", () => {
  const input = new Uint8Array([
    72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
  ]);
  expect(encodeUint8(input)).toEqual("48656c6c6f20776f726c64"); // "Hello world" in hexadecimal
});
