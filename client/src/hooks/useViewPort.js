import { useRef, useState, useEffect, useCallback } from "react";

export default function useViewport(initial = {}) {
  const [viewport, setViewport] = useState(() => ({
    x: initial.x || 0,
    y: initial.y || 0,
    zoom: initial.zoom || 1,
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    function onResize() {
      setViewport((v) => ({
        ...v,
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const panBy = useCallback((dx, dy) => {
    setViewport((v) => ({ ...v, x: v.x - dx / v.zoom, y: v.y - dy / v.zoom }));
  }, []);

  const zoomAt = useCallback((zoomFactor, centerX = null, centerY = null) => {
    setViewport((v) => {
      const prevZoom = v.zoom;
      const nextZoom = Math.max(0.125, Math.min(v.zoom * zoomFactor, 64));

      if (centerX == null || centerY == null) return { ...v, zoom: nextZoom };

      // convert screen center to world coords
      const worldX = (centerX - v.width / 2) / prevZoom + v.x;
      const worldY = (centerY - v.height / 2) / prevZoom + v.y;

      // after zoom, compute new x,y so that worldX/worldY remain under the cursor
      const newX = worldX - (centerX - v.width / 2) / nextZoom;
      const newY = worldY - (centerY - v.height / 2) / nextZoom;

      return { ...v, zoom: nextZoom, x: newX, y: newY };
    });
  }, []);

  return { viewport, setViewport, panBy, zoomAt };
}
