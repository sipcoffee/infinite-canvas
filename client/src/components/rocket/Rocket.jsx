import useDirection from "@/hooks/useDirection";
import React from "react";
import rocketSvg from "../../assets/rocket.svg";

export default function Rocket({ viewport }) {
  const rocketAngle = useDirection(viewport);
  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 
               -translate-x-1/2 -translate-y-1/2 z-20"
      style={{
        transform: `translate(-50%, -50%) rotate(${rocketAngle}deg)`,
      }}
    >
      <div className="relative flex items-center justify-center">
        <img
          src={rocketSvg}
          className="w-16 h-16 select-none shadow-2xl"
          draggable={false}
        />
      </div>
    </div>
  );
}
