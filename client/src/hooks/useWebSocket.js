import { useEffect, useState } from "react";

export default function useWebSocket(onMessage) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = new WebSocket("ws://localhost:8000/ws/render/"); // or use createSocket()
    s.onmessage = (event) => onMessage(JSON.parse(event.data));
    setSocket(s);

    return () => {
      s.close();
    };
  }, [onMessage]);

  return socket;
}
