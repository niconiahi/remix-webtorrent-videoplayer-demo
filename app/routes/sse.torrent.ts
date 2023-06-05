import type { LoaderArgs } from "@remix-run/cloudflare";
import { eventStream } from "remix-utils";
import type { Torrent } from "webtorrent";

export function loader({ request }: LoaderArgs) {
  // const client: Instance = new WebTorrent();
  // const magnet =
  //   "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent";
  // const torrent = client.add(magnet);

  return eventStream(request.signal, function setup(send) {
    let timer = setInterval(async () => {
      // send({ data: await getData(torrent) });
      send({ data: "incoming-data" });
    }, 1000);

    // async function initialSend() {
    //   send({ data: await getData(torrent) });
    // }

    // initialSend();

    return function clear() {
      clearInterval(timer);
    };
  });
}

async function getData(torrent: Torrent) {
  const file = torrent.files[0];
  console.log("getData => progress =>", file.progress);
  // console.log("getData => getPieceDownloaded =>", file.blob);
  // console.log("getData ~ file.blob:", file.blob);
  // const blob = await file.blob();
  // const base64 = file.torrentFile;
  // let nextBlob = null;
  // console.log("nextBlob => ", nextBlob);

  return JSON.stringify({
    peers: {
      count: torrent.numPeers,
    },
    name: torrent.name,
    file: "",
  });
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  const binaryString = Array.from(uint8Array)
    .map((byte) => String.fromCharCode(byte))
    .join("");

  return btoa(binaryString);
}
