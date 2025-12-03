import React, { useEffect, useMemo, useState } from "react";
import { generateStars } from "./data/stars";
import CanvasLayer from "./components/CanvasLayer";
import { createSocket, requestRaster } from "./ws/socket";
import useViewport from "./hooks/useViewPort";
import { Button } from "./components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
const RASTER_THRESHOLD = 6;
const DEBOUNCE_MS = 150;
export default function App() {
  const { viewport, panBy, zoomAt, setViewport } = useViewport({
    x: 0,
    y: 0,
    zoom: 1,
  });

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
      <div className="absolute top-3 left-3 flex z-30 bg-transparent text-white">
        <Button variant="ghost" onClick={() => zoomAt(1.2)}>
          <ZoomIn />
        </Button>
        <Button variant="ghost" onClick={() => zoomAt(0.83)}>
          <ZoomOut />
        </Button>

        <Button
          variant="ghost"
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
        </Button>
      </div>

      <div className="z-10 absolute top-3 right-1.5 p-4 bg-gray-600 rounded-sm flex flex-col gap-1">
        <div>
          Mode: {mode} · Zoom: {viewport.zoom.toFixed(2)}
        </div>
        <div>
          Coordinates: {viewport.x.toFixed(5)}, {viewport.y.toFixed(5)}
        </div>
      </div>

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
