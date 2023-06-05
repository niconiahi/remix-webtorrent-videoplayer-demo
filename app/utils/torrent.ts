type Torrent = {
  announce: string;
  pieceLength: number;
  pieces: string;
  info: {
    name: string;
    length: number;
  };
};

export function createTorrent(magnet: string) {}
