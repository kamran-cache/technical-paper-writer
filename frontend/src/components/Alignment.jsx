import React, { useState } from "react";
import { easeInOut, motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  reorderSection,
  addSection,
  deleteSection,
} from "../Redux/sectionsSlice"; // Assuming you have a reorder action
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaBars } from "react-icons/fa";
import store from "../Redux/store";
import { MdDeleteOutline } from "react-icons/md";

const variants = {
  close: {
    x: -300,
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 1,
  },
};

const Alignment = ({ isOpen, isAligned, setIsAligned }) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const dispatch = useDispatch();
  const section = useSelector((state) => state.sections.sections);

  const handleAligned = () => {
    if (typeof setIsAligned === "function") {
      setIsAligned(false);
    }
  };

  const handleDrag = (results) => {
    const { source, destination } = results;
    console.log(results, "results", 123445);
    console.log(section, "section");

    if (!destination) return; // Exit if dropped outside

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
        setNewSectionTitle(""); // Clear input field after adding
      }
      setIsInputVisible(false); // Hide input field after adding
    } else {
      setIsInputVisible(true); // Show input field when "Add Section" is clicked
    }
  };

  const handleDelete = (index) => {
    if (index !== undefined) {
      dispatch(deleteSection({ index: index }));
    }
  };

  return (
    <>
      <AnimatePresence>
        {isAligned && (
          <motion.nav
            variants={variants}
            initial="close"
            animate="open"
            exit="close"
            transition={{ duration: 0.5, ease: easeInOut }}
            className={`z-10 h-full  flex flex-col gap-8 w-64 absolute bg-[#00072d] ml-0 overflow-y-auto  ${
              isOpen ? "left-40" : "left-[63px]"
            } border-r border-neutral-800 p-5`}
          >
            <div className="flex flex-row w-full justify-between place-items-center">
              <h1 className="tracking-wide text-neutral-100 text-lg"></h1>
              <button
                onClick={handleAligned}
                className="transition-transform duration-500"
              >
                <FaXmark className="text-white" />
              </button>
            </div>
            <div className="text-white">Align your content</div>

            <DragDropContext onDragEnd={handleDrag} className="">
              <Droppable droppableId="ROOT" type="group">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-full "
                  >
                    {section.map((section, index) => (
                      <Draggable
                        draggableId={section.title}
                        key={section._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className=" bg-neutral-700/50 text-neutral-400 hover:text-white shadow-md mb-2 p-2 rounded-lg flex items-center   cursor-grab"
                          >
                            <div>
                              <FaBars className="text-gray-600 mr-2" />
                            </div>
                            <div className="text-sm ">{section.title}</div>
                            <div className=" ml-auto ">
                              <MdDeleteOutline
                                className="text-xl cursor-pointer "
                                onClick={() => handleDelete(index)}
                              />
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

            <div className="flex flex-col gap-2">
              {isInputVisible && (
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Enter section title"
                  className="p-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white"
                />
              )}
              <button
                onClick={handleAddSection}
                className="w-full bg-blue-500 text-white p-2 rounded-lg shadow-md"
              >
                {isInputVisible ? "Submit Section" : "Add Section"}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Alignment;
