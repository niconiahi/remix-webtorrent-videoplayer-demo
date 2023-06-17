import type { MagnetParameters } from "~/utils/magnet";
import { decodeMagnet } from "~/utils/magnet";
import { encodeUint8 } from "~/utils/uint8";
// import { decodeBencode } from "~/utils/bencode";

enum TorrentError {
  InvalidId = "INVALID_ID",
  InvalidString = "INVALID_STRING",
  InvalidMagnet = "INVALID_MAGNET",
  InvalidBuffer = "INVALID_BUFFER",
  InvalidBencoded = "INVALID_BENCODED",
  InvalidInfoHash = "INVALID_INFO_HASH",
}

interface ParsedTorrent {
  infoHash: string;
  announce?: string | string[];
  urlList?: string[];
}

export async function decodeTorrent(
  torrentId: string | Uint8Array | ParsedTorrent
): Promise<ParsedTorrent> {
  if (typeof torrentId === "string" && /^(stream-)?magnet:/.test(torrentId)) {
    return getTorrentFromMagnet(torrentId);
  }

  if (typeof torrentId === "string" && /^[a-f0-9]{40}$/i.test(torrentId)) {
    return getTorrentFromInfoHash(torrentId);
  }

  if (typeof torrentId === "string" && /^[a-z2-7]{32}$/i.test(torrentId)) {
    return getTorrentFromInfoHash(torrentId);
  }

  if (isBuffer(torrentId)) {
    return getTorrentFromBuffer(torrentId);
  }

  // if (isBencoded(torrentId)) {
  //   throw new Error(TorrentError.InvalidBencoded);
  // }

  if (isTorrent(torrentId)) {
    return torrentId;
  }

  throw new Error(TorrentError.InvalidId);
}

function getTorrentFromMagnet(torrentId: string): ParsedTorrent {
  if (!/^(stream-)?magnet:/.test(torrentId)) {
    throw new Error(TorrentError.InvalidMagnet);
  }

  const magnetParameters = decodeMagnet(torrentId);

  if (isParsedTorrent(magnetParameters)) {
    throw new Error(TorrentError.InvalidMagnet);
  }

  return magnetParameters;
}

function isParsedTorrent<K extends keyof MagnetParameters>(
  parameters: MagnetParameters
): parameters is MagnetParameters & { [P in K]: string | string[] } {
  const KEY = "info-hash";

  return (
    (typeof parameters[KEY] === "string" && parameters[KEY].length > 0) ||
    Array.isArray(parameters[KEY])
  );
}

function getTorrentFromInfoHash(torrentId: string): ParsedTorrent {
  if (
    !/^[a-f0-9]{40}$/i.test(torrentId) &&
    !/^[a-z2-7]{32}$/i.test(torrentId)
  ) {
    throw new Error(TorrentError.InvalidInfoHash);
  }

  return getTorrentFromMagnet(`magnet:?xt=urn:btih:${torrentId}`);
}

function getTorrentFromBuffer(torrentId: Uint8Array): ParsedTorrent {
  if (torrentId.length !== 20) throw new Error(TorrentError.InvalidBuffer);

  return getTorrentFromMagnet(`magnet:?xt=urn:btih:${encodeUint8(torrentId)}`);
}

function isTorrent(torrentId: any): torrentId is ParsedTorrent {
  return (
    typeof torrentId === "object" &&
    torrentId !== null &&
    typeof (torrentId as ParsedTorrent).infoHash === "string"
  );
}

function isBuffer(torrentId: any): torrentId is Uint8Array {
  return torrentId instanceof Uint8Array || ArrayBuffer.isView(torrentId);
}

// type Torrent = {
//   announce: string;
//   pieceLength: number;
//   pieces: string;
//   info: {
//     name: string;
//     length: number;
//   };
// };
