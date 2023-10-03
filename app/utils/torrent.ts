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

export function hexToBinary(hex: string) {
  const bytes = Array.from({ length: hex.length / 2 }, (_, i) =>
    parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  );

  return Array.from(bytes, (byte) => {
    return "%" + ("00" + byte.toString(16)).slice(-2);
  }).join("");
}
