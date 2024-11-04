import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSection,
  addSectionContent,
  updateSectionContent,
  deleteSectionContent,
  addNextSection,
  moveContentDown,
  moveContentUp,
} from "../Redux/sectionsSlice";
import "./Section.css";
import "./index.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../firebase";
import { useParams } from "react-router-dom";
import axios from "axios";
import store from "../Redux/store";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { LuCircleDashed } from "react-icons/lu";
import { RiShining2Line } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import ContentDisplay from "./ContentDisplay";
import ContentDisplay2 from "./ContentDisplay2";

const SectionsForm = ({ sectionIndex }) => {
  const dispatch = useDispatch();
  const [newContentText, setNewContentText] = useState("");
  const [newContentEquation, setNewContentEquation] = useState(""); // State for new equation
  const [imageFile, setImageFile] = useState(null);
  const [imageTitle, setImageTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editContentIndex, setEditContentIndex] = useState(null); // For editing content
  const [isChecked, setIsChecked] = useState(false);
  const { id } = useParams();
  const titleofPaper = store.getState().titleAndAuthors.title;
  const token = window.localStorage.getItem("token");
  const [isEquationOpen, setIsEquationOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [editingField, setEditingField] = useState(null); // null, "text", or "equations"

  const section = useSelector((state) => state.sections.sections[sectionIndex]);
  const prevSection = useSelector(
    (state) => state.sections.sections[sectionIndex - 1]
  );
  const toggleEquation = () => {
    setIsEquationOpen(!isEquationOpen);
  };
  const toggleImage = () => {
    setIsImageOpen(!isImageOpen);
  };
  const toggleDisplay = () => {
    setIsDisplayOpen(!isDisplayOpen);
  };

  const handleSectionChange = (field, value) => {
    dispatch(setSection({ index: sectionIndex, field, value }));
  };

  const handleAddTextContent = () => {
    if (newContentText.trim() || newContentEquation.trim()) {
      dispatch(
        addSectionContent({
          index: sectionIndex,
          content: {
            text: newContentText,
            url: "",
            title: "",
            equations: "", // Handle equations
          },
        })
      );
      setNewContentText("");
      // setNewContentEquation(""); // Reset equations input
    }
  };

  const handleAddEquationContent = () => {
    if (newContentEquation.trim()) {
      dispatch(
        addSectionContent({
          index: sectionIndex,
          content: {
            text: "",
            url: "",
            title: "",
            equations: newContentEquation, // Handle equations
          },
        })
      );
    }
    setNewContentEquation("");
  };

  const handleAddImageContent = async () => {
    if (imageFile && imageTitle.trim()) {
      setUploading(true);
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);

        dispatch(
          addSectionContent({
            index: sectionIndex,
            content: {
              text: "",
              url: downloadURL,
              title: imageTitle,
              equations: "", // No equations for image content
            },
          })
        );

        setImageFile(null);
        setImageTitle("");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleEditContent = (contentIndex) => {
    setEditContentIndex(contentIndex);
  };

  const handleSaveContent = (contentIndex) => {
    const updatedContent = section.content[contentIndex];
    if (editingField === "text") {
      dispatch(
        updateSectionContent({
          sectionIndex,
          contentIndex,
          field: "text",
          value: updatedContent.text,
        })
      );
    } else {
      dispatch(
        updateSectionContent({
          sectionIndex,
          contentIndex,
          field: "equations",
          value: updatedContent.equations, // Save updated equations
        })
      );
    }
    setEditContentIndex(null);
  };

  const handleDeleteContent = (contentIndex) => {
    dispatch(deleteSectionContent({ sectionIndex, contentIndex }));
  };

  const handleAddNextSection = () => {
    console.log(sectionIndex, "Adding new section");
    dispatch(addNextSection({ sectionIndex }));
  };

  const handleAI = async () => {
    try {
      const formData = {
        titleOfPaper: titleofPaper,
        content: newContentText,
        field: section.title.toUpperCase(),
        isChecked: isChecked,
      };
      const response = await axios.post(
        `http://54.84.234.156/api/v1/openai/${id}`,
        formData,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      const cleanedText = response.data.replace(/#/g, "");
      setNewContentText(cleanedText);
    } catch (error) {
      console.log("Error occurred:", error);
    }
  };

  const handleMoveContentUp = (contentIndex) => {
    dispatch(moveContentUp({ sectionIndex, contentIndex }));
  };

  const handleMoveContentDown = (contentIndex) => {
    console.log("down index", contentIndex);
    dispatch(moveContentDown({ sectionIndex, contentIndex }));
  };
  console.log("editingField", editingField);
  console.log("contentIndex", section);

  return (
    <>
      <div className="section-item   rounded-lg h-full w-full overflow-y-auto scrollbar-transparent">
        <div className="title w-full h-12 flex items-center justify-start px-4  rounded-t-lg">
          <CiCircleCheck className="mx-2 text-green-700 text-xl" />

          <h1 className="text-black">
            {sectionIndex === 0 ? "Abstract" : prevSection.title}
          </h1>
        </div>
        {/* Middle div with hover effect */}
        <div className="relative w-full h-1 cursor-pointer">
          <button
            className="add-section-button flex flex-row items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-blue-700 border-2 text-blue-600 py-2 px-4 rounded opacity-0 hover:opacity-100 transition-opacity duration-300"
            onClick={handleAddNextSection}
          >
            <FaPlus className="mr-2" /> Add Section
          </button>
        </div>
        <div className="title w-full h-12 flex items-center justify-start px-4 bg-gradient-to-r from-[#9253FF] to-[#32A8FF] ">
          <LuCircleDashed className="mx-2 text-white" />

          <h1 className="text-white">{section.title}</h1>
        </div>

        {/* Title Section */}
        <div className="title border-2 border-[#d4d4d4] rounded-lg p-4 mt-4 mx-3">
          <label className="block mb-2">
            {/* Title: */}
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange("title", e.target.value)}
              className="block w-full  mt-1 p-2  focus:outline-none  rounded-lg"
              placeholder="Section title"
            />
            <hr className=" mt-1 mb-2 w-full  bg-[#d4d4d4] h-[1px]" />
          </label>

          {/* Text and Equation Content Section */}
          <div className="flex flex-col  mt-4">
            <label className="text-sm mb-2">Write text content</label>
            <textarea
              value={newContentText}
              onChange={(e) => setNewContentText(e.target.value)}
              placeholder="Write or enhance your content with the help of AI.."
              className="block  w-full h-40 mt-1 p-2 border-2 border-[#d4d4d4] focus:outline-none  rounded-lg"
            />

            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="refer-checkbox"
                name="abstract"
                value="ABSTRACT"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label htmlFor="refer-checkbox" className="text-sm ml-2">
                Refer to the {section.title} from the paper uploaded.
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="flex flex-row items-center justify-center border-2 border-blue-500 rounded-lg text-blue-500 hover:text-white hover:bg-gradient-to-r from-[#9253FF] to-[#32A8FF] transition-all ease-in-out duration-700 hover:border-white p-2 self-start">
                <RiShining2Line />
                <button className="ml-2 ttext-sm " onClick={handleAI}>
                  Optimize with AI
                </button>
              </div>

              <button
                className="px-2 text-sm bg-blue-500 hover:bg-blue-700 text-white  ml-3 rounded-lg"
                onClick={handleAddTextContent}
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
        {/* {Equations} */}
        {isEquationOpen ? (
          <>
            <div  className="equations m-3 rounded-lg p-4 flex flex-col border-2 border-[#d4d4d4]">
              <div onClick={toggleEquation} className="flex flex-row justify-between">
                <label htmlFor="">Equations</label>
                <FaAngleDown
                  
                  className="rotate-180 cursor-pointer"
                />
              </div>
              <hr className=" mt-1 mb-2 w-full  bg-[#d4d4d4] h-[1px]" />
              <textarea
                value={newContentEquation}
                onChange={(e) => setNewContentEquation(e.target.value)}
                placeholder="Add equations here..."
                className="block  w-full mt-1 p-2  focus:outline-none border-2 border-[#d4d4d4] rounded-lg"
              />
              <div className="btn flex justify-end mt-4 ">
                <button
                  className="p-3 text-sm bg-blue-600 text-white ml-3 rounded-lg"
                  onClick={handleAddEquationContent}
                >
                  Add Equation
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div onClick={toggleEquation} className="equations m-3 rounded-lg p-4 flex flex-col border-2 border-[#d4d4d4]">
              <div className="flex flex-row justify-between">
                <label htmlFor="">Add Equations</label>
                <FaAngleDown
                  
                  className="cursor-pointer"
                />
              </div>

              <hr className=" mt-2 mb-2 w-full  bg-[#d4d4d4] h-[1px]" />
            </div>
          </>
        )}

        {/* Image Upload Section */}
        {isImageOpen ? (
          <>
            <div  className="equations m-3 rounded-lg p-4 flex flex-col border-2 border-[#d4d4d4]">
              <div onClick={toggleImage} className="flex flex-row justify-between">
                <label htmlFor="">Add Images</label>
                <FaAngleDown
                  
                  className="rotate-180 cursor-pointer"
                />
              </div>
              <hr className=" mt-2 mb-2 w-full  bg-[#d4d4d4] h-[1px]" />

              {/* demo */}

              <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-10 mb-5 rounded-lg relative">
                <FiUpload className="text-4xl text-blue-500 mb-2" />
                {imageFile? (
                    <p className="text-[#30353B] mt-2 text-2 leading-[18px] tracking-[-2%]">{imageFile.name}</p>
                ):(
                  <>
                    <p className="text-[#30353B] mt-2 text-2 leading-[18px] tracking-[-2%]">
                      Drag and drop, or browse your images
                    </p>
                    <p className="text-[#7A7A7A] mt-2 text-[14px] leading-[18px] tracking-[-2%]">PDF. Max 10mb</p>
                </>

                )}
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {/* /demo  */}

              {/* <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="block w-full shadow-neutral-400 mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
              /> */}
              <input
                type="text"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Image title"
                className="block  w-full mt-1 mb-2 p-2 border-2 border-[#d4d4d4] focus:outline-none  rounded-lg"
              />
              <div className="flex justify-end">
                <button
                  className={`mt-2 p-2 text-white rounded-lg ${
                    !imageFile || !imageTitle.trim() || uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={handleAddImageContent}
                  disabled={!imageFile || !imageTitle.trim() || uploading}
                >
                  {uploading ? "Uploading..." : "Add Image"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div onClick={toggleImage} className="equations m-3 rounded-lg p-4 flex flex-col border-2 border-[#d4d4d4]">
              <div className="flex flex-row justify-between">
                <label htmlFor="">Add Image</label>
                <FaAngleDown  className="cursor-pointer" />
              </div>

              <hr className=" mt-2 mb-2 w-full  bg-[#d4d4d4] h-[1px]" />
            </div>
          </>
        )}

        <div>
          <ContentDisplay2 sectionIndex={sectionIndex} />
        </div>
      </div>
    </>
  );
};

export default SectionsForm;
