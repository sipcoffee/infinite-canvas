import { useState, useEffect, useCallback } from "react";

export default function useViewport(initial = {}) {
  // Separate size from transform to avoid unnecessary re-renders
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [transform, setTransform] = useState({
    x: initial.x || 0,
    y: initial.y || 0,
    zoom: initial.zoom || 1,
  });

  // Handle window resize safely
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pan the viewport
  const panBy = useCallback((dx, dy) => {
    setTransform((v) => ({ ...v, x: v.x - dx / v.zoom, y: v.y - dy / v.zoom }));
  }, []);

  // Zoom at a specific point
  const zoomAt = useCallback(
    (zoomFactor, centerX = null, centerY = null) => {
      setTransform((v) => {
        const prevZoom = v.zoom;
        const nextZoom = Math.max(0.125, Math.min(v.zoom * zoomFactor, 64));

        if (centerX == null || centerY == null) return { ...v, zoom: nextZoom };

        const worldX = (centerX - size.width / 2) / prevZoom + v.x;
        const worldY = (centerY - size.height / 2) / prevZoom + v.y;

        const newX = worldX - (centerX - size.width / 2) / nextZoom;
        const newY = worldY - (centerY - size.height / 2) / nextZoom;

        return { ...v, zoom: nextZoom, x: newX, y: newY };
      });
    },
    [size.width, size.height]
  );

  // Return combined viewport object
  const viewport = { ...transform, ...size };

  return { viewport, setTransform, panBy, zoomAt };
}
