import { decodeMagnet } from "./magnet";

describe("decodeMagnet", () => {
  test('decodes "Majutsushi Orphen Hagure Tabi - Seiiki Hen - 12" correctly', () => {
    const magnet =
      "magnet:?xt=urn:btih:b466aa29b4de04ad5f166e9f7f7ed1bc7ac0587b&dn=%5BErai-raws%5D%20Majutsushi%20Orphen%20Hagure%20Tabi%20-%20Seiiki%20Hen%20-%2012%20%5B1080p%5D%5BHEVC%5D%5BMultiple%20Subtitle%5D%20%5BENG%5D%5BPOR-BR%5D%5BSPA-LA%5D%5BSPA%5D%5BARA%5D%5BFRE%5D%5BGER%5D%5BITA%5D%5BRUS%5D&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce";

    expect(decodeMagnet(magnet)).toStrictEqual({
      dn: "[Erai-raws] Majutsushi Orphen Hagure Tabi - Seiiki Hen - 12 [1080p][HEVC][Multiple Subtitle] [ENG][POR-BR][SPA-LA][SPA][ARA][FRE][GER][ITA][RUS]",
      tr: [
        "http://nyaa.tracker.wf:7777/announce",
        "udp://open.stealth.si:80/announce",
        "udp://tracker.opentrackr.org:1337/announce",
        "udp://exodus.desync.com:6969/announce",
        "udp://tracker.torrent.eu.org:451/announce",
      ],
      xt: "urn:btih:b466aa29b4de04ad5f166e9f7f7ed1bc7ac0587b",
    });
  });

  test('decodes "Danmachi - S04E21" correctly', () => {
    const magnet =
      "magnet:?xt=urn:btih:03c4f07daa8718b2b4dd99f551676239c41bdccc&dn=%5BRyuu%5D%20Danmachi%20-%20S04E21%20%28WEB%201080p%20x264%20AAC%29%20%5BDual-Audio%5D%20%7C%20Is%20It%20Wrong%20to%20Try%20to%20Pick%20Up%20Girls%20in%20a%20Dungeon%20IV%20%7C%20Dungeon%20ni%20Deai%20o%20Motomeru%20no%20wa%20Machigatte%20Iru%20Darouka%20-%20Familia%20Myth%20IV&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce";

    expect(decodeMagnet(magnet)).toStrictEqual({
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
