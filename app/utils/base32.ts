const CHAR_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// ENCODING
function byteToBinary(byte: number): string {
  return byte.toString(2).padStart(8, "0");
}

function concatenateBinaryBytes(buffer: Buffer): string {
  return Array.from(buffer).map(byteToBinary).join("");
}

function binarySegmentToBase32(binarySegment: string): string {
  const decimalValue = parseInt(binarySegment, 2);

  return CHAR_TABLE[decimalValue];
}

function getPadding(bufferLength: number): string {
  const remainder = bufferLength % 5;
  if (remainder === 0) {
    return "";
  } else {
    const paddingLength = 5 - remainder + 1;
    return "=".repeat(paddingLength);
  }
}

export function encodeBase32(_buffer: Buffer | string): string {
  const buffer = typeof _buffer === "string" ? Buffer.from(_buffer) : _buffer;
  const binaryData = concatenateBinaryBytes(buffer);
  const segments = splitBinaryIntoSegments(binaryData, 5);
  const base32String = segments.map(binarySegmentToBase32).join("");
  const padding = getPadding(buffer.length);

  return base32String + padding;
}

// DECODING
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

export function decodeBase32(input: string | Buffer): string {
  const base32String =
    typeof input === "string" ? input : Buffer.from(input).toString();
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
