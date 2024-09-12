import React, { useEffect, useState } from "react";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
// import NavigationLink from "./NavigationLink";
import { IoHome } from "react-icons/io5";
import { SiSimpleanalytics } from "react-icons/si";
import { MdOutlineFormatAlignLeft } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import Alignment from "./Alignment";
import { useParams, Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const containerVariants = {
  close: {
    width: "4rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "10rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerControls = useAnimationControls();
  const [isAligned, setIsAlgined] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
    } else {
      containerControls.start("close");
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleAlign = () => {
    setIsAlgined(!isAligned);
  };

  return (
    <>
      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial="close"
        className=" bg-[#00072d]  flex flex-col z-20 gap-20 p-5 absolute top-0 left-0 h-full shadow shadow-neutral-600"
      >
        <div className="flex flex-row w-full  justify-between place-items-center">
          {/* Orange Circle Div */}
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-500 rounded-full"></div>
          {/* <img
            src={Logo}
            alt="logo"
            className="p-1  flex items-center justify-center w-12 h-12 bg-white rounded-full"
          /> */}
          {/* Arrow Button */}
          <button
            className="flex items-center justify-center p-2 rounded-full bg-neutral-700"
            onClick={handleToggle}
          >
            <FaArrowRight
              className={`w-4 h-4 text-neutral-200 transition-transform duration-500 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Link
              to="/"
              className="mt-8 p-1 rounded flex cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
            >
              <IoHome className="stroke-inherit stroke-[0.75] min-w-5 w-5 flex items-center  justify-center" />
              {isOpen && (
                <p className="text-inherit font-Poppins overflow-clip  tracking-wide">
                  Home
                </p>
              )}
            </Link>
            <Link
              to="/paper-list"
              className=" mt-4 p-1 rounded flex cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
            >
              <SiSimpleanalytics className="stroke-inherit stroke-[0.75] min-w-5 w-5 flex items-center  justify-center" />
              {isOpen && (
                <p className="text-inherit font-Poppins overflow-clip  tracking-wide">
                  Dashboard
                </p>
              )}
            </Link>
            <button
              onClick={handleAlign}
              className=" mt-4 p-1 rounded flex cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
            >
              <MdOutlineFormatAlignLeft className="stroke-inherit stroke-[0.75] min-w-5 w-5 flex items-center  justify-center" />
              {isOpen && (
                <p className="text-inherit font-Poppins overflow-clip  tracking-wide">
                  Alignment
                </p>
              )}
            </button>
            <Link
              href="/login"
              className=" mt-4 p-1 rounded flex cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
            >
              <FaRegUser className="stroke-inherit stroke-[0.75] min-w-5 w-5 flex items-center  justify-center" />
              {isOpen && (
                <p className="text-inherit font-Poppins overflow-clip  tracking-wide">
                  Logout
                </p>
              )}
            </Link>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {id && (
          <Alignment
            isOpen={isOpen}
            isAligned={isAligned}
            setIsAligned={setIsAlgined}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
