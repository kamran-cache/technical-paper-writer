import React from "react";
import { Link } from "react-router-dom";
const Additional = () => {
  return (
    <div className="h-[30rem]  flex flex-col items-center justify-center">
      <div className="text-5xl font-bold">Craft your technical paper</div>
      <Link to="/login">
        <button className=" mt-8 text-xl bg-gradient-to-r from-blue-600 via-blue-800 to-blue-950 text-white h-16 w-40 rounded-xl">
          Start Writing...
        </button>
      </Link>
    </div>
  );
};

export default Additional;
