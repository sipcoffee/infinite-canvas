import React, { useEffect, useState } from "react";
import { generateStars } from "./data/stars";
import CanvasLayer from "./components/CanvasLayer";
import { createSocket, requestRaster } from "./ws/socket";
import useViewport from "./hooks/useViewPort";
import Rocket from "./components/rocket/Rocket";
import Controls from "./components/hud/Controls";
import RocketStatus from "./components/hud/RocketStatus";
import useRenderMode from "./hooks/useRenderMode";
import useRasterRequest from "./hooks/useRasterHook";

export default function App() {
  const { viewport, panBy, zoomAt } = useViewport({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [socket, setSocket] = useState(null);
  const [rasterFrame, setRasterFrame] = useState(null);

  useEffect(() => {
    const s = createSocket((data) => {
      // console.log("WS =>", data);
      if (data.type === "frame") {
        // console.log(data);
        setRasterFrame({
          frameId: data.frameId,
          image: data.image,
          width: viewport.width,
          height: viewport.height,
          x: data.x,
          y: data.y,
          zoom: data.zoom,
        });
      }
    });
    setSocket(s);
  }, []);

  // switching logic
  const mode = useRenderMode(viewport.zoom);
  // Make request to the raster
  useRasterRequest({ viewport, mode, socket });

  return (
    <div className="relative">
      <Controls />

      <Rocket viewport={viewport} />

      <RocketStatus viewport={viewport} mode={mode} />

      <CanvasLayer
        viewport={viewport}
        panBy={panBy}
        zoomAt={zoomAt}
        // stars={stars}
        renderMode={mode}
        rasterFrame={rasterFrame}
      />
    </div>
  );
}
