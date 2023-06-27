import { magnetDecode } from "@ctrl/magnet-link";
import { decodeTorrent } from "~/utils/torrent";
import { decodeUint8, encodeUint8 } from "./uint8";

test.only("decodeTorrent - magnet URI", async () => {
  const torrentId =
    "magnet:?xt=urn:btih:ec64c3b4525c6617d8bb37415a208b30db6ffca3&dn=%5BErai-raws%5D%20Mix%20-%20Meisei%20Story%202nd%20Season%20-%2013%20%5B480p%5D%5BMultiple%20Subtitle%5D%20%5BENG%5D%5BPOR-BR%5D%5BSPA-LA%5D%5BSPA%5D%5BARA%5D%5BGER%5D%5BRUS%5D&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce";

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    xt: "urn:btih:cb275687b50d7020da05a8de97c741fc3e81e03a",
    dn: "[NanakoRaws] Mahoutsukai no Yome Season 2 - 12 (1080p).mp4",
    tr: [
      "http://nyaa.tracker.wf:7777/announce",
      "udp://open.stealth.si:80/announce",
      "udp://tracker.opentrackr.org:1337/announce",
      "udp://exodus.desync.com:6969/announce",
      "udp://tracker.torrent.eu.org:451/announce",
    ],
    infoHash: "cb275687b50d7020da05a8de97c741fc3e81e03a",
    infoHashBuffer: encodeUint8("cb275687b50d7020da05a8de97c741fc3e81e03a"),
    name: "[NanakoRaws] Mahoutsukai no Yome Season 2 - 12 (1080p).mp4",
    announce: [
      "http://nyaa.tracker.wf:7777/announce",
      "udp://exodus.desync.com:6969/announce",
      "udp://open.stealth.si:80/announce",
      "udp://tracker.opentrackr.org:1337/announce",
      "udp://tracker.torrent.eu.org:451/announce",
    ],
    urlList: [],
    peerAddresses: [],
  });
});

// test("decodeTorrent - info hash (hex)", async () => {
//   const torrentId = "abcdef1234567890";

//   const result = await decodeTorrent(torrentId);

//   expect(result).toEqual({
//     infoHash: "abcdef1234567890",
//   });
// });

// test("decodeTorrent - info hash (base-32)", async () => {
//   const torrentId = "a3dumfoo7zfoo6bazfoo5b2foo4bar";

//   const result = await decodeTorrent(torrentId);

//   expect(result).toEqual({
//     infoHash: "a3dumfoo7zfoo6bazfoo5b2foo4bar",
//   });
// });

test("decodeTorrent - info hash (buffer)", async () => {
  const torrentId = Buffer.from("abcdef1234567890abcdef1234567890", "hex");

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890abcdef1234567890",
  });
});

// // test("decodeTorrent - .torrent file (buffer)", async () => {
// //   const torrentId = Buffer.from("torrent file buffer");

// //   const result = await decodeTorrent(torrentId);

// //   // Provide your expected result based on the input .torrent file
// //   expect(result).toEqual(/* Your expected result */);
// // });

// test("decodeTorrent - parsed torrent object", async () => {
//   const torrentId = {
//     infoHash: "abcdef1234567890",
//     announce: "http://tracker.example.com/announce",
//     urlList: [
//       "http://source1.example.com/file",
//       "http://source2.example.com/file",
//     ],
//   };

//   const result = await decodeTorrent(torrentId);

//   expect(result).toEqual({
//     infoHash: "abcdef1234567890",
//     announce: ["http://tracker.example.com/announce"],
//     urlList: [
//       "http://source1.example.com/file",
//       "http://source2.example.com/file",
//     ],
//   });
// });

// test("decodeTorrent - invalid torrent identifier", async () => {
//   const torrentId = "invalidTorrentId";

//   await expect(decodeTorrent(torrentId)).rejects.toThrow(
//     "Invalid torrent identifier"
//   );
// });

// test("decodeTorrent - info hash (hex) with lowercase letters", async () => {
//   const torrentId = "abcdef1234567890";

//   const result = await decodeTorrent(torrentId);

//   expect(result).toEqual({
//     infoHash: "abcdef1234567890",
//   });
// });

// test("decodeTorrent - info hash (base-32) with lowercase letters", async () => {
//   const torrentId = "abcdef1234567890abcdef1234567890";

//   const result = await decodeTorrent(torrentId);

//   expect(result).toEqual({
//     infoHash: "abcdef1234567890abcdef1234567890",
//   });
// });

// test("decodeTorrent - parsed torrent object with lowercase info hash", async () => {
//   const torrentId = {
//     infoHash: "abcdef1234567890",
//     announce: "http://tracker.example.com/announce",
//     urlList: [
//       "http://source1.example.com/file",
//       "http://source2.example.com/file",
//     ],
//   };

//   const result = await decodeTorrent(torrentId);

//   expect(result).toEqual({
//     infoHash: "abcdef1234567890",
//     announce: ["http://tracker.example.com/announce"],
//     urlList: [
//       "http://source1.example.com/file",
//       "http://source2.example.com/file",
//     ],
//   });
// });
