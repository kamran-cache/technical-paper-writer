import React from "react";
import { FaAccessibleIcon } from "react-icons/fa";
import { RiShining2Line } from "react-icons/ri";
import { BsReverseLayoutTextWindowReverse } from "react-icons/bs";
import { SlClock } from "react-icons/sl";
import { BsFiletypePdf } from "react-icons/bs";
import { ImFilesEmpty } from "react-icons/im";
import background from "../../assets/background.jpg";

const Features = () => {
  const cardItems = [
    {
      title: "AI-Powered Writing Assistance",
      content:
        "Generate well-structured content with AI assistance, helping you focus on research, not writing.",
      icon: <RiShining2Line />,
    },
    {
      title: "Seamless LaTeX Integration",
      content:
        "Streamline formatting with seamless LaTeX integration—no coding required.",
      icon: <BsReverseLayoutTextWindowReverse />,
    },
    {
      title: "Save Valuable Time",
      content:
        "Automate tedious tasks like formatting and structuring, freeing up more time for your research.",
      icon: <SlClock />,
    },
    {
      title: "PDF Export and Management",
      content:
        "Compile, download, and manage your papers in polished PDF format with just one click.",
      icon: <BsFiletypePdf />,
    },
    {
      title: "Custom Templates",
      content:
        "Get started quickly with ready-made templates for popular research formats like IEEE and ACM.",
      icon: <ImFilesEmpty />,
    },
  ];

  return (
    <>
      <div className="h-screen w-full bg-white flex flex-col items-center">
        <div className="container mt-8 md:mt-4 h-[90%]  flex flex-col items-center justify-center w-full">
          <div className="heading text-2xl sm:text-3xl flex items-center justify-center mb-6">
            Features and Overview
          </div>
          <div className="subsection overflow-x-auto bg-blue-700/40 shadow-lg shadow-neutral-500 w-[95%] sm:w-[90%] h-[85%] flex flex-col sm:flex-row items-center justify-center flex-wrap p-4 rounded-xl">
            {cardItems &&
              cardItems.map((card) => (
                <div
                  key={card.title}
                  className="cards hover:shadow-neutral-700 m-4 h-[17rem] w-[90%] sm:w-[14rem] rounded-xl bg-[#faf5ff] flex flex-col p-6 shadow-lg shadow-neutral-400"
                >
                  <div className="icon flex items-center justify-start mb-4 text-3xl">
                    {card.icon}
                  </div>
                  <div className="title flex items-center justify-center font-semibold text-base sm:text-lg mb-2">
                    {card.title}
                  </div>
                  <div className="content text-left text-sm sm:text-base">
                    {card.content}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
