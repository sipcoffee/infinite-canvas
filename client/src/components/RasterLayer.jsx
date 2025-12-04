import React from "react";

export default function RasterLayer({ frame, visible }) {
  const src = frame ? `data:image/png;base64,${frame.image}` : null;

  return (
    <img
      alt="raster"
      src={src}
      className="absolute top-0 left-0 w-full h-full object-cover transition-opacity "
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
