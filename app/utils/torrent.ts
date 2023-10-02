import { decodeMagnet } from "~/utils/magnet";

enum TorrentError {
  InvalidId = "INVALID_ID",
  InvalidString = "INVALID_STRING",
  InvalidMagnet = "INVALID_MAGNET",
  InvalidBuffer = "INVALID_BUFFER",
  InvalidBencoded = "INVALID_BENCODED",
  InvalidInfoHash = "INVALID_INFO_HASH",
}

export function decodeTorrent(torrentId: string) {
  if (typeof torrentId === "string" && /^(stream-)?magnet:/.test(torrentId)) {
    return decodeMagnet(torrentId);
  }

  throw new Error(TorrentError.InvalidId);
}
