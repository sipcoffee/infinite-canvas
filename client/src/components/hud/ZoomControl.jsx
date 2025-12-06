import React from "react";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function ZoomControl({ zoomAt }) {
  return (
    <div className="z-20 absolute bottom-40 right-6 p-4  flex  gap-2 text-white">
      <Button variant="ghost" onClick={() => zoomAt(1.25)}>
        <ZoomIn />
      </Button>

      <Button variant="ghost" onClick={() => zoomAt(1 / 1.25)}>
        <ZoomOut />
      </Button>
    </div>
  );
}
