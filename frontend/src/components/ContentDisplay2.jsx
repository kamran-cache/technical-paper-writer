import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSectionContent,
  deleteSectionContent,
  reorderSectionContent,
} from "../Redux/sectionsSlice";
import { PiDotsSixVertical } from "react-icons/pi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./Section.css";
import "./index.css";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

const ContentDisplay2 = ({ sectionIndex }) => {
  const dispatch = useDispatch();
  const [editContentIndex, setEditContentIndex] = useState(null);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const section = useSelector((state) => state.sections.sections[sectionIndex]);

  const toggleDisplay = () => setIsDisplayOpen((prev) => !prev);

  const handleDrag = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (
      source.droppableId === destination.droppableId &&
      sourceIndex === destinationIndex
    )
      return;

    try {
      dispatch(
        reorderSectionContent({
          sectionIndex,
          sourceIndex,
          destinationIndex,
        })
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleSaveContent = (contentIndex) => {
    const field = editingField === "text" ? "text" : editingField === "equations" ? "equations" : "title";
    const value = section.content[contentIndex][field];

    dispatch(
      updateSectionContent({
        sectionIndex,
        contentIndex,
        field,
        value,
      })
    );
    setEditContentIndex(null);
  };

  const handleDeleteContent = (contentIndex) => {
    dispatch(deleteSectionContent({ sectionIndex, contentIndex }));
  };

  const renderEditButton = (contentIndex, field) => (
    <button
      className="space-x-1 w-8 h-8 flex flex-row justify-center items-center rounded-full text-blue-700 bg-blue-100"
      onClick={() => {
        setEditContentIndex(contentIndex);
        setEditingField(field);
      }}
    >
      <MdEdit className="text-xl" />
    </button>
  );

  const renderDeleteButton = (contentIndex) => (
    <button
      className="space-x-1 w-8 h-8 flex flex-row justify-center items-center rounded-full bg-blue-100"
      onClick={() => handleDeleteContent(contentIndex)}
    >
      <img src="/Dustbin.svg" alt="dustbin"></img>
    </button>
  );

  return (
    <div className="m-3 p-4 rounded-lg flex flex-col border-2 border-[#d4d4d4]">
      <div className=" w-[100%] flex flex-row justify-between">
        <label>Arrange added content:</label>
        <FaAngleDown onClick={toggleDisplay} className={isDisplayOpen ? "rotate-180 cursor-pointer" : "cursor-pointer"} />
      </div>
      <hr className="mt-2 mb-2 w-full bg-[#d4d4d4] h-[1px]" />

      {isDisplayOpen && (
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-[100%]"
              >
                {section.content.map((contentItem, contentIndex) => (
                  <Draggable
                    draggableId={`${contentIndex}`} 
                    key={contentIndex} 
                    index={contentIndex}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="bg-white h-auto border-2 border-[#d4d4d4] text-black shadow-md mb-2 py-4 px-2 rounded-lg flex items-start cursor-grab"
                      >
                        <PiDotsSixVertical className="text-black text-xl mr-2" />
                        <div className="mt-2 w-[50%] h-auto p-2 border rounded-lg">
                          {editContentIndex === contentIndex ? (
                            <>
                              {editingField === "image" ? (
                                <>
                                  <input
                                    type="text"
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
                                    className="block shadow-neutral-400 w-100% mt-1 p-2 white focus:shadow-md text-black font-normal text-[14px] rounded-lg"
                                    placeholder="Edit image title..."
                                  />
                                  <button
                                    className="mt-2 p-2 shadow-neutral-400 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() => handleSaveContent(contentIndex)}
                                  >
                                    Save
                                  </button>
                                </>
                              ) : (
                                <>
                                  <textarea
                                    value={editingField === "equations" ? contentItem.equations : contentItem.text}
                                    onChange={(e) =>
                                      dispatch(
                                        updateSectionContent({
                                          sectionIndex,
                                          contentIndex,
                                          field: editingField === "equations" ? "equations" : "text",
                                          value: e.target.value,
                                        })
                                      )
                                    }
                                    className="block shadow-neutral-400 w-100% mt-1 p-2 white focus:shadow-md text-black font-normal text-[14px] rounded-lg"
                                    placeholder={editingField === "equations" ? "Add equations here..." : "Edit text..."}
                                  />
                                  <button
                                    className="mt-2 p-2 shadow-neutral-400 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() => handleSaveContent(contentIndex)}
                                  >
                                    Save
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {contentItem.text && (
                                <div>
                                  <p>{contentItem.text}</p>
                                  <div className="mt-12 flex space-x-2">
                                    {renderEditButton(contentIndex, "text")}
                                    {renderDeleteButton(contentIndex)}
                                  </div>
                                </div>
                              )}
                              {contentItem.equations && (
                                <div className="mt-12 p-2 border rounded-lg bg-gray-100">
                                  <p className="font-semibold">Equations:</p>
                                  <p>{contentItem.equations}</p>
                                  <div className="mt-2 flex space-x-2">
                                    {renderEditButton(contentIndex, "equations")}
                                    {renderDeleteButton(contentIndex)}
                                  </div>
                                </div>
                              )}
                              {contentItem.url && (
                                <div>
                                  <p>{contentItem.title}</p>
                                  <img src={contentItem.url} alt={contentItem.title} className="w-full h-auto mt-2" />
                                  <div className="mt-12 flex space-x-2">
                                    {renderEditButton(contentIndex, "image")}
                                    {renderDeleteButton(contentIndex)}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default ContentDisplay2;
