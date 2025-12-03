import React, { useEffect, useMemo, useState } from "react";
import { generateStars } from "./data/stars";
import CanvasLayer from "./components/CanvasLayer";
import { createSocket, requestRaster } from "./ws/socket";
import useViewport from "./hooks/useViewPort";
const RASTER_THRESHOLD = 6;
const DEBOUNCE_MS = 150;
export default function App() {
  const { viewport, panBy, zoomAt, setViewport } = useViewport({
    x: 0,
    y: 0,
    zoom: 1,
  });
  9;
  const [stars] = useState(() => generateStars(1000000));
  const [socket, setSocket] = useState(null);
  const [rasterFrame, setRasterFrame] = useState(null);
  const [mode, setMode] = useState("vector");
  const [lastReq, setLastReq] = useState(0);

  useEffect(() => {
    const s = createSocket((data) => {
      if (data.type === "frame") {
        // data.image is base64
        setRasterFrame({
          frameId: data.frameId,
          image: data.image,
          width: viewport.width,
          height: viewport.height,
        });
      }
    });
    setSocket(s);
  }, []);
  // switching logic
  useEffect(() => {
    const next = viewport.zoom >= RASTER_THRESHOLD ? "raster" : "vector";
    setMode(next);
  }, [viewport.zoom]);

  // when in raster mode, debounce and request new frames on viewport changes
  useEffect(() => {
    if (mode !== "raster") return;
    const now = Date.now();
    if (now - lastReq < DEBOUNCE_MS) return;
    setLastReq(now);
    const payload = { ...viewport };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "renderRequest", viewport: payload }));
    }
  }, [viewport, mode, socket, lastReq]);
  return (
    <div>
      <div className="controls">
        <button className="button" onClick={() => zoomAt(1.2)}>
          Zoom In
        </button>
        <button className="button" onClick={() => zoomAt(0.83)}>
          Zoom Out
        </button>
        <button
          className="button"
          onClick={() =>
            setViewport({
              x: 0,
              y: 0,
              zoom: 1,
              width: viewport.width,
              height: viewport.height,
            })
          }
        >
          Reset
        </button>
      </div>
      <div className="info">
        Mode: {mode} · Zoom: {viewport.zoom.toFixed(2)}
      </div>
      Mode: {mode} · Zoom: {viewport.zoom.toFixed(2)}, x:{viewport.x}, y:
      {viewport.y}
      <CanvasLayer
        viewport={viewport}
        panBy={panBy}
        zoomAt={zoomAt}
        stars={stars}
        renderMode={mode}
        rasterFrame={rasterFrame}
      />
    </div>
  );
}
