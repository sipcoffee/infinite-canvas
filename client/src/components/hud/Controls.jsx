import { Mouse } from "lucide-react";
import React from "react";

export default function Controls() {
  return (
    <div className="absolute bottom-6 left-6 flex z-30 bg-blue-950 shadow-2xl p-4 rounded-sm text-white flex-col gap-2">
      <span className="font-medium mb-1">Flight Control</span>
      <div className="flex gap-2 items-center">
        <Mouse size={16} />{" "}
        <span className="text-sm">Drag to fly the rocket</span>
      </div>
      <div className="flex gap-2 items-center">
        <Mouse size={16} />{" "}
        <span className="text-sm">Scroll to zoom into stars</span>
      </div>

      <div className="text-xs">
        <p>Zoom {">"} 6x switches to raster mode </p>
      </div>
    </div>
  );
}
