// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { addPdf, deletePdf } from "../Redux/pdfSlice";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { MdDeleteOutline } from "react-icons/md";

// const AddPdf = () => {
//   const dispatch = useDispatch();
//   const [pdfFile, setPdfFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const { id } = useParams();
//   const pdfs = useSelector((state) => state.pdf.pdfs);

//   const handleAddPdf = async () => {
//     if (pdfFile) {
//       setUploading(true);
//       try {
//         const token = window.localStorage.getItem("token");

//         // Prepare FormData for sending file
//         const formData = new FormData();
//         formData.append("pdf", pdfFile);

//         // Upload PDF to the backend
//         const response = await axios.post(
//           `http://localhost:5000/api/v1/pdf/add-pdf/${id}`,
//           formData,
//           {
//             headers: {
//               token: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         console.log("PDF uploaded");
//         dispatch(addPdf(response.data.pdfLink));
//         window.location.reload();
//       } catch (error) {
//         console.error("Error uploading PDF:", error);
//       } finally {
//         setUploading(false);
//         setPdfFile(null); // Clear the file input after successful upload
//       }
//     }
//   };

//   const handleDelete = async (index) => {
//     const token = window.localStorage.getItem("token");
//     const pdfId = pdfs[index]._id;
//     console.log(pdfId, "pdfId");

//     try {
//       await axios.delete(`http://localhost:5000/api/v1/pdf/${id}/${pdfId}`, {
//         headers: { token: `Bearer ${token}` },
//       });

//       console.log("PDF deleted");
//       dispatch(deletePdf(index));
//     } catch (error) {
//       console.error("Error deleting PDF:", error);
//     }
//   };

//   return (
//     <form
//       onSubmit={(e) => e.preventDefault()}
//       className="h-full w-full overflow-y-auto flex flex-col items-center rounded-lg justify-center space-y-6 p-4"
//     >
//       {/* Label for Add Referral Papers */}
//       <label
//         htmlFor="pdf-upload"
//         className="text-lg font-medium p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//       >
//         Add Referral Papers
//       </label>

//       {/* File Input */}
//       <input
//         id="pdf-upload"
//         type="file"
//         accept="application/pdf"
//         onChange={(e) => setPdfFile(e.target.files[0])}
//         className="p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
//       />

//       {/* Add PDF Button */}
//       <button
//         onClick={handleAddPdf}
//         disabled={!pdfFile || uploading}
//         className={`border-2 border-gray-300 rounded-lg h-12 w-28
//       ${
//         !pdfFile || uploading
//           ? "bg-gray-200 text-gray-500"
//           : "hover:bg-black hover:text-white"
//       }
//       transition duration-200 ease-in-out`}
//       >
//         {uploading ? "Uploading..." : "Add PDF"}
//       </button>

//       {/* List of Uploaded PDFs */}
//       <div className="flex flex-col w-full space-y-4">
//         {pdfs &&
//           pdfs.map((pdf, index) => {
//             console.log("pdf.link", pdf.link); // Inspect the pdf.link value
//             const pdfName =
//               typeof pdf.link === "string"
//                 ? pdf.link.substring(pdf.link.lastIndexOf("-") + 1)
//                 : `PDF ${index + 1}`;

//             return (
//               <div
//                 key={pdf._id || index}
//                 className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
//               >
//                 <span className="truncate">{pdfName}</span>
//                 <button
//                   onClick={() => handleDelete(index)}
//                   className="text-white"
//                 >
//                   <MdDeleteOutline className="text-2xl text-neutral-700 rounded-lg hover:text-neutral-950 transition duration-200" />
//                 </button>
//               </div>
//             );
//           })}
//       </div>
//     </form>
//   );
// };

// export default AddPdf;

// demo2
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPdf, deletePdf } from "../Redux/pdfSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

const AddPdf = () => {
  const dispatch = useDispatch();
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { id } = useParams();
  const pdfs = useSelector((state) => state.pdf.pdfs);
  const [pdfNames, setPdfNames] = useState([]);

  useEffect(() => {
    // Extract PDF names and ids whenever pdfs array changes
    console.log(pdfs, "pdfs");
    console.log(pdfNames, "pdfName");
    // const extractedData = pdfs.map((pdf, index) => {
    //   let name = "";
    //   let id = pdf._id || `PDF ${index + 1}`; // Use _id if available, fallback to 'PDF {index}'

    //   // Check if pdf is an object with a `link` property
    //   if (typeof pdf === "object" && pdf.link) {
    //     name = pdf.link.substring(pdf.link.lastIndexOf("-") + 1);
    //   }
    //   // Handle case where pdf is a string (the link itself)
    //   else if (typeof pdf === "string") {
    //     name = pdf.substring(pdf.lastIndexOf("-") + 1);
    //   }

    //   return { name, id }; // Return an object containing both name and id
    // });

    // setPdfNames(extractedData); // Set the state with the array of objects
    // console.log("Extracted PDF Data:", extractedData);
  }, [pdfs]); // Trigger this effect whenever pdfs state changes

  const handleAddPdf = async () => {
    if (pdfFile) {
      setUploading(true);
      try {
        const token = window.localStorage.getItem("token");

        // Prepare FormData for sending file
        const formData = new FormData();
        formData.append("pdf", pdfFile);

        // Upload PDF to the backend
        const response = await axios.post(
          `http://localhost:5000/api/v1/pdf/add-pdf/${id}`,
          formData,
          {
            headers: {
              token: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("PDF uploaded");
        console.log(response.data, 1234);
        const { pdfLink, id: pdfId } = response.data;

        // Dispatch both pdfLink and id to Redux
        dispatch(addPdf({ link: pdfLink, _id: pdfId })); // This will trigger the pdfNames update via useEffect
      } catch (error) {
        console.error("Error uploading PDF:", error);
      } finally {
        setUploading(false);
        setPdfFile(null); // Clear the file input after successful upload
      }
    }
  };

  const handleDelete = async (index) => {
    const token = window.localStorage.getItem("token");
    const pdfId = pdfs[index]._id;

    console.log(pdfId, "pdfId");

    try {
      await axios.delete(`http://localhost:5000/api/v1/pdf/${id}/${pdfId}`, {
        headers: { token: `Bearer ${token}` },
      });

      console.log("PDF deleted");
      dispatch(deletePdf(index));
    } catch (error) {
      console.error("Error deleting PDF:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="h-full w-full overflow-y-auto flex flex-col items-center rounded-lg justify-center space-y-6 p-4"
    >
      {/* Label for Add Referral Papers */}
      <label
        htmlFor="pdf-upload"
        className="text-lg font-medium p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
      >
        Add Referral Papers
      </label>

      {/* File Input */}
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files[0])}
        className="p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg"
      />

      {/* Add PDF Button */}
      <button
        onClick={handleAddPdf}
        disabled={!pdfFile || uploading}
        className={`border-2 border-gray-300 rounded-lg h-12 w-28
      ${
        !pdfFile || uploading
          ? "bg-gray-200 text-gray-500"
          : "hover:bg-black hover:text-white"
      }
      transition duration-200 ease-in-out`}
      >
        {uploading ? "Uploading..." : "Add PDF"}
      </button>

      {/* List of Uploaded PDFs */}
      <div className="flex flex-col w-full space-y-4">
        {pdfs &&
          pdfs.map((pdf, index) => {
            console.log("pdf.link", pdf.link); // Inspect the pdf.link value
            const pdfName =
              typeof pdf.link === "string"
                ? pdf.link.substring(pdf.link.lastIndexOf("-") + 1)
                : `PDF ${index + 1}`;

            return (
              <div
                key={pdf._id || index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
              >
                <span className="truncate">{pdfName}</span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-white"
                >
                  <MdDeleteOutline className="text-2xl text-neutral-700 rounded-lg hover:text-neutral-950 transition duration-200" />
                </button>
              </div>
            );
          })}
      </div>
    </form>
  );
};

export default AddPdf;
