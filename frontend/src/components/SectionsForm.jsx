// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setSection,
//   addSectionContent,
//   updateSectionContent,
//   deleteSectionContent,
//   addNextSection,
//   moveContentDown,
//   moveContentUp,
// } from "../Redux/sectionsSlice";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// import app from "../firebase";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import store from "../Redux/store";
// import { FiEdit } from "react-icons/fi";
// import { MdDeleteOutline } from "react-icons/md";
// import { FaArrowUp } from "react-icons/fa6";
// import { FaArrowDown } from "react-icons/fa6";

// const SectionsForm = ({ sectionIndex }) => {
//   const dispatch = useDispatch();
//   const [newContentText, setNewContentText] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imageTitle, setImageTitle] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [editContentIndex, setEditContentIndex] = useState(null); // For editing content
//   const [isChecked, setIsChecked] = useState(false);
//   const { id } = useParams();
//   const titleofPaper = store.getState().titleAndAuthors.title;
//   const token = window.localStorage.getItem("token");

//   const section = useSelector((state) => state.sections.sections[sectionIndex]);
//   console.log(section, "section");
//   const handleSectionChange = (field, value) => {
//     dispatch(setSection({ index: sectionIndex, field, value }));
//   };

//   const handleAddTextContent = () => {
//     if (newContentText.trim()) {
//       dispatch(
//         addSectionContent({
//           index: sectionIndex,
//           content: { text: newContentText, url: "", title: "" },
//         })
//       );
//       setNewContentText("");
//     }
//   };

//   const handleAddImageContent = async () => {
//     if (imageFile && imageTitle.trim()) {
//       setUploading(true);
//       try {
//         const storage = getStorage(app);
//         const storageRef = ref(storage, `images/${imageFile.name}`);
//         await uploadBytes(storageRef, imageFile);
//         const downloadURL = await getDownloadURL(storageRef);

//         dispatch(
//           addSectionContent({
//             index: sectionIndex,
//             content: { text: "", url: downloadURL, title: imageTitle },
//           })
//         );

//         setImageFile(null);
//         setImageTitle("");
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       } finally {
//         setUploading(false);
//       }
//     }
//   };

//   const handleEditContent = (contentIndex) => {
//     setEditContentIndex(contentIndex);
//   };

//   const handleSaveContent = (contentIndex) => {
//     const updatedContent = section.content[contentIndex];
//     dispatch(
//       updateSectionContent({
//         sectionIndex,
//         contentIndex,
//         field: "text",
//         value: updatedContent.text,
//       })
//     );
//     setEditContentIndex(null);
//   };

//   const handleDeleteContent = (contentIndex) => {
//     dispatch(deleteSectionContent({ sectionIndex, contentIndex }));
//   };

//   const handleAddNextSection = (sectionIndex) => {
//     dispatch(addNextSection({ sectionIndex: sectionIndex }));
//   };

//   const handleAI = async () => {
//     try {
//       const formData = {
//         titleOfPaper: titleofPaper,
//         content: newContentText,
//         field: section.title.toUpperCase(),
//         isChecked: isChecked,
//       };
//       console.log(formData, "data");
//       const response = await axios.post(
//         `http://localhost:5000/api/v1/openai/${id}`,
//         formData,
//         {
//           headers: {
//             token: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(response, "response");
//       const cleanedText = response.data.replace(/#/g, "");
//       setNewContentText(cleanedText);
//       // dispatch(setAbstract(response.data));
//     } catch (error) {
//       console.log("error occured", error);
//     }
//   };

//   const handleMoveContentUp = (sectionIndex, contentIndex) => {
//     dispatch(moveContentUp({ sectionIndex, contentIndex }));
//   };

//   const handleMoveContentDown = (sectionIndex, contentIndex) => {
//     dispatch(moveContentDown({ sectionIndex, contentIndex }));
//   };
//   return (
//     <>
//       <div className="section-item mt-4 mb-4 p-4 rounded-lg h-full w-full overflow-y-auto">
//         <div className="flex items-end justify-end w-full ">
//           {/* <button onClick={handleAddNextSection(sectionIndex + 1)}>
//             Add New Section
//           </button> */}
//         </div>

//         {/* Title Section */}
//         <label className="block mb-2">
//           Title:
//           <input
//             type="text"
//             value={section.title}
//             onChange={(e) => handleSectionChange("title", e.target.value)}
//             className="block w-full shadow-neutral-400 mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//             placeholder="Section title"
//           />
//         </label>

//         {/* Text Content Section */}
//         <div className="flex flex-col items-center mt-4">
//           <textarea
//             value={newContentText}
//             onChange={(e) => setNewContentText(e.target.value)}
//             placeholder="Write or enhance your content with the help of AI.."
//             className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//           />
//           <div className="flex items-center mt-2">
//             <input
//               type="checkbox"
//               id="refer-checkbox"
//               name="abstract"
//               value="ABSTRACT"
//               checked={isChecked}
//               onChange={() => setIsChecked(!isChecked)}
//             />
//             <label htmlFor="refer-checkbox" className="text-sm ml-2">
//               Refer to the {section.title} from the paper uploaded.
//             </label>
//           </div>

//           <div className="mt-3 flex space-x-2">
//             <button
//               className="p-2 bg-[#00072d] text-white rounded-lg "
//               onClick={handleAddTextContent}
//             >
//               Add Text Content
//             </button>
//             <button
//               className="p-2 shadow-neutral-400 bg-gradient-to-r from-sky-500  to-fuchsia-600 via-violet-500 text-white rounded-lg hover:bg-blue-600"
//               onClick={handleAI}
//             >
//               Write with AI
//             </button>
//           </div>
//         </div>

//         {/* Image Upload Section */}
//         <div className="mt-4">
//           <label className="block mb-2">Add Image:</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setImageFile(e.target.files[0])}
//             className="block w-full shadow-neutral-400 mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//           />
//           <input
//             type="text"
//             value={imageTitle}
//             onChange={(e) => setImageTitle(e.target.value)}
//             placeholder="Image title"
//             className="block shadow-neutral-400 w-full mt-2 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//           />
//           <button
//             className={`mt-2 p-2 text-white rounded-lg ${
//               !imageFile || !imageTitle.trim() || uploading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600"
//             }`}
//             onClick={handleAddImageContent}
//             disabled={!imageFile || !imageTitle.trim() || uploading}
//           >
//             {uploading ? "Uploading..." : "Add Image"}
//           </button>
//         </div>

//         {/* Existing Content Section */}
//         <div className="mt-4">
//           <h3 className="text-lg  font-semibold">Existing Content:</h3>
//           {section.content.map((contentItem, contentIndex) => (
//             <div key={contentIndex} className="mt-2 p-2 border rounded-lg">
//               {editContentIndex === contentIndex ? (
//                 <>
//                   <textarea
//                     value={contentItem.text}
//                     onChange={(e) =>
//                       dispatch(
//                         updateSectionContent({
//                           sectionIndex,
//                           contentIndex,
//                           field: "text",
//                           value: e.target.value,
//                         })
//                       )
//                     }
//                     className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//                   />
//                   <button
//                     className="mt-2 p-2 shadow-neutral-400 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                     onClick={() => handleSaveContent(contentIndex)}
//                   >
//                     Save
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   {contentItem.text && <p>{contentItem.text}</p>}
//                   {contentItem.url && (
//                     <div>
//                       <p>{contentItem.title}</p>
//                       <img
//                         src={contentItem.url}
//                         alt={contentItem.title}
//                         className="w-full h-auto mt-2"
//                       />
//                     </div>
//                   )}
//                   <div className="mt-2 flex space-x-2">
//                     <button
//                       className="flex items-center space-x-1 "
//                       onClick={() => handleEditContent(contentIndex)}
//                     >
//                       {/* <span>Edit</span> */}
//                       <FiEdit className="text-xl" />
//                     </button>
//                     <button
//                       className="flex items-center space-x-1 "
//                       onClick={() => handleDeleteContent(contentIndex)}
//                     >
//                       {/* <span>Delete</span> */}
//                       <MdDeleteOutline className="text-2xl" />
//                     </button>
//                     <button
//                       className="flex items-center space-x-1"
//                       onClick={() =>
//                         handleMoveContentUp(sectionIndex, contentIndex)
//                       }
//                       disabled={contentIndex === 0} // Disable if it's already the first item
//                     >
//                       <FaArrowUp className="text-lg" />
//                     </button>
//                     <button
//                       className="flex items-center space-x-1"
//                       onClick={() =>
//                         handleMoveContentDown(sectionIndex, contentIndex)
//                       }
//                       disabled={contentIndex === contentItem.length - 1} // Disable if it's already the last item
//                     >
//                       <FaArrowDown className="text-lg" />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SectionsForm;

// demp2
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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../firebase";
import { useParams } from "react-router-dom";
import axios from "axios";
import store from "../Redux/store";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

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

  const section = useSelector((state) => state.sections.sections[sectionIndex]);

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
            equations: newContentEquation, // Handle equations
          },
        })
      );
      setNewContentText("");
      setNewContentEquation(""); // Reset equations input
    }
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
    dispatch(
      updateSectionContent({
        sectionIndex,
        contentIndex,
        field: "text",
        value: updatedContent.text,
      })
    );
    dispatch(
      updateSectionContent({
        sectionIndex,
        contentIndex,
        field: "equations",
        value: updatedContent.equations, // Save updated equations
      })
    );
    setEditContentIndex(null);
  };

  const handleDeleteContent = (contentIndex) => {
    dispatch(deleteSectionContent({ sectionIndex, contentIndex }));
  };

  const handleAddNextSection = (sectionIndex) => {
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
        `http://localhost:5000/api/v1/openai/${id}`,
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
    dispatch(moveContentDown({ sectionIndex, contentIndex }));
  };

  return (
    <>
      <div className="section-item mt-4 mb-4 p-4 rounded-lg h-full w-full overflow-y-auto">
        <div className="flex items-end justify-end w-full"></div>

        {/* Title Section */}
        <label className="block mb-2">
          Title:
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleSectionChange("title", e.target.value)}
            className="block w-full shadow-neutral-400 mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
            placeholder="Section title"
          />
        </label>

        {/* Text and Equation Content Section */}
        <div className="flex flex-col items-center mt-4">
          <textarea
            value={newContentText}
            onChange={(e) => setNewContentText(e.target.value)}
            placeholder="Write or enhance your content with the help of AI.."
            className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
          />
          <textarea
            value={newContentEquation}
            onChange={(e) => setNewContentEquation(e.target.value)}
            placeholder="Add equations here..."
            className="block shadow-neutral-400 w-full mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
          />
          <div className="flex items-center mt-2">
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

          <div className="mt-3 flex space-x-2">
            <button
              className="p-2 bg-[#00072d] text-white rounded-lg"
              onClick={handleAddTextContent}
            >
              Add Text Content
            </button>
            <button
              className="p-2 shadow-neutral-400 bg-gradient-to-r from-sky-500 to-fuchsia-600 via-violet-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleAI}
            >
              Write with AI
            </button>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mt-4">
          <label className="block mb-2">Add Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="block w-full shadow-neutral-400 mt-1 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
          />
          <input
            type="text"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
            placeholder="Image title"
            className="block shadow-neutral-400 w-full mt-2 p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
          />
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

        {/* Existing Content Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Existing Content:</h3>
          {section.content.map((contentItem, contentIndex) => (
            <div key={contentIndex} className="mt-2 p-2 border rounded-lg">
              {editContentIndex === contentIndex ? (
                <>
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
              ) : (
                <>
                  {contentItem.text && <p>{contentItem.text}</p>}
                  {contentItem.equations && (
                    <div className="mt-2 p-2 border rounded-lg bg-gray-100">
                      <p className="font-semibold">Equations:</p>
                      <p>{contentItem.equations}</p>
                    </div>
                  )}
                  {contentItem.url && (
                    <div>
                      <p>{contentItem.title}</p>
                      <img
                        src={contentItem.url}
                        alt={contentItem.title}
                        className="w-full h-auto mt-2"
                      />
                    </div>
                  )}
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="flex items-center space-x-1 "
                      onClick={() => handleEditContent(contentIndex)}
                    >
                      <FiEdit className="text-xl" />
                    </button>
                    <button
                      className="flex items-center space-x-1 "
                      onClick={() => handleDeleteContent(contentIndex)}
                    >
                      <MdDeleteOutline className="text-2xl" />
                    </button>
                    <button
                      className="flex items-center space-x-1"
                      onClick={() =>
                        handleMoveContentUp(sectionIndex, contentIndex)
                      }
                      disabled={contentIndex === 0} // Disable if it's already the first item
                    >
                      <FaArrowUp className="text-lg" />
                    </button>
                    <button
                      className="flex items-center space-x-1"
                      onClick={() =>
                        handleMoveContentDown(sectionIndex, contentIndex)
                      }
                      disabled={contentIndex === section.content.length - 1} // Disable if it's already the last item
                    >
                      <FaArrowDown className="text-lg" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionsForm;
