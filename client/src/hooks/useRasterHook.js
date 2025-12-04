import { useEffect, useRef } from "react"; 

export default function useRasterRequest({
  viewport,
  mode,
  socket,
  debounceMs = 500,
  visibleStars   // ← already passed from parent
}) {
  const lastReqRef = useRef(0);

  useEffect(() => {
    if (mode !== "raster") return;

    const now = Date.now();
    if (now - lastReqRef.current < debounceMs) return;
    lastReqRef.current = now;

    if (socket && socket.readyState === WebSocket.OPEN) {
      const payload = {
        type: "renderRequest",
        viewport,
        stars: visibleStars || []   // ← new field added
      };

      console.log("render request payload:", payload);

      socket.send(JSON.stringify(payload));
    }
  }, [viewport, mode, socket, debounceMs, visibleStars]);  // ← include visibleStars
}
