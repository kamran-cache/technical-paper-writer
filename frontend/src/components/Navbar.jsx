import React from "react";

const Navbar = () => {
  return (
    <div className="h-12 w-full bg-white shadow-lg">
      <div className="flex flex-row items-start justify-between">
        <span className="flex text-lg p-2  font-semibold">Paper Writer</span>
        <span className="flex text-lg p-2 text-gray-400 ">Hi, Kamran</span>
      </div>
    </div>
  );
};

export default Navbar;
