import { decodeTorrent } from "~/utils/torrent";

test("decodeTorrent - magnet URI", async () => {
  const torrentId =
    "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce";

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890",
    dn: "My Torrent",
    tr: "http://tracker.example.com/announce",
  });
});

test("decodeTorrent - info hash (hex)", async () => {
  const torrentId = "abcdef1234567890";

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890",
  });
});

test("decodeTorrent - info hash (base-32)", async () => {
  const torrentId = "a3dumfoo7zfoo6bazfoo5b2foo4bar";

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "a3dumfoo7zfoo6bazfoo5b2foo4bar",
  });
});

test("decodeTorrent - info hash (buffer)", async () => {
  const torrentId = Buffer.from("abcdef1234567890abcdef1234567890", "hex");

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890abcdef1234567890",
  });
});

// test("decodeTorrent - .torrent file (buffer)", async () => {
//   const torrentId = Buffer.from("torrent file buffer");

//   const result = await decodeTorrent(torrentId);

//   // Provide your expected result based on the input .torrent file
//   expect(result).toEqual(/* Your expected result */);
// });

test("decodeTorrent - parsed torrent object", async () => {
  const torrentId = {
    infoHash: "abcdef1234567890",
    announce: "http://tracker.example.com/announce",
    urlList: [
      "http://source1.example.com/file",
      "http://source2.example.com/file",
    ],
  };

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890",
    announce: ["http://tracker.example.com/announce"],
    urlList: [
      "http://source1.example.com/file",
      "http://source2.example.com/file",
    ],
  });
});

test("decodeTorrent - invalid torrent identifier", async () => {
  const torrentId = "invalidTorrentId";

  await expect(decodeTorrent(torrentId)).rejects.toThrow(
    "Invalid torrent identifier"
  );
});

test("decodeTorrent - info hash (hex) with lowercase letters", async () => {
  const torrentId = "abcdef1234567890";

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890",
  });
});

test("decodeTorrent - info hash (base-32) with lowercase letters", async () => {
  const torrentId = "abcdef1234567890abcdef1234567890";

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890abcdef1234567890",
  });
});

test("decodeTorrent - parsed torrent object with lowercase info hash", async () => {
  const torrentId = {
    infoHash: "abcdef1234567890",
    announce: "http://tracker.example.com/announce",
    urlList: [
      "http://source1.example.com/file",
      "http://source2.example.com/file",
    ],
  };

  const result = await decodeTorrent(torrentId);

  expect(result).toEqual({
    infoHash: "abcdef1234567890",
    announce: ["http://tracker.example.com/announce"],
    urlList: [
      "http://source1.example.com/file",
      "http://source2.example.com/file",
    ],
  });
});
