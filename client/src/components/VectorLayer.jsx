import { generateStars } from "@/data/stars";
import React, { useEffect, useRef, useState } from "react";

export default function VectorLayer({ viewport, visible, onVisibleStarsChange }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [stars] = useState(() => generateStars(1000000));

  const [visibleStars, setVisibleStars] = useState([]);

  useEffect(() => {
    const newVisible = getVisibleStars();
    setVisibleStars(newVisible);

    // send up to CanvasLayer/App
    if (onVisibleStarsChange) {
      onVisibleStarsChange(newVisible);
    }

  }, [viewport]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", () => setHoveredStar(null));

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", () => setHoveredStar(null));
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function draw() {
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      ctx.fillStyle = "#03030a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const drawStar = (s) => {
        const sx = (s.x - viewport.x) * viewport.zoom + canvas.width / 2;
        const sy = (s.y - viewport.y) * viewport.zoom + canvas.height / 2;

        if (
          sx < -50 ||
          sx > canvas.width + 50 ||
          sy < -50 ||
          sy > canvas.height + 50
        )
          return;

        // ⭐ animate size
        s.pulsePhase += s.pulseSpeed;
        const pulseFactor = 1 + Math.sin(s.pulsePhase) * s.pulseAmp;

        const outerRadius = Math.max(0.6, s.size * viewport.zoom * pulseFactor);
        const innerRadius = outerRadius / 2;

        ctx.globalAlpha = Math.min(1, s.brightness);
        ctx.fillStyle = s.color; // ⭐ apply color

        const numPoints = 5;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / numPoints;

        ctx.beginPath();
        ctx.moveTo(sx, sy - outerRadius);
        for (let i = 0; i < numPoints; i++) {
          ctx.lineTo(
            sx + Math.cos(rot) * outerRadius,
            sy + Math.sin(rot) * outerRadius
          );
          rot += step;
          ctx.lineTo(
            sx + Math.cos(rot) * innerRadius,
            sy + Math.sin(rot) * innerRadius
          );
          rot += step;
        }
        ctx.closePath();
        ctx.fill();
      };

      const lod = Math.max(1, Math.floor(6 / Math.sqrt(viewport.zoom)));
      for (let i = 0; i < stars.length; i += lod) drawStar(stars[i]);

      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, [viewport, stars, visible]);

  function getVisibleStars() {
    const visible = [];

    const w = viewport.width;
    const h = viewport.height;

    for (const s of stars) {
      const sx = (s.x - viewport.x) * viewport.zoom + w / 2;
      const sy = (s.y - viewport.y) * viewport.zoom + h / 2;

      if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
        visible.push(s);
      }
    }

    return visible;
  }

  // console.log('visible stars from VECTOR', visibleStars)

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ zIndex: visible ? 20 : 5, opacity: visible ? 1 : 0.001 }}
      />
    </div>
  );
}
