import { decodeMagnet, encodeMagnet } from "~/utils/magnet";

describe("decodeMagnet", () => {
  it("should decode a magnet URI with valid parameters", () => {
    const uri =
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce";

    const result = decodeMagnet(uri);

    expect(result).toEqual({
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: "http://tracker.example.com/announce",
    });
  });

  it("should decode a magnet URI with multiple values for a parameter", () => {
    const uri =
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker1.example.com%2Fannounce&tr=http%3A%2F%2Ftracker2.example.com%2Fannounce";

    const result = decodeMagnet(uri);

    expect(result).toEqual({
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: [
        "http://tracker1.example.com/announce",
        "http://tracker2.example.com/announce",
      ],
    });
  });

  it("should decode a magnet URI with special characters in parameters", () => {
    const uri =
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce%3Fparam%3Dvalue";

    const result = decodeMagnet(uri);

    expect(result).toEqual({
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: "http://tracker.example.com/announce?param=value",
    });
  });

  it("should decode a magnet URI with multiple parameters", () => {
    const uri =
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce&as=http%3A%2F%2Fsource1.example.com%2Ffile&as=http%3A%2F%2Fsource2.example.com%2Ffile";

    const result = decodeMagnet(uri);

    expect(result).toEqual({
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: "http://tracker.example.com/announce",
      as: [
        "http://source1.example.com/file",
        "http://source2.example.com/file",
      ],
    });
  });

  // Add more test cases as needed
});

describe("encodeMagnet", () => {
  it("should encode a magnet URI with valid parameters", () => {
    const params = {
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: "http://tracker.example.com/announce",
    };

    const result = encodeMagnet(params);

    expect(result).toEqual(
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce"
    );
  });

  it("should encode a magnet URI with multiple values for a parameter", () => {
    const params = {
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: [
        "http://tracker1.example.com/announce",
        "http://tracker2.example.com/announce",
      ],
    };

    const result = encodeMagnet(params);

    expect(result).toEqual(
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker1.example.com%2Fannounce&tr=http%3A%2F%2Ftracker2.example.com%2Fannounce"
    );
  });

  it("should encode a magnet URI with special characters in parameters", () => {
    const params = {
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: "http://tracker.example.com/announce?param=value",
    };

    const result = encodeMagnet(params);

    expect(result).toEqual(
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce%3Fparam%3Dvalue"
    );
  });

  it("should encode a magnet URI with multiple parameters", () => {
    const params = {
      xt: "urn:btih:abcdef1234567890",
      dn: "My Torrent",
      tr: "http://tracker.example.com/announce",
      as: [
        "http://source1.example.com/file",
        "http://source2.example.com/file",
      ],
    };

    const result = encodeMagnet(params);

    expect(result).toEqual(
      "magnet:?xt=urn:btih:abcdef1234567890&dn=My%20Torrent&tr=http%3A%2F%2Ftracker.example.com%2Fannounce&as=http%3A%2F%2Fsource1.example.com%2Ffile&as=http%3A%2F%2Fsource2.example.com%2Ffile"
    );
  });

  // Add more test cases as needed
});
