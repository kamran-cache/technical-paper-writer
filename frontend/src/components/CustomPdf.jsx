import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import store from "../Redux/store";
import { RiRefreshLine } from "react-icons/ri";
import { IoMdDownload } from "react-icons/io";
import { CiZoomIn } from "react-icons/ci";
import { CiZoomOut } from "react-icons/ci";
import Loading from "../assets/Rocket.mp4";
import { setAlerts, setMessage } from "../Redux/applicationStatesSlice";

const CustomPdf = () => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [zoom, setZoom] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false); // State to handle loading
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const generatePdf = async () => {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 650]);
      const { width, height } = page.getSize();
      page.drawText("Hello, world!", {
        x: 50,
        y: height - 150,
        size: 30,
        color: rgb(0, 0, 0),
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setPdfBlob(blob);
    };

    if (!pdfUrl) {
      generatePdf();
    } else {
      fetch(pdfUrl)
        .then((response) => response.blob())
        .then((blob) => setPdfBlob(blob));
    }
  }, [pdfUrl]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(prevZoom + 0.1, 2);
      return newZoom;
    });
  };

  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  const handleDownload = () => {
    if (pdfUrl) {
      const fileName = pdfName ? `${pdfName}.pdf` : "custom.pdf";
      saveAs(pdfUrl, fileName);
    }
  };

  const payloadWithoutPdf = (state) => {
    const { application, pdf, ...rest } = state;
    return rest;
  };

  const validation = (data) => {
    if (!data) return false;

    // Check if title is filled
    if (
      !data.titleAndAuthors?.title ||
      data.titleAndAuthors.title.trim() === ""
    ) {
      dispatch(setAlerts(true));
      dispatch(setMessage("Title is required."));
      return false;
    }

    // Check if each author field is filled
    if (data.titleAndAuthors?.authors?.length) {
      for (const author of data.titleAndAuthors.authors) {
        if (!author.name || author.name.trim() === "") {
          dispatch(setAlerts(true));
          dispatch(setMessage("Author name is required."));
          return false;
        }
        if (!author.department || author.department.trim() === "") {
          dispatch(setAlerts(true));
          dispatch(setMessage("Author department is required."));
          return false;
        }
        if (!author.organization || author.organization.trim() === "") {
          dispatch(setAlerts(true));
          dispatch(setMessage("Author organization is required."));
          return false;
        }
      }
    } else {
      dispatch(setAlerts(true));
      dispatch(setMessage("At least one author is required."));
      return false;
    }

    return true;
  };

  const handleClick = async () => {
    try {
      setLoading(true); // Show loader when save button is clicked
      const data = store.getState();
      const state = payloadWithoutPdf(data);
      console.log(state, "payload data ");
      const isValid = validation(store.getState());
      const token = window.localStorage.getItem("token");
      let response;
      if (isValid) {
        if (id !== "undefined") {
          response = await axios.put(
            `http://localhost:5000/api/v1/paper/${id}`,
            state,
            {
              headers: { token: `Bearer ${token}` },
            }
          );
        } else {
          response = await axios.post(
            "http://localhost:5000/api/v1/paper/add",
            state,
            {
              headers: { token: `Bearer ${token}` },
            }
          );
          navigate(`/paper/${response.data._id}`);
        }

        const res = await axios.post(
          "http://localhost:5000/api/v1/paper/generate",
          state,
          {
            headers: { token: `Bearer ${token}` },
          }
        );

        const binaryData = atob(res.data.pdf);
        const byteNumbers = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteNumbers[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }
    } catch (error) {
      console.error("There was an error processing the paper!", error);
    } finally {
      setLoading(false); // Hide loader when the PDF is ready
    }
  };

  return (
    <div className="pdf-viewer w-full">
      <div className="toolbar w-full bg-white flex items-center justify-between p-2 border-b-2">
        <div className="flex-1">Click on save button to apply changes</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClick}
            className="text-black p-2 flex bg-[#0072] items-center"
          >
            <RiRefreshLine className="mr-1" /> Save Paper
          </button>
        </div>
      </div>
      <div className="mt-2 relative">
        {loading && !pdfUrl && (
          <div className="absolute mt-64 inset-0 flex justify-center items-center  bg-opacity-50 z-50">
            <video autoPlay loop muted className="w-32 h-32 flex">
              <source src={Loading} type="video/mp4" />
            </video>
          </div>
        )}
        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=1`}
            style={{
              width: "100%",
              height: "calc(100vh - 4rem)",
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
              border: "none",
              textRendering: "geometricPrecision",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              zoom: zoom,
            }}
            frameBorder="0"
            className="no-border mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default CustomPdf;
