import React, { useRef, useEffect, useState } from "react";
import VectorLayer from "./VectorLayer";
import RasterLayer from "./RasterLayer";
import useRasterRequest from "@/hooks/useRasterHook";

export default function CanvasLayer({
  viewport,
  panBy,
  zoomAt,
  renderMode,
  rasterFrame,
}) {
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const last = useRef([0, 0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastRasterFrame, setLastRasterFrame] = useState(null);

  // Detect when raster frame changes (new frame loaded)
  useEffect(() => {
    if (rasterFrame && rasterFrame !== lastRasterFrame) {
      setLastRasterFrame(rasterFrame);
    }
  }, [rasterFrame, lastRasterFrame]);

  // Trigger transition state when mode changes
  useEffect(() => {
    if (renderMode === "raster" && lastRasterFrame) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [renderMode, lastRasterFrame]);

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

  // Keep vector visible during transition OR if raster not ready
  const showVector =
    renderMode === "vector" || isTransitioning || !lastRasterFrame;
  const showRaster = renderMode === "raster" && lastRasterFrame;

  // console.log(viewport)
  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-black"
    >
      <canvas
        className="absolute left:0 right-0"
        style={{ zIndex: 10 }}
        width={viewport.width}
        height={viewport.height}
      />

      {/* Vector layer with fade-out transition */}
      <VectorLayer
        viewport={viewport}
        visible={showVector}
        style={{
          opacity: renderMode === "raster" && isTransitioning ? 0 : 1,
          transition: "opacity 300ms ease-out",
        }}
      />

      {/* Raster layer with fade-in transition */}
      <RasterLayer
        frame={rasterFrame}
        visible={showRaster}
        viewport={viewport}
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 300ms ease-in",
        }}
      />
    </div>
  );
}
