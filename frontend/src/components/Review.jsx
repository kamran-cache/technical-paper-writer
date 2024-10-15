import React, { useState } from "react";
import { LuCircleDashed } from "react-icons/lu";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { ImBin2 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { SiTicktick } from "react-icons/si";

import {
  reorderSection,
  reorderSectionContent,
  addSection,
  deleteSection,
} from "../Redux/sectionsSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PiDotsSixVertical } from "react-icons/pi";

const Review = () => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.sections.sections);
  console.log(sections, "secttions");

  
  const handleDrag = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (
      source.droppableId === destination.droppableId &&
      sourceIndex === destinationIndex
    )
      return; // Exit if the item is dropped in the same place

    try {
      dispatch(
        reorderSection({
          sourceIndex,
          destinationIndex,
        })
      );
      // console.log("Order updated", store.getState());
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleAddSection = () => {
    if (isInputVisible) {
      if (newSectionTitle.trim()) {
        dispatch(addSection({ title: newSectionTitle }));
        setNewSectionTitle("");
      }
      setIsInputVisible(false);
    } else {
      setIsInputVisible(true);
    }
  };

  const handleDelete = (index) => {
    console.log(index, "index");
    if (index !== undefined) {
      dispatch(deleteSection({ index: index }));
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="title w-full h-12 flex items-center justify-start px-4 bg-gradient-to-r from-[#9253FF] to-[#32A8FF] rounded-t-lg">
        <LuCircleDashed className="mx-2 text-white" />
        <h1 className="text-white">Review</h1>
      </div>
      <div className="form alignments p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-lg text-white">Align your content</h1>
          <button className="text-white">
            <FaXmark />
          </button>
        </div>

        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full"
              >
                {sections.map((section, index) => (
                  <Draggable
                    draggableId={`${index}`} // Use index as the unique draggableId
                    key={index}               // Use index as the unique key
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="bg-white h-[3.5rem] border-2 border-[#9253ff]  text-black shadow-md mb-2 p-2 rounded-lg flex items-center cursor-grab"
                      >
                        <PiDotsSixVertical className="text-black text-xl mr-2" />
                        <div className="text-l flex flex-row justify-center items-center gap-2"> <img src="/tick.svg"></img> {section.title}</div>
                        <div  className="text-m h-[2rem] w-[2rem] rounded-full bg-blue-100 cursor-pointer ml-auto flex flex-row justify-center items-center hover:bg-red-100 text-blue-400 hover:text-red-400"
                          onClick={() => handleDelete(index)}>
                          {/* <img src="/Dustbin.svg" alt="delete"></img> */}
                          <ImBin2/>
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

        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          {isInputVisible && (
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Enter section title"
              className=" w-full p-2 rounded-lg border bg-white text-black"
            />
          )}
          <button
            onClick={handleAddSection}
            className="flex flex-row items-center justify-center  mt-3  text-blue-500 bg-[#f4f5f4] border-2 border-blue-500 p-3 rounded-lg"
          >
            {!isInputVisible && <FaPlus className="mx-2" />}
            {isInputVisible ? "Submit Section" : "Add Section"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
