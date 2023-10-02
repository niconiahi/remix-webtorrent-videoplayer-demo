import { decodeTorrent, hexToBinary } from "~/utils/torrent";

describe("decodeTorrent", () => {
  test("magnet", () => {
    const torrentId =
      "magnet:?xt=urn:btih:03c4f07daa8718b2b4dd99f551676239c41bdccc&dn=%5BRyuu%5D%20Danmachi%20-%20S04E21%20%28WEB%201080p%20x264%20AAC%29%20%5BDual-Audio%5D%20%7C%20Is%20It%20Wrong%20to%20Try%20to%20Pick%20Up%20Girls%20in%20a%20Dungeon%20IV%20%7C%20Dungeon%20ni%20Deai%20o%20Motomeru%20no%20wa%20Machigatte%20Iru%20Darouka%20-%20Familia%20Myth%20IV&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce";
    const result = decodeTorrent(torrentId);

    expect(result).toEqual({
      xt: "urn:btih:03c4f07daa8718b2b4dd99f551676239c41bdccc",
      dn: "[Ryuu] Danmachi - S04E21 (WEB 1080p x264 AAC) [Dual-Audio] | Is It Wrong to Try to Pick Up Girls in a Dungeon IV | Dungeon ni Deai o Motomeru no wa Machigatte Iru Darouka - Familia Myth IV",
      tr: [
        "http://nyaa.tracker.wf:7777/announce",
        "udp://open.stealth.si:80/announce",
        "udp://tracker.opentrackr.org:1337/announce",
        "udp://exodus.desync.com:6969/announce",
        "udp://tracker.torrent.eu.org:451/announce",
      ],
    });
  });
});

describe("hexToBinary", () => {
  test.only(`encodes "03c4f07daa8718b2b4dd99f551676239c41bdccc" correctly`, () => {
    expect(hexToBinary("03c4f07daa8718b2b4dd99f551676239c41bdccc")).toBe(
      "%03%c4%f0%7d%aa%87%18%b2%b4%dd%99%f5%51%67%62%39%c4%1b%dc%cc"
    );
  });
  // nyaa.tracker.wf:7777/announce?info_hash=%03%c4%f0%7d%aa%87%18%b2%b4%dd%99%f5%51%67%62%39%c4%1b%dc%cc&peer_id=TR2840-k8hgf7d5k2srx&port=1223
});
