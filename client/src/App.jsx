import React, { useEffect, useState } from "react";
import CanvasLayer from "./components/CanvasLayer";
import { createSocket, requestRaster } from "./ws/socket";
import useViewport from "./hooks/useViewPort";
import Rocket from "./components/rocket/Rocket";
import Controls from "./components/hud/Controls";
import RocketStatus from "./components/hud/RocketStatus";
import useRenderMode from "./hooks/useRenderMode";
import useRasterRequest from "./hooks/useRasterHook";
import Prompt from "./components/prompt/Prompt";
import ZoomControl from "./components/hud/ZoomControl";
import HeaderSpace from "./components/hud/HeaderSpace";

export default function App() {
  const { viewport, panBy, zoomAt } = useViewport({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [socket, setSocket] = useState(null);
  const [rasterFrame, setRasterFrame] = useState(null);
  const [visibleStars, setVisibleStars] = useState([]);

  useEffect(() => {
    const s = createSocket((data) => {
      console.log("WS =>", data);
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
  useRasterRequest({ viewport, mode, socket, visibleStars });
  // console.log(visibleStars)
  return (
    <div className="relative">
      <Controls />

      <HeaderSpace />

      <Rocket viewport={viewport} />

      <ZoomControl />

      <Prompt />

      <RocketStatus viewport={viewport} mode={mode} />

      <CanvasLayer
        viewport={viewport}
        panBy={panBy}
        zoomAt={zoomAt}
        renderMode={mode}
        rasterFrame={rasterFrame}
        onVisibleStarsChange={setVisibleStars}
      />
    </div>
  );
}
