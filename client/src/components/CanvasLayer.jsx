import React, { useRef, useEffect, useState } from "react";
import VectorLayer from "./VectorLayer";
import RasterLayer from "./RasterLayer";
import { useViewportStore } from "@/store/useViewPortStore";

export default function CanvasLayer({
  viewport,
  panBy,
  zoomAt,
  stars,
  renderMode,
  rasterFrame,
}) {

  const containerRef = useRef(null);
  const dragging = useRef(false);
  const last = useRef([0, 0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onDown(e) {
      dragging.current = true;
      last.current = [e.clientX, e.clientY];
    }
    function onUp() {
      dragging.current = false;
    }
    function onMove(e) {
      if (!dragging.current) return;
      const dx = e.clientX - last.current[0];
      const dy = e.clientY - last.current[1];
      last.current = [e.clientX, e.clientY];
      panBy(dx, dy);
    }
    function onWheel(e) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.88 : 1.12;
      zoomAt(factor, e.clientX, e.clientY);
    }

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, [panBy, zoomAt]);
  
  // console.log(viewport)
  return (
    <div
      ref={containerRef}
      className="w-screen h-screen relative overflow-hidden"
    >
      <canvas
        className="absolute left:0 right-0"
        style={{ zIndex: 10 }}
        width={viewport.width}
        height={viewport.height}
      />
        {renderMode === 'raster' &&( <div className="absolute top-0 left-0 bg-transparent z-50 flex items-center justify-center w-full h-20"><h1 className="text-white">loading..</h1></div>)}
      {/* Vector layer renders directly to a canvas inside it */}
      <VectorLayer
        viewport={viewport}
        stars={stars}
        visible={renderMode === "vector"}
      />

      {/* Raster layer is an <img> overlayed - we keep vector visible until first raster frame arrives */}
      <RasterLayer frame={rasterFrame} visible={renderMode === "raster"} viewport={viewport}/>
    </div>
  );
}
