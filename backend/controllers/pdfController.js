const express = require("express");
const multer = require("multer");
const { bucket } = require("../firebaseconfig"); // Configure Firebase bucket
const pdfParse = require("pdf-parse");
const { v4: uuidv4 } = require("uuid");
const Pdf = require("../models/pdf"); // Your Pdf model
const Paper = require("../models/paper"); // Your Paper model

// function to get citation using the metadata from the pdf:
function generateCitation(pdfData) {
  const { info, metadata } = pdfData;

  const title = metadata._metadata["dc:title"] || "Title not available";
  const authors = metadata._metadata["dc:creator"] || "Author not available";
  const publicationName =
    metadata._metadata["prism:publicationname"] || "Publication not available";
  const publicationDate =
    metadata._metadata["prism:coverdisplaydate"] || "Date not available";
  const doi = metadata._metadata["prism:doi"] || "DOI not available";
  const startingPage =
    metadata._metadata["prism:startingpage"] || "Starting page not available";
  const endingPage =
    metadata._metadata["prism:endingpage"] || "Ending page not available";

  // APA Citation format
  const citation = `${authors} (${publicationDate}). ${title}. In *${publicationName}* (pp. ${startingPage}-${endingPage}). https://doi.org/${doi}`;
  console.log("citation", citation);
  return citation;
}

// Function to extract sections from PDF text
const extractSections = async (text) => {
  const regex =
    /(?:^|\n)(Abstract—\s*[^\n]*|REFERENCES|[IVX]+[.]\s*[^\n]*?)\n([\s\S]*?)(?=\n(?:[IVX]+[.]\s+[A-Z]|REFERENCES)|\n*$)/g;

  let match;
  const sections = {};

  while ((match = regex.exec(text)) !== null) {
    let title = match[1].trim();
    let content = match[2].trim();

    title = title
      .replace(/^\s*[IVX]+\.\s*/, "")
      .replace(/\n/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/^\s+|\s+$/g, "");

    if (title.length === 1 && /[A-Z]/.test(title)) {
      let nextPart = content.match(/^[A-Z\s]+/);
      if (nextPart) {
        title += nextPart[0].trim();
        content = content.slice(nextPart[0].length).trim();
      }
    }

    if (
      title.length > 1 &&
      (title[title.length - 2] === " " ||
        title[title.length - 3] === " " ||
        title[title.length - 2] === "\n") &&
      (title[title.length - 1].length === 1 ||
        title[title.length - 2].length === 1)
    ) {
      title = title.slice(0, -2).trim();
    }

    if (title.startsWith("Abstract—")) {
      title = "Abstract";
    }
    if (title.startsWith("REFERENCES" || "R EFRENCES")) {
      title = "REFERENCES";
    }

    title = title.toUpperCase().replace(/\s{2,}/g, " ");
    content = cleanText(content);

    sections[title] = content;
  }

  return sections;
};

// Function to clean text content
const cleanText = (text) => {
  return text
    .replace(/[\n’”\u]/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(
      /(?:Image|Object Detection|Grant ID|Predict Next Position|Each Class)/g,
      ""
    )
    .replace(/^\s+|\s+$/g, "")
    .trim();
};

module.exports.addOrUpdatePdf = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Upload PDF to Firebase Storage
    const blob = bucket.file(`pdfs/${uuidv4()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });
    blobStream.end(file.buffer);

    const publicUrl = await new Promise((resolve, reject) => {
      blobStream.on("finish", () =>
        resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      );
      blobStream.on("error", reject);
    });

    // Extract text from the PDF file
    const pdfData = await pdfParse(file.buffer);

    console.log("pdfData", pdfData);

    const result = await extractSections(pdfData.text);

    const formattedContent = Object.entries(result).map(([title, text]) => ({
      title: title,
      text: text,
    }));

    // Check if a PDF with the given paperId already exists
    let pdfDocument = await Pdf.findOne({ paperId });

    if (pdfDocument) {
      // Update existing PDF document
      pdfDocument.pdfs.push({ link: publicUrl, content: formattedContent });
      await pdfDocument.save();
    } else {
      // Create a new PDF document
      pdfDocument = new Pdf({
        paperId,
        pdfs: [{ link: publicUrl, content: formattedContent }],
      });
      await pdfDocument.save();

      // Link the new PDF document to the paper
      paper.pdfs = [pdfDocument._id];
      await paper.save();
    }

    return res
      .status(200)
      .json({
        message: "PDF processed successfully",
        pdfLink: publicUrl,
        id: pdfDocument._id,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to process PDF", error: error.message });
  }
};

// delete dunction to delete paper
module.exports.deletePdf = async (req, res) => {
  try {
    // const data = req.body;
    const paperId = req.params.paperId;
    const pdfId = req.params.pdfId;
    console.log(paperId, " ", pdfId);
    if (!pdfId) {
      return res.status(404).json({ message: "Pdf not found" });
    }
    await Pdf.updateOne(
      { paperId: paperId },
      { $pull: { pdfs: { _id: pdfId } } }
    );
    return res.status(200).json({ message: "Pdf Deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete PDF", error: error.message });
  }
};
