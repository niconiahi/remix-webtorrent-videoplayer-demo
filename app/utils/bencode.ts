function decodeString(bdata: string) {
  console.log("--------------");

  if (isNaN(Number(bdata[0]))) {
    throw new Error("invalid string identifier, it should start with a number");
  }

  const delimiter = bdata.indexOf(":");
  const length = parseInt(bdata.slice(0, delimiter));
  const start = delimiter + 1;
  const string = bdata.slice(start, start + length);

  console.log("start =>", start);
  console.log("initial bdata =>", bdata);
  console.log("initial bdata length =>", bdata.length);
  console.log("string captured =>", string);
  console.log("string captured length =>", string.length);
  console.log("amount to be sliced =>", length + start);

  bdata = bdata.slice(start + length);
  console.log("remaning bdata =>", bdata);
  console.log("remaning bdata length =>", bdata.length);

  if (string.length !== length) {
    const encoder = new TextEncoder();

    return [parsePeers(encoder.encode(string)), bdata];
  }

  return [string, bdata];
}

function decodeNumber(bdata: string) {
  if (bdata[0] !== "i") {
    throw new Error('invalid number identifier, it should start with "i"');
  }

  const end = bdata.indexOf("e");
  const number = bdata.slice(1, end);
  bdata = bdata.slice(end + 1);

  return [Number(number), bdata];
}

function decodeList(bdata: string) {
  if (bdata[0] !== "l") {
    throw new Error('invalid list identifier, it should start with "l"');
  }

  let list: any[] = [];
  bdata = bdata.slice(1);

  while (bdata[0] !== "" && bdata[0] !== "e" && bdata[0] !== undefined) {
    const decoder = getDecoder(bdata[0]);
    const [item, remaining] = decoder(bdata);

    list.push(item);
    // @ts-ignore
    bdata = remaining;
  }

  return [list, bdata.slice(1)];
}

function decodeDictionary(bdata: string) {
  if (bdata[0] !== "d") {
    throw new Error('invalid dictionary identifier, it should start with "d"');
  }

  let dictionary: { [key: string]: any } = {};
  bdata = bdata.slice(1);

  while (bdata[0] !== "" && bdata[0] !== "e" && bdata[0] !== undefined) {
    const decoder = getDecoder(bdata[0]);
    let [key, remaining] = decoder(bdata);
    let value: any;

    if (
      // @ts-ignore
      (remaining[0] as unknown as string) === "" ||
      // @ts-ignore
      remaining[0] === "e" ||
      // @ts-ignore
      remaining[0] === undefined
    ) {
      value = null;
    } else {
      // @ts-ignore
      const decoder = getDecoder(remaining[0]);
      // @ts-ignore
      [value, remaining] = decoder(remaining);
    }
    // @ts-ignore
    if (key in dictionary) {
      throw new Error(
        "there are repeated keys in this object. That is not valid"
      );
    }

    // @ts-ignore
    dictionary[key] = value;
    // @ts-ignore
    bdata = remaining;
  }

  return [dictionary, bdata.slice(1)];
}

const types = {
  l: decodeList,
  i: decodeNumber,
  d: decodeDictionary,
};

function getDecoder(type: string) {
  return types[type as "l" | "i" | "d"] ?? decodeString;
}

export function decodeBencodedData(bdata: string) {
  if (
    Object.keys(types).every((possibleType) => possibleType !== bdata[0]) &&
    isNaN(Number(bdata[0]))
  ) {
    throw new Error("invalid encoded value");
  }
  const decoder = getDecoder(bdata[0]);

  return decoder(bdata)[0];
}

type Peer = {
  ip: string;
  port: number;
};

function parsePeers(peerInfo: Uint8Array): Peer[] {
  if (peerInfo.length % 6 !== 0) {
    throw new Error("Incomplete peer information");
  }

  let peers = [];
  const peerCount = peerInfo.length / 6;

  for (let i = 0; i < peerCount; i++) {
    const offset = i * 6;
    const ip = Array.from(peerInfo.subarray(offset, offset + 4)).join(".");
    const portView = new DataView(peerInfo.buffer, offset + 4, 2);
    const port = portView.getUint16(0, false);

    peers.push({ ip, port });
  }

  return peers;
}
