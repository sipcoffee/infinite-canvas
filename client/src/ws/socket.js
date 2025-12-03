let socket = null;
export function createSocket(onMessage) {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  )
    return socket;
  socket = new WebSocket("ws://localhost:8000/ws/render/");

  socket.onopen = () => console.log("[WS] connected");
  socket.onclose = () => console.log("[WS] closed");
  socket.onerror = (e) => console.warn("[WS] error", e);
  socket.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      if (onMessage) onMessage(data);
    } catch (e) {
      console.warn("invalid ws msg", e);
    }
  };

  return socket;
}

export function requestRaster(viewport) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "renderRequest", viewport }));
}
