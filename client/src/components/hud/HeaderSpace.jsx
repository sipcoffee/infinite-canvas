import React from "react";

import logo from "./../../assets/logo1.png";
export default function HeaderSpace() {
  return (
    <div className="z-20 absolute top-3 left-6 p-4 ">
      <div className="flex gap-2 items-center">
        <img className="h-13 w-13 object-contain" alt="logo" src={logo} />
        <h2 className="text-white font-bold text-2xl">Orbital Navigator</h2>
      </div>
    </div>
  );
}
