import { useEffect, useState } from "react";

export default function useRenderMode(zoom, threshold = 6) {
  const [mode, setMode] = useState(zoom >= threshold ? "raster" : "vector");

  useEffect(() => {
    setMode(zoom >= threshold ? "raster" : "vector");
  }, [zoom, threshold]);

  return mode;
}
