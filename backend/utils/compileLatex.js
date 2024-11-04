const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
// exports.compileLatex = (filePath, user) => {
//   return new Promise((resolve, reject) => {
//     console.log("inside the complire ");
//     exec(`pdflatex ${user}.tex`, (error, stdout, stderr) => {
//       console.log("converting...");
//       if (error) {
//         console.error(`Error: ${stderr}`);
//         reject(error);
//       } else {
//         console.log(stdout);
//         resolve();
//       }
//     });
//   });
// };

exports.compileLatex = (filePath, user) => {
  return new Promise((resolve, reject) => {
    console.log("inside the compile");

    // Add a timeout of 10 seconds to avoid indefinite hanging
    exec(
      `pdflatex ${user}.tex`,
      { timeout: 10000 },
      (error, stdout, stderr) => {
        console.log("converting...");

        if (error) {
          console.error(`Error: ${stderr}`);
          reject(`Compilation error: ${stderr || stdout}`); // Pass detailed error message
        } else {
          console.log(stdout);
          resolve();
        }
      }
    );
  });
};
