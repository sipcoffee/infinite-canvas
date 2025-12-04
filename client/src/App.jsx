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
import { Button } from "./components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import logo from './assets/logo1.png'

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

      <div className="z-20 absolute top-3 left-6 p-4 ">
          <div className="flex gap-2 items-center">
            <img
              className="h-13 w-13 object-contain"
              alt="logo"
              src={logo}
            />
            <h2 className="text-white font-bold text-2xl">Orbital Navigator {visibleStars.length}</h2>
          </div>
      </div>

      <Rocket viewport={viewport} />

      <div className="z-20 absolute bottom-40 right-6 p-4  flex  gap-2 text-white">
        <Button variant="ghost" onClick={() => zoomAt(1.25)}>
          <ZoomIn />
        </Button>

        <Button variant="ghost" onClick={() => zoomAt(1 / 1.25)}>
          <ZoomOut />
        </Button>
      </div>

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
