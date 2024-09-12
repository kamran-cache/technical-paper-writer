const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
exports.compileLatex = (filePath, user) => {
  return new Promise((resolve, reject) => {
    console.log("inside the complire ");
    exec(`pdflatex ${user}.tex`, (error, stdout, stderr) => {
      console.log("converting...");
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
};
