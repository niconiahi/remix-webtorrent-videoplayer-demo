import type { LoaderArgs } from "@remix-run/cloudflare";
import { eventStream } from "remix-utils";
import { convertHexToUrlEncodedBytes } from "~/utils/bytes";
import { decodeMagnet } from "~/utils/magnet";
import { decodeBencodedData } from "~/utils/bencode";

function getInfoHash(magnet: { [group: string]: string | string[] }) {
  const match = (magnet.xt as string).match(/(?<=urn:btih:)[a-fA-F0-9]{40}/);

  if (!match) {
    throw new Error("failed to capture info hash");
  }

  return match[0];
}

// QUICK REFERENCES:
// info_hash: The URL-encoded info hash extracted from the magnet link.
// peer_id: A 20-byte string used to uniquely identify your client.
// port: The port number on which your client is listening for incoming connections.
// downloaded: The total amount downloaded (initially 0).
// left: The number of bytes you have left to download to complete the file (initially the total file size).

export async function loader({ request }: LoaderArgs) {
  const magnet = decodeMagnet(
    "magnet:?xt=urn:btih:70dfcbc7a83f8854daf543aaa6623e2f12b9e696&dn=%5BErai-raws%5D%20One%20Piece%20-%201078%20%5B1080p%5D%20%5BENG%5D&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce"
  );
  const tracker = "http://nyaa.tracker.wf:7777/announce";
  const infoHash = getInfoHash(magnet);
  const peerId = generatePeerId();
  const port = 1223;
  const downloaded = 0;
  // TODO: compute this somehow
  // const left = 0;

  const searchParams = new URLSearchParams();

  searchParams.set("peer_id", peerId);
  searchParams.set("port", String(port));
  searchParams.set("downloaded", String(downloaded));
  searchParams.set("left", String(1_459_837_246));

  const url = new URL(
    `${tracker}?info_hash=${convertHexToUrlEncodedBytes(
      infoHash
    )}&${searchParams.toString()}`
  );
  console.log("trying url => ", url.toString());
  const peers = await getPeers(url.toString());
  console.log("list of peers obtained =>", peers);

  return eventStream(request.signal, function setup(send) {
    let timer = setInterval(async () => {
      send({ data: "incoming-data" });
    }, 1000);

    return function clear() {
      clearInterval(timer);
    };
  });
}

async function getPeers(url: string) {
  return fetch(url).then(async (data) => {
    const text = await data.text();
    const decodedData = decodeBencodedData(text);

    return decodedData;
  });
}

function generatePeerId() {
  const prefix: string = "-TS0001-";
  const possible: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let randomString: string = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * possible.length);
    randomString += possible.charAt(randomIndex);
  }

  return prefix + randomString;
}
