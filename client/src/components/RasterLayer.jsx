import React from "react";

export default function RasterLayer({ frame, visible }) {
  // frame: { frameId, imageBase64 }
  const src = frame ? `data:image/png;base64,${frame.image}` : null;
  // console.log('src is', frame)
  
  return (
    <img
      alt="raster"
      src={src}
      className="absolute top-0 left-0 w-full h-full object-cover transition-opacity "
      style={{ opacity: visible ? 1 : 0 }}
    />  
  );
}
