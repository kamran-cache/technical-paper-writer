import React from "react";
import hero from "../../assets/hero1.png";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div className="hero h-screen md:h-[90vh] w-full bg-[#faf5ff]">
      <div className="container h-full  flex flex-col items-center justify-center">
        <div className="title text-center font-Poppins text-blue-600 font-semibold text-xl md:text-2xl mt-4">
          Write Research Papers with Ease Using AI-Powered Assistance
        </div>
        <div className="subContainer mt-3 md:mt-8  h-full w-[95%] flex flex-col-reverse md:flex-row items-center justify-between">
          <div className="left md:-mt-4 mb-3 p-2  h-64 w-64 text-lg md:w-auto md:max-w-[60%] md:text-3xl flex flex-col">
            <div>
              Say goodbye to formatting headaches and endless revisions. Our
              AI-driven platform helps you create professional technical papers
              effortlessly, so you can focus on your research.
            </div>
            <div className="mt-4 mb-4 text-lg md:text-2xl">
              <Link to="/login">
                <button className="mr-3 md:p-2 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-950 text-white  h-10 w-32 text-sm md:text-lg md:h-16 md:w-40 rounded-lg">
                  Start Writing...
                </button>
              </Link>
              {/* <button className="md:p-2 bg-black text-white  h-10 w-24 text-lg md:h-16 md:w-36 rounded-lg ">
                Register
              </button> */}
            </div>
          </div>
          <div className="right md:-mt-8  md:h-[90%] md:w-[100%px]   h-[70%] w-[90%] ">
            <img
              src={hero}
              alt=""
              className=" md:h-[500px] md:w-[500px] md:-mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
