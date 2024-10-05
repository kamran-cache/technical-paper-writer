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

//dragable content 
import {
  reorderSection,
  addSection,
  deleteSection,
} from "../Redux/sectionsSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PiDotsSixVertical } from "react-icons/pi";




const ContentDisplay = ({ sectionIndex }) => {

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

  const handleDrag = (result) => {
    const { source, destination } = result;
  
    // If there is no destination or the item is dropped in the same place, return
    if (!destination || source.index === destination.index) return;
  
    const sourceIndex = source.index;
    const destinationIndex = destination.index;
  
    try {
      // Ensure the action payload is correct
      dispatch(
        reorderSection({
          sourceIndex,
          destinationIndex,
        })
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
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
      {isDisplayOpen ? (
        <>
          <div  className="m-3 p-4 rounded-lg flex flex-col border-2 border-[#d4d4d4]">
            <div onClick={toggleDisplay} className="flex flex-row justify-between">
              <label htmlFor="">Arrange added content:</label>
              <FaAngleDown
                
                className="rotate-180 cursor-pointer"
              />
            </div>

            <hr className="mt-2 mb-2 w-full bg-[#d4d4d4] h-[1px]" />

            {/* DragDropContext enables drag and drop functionality */}
            <DragDropContext onDragEnd={handleDrag}>
              <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className=""
              >
              {section.content.map((contentItem, contentIndex) => (
                <Draggable
                    draggableId={`item-${contentIndex}`}  // Use index as the unique draggableId
                    key={contentIndex}               // Use index as the unique key
                    index={contentIndex}
                  >
                  {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className= " cursor-grab"
                      >
              <div key={contentIndex} className="mt-2 p-2 border rounded-lg">
              <PiDotsSixVertical className="text-black text-xl mr-2" />
                {editContentIndex === contentIndex ? (
                  <>
                    {/* Conditional rendering for editing equations */}
                    {editingField === "equations" ? (
                      <>
                        <textarea
                          value={contentItem.equations}
                          onChange={(e) =>
                            dispatch(
                              updateSectionContent({
                                sectionIndex,
                                contentIndex,
                                field: "equations",
                                value: e.target.value,
                              })
                            )
                          }
                          className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                          placeholder="Add equations here..."
                        />
                        <button
                          className="mt-2 p-2 shadow-neutral-400 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          onClick={() => handleSaveContent(contentIndex)}
                        >
                          Save
                        </button>
                      </>
                    ) : editingField === "text" ? (
                      <>
                        {/* Conditional rendering for editing text */}
                        <textarea
                          value={contentItem.text}
                          onChange={(e) =>
                            dispatch(
                              updateSectionContent({
                                sectionIndex,
                                contentIndex,
                                field: "text",
                                value: e.target.value,
                              })
                            )
                          }
                          className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                        />
                        <button
                          className="mt-2 p-2 shadow-neutral-400 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          onClick={() => handleSaveContent(contentIndex)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <>
                          {/* Conditional rendering for editing text */}
                          <textarea
                            value={contentItem.title}
                            onChange={(e) =>
                              dispatch(
                                updateSectionContent({
                                  sectionIndex,
                                  contentIndex,
                                  field: "title",
                                  value: e.target.value,
                                })
                              )
                            }
                            className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
                          />
                          <button
                            className="mt-2 p-2 shadow-neutral-400 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            onClick={() => handleSaveContent(contentIndex)}
                          >
                            Save
                          </button>
                        </>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Display text content */}
                    {contentItem.text && (
                      <>
                        <p>
                          {contentItem.text}

                          {/* Edit, delete, move buttons */}
                          <div className="mt-2 flex space-x-2">
                            <button
                              className="flex items-center space-x-1"
                              onClick={() => {
                                setEditContentIndex(contentIndex);
                                setEditingField("text");
                              }}
                            >
                              <FiEdit className="text-xl" />
                            </button>

                            <button
                              className="flex items-center space-x-1"
                              onClick={() => handleDeleteContent(contentIndex)}
                            >
                              <MdDeleteOutline className="text-2xl" />
                            </button>

                            <button
                              className="flex items-center space-x-1"
                              onClick={() => handleMoveContentUp(contentIndex)}
                              disabled={contentIndex === 0} // Disable if it's the first item
                            >
                              <FaArrowUp className="text-lg" />
                            </button>

                            <button
                              className="flex items-center space-x-1"
                              onClick={() =>
                                handleMoveContentDown(contentIndex)
                              }
                              disabled={
                                contentIndex === section.content.length - 1
                              } // Disable if it's the last item
                            >
                              <FaArrowDown className="text-lg" />
                            </button>
                          </div>
                        </p>
                      </>
                    )}

                    {/* Display equation content */}
                    {contentItem.equations && (
                      <div className="mt-2 p-2 border rounded-lg bg-white">
                        <p className="font-semibold">Equations:</p>
                        <p>{contentItem.equations}</p>

                        {/* Edit, delete, move buttons */}
                        <div className="mt-2 flex space-x-2">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => {
                              setEditContentIndex(contentIndex);
                              setEditingField("equations");
                            }}
                          >
                            <FiEdit className="text-xl" />
                          </button>

                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleDeleteContent(contentIndex)}
                          >
                            <MdDeleteOutline className="text-2xl" />
                          </button>

                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleMoveContentUp(contentIndex)}
                            disabled={contentIndex === 0} // Disable if it's the first item
                          >
                            <FaArrowUp className="text-lg" />
                          </button>

                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleMoveContentDown(contentIndex)}
                            disabled={
                              contentIndex === section.content.length - 1
                            } // Disable if it's the last item
                          >
                            <FaArrowDown className="text-lg" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Display image content */}
                    {contentItem.url && (
                      <div>
                        <p>{contentItem.title}</p>
                        <img
                          src={contentItem.url}
                          alt={contentItem.title}
                          className="w-full h-auto mt-2"
                        />

                        {/* Edit, delete, move buttons */}
                        <div className="mt-2 flex space-x-2">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => {
                              setEditContentIndex(contentIndex);
                              setEditingField("image");
                            }}
                          >
                            <FiEdit className="text-xl" />
                          </button>

                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleDeleteContent(contentIndex)}
                          >
                            <MdDeleteOutline className="text-2xl" />
                          </button>

                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleMoveContentUp(contentIndex)}
                            disabled={contentIndex === 0} // Disable if it's the first item
                          >
                            <FaArrowUp className="text-lg" />
                          </button>

                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleMoveContentDown(contentIndex)}
                            disabled={
                              contentIndex === section.content.length - 1
                            } // Disable if it's the last item
                          >
                            <FaArrowDown className="text-lg" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {contentItem.text === "" &&
                  contentItem.equations === "" &&
                  contentItem.url === "" && (
                    <>
                      {/* Edit, delete, move buttons */}
                      <div className="mt-2 flex space-x-2">
                        <button
                          className="flex items-center space-x-1"
                          onClick={() => {
                            setEditContentIndex(contentIndex);
                            setEditingField("image");
                          }}
                        >
                          <FiEdit className="text-xl" />
                        </button>

                        <button
                          className="flex items-center space-x-1"
                          onClick={() => handleDeleteContent(contentIndex)}
                        >
                          <MdDeleteOutline className="text-2xl" />
                        </button>

                        <button
                          className="flex items-center space-x-1"
                          onClick={() => handleMoveContentUp(contentIndex)}
                          disabled={contentIndex === 0} // Disable if it's the first item
                        >
                          <FaArrowUp className="text-lg" />
                        </button>

                        <button
                          className="flex items-center space-x-1"
                          onClick={() =>
                            handleMoveContentDown(sectionIndex, contentIndex)
                          }
                          disabled={contentIndex === section.content.length - 1} // Disable if it's the last item
                        >
                          <FaArrowDown className="text-lg" />
                        </button>
                      </div>
                    </>
                  )}
              </div>
              </div>
                    )}
              </Draggable>
            ))}
              </div>
          )}
          </Droppable>
        </DragDropContext>
          </div>
        </>
      ) : (
        <>
          <div onClick={toggleDisplay} className="cursor-pointer equations m-3 rounded-lg p-4 flex flex-col border-2 border-[#d4d4d4]">
            <div className="flex flex-row justify-between">
              <label htmlFor="">Arrange added content:</label>
              <FaAngleDown  className="cursor-pointer" />
            </div>
            <hr className="mt-2 mb-2 w-full bg-[#d4d4d4] h-[1px]" />
          </div>
        </>
      )}
    </>
  );
};

export default ContentDisplay;
