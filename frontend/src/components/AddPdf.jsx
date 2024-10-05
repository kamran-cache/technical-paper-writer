import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPdf, deletePdf } from "../Redux/pdfSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { LuCircleDashed } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { CiCircleCheck } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { ImBin2 } from "react-icons/im";

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
          `http://54.84.234.156/api/v1/pdf/add-pdf/${id}`,
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
      await axios.delete(`http://54.84.234.156/api/v1/pdf/${id}/${pdfId}`, {
        headers: { token: `Bearer ${token}` },
      });

      console.log("PDF deleted");
      dispatch(deletePdf(index));
    } catch (error) {
      console.error("Error deleting PDF:", error);
    }
  };

  return (
    // <>
    //   <div className="flex flex-col h-full w-full items-center ">
    //     <div className="title w-full h-12 flex items-center justify-start px-4 bg-gradient-to-r from-[#9253FF] to-[#32A8FF] rounded-t-lg">
    //       <LuCircleDashed className="mx-2 text-white" />

    //       <h1 className="text-white">Referral Paper</h1>
    //     </div>
    //     <div className="flex flex-col items-center justify-center p-4 mt-4 h-full w-[90%] max-h-[400px]  border-2 border-[#d4d4d4] overflow-y-auto  rounded-lg">
    //       <form onSubmit={(e) => e.preventDefault()}>
    //         <div className="flex flex-col -ml-20 items-start ">
    //           <h1 className="text-lg ">Add Referral Papers</h1>
    //           <hr className=" mt-1 mb-3 w-full  bg-[#d4d4d4] h-[1px]" />
    //         </div>
    //         <div className="flex flex-col items-center justify-center">
    //           {/* File Input */}
    //           {/* <input
    //             id="pdf-upload"
    //             type="file"
    //             accept="application/pdf"
    //             onChange={(e) => setPdfFile(e.target.files[0])}
    //             className="p-2 bg-gray-200/40 focus:outline-none shadow-md rounded-lg my-4"
    //           /> */}
    //           <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-10 mb-5 rounded-lg">
    //             <FiUpload className="text-4xl text-blue-500 mb-2" />
    //             <p className="text-gray-500">
    //               Drag and drop, or browse your files
    //             </p>
    //             <p className="text-gray-400"> PDF. Max 100mb</p>

    //             {/* File Input */}
    //             <input
    //               type="file"
    //               accept=".pdf"
    //               onChange={(e) => setPdfFile(e.target.files[0])}
    //               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
    //             />
    //           </div>

    //           {/* Add PDF Button */}
    //           <button
    //             onClick={handleAddPdf}
    //             disabled={!pdfFile || uploading}
    //             className={`border-2 border-gray-300 rounded-lg h-12 w-28
    //   ${
    //     !pdfFile || uploading
    //       ? "bg-gray-200 text-gray-500"
    //       : "hover:bg-black hover:text-white"
    //   }
    //   transition duration-200 ease-in-out`}
    //           >
    //             {uploading ? "Uploading..." : "Add PDF"}
    //           </button>
    //         </div>

    //         {/* List of Uploaded PDFs */}
    //         <div className="flex flex-col w-full mt-4 space-y-4">
    //           {pdfs &&
    //             pdfs.map((pdf, index) => {
    //               console.log("pdf.link", pdf.link); // Inspect the pdf.link value
    //               const pdfName =
    //                 typeof pdf.link === "string"
    //                   ? pdf.link.substring(pdf.link.lastIndexOf("-") + 1)
    //                   : `PDF ${index + 1}`;

    //               return (
    //                 <div
    //                   key={pdf._id || index}
    //                   className="flex justify-between items-center p-2 border-2 border-[#d4d4d4] rounded-lg"
    //                 >
    //                   <span className="truncate flex flex-row ">
    //                     <CiCircleCheck className="text-xl text-green-700 mx-2 mt-[2px]" />
    //                     {pdfName ? pdfName : "PDF"}
    //                   </span>
    //                   <button
    //                     onClick={() => handleDelete(index)}
    //                     className="text-white"
    //                   >
    //                     <MdDeleteOutline className="text-2xl text-neutral-700 rounded-lg hover:text-neutral-950 transition duration-200" />
    //                   </button>
    //                 </div>
    //               );
    //             })}
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </>

    <>
      <div className="flex flex-col h-full w-full items-center">
        <div className="title w-full h-[58px] flex items-center justify-start px-4 bg-gradient-to-r from-[#9253FF] to-[#32A8FF] rounded-t-lg">
          <LuCircleDashed className="mx-2 text-white" />
          <h1 className="text-white text-[18px] font-medium ">Referral Paper</h1>
        </div>

        <div className="flex flex-col items-center justify-center p-4 mt-4 h-full w-[90%] max-h-[400px] border-2 border-[#d4d4d4] overflow-y-auto rounded-lg relative">
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <div className="flex flex-col  items-start">
              <h1 className="text-[16px] text-black font-medium ">Add Referral Papers</h1>
              <hr className="mt-1 mb-3 w-full bg-[#d4d4d4] h-[1px]" />
            </div>

            {/* File Input Section */}
            <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-10 mb-5 rounded-lg relative">
              <FiUpload className="text-4xl text-blue-500 mb-2" />
              {pdfFile ? (
                  <p className="text-[#30353B] mt-2 text-2 leading-[18px] tracking-[-2%]">{pdfFile.name}</p>
                ) : (
                  <>
                    <p className="text-[#30353B] mt-2 text-[15px] font-normal leading-[18px] tracking-[-2%]">Drag and drop, or browse your files</p>
                    <p className="text-[#7A7A7A] mt-2 text-[14px] font-normal leading-[18px] tracking-[-2%]">PDF. Max 100mb</p>
                  </>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Add PDF Button */}
            <button
              onClick={handleAddPdf}
              disabled={!pdfFile || uploading}
              className={`border-2 border-gray-300 rounded-lg h-12 w-28 ${
                !pdfFile || uploading
                  ? "bg-gray-200 text-gray-500"
                  : "hover:bg-black hover:text-white"
              } transition duration-200 ease-in-out`}
            >
              {uploading ? "Uploading..." : "Add PDF"}
            </button>

            {/* List of Uploaded PDFs */}
            <div className="flex flex-col w-full mt-4 space-y-4">
              {pdfs.map((pdf, index) => {
                const pdfName =
                  typeof pdf.link === "string"
                    ? pdf.link.substring(pdf.link.lastIndexOf("-") + 1)
                    : `PDF ${index + 1}`;

                return (
                  <div
                    key={pdf.link || index}
                    className="flex justify-between items-center p-2 border-2 border-[#d4d4d4] rounded-lg"
                  >
                    <span className="truncate flex flex-row">
                      <CiCircleCheck className="text-xl text-green-700 mx-2 mt-[2px]" />
                      {pdfName ? pdfName : "PDF"}
                    </span>
                    <div onClick={() => handleDelete(index)}  className="text-m h-[2rem] w-[2rem] rounded-full bg-blue-100 cursor-pointer ml-auto flex flex-row justify-center items-center hover:bg-red-100 text-blue-400 hover:text-red-400">
                      <ImBin2/>
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPdf;
