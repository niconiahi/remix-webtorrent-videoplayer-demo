import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { useEffect, useRef } from "react";
import { useEventSource } from "remix-utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const torrentEvent = useEventSource("/sse/torrent");

  useEffect(() => {
    if (!torrentEvent) return;
  });

  return (
    <video playsInline ref={videoRef}>
      <source type="video/mp4" />
    </video>
  );
}
