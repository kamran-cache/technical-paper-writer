import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AbstractAndKeywordsForm from "../components/AbstractAndKeywords";
import TitleAndAuthorsForm from "../components/TitleAndAuthors";
import SectionsForm from "../components/SectionsForm";
import { setAbstract, setKeywords } from "../Redux/abstractsAndKeywordsSlice";
import { setTitle, setAuthors, displayAuthor } from "../Redux/titleAndAuthors";
import {
  addSection,
  displaySection,
  reorderSection,
} from "../Redux/sectionsSlice";
import { setAlerts } from "../Redux/applicationStatesSlice";
import store from "../Redux/store";
import Navbar from "../components/Navbar";
import AddPdf from "../components/AddPdf";
import { setPdf } from "../Redux/pdfSlice";
import RightSideBar from "../components/RightSideBar";
import CustomPdf from "../components/CustomPdf";
import Navigation from "../components/Navigation";
import "./paperlist.css";
import { FaXmark } from "react-icons/fa6";

const Paper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);
  const [sections, setSections] = useState([]);

  const section = useSelector((state) => state.sections.sections);
  const application = useSelector((state) => state.application);
  console.log(application, "application");
  const handleNext = (i) => {
    if (i < section.length + 2) setIndex(i + 1);
  };

  const handlePrev = (i) => {
    if (i > 0) setIndex(i - 1);
  };

  const getData = async () => {
    try {
      const token = window.localStorage.getItem("token");
      console.log(id);
      if (id !== "undefined") {
        const response = await axios.get(
          `http://18.206.56.55/api/v1/paper/get-paper/${id}`,
          // `http://localhost:5000/api/v1/paper/get-paper/${id}`,
          {
            headers: { token: `Bearer ${token}` },
          }
        );
        const paperData = response.data;
        setData(paperData.paper);
        console.log(paperData, "paperData");

        // Update Redux store
        dispatch(setTitle(paperData.paper.titleAndAuthors.title));
        dispatch(displayAuthor(paperData.paper.titleAndAuthors.authors));
        dispatch(setAbstract(paperData.paper.abstractAndKeywords.abstract));
        dispatch(setKeywords(paperData.paper.abstractAndKeywords.keywords));
        dispatch(displaySection(paperData.paper.sections.sections));
        dispatch(setPdf(paperData.paper.pdfs.pdfs));

        // Set sections
        setSections(paperData.paper.sections.sections || []);
      }
    } catch (error) {
      console.error("There was an error fetching the paper data!", error);
    }
  };

  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      navigate("/login");
    }
    getData();
    setSections(section);
    console.log("index", index);
    console.log("store", store.getState());
  }, [id]);

  const handleAlert = () => {
    dispatch(setAlerts(false));
  };

  // const handleSee = () => {
  //   navigate(`pdf/${id}`);
  // };
  return (
    <>
      {application.alerts && (
        <>
          <div className="mt-1 flex items-center justify-center">
            <div
              className=" bg-red-100 w-full sm:w-[30rem] border border-red-400 text-red-700 px-1 py-1 rounded relative"
              role="alert"
            >
              <span className="block text-sm sm:inline">
                {application.message}
              </span>
              <span className="absolute top-0 bottom-0 right-0 px-2 py-2">
                <FaXmark className="cursor-pointer" onClick={handleAlert} />
              </span>
            </div>
          </div>
        </>
      )}
      <div
        className={`main h-screen ${
          application.alerts ? "-mt-2" : ""
        } bg-gradient-to-b from-[#f8f7ff]/40   via-[#e1e5f2]/40 to-[#fdc5f5]/40 flex items-center justify-center`}
      >
        {/* <Navbar /> */}

        <Navigation />

        <div className="container shadow-xl shadow-neutral-400 border-t-2 rounded-lg md:ml-12 bg-[#faf5ff] md:h-[95%] w-[90%] flex flex-row items-center justify-between px-4 md:px-8 relative">
          {/* Left: Navigation */}

          {/* Center: Form */}
          <div className="form-container flex flex-col ml-20 w-full md:w-[50%] h-[90vh] md:h-auto mx-4">
            <div className="bg-white rounded-lg shadow-lg w-full h-[75vh] md:h-[600px] flex flex-col items-center justify-center">
              {index === 0 && <TitleAndAuthorsForm />}
              {index === 1 && <AddPdf />}
              {index === 2 && <AbstractAndKeywordsForm />}
              {index > 2 && index - 3 < section.length && (
                <SectionsForm
                  sectionData={section[index - 3]}
                  sectionIndex={index - 3}
                />
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                className="border-2 rounded-lg bg-[#00072d]  text-neutral-200 hover:bg-neutral-950 hover:text-white p-2"
                onClick={() => handlePrev(index)}
              >
                Prev
              </button>
              <div className="relative w-[70%] h-3 bg-white rounded-full mx-4">
                <div
                  className={`progress top-0 left-0 absolute h-full bg-gradient-to-r from-sky-500  to-fuchsia-600 via-violet-500 rounded-full transition-transform duration-500`}
                  style={{
                    width: `${((index + 1) / (section.length + 3)) * 100}%`,
                  }}
                ></div>
              </div>
              <button
                className="border-2 rounded-lg  bg-[#00072d]  text-neutral-200 hover:bg-neutral-950 hover:text-white p-2"
                onClick={() => handleNext(index)}
              >
                Next
              </button>
            </div>
          </div>

          {/* Right: PDF Display */}
          <div className="pdf-container scrollbar-hidden -mt-16 border-2 overflow-y-auto w-[45%] hidden lg:flex flex-col items-center justify-start h-[600px]">
            <CustomPdf />
          </div>
        </div>
      </div>
    </>
  );
};

export default Paper;
