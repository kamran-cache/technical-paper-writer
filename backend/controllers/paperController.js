const fs = require("fs");
const path = require("path");
const { compileLatex } = require("../utils/compileLatex");
const { exec } = require("child_process");
const Papers = require("../models/paper");
const Users = require("../models/users");
const { Paper } = require("../utils/template1");
// const { Paper } = require("../utils/test"); //this is taking lest time to generate the pdf
const Pdf = require("../models/pdf");
const User = require("../models/users");
const isSectionFilled = (section) => {
  return section.some((item) =>
    Object.values(item).some((value) => value && value.trim() !== "")
  );
};



exports.createPaper = async (req, res) => {
  const userId = req.user.userId;

  try {
    const paper = new Papers({
      user: userId,
      ...req.body,
    });
    await paper.save();
    const paper_id = paper._id;
    console.log("paperid", paper._id);
    console.log(userId, "userId");
    const user = await Users.findByIdAndUpdate(
      userId,
      { $push: { papers: paper_id } },
      { new: true, useFindAndModify: false }
    );
    console.log("user", user);

    return res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: "Error creating paper", error });
  }
};

// get a users Paper
exports.getUserPaper = async (req, res) => {
  const userId = req.user.userId;
  const paperId = req.params.id;
  console.log(paperId, "paperId");
  try {
    console.log(paperId);
    const paper = await Papers.findById({ _id: paperId }).populate("pdfs");
    if (!paper) {
      return res.status(404).json({ message: "paper not found" });
    }

    res.status(200).json({ paper });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.updatePaper = async (req, res) => {
  const { paperId } = req.params;
  const updateData = req.body;

  try {
    // Find the paper by ID and update it with the new data
    const payloadSize = Buffer.byteLength(JSON.stringify(req.body));
    console.log(`Payload size: ${payloadSize} bytes`);
    console.log("paperId", paperId);
    const updatedPaper = await Papers.findByIdAndUpdate(paperId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPaper) {
      return res.status(404).json({ message: "paper not found" });
    }

    res.status(200).json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deletePaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const userId = req.user.userId;
    console.log("paperId", paperId, userId);
    console.log(req.params);
    if (!paperId) {
      return res.json("Provide correct paperID");
    }
    await Papers.findByIdAndDelete(paperId);
    await Pdf.findOneAndDelete({ paperId });
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { papers: paperId } },
      { new: true } // Return the updated document
    );
    return res.json("paper and corresponding pdfs deleted successfully!!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------Demo2---------------------------------------

// exports.generatePaper = async (req, res) => {
//   try {
//     const user = req.user.userId;
//     const data = req.body;
//     console.log("data", data);
//     const latexContent = await Paper(data, user);
//     const paperPath = path.join(__dirname, `../${user}.tex`);
//     fs.writeFileSync(paperPath, latexContent);

//     await compileLatex(paperPath, user);

//     const pdfPath = path.join(__dirname, `../${user}.pdf`);
//     const logPath = path.join(__dirname, `../${user}.log`);
//     const auxPath = path.join(__dirname, `../${user}.aux`);
//     const imgPath = path.join(__dirname, `../${user}`);
//     const pdfBuffer = fs.readFileSync(pdfPath);
//     const base64PDF = pdfBuffer.toString("base64");
//     res.json({ pdf: base64PDF });

//     res.on("finish", () => {
//       // Delete files after the response is sent
//       fs.unlink(pdfPath, (err) => {
//         if (err) {
//           console.error(`Error deleting PDF file: ${err}`);
//         } else {
//           console.log(`PDF file ${pdfPath} deleted successfully.`);
//         }
//       });
//       fs.unlink(paperPath, (err) => {
//         if (err) {
//           console.error(`Error deleting PDF file: ${err}`);
//         } else {
//           console.log(`paper  file ${pdfPath} deleted successfully.`);
//         }
//       });
//       fs.unlink(logPath, (err) => {
//         if (err) {
//           console.error(`Error deleting log file: ${err}`);
//         } else {
//           console.log(`Log file ${logPath} deleted successfully.`);
//         }
//       });
//       fs.unlink(auxPath, (err) => {
//         if (err) {
//           console.error(`Error deleting aux file: ${err}`);
//         } else {
//           console.log(`Aux file ${auxPath} deleted successfully.`);
//         }
//       });

//       // Delete the image directory and its contents
//       fs.rm(imgPath, { recursive: true, force: true }, (err) => {
//         if (err) {
//           console.error(`Error deleting images directory: ${err}`);
//         } else {
//           console.log(`Images directory deleted successfully.`);
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error compiling LaTeX document", error);
//     res.status(500).send("Error compiling LaTeX document");
//   }
// };

exports.generatePaper = async (req, res) => {
  try {
    const user = req.user.userId;
    const data = req.body;
    console.log("data", data);
    const latexContent = await Paper(data, user);
    const paperPath = path.join(__dirname, `../${user}.tex`);
    fs.writeFileSync(paperPath, latexContent);

    // Await the compileLatex function and handle errors if any occur
    const val = await compileLatex(paperPath, user);
    console.log(val, "val");
    const pdfPath = path.join(__dirname, `../${user}.pdf`);
    const logPath = path.join(__dirname, `../${user}.log`);
    const auxPath = path.join(__dirname, `../${user}.aux`);
    const imgPath = path.join(__dirname, `../${user}`);
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64PDF = pdfBuffer.toString("base64");
    res.json({ pdf: base64PDF });

    res.on("finish", () => {
      // Delete files after the response is sent
      fs.unlink(pdfPath, (err) => {
        if (err) {
          console.error(`Error deleting PDF file: ${err}`);
        } else {
          console.log(`PDF file ${pdfPath} deleted successfully.`);
        }
      });
      fs.unlink(paperPath, (err) => {
        if (err) {
          console.error(`Error deleting .tex file: ${err}`);
        } else {
          console.log(`.tex file ${paperPath} deleted successfully.`);
        }
      });
      fs.unlink(logPath, (err) => {
        if (err) {
          console.error(`Error deleting log file: ${err}`);
        } else {
          console.log(`Log file ${logPath} deleted successfully.`);
        }
      });
      fs.unlink(auxPath, (err) => {
        if (err) {
          console.error(`Error deleting aux file: ${err}`);
        } else {
          console.log(`Aux file ${auxPath} deleted successfully.`);
        }
      });

      // Delete the image directory and its contents
      fs.rm(imgPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`Error deleting images directory: ${err}`);
        } else {
          console.log(`Images directory deleted successfully.`);
        }
      });
    });
  } catch (error) {
    console.error("Error compiling LaTeX document", error);
    res.status(500).json({ message: "Error compiling LaTeX document", error });
  }
};
