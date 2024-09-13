import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [menuOpen, setMenuopen] = useState(false);
  const handleToggles = () => {
    setMenuopen(!menuOpen);
  };
  return (
    <>
      <div className=" bg-white text-black   md:h-12 md:w-full flex flex-row items-center justify-between shadow-lg ">
        <div className="left flex flex-row item-center justify-center">
          <span className="left text-xl m-2 font-bold">Paper Writer</span>
        </div>
        <div className="center hidden  flex-col items-center justify-center md:flex md:flex-row md:item-center md:justify-center">
          <ul className=" hidden md:flex flex-col md:flex-row">
            <li className="m-2">Home</li>
            <li className="m-2">Features</li>
            <li className="m-2">About</li>
            <li className="m-2">Contact</li>
          </ul>
        </div>
        <div className="right  flex flex-row item-center justify-center ">
          <ul className="flex ">
            <Link to="/login">
              <li className="m-2">register</li>
              <li className="m-2">signin</li>
            </Link>
          </ul>
        </div>
        <div className="md:hidden flex items-center justify-end m-2">
          <button onClick={handleToggles}>{menuOpen ? "X" : <FaBars />}</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div className="fixed top-0 left-0 md:hidden h-full w-40 bg-gray-300 flex flex-col items-center justify-start">
            <ul className="flex flex-col ">
              <li className="m-2">Home</li>
              <li className="m-2">Shop</li>
              <li className="m-2">Products</li>
              <li className="m-2">Contact</li>
              <li className="m-2">register</li>
              <li className="m-2">signin</li>
              <li className="m-2">cart</li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
