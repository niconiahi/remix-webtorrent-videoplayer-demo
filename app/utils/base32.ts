import { decodeUint8, encodeUint8 } from "~/utils/uint8";

const CHAR_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// ENCODING
export function encodeBase32(_binary: Uint8Array | string): string {
  const binary = typeof _binary === "string" ? decodeUint8(_binary) : _binary;
  const binaryData = concatenateBinaryBytes(binary);
  const segments = splitBinaryIntoSegments(binaryData, 5);
  const base32String = segments.map(binarySegmentToBase32).join("");
  const padding = getPadding(binary.length);

  return base32String + padding;
}

function byteToBinary(byte: number): string {
  return byte.toString(2).padStart(8, "0");
}

function concatenateBinaryBytes(binary: Uint8Array): string {
  return Array.from(binary).map(byteToBinary).join("");
}

function binarySegmentToBase32(binarySegment: string): string {
  const decimalValue = parseInt(binarySegment, 2);

  return CHAR_TABLE[decimalValue];
}

function getPadding(binaryLength: number): string {
  const remainder = binaryLength % 5;
  if (remainder === 0) {
    return "";
  } else {
    const paddingLength = 5 - remainder + 1;
    return "=".repeat(paddingLength);
  }
}

// DECODING
export function decodeBase32(input: string | Uint8Array): string {
  const base32String = typeof input === "string" ? input : encodeUint8(input);
  const binaryValues = Array.from(base32String)
    .filter((char) => char !== "=")
    .map(base32ToBinary);
  const binaryData = concatenateBinaryValues(binaryValues);
  const segments = splitBinaryIntoSegments(binaryData, 8);
  const decodedString = segments
    .filter((segment) => segment !== "00000000")
    .map(binaryToAscii)
    .join("");

  return decodedString;
}

function base32ToBinary(base32Char: string): string {
  const charCode = base32Char.charCodeAt(0);
  if (charCode >= 50 && charCode <= 55) {
    // Numeric characters '2' to '7'
    return (charCode - 24).toString(2).padStart(5, "0");
  } else if (charCode >= 65 && charCode <= 90) {
    // Uppercase letters 'A' to 'Z'
    return (charCode - 65).toString(2).padStart(5, "0");
  } else {
    throw new Error("Invalid Base32 character: " + base32Char);
  }
}

function concatenateBinaryValues(binaryValues: string[]): string {
  return binaryValues.join("");
}

function splitBinaryIntoSegments(
  binaryData: string,
  segmentSize: number
): string[] {
  const segments: string[] = [];
  let i = 0;
  while (i < binaryData.length) {
    let segment = binaryData.slice(i, i + segmentSize);
    if (segment.length < segmentSize) {
      segment += "0".repeat(segmentSize - segment.length);
    }
    segments.push(segment);
    i += segmentSize;
  }
  return segments;
}

function binaryToAscii(binarySegment: string): string {
  const decimalValue = parseInt(binarySegment, 2);
  return String.fromCharCode(decimalValue);
}
