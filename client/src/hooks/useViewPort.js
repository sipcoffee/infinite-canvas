
import { useState, useEffect, useCallback, useMemo } from 'react';

export default function useViewport(initial = { x: 0, y: 0, zoom: 1 }) {
  const [viewport, setViewport] = useState({
    ...initial,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    function onResize() {
      setViewport((v) => ({
        ...v,
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const panBy = useCallback((dx, dy) => {
    setViewport((v) => ({
      ...v,
      x: v.x - dx / v.zoom,
      y: v.y - dy / v.zoom,
    }));
  }, []);

  const zoomAt = useCallback((factor, clientX, clientY) => {
    setViewport((v) => {
      const cx = clientX ?? v.width / 2;
      const cy = clientY ?? v.height / 2;
      const worldX = v.x + (cx - v.width / 2) / v.zoom;
      const worldY = v.y + (cy - v.height / 2) / v.zoom;
      const newZoom = v.zoom * factor;
      return {
        ...v,
        zoom: newZoom,
        x: worldX - (cx - v.width / 2) / newZoom,
        y: worldY - (cy - v.height / 2) / newZoom,
      };
    });
  }, []);

  // New function to get visible stars
  const getVisibleStars = useCallback((stars) => {
    const visibleStars = [];
    const halfWidth = viewport.width / 2;
    const halfHeight = viewport.height / 2;

    for (const star of stars) {
      const sx = (star.x - viewport.x) * viewport.zoom + halfWidth;
      const sy = (star.y - viewport.y) * viewport.zoom + halfHeight;

      if (
        sx >= -50 &&
        sx <= viewport.width + 50 &&
        sy >= -50 &&
        sy <= viewport.height + 50
      ) {
        visibleStars.push({
          ...star,
          screenX: sx,
          screenY: sy,
        });
      }
    }

    return visibleStars;
  }, [viewport]);

  return { viewport, panBy, zoomAt, getVisibleStars };
}