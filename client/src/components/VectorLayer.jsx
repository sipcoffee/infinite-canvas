import React, { useEffect, useRef } from "react";

export default function VectorLayer({ viewport, stars, visible }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // clear
    ctx.fillStyle = "#03030a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // transform world -> screen: screenX = (worldX - viewport.x) * zoom + width/2
    const drawStar = (s) => {
      const sx = (s.x - viewport.x) * viewport.zoom + canvas.width / 2;
      const sy = (s.y - viewport.y) * viewport.zoom + canvas.height / 2;
      const size = Math.max(0.6, s.size * viewport.zoom);
      if (
        sx < -50 ||
        sx > canvas.width + 50 ||
        sy < -50 ||
        sy > canvas.height + 50
      )
        return;
      const alpha = Math.min(1, s.brightness);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    };

    // simple LOD: draw subset of stars depending on zoom
    const lod = Math.max(1, Math.floor(6 / Math.sqrt(viewport.zoom)));
    for (let i = 0; i < stars.length; i += lod) drawStar(stars[i]);

    ctx.globalAlpha = 1;
  }, [viewport, stars, visible]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-layer"
      style={{ zIndex: visible ? 20 : 5, opacity: visible ? 1 : 0.001 }}
    />
  );
}
