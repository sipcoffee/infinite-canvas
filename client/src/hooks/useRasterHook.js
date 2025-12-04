import { useEffect, useRef } from "react";

export default function useRasterRequest({
  viewport,
  mode,
  socket,
  debounceMs = 500, // Controls the frequent request of raster image
}) {
  const lastReqRef = useRef(0);

  useEffect(() => {
    if (mode !== "raster") return;

    const now = Date.now();
    if (now - lastReqRef.current < debounceMs) return;
    lastReqRef.current = now;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "renderRequest", viewport }));
    }
  }, [viewport, mode, socket, debounceMs]);
}
