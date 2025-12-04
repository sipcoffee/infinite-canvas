import React from "react";

export default function RocketStatus({ viewport, mode }) {
  return (
    <div className="z-10 absolute bottom-6 right-6 p-4 bg-blue-950 shadow-2xl rounded-sm flex flex-col gap-2 text-white">
      <h5 className="font-semibold mb-1">Rocket Status</h5>
      <span className="text-white">
        🚀 {viewport.x.toFixed(5)}, {viewport.y.toFixed(5)}
      </span>
      <span className="text-xs">Engine Mode: {mode.toUpperCase()}</span>
      <span className="text-xs">Depth: {viewport.zoom.toFixed(2)}</span>
    </div>
  );
}
