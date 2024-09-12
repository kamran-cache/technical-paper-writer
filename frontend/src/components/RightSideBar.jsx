import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addSection,
  displaySection,
  reorderSection,
} from "../Redux/sectionsSlice";
import store from "../Redux/store";

const RightSideBar = () => {
  const dispatch = useDispatch();
  const section = useSelector((state) => state.sections.sections);
  const handleAddSection = () => {
    dispatch(addSection());
    console.log("section added", store.getState());
  };
  const handleDrag = (results) => {
    const { source, destination } = results;
    console.log(results, "results", 123445);

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
  return (
    <div>
      <div className="hidden bg-white border-t-2 ml-2 h-[calc(100vh-48px)] shadow-2xl md:w-[200px] xl:flex flex-col items-start p-4 overflow-hidden">
        <h2 className="text-lg mb-4">Align your paper content</h2>
        <div className="h-[2px] w-full bg-black mb-4"></div>

        <ul className="w-full overflow-y-auto">
          <li className="bg-white text-sm border-2 border-gray-300 shadow-md mb-2 p-2 rounded-lg">
            Add PDFs
          </li>
          <li className="bg-white text-sm border-2 border-gray-300 shadow-md mb-2 p-2 rounded-lg">
            Title and Authors
          </li>
          <li className="bg-white text-sm border-2 border-gray-300 shadow-md mb-2 p-2 rounded-lg">
            Abstract and Keywords
          </li>

          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId="ROOT" type="group">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full "
                >
                  {section.map((section, index) => (
                    <Draggable
                      draggableId={section._id}
                      key={section._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className=" bg-white  shadow-md mb-2 p-2 rounded-lg flex items-center cursor-grab"
                        >
                          <div>
                            <FaBars className="text-gray-600 mr-2" />
                          </div>
                          <div className="text-sm">{section.title}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <li className="mt-4">
            <button
              onClick={handleAddSection}
              className="w-full bg-blue-500 text-white p-2 rounded-lg shadow-md"
            >
              Add Section
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightSideBar;
