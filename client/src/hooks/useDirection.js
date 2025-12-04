import { useEffect, useRef, useState } from "react";

export default function useDirection(viewport) {
  const prev = useRef({ x: viewport.x, y: viewport.y });
  const [angle, setAngle] = useState(0);
  const smoothedAngle = useRef(0);

  useEffect(() => {
    const dx = viewport.x - prev.current.x;
    const dy = viewport.y - prev.current.y;

    const speed = Math.sqrt(dx * dx + dy * dy);

    if (speed > 0.00001) {
      const rad = Math.atan2(dy, dx);
      const target = (rad * 180) / Math.PI + 90;

      const alpha = 0.1;
      smoothedAngle.current += alpha * (target - smoothedAngle.current);
      setAngle(smoothedAngle.current);
    }

    prev.current = { x: viewport.x, y: viewport.y };
  }, [viewport.x, viewport.y]);

  return angle;
}
