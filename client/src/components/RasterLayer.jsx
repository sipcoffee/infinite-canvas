import React from "react";

export default function RasterLayer({ frame, visible }) {
  // frame: { frameId, imageBase64 }
  const src = frame ? `data:image/png;base64,${frame.image}` : null;
  return (
    <img
      alt="raster"
      src={src}
      className="canvas-layer fade-image"
      style={{ zIndex: visible ? 40 : 0, opacity: visible ? 1 : 0 }}
      width={frame ? frame.width : undefined}
      height={frame ? frame.height : undefined}
    />
  );
}
