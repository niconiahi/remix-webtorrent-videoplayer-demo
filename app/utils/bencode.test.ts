import {
  decodeBencodedList,
  decodeBencodedNumber,
  decodeBencodedString,
} from "~/utils/bencode";

describe("decodeBencodedNumber", () => {
  test("decodes bencoded integers correctly", () => {
    test("decodes 10 correctly", () => {
      expect(decodeBencodedNumber("i10e")).toBe(10);
    });

    test("decodes 154 correctly", () => {
      expect(decodeBencodedNumber("i154e")).toBe(154);
    });

    test("decodes 100349 correctly", () => {
      expect(decodeBencodedNumber("i100349e")).toBe(100349);
    });

    test("decodes 0 correctly", () => {
      expect(decodeBencodedNumber("i0e")).toBe(0);
    });

    test("decodes -1 correctly", () => {
      expect(decodeBencodedNumber("i-1e")).toBe(-1);
    });

    test("decodes -50 correctly", () => {
      expect(decodeBencodedNumber("i-50e")).toBe(-50);
    });
  });
});

describe("decodeBencodedString", () => {
  test('decodes "house" correctly', () => {
    expect(decodeBencodedString("5:house")).toBe("house");
  });

  test('decodes "dog" correctly', () => {
    expect(decodeBencodedString("3:dog")).toBe("dog");
  });

  test('decodes "I love ruby" correctly', () => {
    expect(decodeBencodedString("11:I love ruby")).toBe("I love ruby");
  });
});

describe("decodeBencodedList", () => {
  test("decodes [4, 6] correctly", () => {
    expect(decodeBencodedList("li4ei6ee")).toEqual([4, 6]);
  });

  test('decodes ["blue", "red"] correctly', () => {
    expect(decodeBencodedList("l4:blue3:rede")).toEqual(["blue", "red"]);
  });

  test('decodes ["cat", "dog", "parrot", 27, 36, "candy"] correctly', () => {
    expect(decodeBencodedList("l3:cat3:dog6:parroti27ei36e5:candye")).toEqual([
      "cat",
      "dog",
      "parrot",
      27,
      36,
      "candy",
    ]);
  });
});

// describe("decodeBencode", () => {
//   it.only("should decode a bencoded torrent string", () => {
//     const torrentString =
//       "d8:announce36:udp://tracker.example.com:80808:created by13:MyTorrentClient13:creation datei1630375192e4:infod5:filesld6:lengthi1234e4:pathl9:directory8:file1.txteee4:name11:my-torrent12:piece lengthi65536e6:pieces40:0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "udp://tracker.example.com:8080",
//       "created by": "MyTorrentClient",
//       "creation date": 1630375192,
//       info: {
//         files: [
//           {
//             length: 1234,
//             path: ["directory", "file1.txt"],
//           },
//         ],
//         name: "my-torrent",
//         "piece length": 65536,
//         pieces: ["AUJK2iMtF6z9ABNF7k68f0I0Vn0="],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode another bencoded torrent string", () => {
//     const torrentString =
//       "d8:announce44:http://tracker.example.com/announce12:created by13:MyTorrentClient13:creation datei1630375192e4:infod6:lengthi56789e4:name8:test.txe4:piece lengthi32768e6:pieces80:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "http://tracker.example.com/announce",
//       "created by": "MyTorrentClient",
//       "creation date": 1630375192,
//       info: {
//         length: 56789,
//         name: "test.txt",
//         "piece length": 32768,
//         pieces: [
//           "AUJK2iMtF6z9ABNF7k68f0I0Vn0=",
//           "ibrvABNCVne9ABNF7k68f0I0Vn0=",
//         ],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode a bencoded torrent string with multiple files", () => {
//     const torrentString =
//       "d8:announce36:udp://tracker.example.com:80808:created by13:MyTorrentClient13:creation datei1630375192e4:infod5:filesld6:lengthi1234e4:pathl9:directory8:file1.txteed6:lengthi5678e4:pathl9:directory8:file2.txteee4:name11:my-torrent12:piece lengthi65536e6:pieces40:0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "udp://tracker.example.com:8080",
//       "created by": "MyTorrentClient",
//       "creation date": 1630375192,
//       info: {
//         files: [
//           {
//             length: 1234,
//             path: ["directory", "file1.txt"],
//           },
//           {
//             length: 5678,
//             path: ["directory", "file2.txt"],
//           },
//         ],
//         name: "my-torrent",
//         "piece length": 65536,
//         pieces: ["AUJK2iMtF6z9ABNF7k68f0I0Vn0="],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode a bencoded torrent string with a single file", () => {
//     const torrentString =
//       "d8:announce44:http://tracker.example.com/announce12:created by13:MyTorrentClient13:creation datei1630375192e4:infod6:lengthi56789e4:name8:test.txe4:piece lengthi32768e6:pieces80:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "http://tracker.example.com/announce",
//       "created by": "MyTorrentClient",
//       "creation date": 1630375192,
//       info: {
//         length: 56789,
//         name: "test.txt",
//         "piece length": 32768,
//         pieces: [
//           "AUJK2iMtF6z9ABNF7k68f0I0Vn0=",
//           "ibrvABNCVne9ABNF7k68f0I0Vn0=",
//         ],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode a bencoded torrent string with no created by field", () => {
//     const torrentString =
//       "d8:announce44:http://tracker.example.com/announce13:creation datei1630375192e4:infod6:lengthi56789e4:name8:test.txe4:piece lengthi32768e6:pieces40:0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "http://tracker.example.com/announce",
//       "creation date": 1630375192,
//       info: {
//         length: 56789,
//         name: "test.txt",
//         "piece length": 32768,
//         pieces: ["AUJK2iMtF6z9ABNF7k68f0I0Vn0="],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode a bencoded torrent string with empty files list", () => {
//     const torrentString =
//       "d8:announce44:http://tracker.example.com/announce13:creation datei1630375192e4:infod5:fileslee4:name8:test.txe4:piece lengthi32768e6:pieces40:0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "http://tracker.example.com/announce",
//       "creation date": 1630375192,
//       info: {
//         files: [],
//         name: "test.txt",
//         "piece length": 32768,
//         pieces: ["AUJK2iMtF6z9ABNF7k68f0I0Vn0="],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode a bencoded torrent string with single character name", () => {
//     const torrentString =
//       "d8:announce44:http://tracker.example.com/announce13:creation datei1630375192e4:infod6:lengthi567e4:name1:xe4:piece lengthi32768e6:pieces40:0123456789abcdef0123456789abcdef01234567ee";
//     const expected = {
//       announce: "http://tracker.example.com/announce",
//       "creation date": 1630375192,
//       info: {
//         length: 567,
//         name: "x",
//         "piece length": 32768,
//         pieces: ["AUJK2iMtF6z9ABNF7k68f0I0Vn0="],
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });

//   it("should decode a bencoded torrent string with no piece hashes", () => {
//     const torrentString =
//       "d8:announce44:http://tracker.example.com/announce13:creation datei1630375192e4:infod6:lengthi56789e4:name8:test.txe4:piece lengthi32768ee";
//     const expected = {
//       announce: "http://tracker.example.com/announce",
//       "creation date": 1630375192,
//       info: {
//         length: 56789,
//         name: "test.txt",
//         "piece length": 32768,
//       },
//     };

//     const result = decodeBencode(torrentString);

//     expect(result).toEqual(expected);
//   });
// });
