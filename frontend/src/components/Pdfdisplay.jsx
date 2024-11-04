import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { LuUpload } from "react-icons/lu";
import { IoMdDownload } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import Loading from "../assets/Rocket.mp4";
// Set worker URL (ensure version matches)
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs";

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};
const maxWidth = 800;

const Pdfdisplay = ({ pdfUrl, fileName }) => {
  // Accept pdfUrl and fileName as props
  const [file, setFile] = useState(pdfUrl); // Initialize file with pdfUrl
  const [numPages, setNumPages] = useState(null); // Initialize with null to handle loading
  const [currentPage, setCurrentPage] = useState(1); // Initialize the current page
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [scale, setScale] = useState(1.0); // Zoom level state
  const pagesRef = useRef([]); // Ref to store page heights
  const loading = useSelector((state) => state.application.loading);
  const error = useSelector((state) => state.application.errors);
  // Update the file state when pdfUrl changes
  useEffect(() => {
    setFile(pdfUrl); // Set the file state to the provided pdfUrl
  }, [pdfUrl]);

  // Handle resizing of the PDF container
  const onResize = useCallback((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  // When the document is loaded successfully
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  // Zoom in function
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3.0)); // Max zoom level 3.0
  };

  // Zoom out function
  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min zoom level 0.5
  };

  // Update current page based on scroll position
  const handleScroll = () => {
    if (pagesRef.current.length === 0 || numPages === null) return;

    const scrollTop = window.scrollY; // Get current scroll position
    const pageHeight = pagesRef.current[0]?.offsetHeight; // Get the height of the first page

    const newPage = Math.min(
      Math.max(Math.floor(scrollTop / pageHeight) + 1, 1),
      numPages
    );
    setCurrentPage(newPage); // Update current page based on scroll position
  };

  // Add scroll event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [numPages]);

  // Download PDF function
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = fileName || "document.pdf"; // Default name if no file name is available
    link.click();
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-neutral-300 h-[40rem] w-[600px] overflow-y-auto text-white relative">
      {/* Navbar */}
      <div className="flex flex-row justify-between items-center bg-neutral-500 z-40 sticky top-0 h-[4rem] w-full">
        {/* Display the file name or a placeholder if no file is selected */}
        <div className="ml-2 gap-2 items-center flex flex-row justify-around">
          <div>
            {fileName
              ? fileName.length > 15
                ? `${fileName.substring(0, 15)}...`
                : fileName
              : "No file selected"}
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-around items-center">
          <div className="mr-5">
            {numPages && (
              <span className="ml-4 text-white">
                <span className="h-[2rem] w-[2rem] px-2 bg-neutral-400">
                  {currentPage}
                </span>{" "}
                / <span>{numPages}</span>
              </span>
            )}
          </div>
          <button
            className="bg-neutral-400 h-[2rem] w-[2rem] flex rounded-full hover:bg-neutral-200 hover:text-red-700 justify-center items-center"
            onClick={zoomIn}
          >
            <IoMdAdd />
          </button>
          <span className="bg-neutral-400 text-white p-1 mx-4">
            {Math.round(scale * 100)}%
          </span>
          <button
            className="bg-neutral-400 hover:bg-neutral-200 hover:text-red-700 rounded-full h-[2rem] w-[2rem] flex justify-center items-center"
            onClick={zoomOut}
          >
            <RiSubtractFill />
          </button>
        </div>
        <div className="flex text-[1.5rem] flex-row justify-around items-center">
          {/* Download icon and functionality */}
          <button onClick={handleDownload} className="mr-4">
            <IoMdDownload />
          </button>

          {/* Print icon and functionality */}
          <button onClick={handlePrint} className="mr-4">
            <IoMdPrint />
          </button>
        </div>
      </div>
      {/* Navbar ends */}
      <div className="">
        {/* PDF Document Viewer */}
        <div
          className="flex flex-col justify-center items-center"
          ref={setContainerRef}
        >
          {error && (
            <div className="absolute inset-0  flex justify-center items-center  ">
              <div className=" text-black bg-red-300  p-2 w-[70%]  ">
                {error}
              </div>
            </div>
          )}
          {loading && !pdfUrl && (
            <div className="absolute  inset-0 flex justify-center items-center  bg-opacity-50 z-50">
              <video autoPlay loop muted className="w-32 h-32 flex">
                <source src={Loading} type="video/mp4" />
              </video>
            </div>
          )}
          {!file && !loading && (
            <div className="text-black mt-[50%]">
              Click on Save progress to view the pdf!
            </div>
          )}
          {file && (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                <div
                  key={`page_${index + 1}`}
                  ref={(el) => (pagesRef.current[index] = el)}
                  className="transition-transform duration-300 ease-in-out" // Add smooth transition
                >
                  <Page
                    className="mb-10"
                    pageNumber={index + 1}
                    width={
                      containerWidth
                        ? Math.min(containerWidth, maxWidth)
                        : maxWidth
                    }
                    scale={scale} // Apply the scale to each page
                  />
                </div>
              ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pdfdisplay;
