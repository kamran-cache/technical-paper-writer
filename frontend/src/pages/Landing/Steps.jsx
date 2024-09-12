import React from "react";
import Step from "../../assets/steps.jpg";
import Paper from "../../assets/win1.png";
const Steps = () => {
  return (
    <>
      <div className="h-screen w-full bg-white flex flex-col items-center">
        <div className="heading mt-2 text-2xl sm:text-3xl flex items-center justify-center mb-3">
          Steps to create your paper with{" "}
          <span className="ml-2 text-purple-900 text-3xl font-bold"> Ai</span>
        </div>
        <div className="container  h-full w-full flex items-center justify-center">
          <div className="left h-full w-2/5 bg-green-300">
            <img src={Step} alt="" className="h-full w-full" />
          </div>
          <div className="right h-full w-3/5 flex flex-col items-center justify-center">
            <div className="top flex items-center justify-center">
              <img src={Paper} alt="" className="h-96 w-96 p-4" />
            </div>
            <div className="bottom flex flex-col h-full w-full">
              <div className="1 h-20 w-[60%] bg-gradient-to-r from-rose-50 via-rose-100 to-rose-200  text-3xl rounded-md shadow-lg">
                <div className="text p-3 flex flex-col items-start justify-center">
                  <span>3. Fill the form</span>
                  <p className="text-base mt-1">
                    Start by entering all the required details in the form.
                  </p>
                </div>
              </div>
              <div className="2 h-20 w-[70%] bg-gradient-to-r from-rose-100 via-rose-200 to-rose-300  text-3xl rounded-md shadow-lg mt-4">
                <div className="text p-3 flex flex-col items-start justify-center">
                  <span>2. Review your inputs</span>
                  <p className="text-base mt-1">
                    Double-check all the information before proceeding.
                  </p>
                </div>
              </div>
              <div className="3 h-20 w-[80%] bg-gradient-to-r from-rose-200 via-rose-300 to-rose-400  text-3xl rounded-md shadow-lg mt-4">
                <div className="text p-3 flex flex-col items-start justify-center">
                  <span>1. Submit your paper</span>
                  <p className="text-base mt-1">
                    Once everything looks good, submit your paper for review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Steps;
