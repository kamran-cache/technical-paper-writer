import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../Redux/applicationStatesSlice";
import store from "../Redux/store";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import AbstractAndKeywordsForm from "../components/AbstractAndKeywords";
import TitleAndAuthorsForm from "../components/TitleAndAuthors";
import SectionsForm from "../components/SectionsForm";
import AddPdf from "../components/AddPdf";
import CustomPdf from "../components/CustomPdf";
import { setTitle, setAuthors, displayAuthor } from "../Redux/titleAndAuthors";
import { setAbstract, setKeywords } from "../Redux/abstractsAndKeywordsSlice";
import { setPdf } from "../Redux/pdfSlice";
import {
  addSection,
  displaySection,
  reorderSection,
} from "../Redux/sectionsSlice";
import "./index.css";
import Review from "../components/Review";
import Pdfdisplay from "../components/Pdfdisplay";
import {
  setAlerts,
  setMessage,
  setLoading,
} from "../Redux/applicationStatesSlice";
import { FaXmark } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";

const Paper1 = () => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [pdfUrl, setPdfUrl] = useState("");
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState("");
  const title = useSelector((state) => state.titleAndAuthors.title);
  const section = useSelector((state) => state.sections.sections);
  const application = useSelector((state) => state.application);
  const navigate = useNavigate();
  const error = useSelector((state) => state.application.errors);
  const data = [
    "Title and authors",
    "Abstract and Keywords",
    "PDF",
    ...section.map((sec) => `${sec.title}`),
    "Review",
  ];

  const handleNext = (i) => {
    if (i < data.length - 1) setIndex(i + 1);
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
          // `http://tpw.smartimmigrant.ai/api/v1/paper/get-paper/${id}`,
          `http://localhost:5000/api/v1/paper/get-paper/${id}`,
          {
            headers: { token: `Bearer ${token}` },
          }
        );
        const paperData = response.data;
        // setData(paperData.paper);
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
    console.log(window.localStorage.getItem("token"));
    // if (!window.localStorage.getItem("token")) {
    //   // console.log()
    //   navigate("/login");
    // }
    getData();
  }, [id]);

  useEffect(() => {
    console.log("index", index);
    console.log("store", store.getState());
    setSections(section);
    if (index >= data.length) {
      setIndex(data.length - 1); // Move to the last valid index
    }
  }, [section, index, data.length]);

  const handleAlert = () => {
    dispatch(setAlerts(false));
  };

  const payloadWithoutPdf = (state) => {
    const { application, pdf, ...rest } = state;
    return rest;
  };

  const validation = (data) => {
    if (!data) return false;

    // Check if title is filled
    if (
      !data.titleAndAuthors?.title ||
      data.titleAndAuthors.title.trim() === ""
    ) {
      dispatch(setAlerts(true));
      dispatch(setMessage("Title is required."));
      return false;
    }

    // Check if each author field is filled
    if (data.titleAndAuthors?.authors?.length) {
      for (const author of data.titleAndAuthors.authors) {
        if (!author.name || author.name.trim() === "") {
          dispatch(setAlerts(true));
          dispatch(setMessage("Author name is required."));
          return false;
        }
        if (!author.department || author.department.trim() === "") {
          dispatch(setAlerts(true));
          dispatch(setMessage("Author department is required."));
          return false;
        }
        if (!author.organization || author.organization.trim() === "") {
          dispatch(setAlerts(true));
          dispatch(setMessage("Author organization is required."));
          return false;
        }
      }
    } else {
      dispatch(setAlerts(true));
      dispatch(setMessage("At least one author is required."));
      return false;
    }

    return true;
  };

  const handleClick = async () => {
    try {
      const data = store.getState();
      const state = payloadWithoutPdf(data);
      console.log(state, "payload data ");
      const isValid = validation(store.getState());

      if (!isValid) {
        return;
      }

      dispatch(setLoading(true)); // Show loader when save button is clicked
      setPdfUrl();

      const token = window.localStorage.getItem("token");
      let response;
      if (isValid) {
        if (id !== "undefined") {
          response = await axios.put(
            // `http://tpw.smartimmigrant.ai/api/v1/paper/${id}`,
            `http://localhost:5000/api/v1/paper/${id}`,
            state,
            {
              headers: { token: `Bearer ${token}` },
            }
          );
        } else {
          response = await axios.post(
            // "http://tpw.smartimmigrant.ai/api/v1/paper/add",
            "http://localhost:5000/api/v1/paper/add",
            state,
            {
              headers: { token: `Bearer ${token}` },
            }
          );
          navigate(`/paper1/${response.data._id}`);
        }

        const res = await axios.post(
          // "http://tpw.smartimmigrant.ai/api/v1/paper/generate",
          "http://localhost:5000/api/v1/paper/generate",
          state,
          {
            headers: { token: `Bearer ${token}` },
          }
        );
        console.log(res, "res");
        if (res.status === 200) {
          // Handle success response
          console.log("Document generated successfully!");
          const binaryData = atob(res.data.pdf);
          const byteNumbers = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteNumbers[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([byteNumbers], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          dispatch(setLoading(false));
          dispatch(setError(""));
          // You can navigate to another page or display success message here
        } else {
          // Handle unexpected response status
          setErrors(["Unexpected response status: " + res.status]);
          console.log(errors, "errors");
        }
      }
    } catch (error) {
      // Handle error response from API
      if (error.response) {
        // If the server responded with a status code outside the 2xx range
        const { message, error: errorMessage } = error.response.data;

        // Display the main error message
        if (message) {
          setErrors([message]);
        }

        // Extract specific LaTeX errors from the response
        const latexErrorMatch = errorMessage.match(/! LaTeX Error: .+/);
        console.log(latexErrorMatch, "errormatch");
        if (latexErrorMatch) {
          let value =
            latexErrorMatch[0] +
            " \n So please use some other similar special character!!";
          dispatch(setError(value));
          dispatch(setLoading(false));
        } else {
          // setErrors((prevErrors) => [...prevErrors, errorMessage]); // Add the general error message if no LaTeX error found
          dispatch(setError("Use Normal Special Characters!!!"));
        }
      } else if (error.request) {
        // If the request was made but no response was received
        setErrors(["No response from server. Please try again."]);
      } else {
        // Something happened in setting up the request that triggered an error
        setErrors([error.message]);
      }
      console.error("There was an error processing the paper!", error);
    } finally {
      setLoading(false); // Hide loader when the PDF is ready
    }
  };

  return (
    <>
      <div className="main bg-red-300 mt-2 h-[130vh] max-w-full flex flex-col  scrollbar-transparent">
        <div className="top h-[280px] w-full  ">
          <div className="title mt-3 ml-4 display flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <FaAngleLeft className="text-3xl font-semibold" />
              {title ? (
                <h3 className=" text-[32px] font-semibold font-sans ml-4">
                  {title}
                </h3>
              ) : (
                <h3 className=" text-[32px] font-semibold font-sans ml-4">
                  AI Paper Writer
                </h3>
              )}
            </div>
            <div className="flex flex-row mr-10 gap-4">
              <div className="h-[36px] w-[36px] flex items-center justify-center border-[1px] border-[#D4D4D4] rounded hover:bg-blue-500 hover:text-white">
                <CiSettings className="text-[20px]" />
              </div>
              <div className="h-[36px] w-[36px] flex items-center justify-center border-[1px] border-[#D4D4D4] rounded hover:bg-blue-500 hover:text-white">
                <BsThreeDotsVertical className="text-[20px]" />
              </div>
            </div>
          </div>
          <h1 className="ml-16 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti,
            in!
          </h1>
          {/* Progress Bar */}
          <div className="progressbar mt-4 relative w-[90%] h-1 bg-[#D7D7D7] rounded-full mx-10">
            <div
              className={`progress top-0 left-0 absolute h-full bg-gradient-to-r via-[#9253FF] from-purple-800 to-[#32A8FF]  rounded-full transition-all duration-500`}
              style={{
                width:
                  index === 0
                    ? "1.5rem"
                    : `${(index / (data.length - 1)) * 100}%`,
              }}
            ></div>

            {/* Circles and Titles */}
            {data.map((sectionItem, idx) => (
              <div
                key={idx}
                className="absolute flex flex-col items-center -mt-[5px]"
                style={{
                  left: `${(idx / (data.length - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                  marginLeft: idx === 0 ? "1.5rem" : "0", // Optional margin for the first element
                }}
              >
                {/* Circle with Active Indicator */}
                <div
                  className={`circle w-3 h-3 ${
                    idx <= index
                      ? "bg-blue-500 duration-700"
                      : "bg-white border-2 border-blue-500"
                  } rounded-full -top-2`}
                ></div>

                {/* Title Below Circle */}
                <span className="text-xs text-gray-700 ml-4 text-center whitespace-pre-wrap">
                  {sectionItem.split(" ").map((word, i) => (
                    <>
                      {word}
                      {i % 2 === 1 && <br />}{" "}
                      {/* Add a line break after every two words */}{" "}
                    </>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="buttons flex flex-row items-start justify-between mx-12 mt-10 mb-3 w-[90%]">
            <button
              className="border mt-[1rem] rounded-lg text-blue-500 border-blue-600 hover:text-white hover:bg-gradient-to-r from-[#9253FF] to-[#32A8FF] px-4 py-2 transition-all ease-in-out duration-300"
              onClick={() => handlePrev(index)}
            >
              Prev
            </button>
            <button
              className=" mt-[1rem] border rounded-lg text-blue-500 border-blue-600 px-4 py-2 hover:text-white hover:bg-gradient-to-r from-[#9253FF] to-[#32A8FF] transition-all ease-in-out duration-300"
              onClick={() => handleNext(index)}
            >
              Next
            </button>
          </div>
        </div>
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
        <div className="bottom   flex flex-row  h-full ">
          <div className="left flex flex-col justify-between rounded-lg h-[100%] w-1/2 bg-[#F3F4F7]">
            <div className="form h-[40rem] w-[90%] mx-10  my-6 bg-white rounded-lg">
              {index === 0 && <TitleAndAuthorsForm />}
              {index === 1 && <AddPdf />}
              {index === 2 && <AbstractAndKeywordsForm />}
              {index > 2 && index - 3 < section.length && (
                <SectionsForm
                  sectionData={section[index - 3]}
                  sectionIndex={index - 3}
                />
              )}
              {index === data.length - 1 && <Review />}
            </div>
            <div className="submit fixed z-50 bottom-0  flex flex-row items-center justify-between w-1/2 h-16 bg-white">
              <h1 className="ml-4">23453 words</h1>
              <button
                className="mr-9 rounded-lg bg-blue-500 hover:bg-blue-700 p-2 text-white"
                onClick={handleClick}
              >
                Save Progress
              </button>
            </div>
          </div>
          <div className="right h-[100%] w-1/2  my-6 flex justify-center ">
            <Pdfdisplay pdfUrl={pdfUrl} fileName={title} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Paper1;
