const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pLimit = require("p-limit");

const limit = pLimit(5); // Adjust the concurrency level as needed

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const downloadImage = async (url, filePath) => {
  try {
    if (!filePath.endsWith(".png")) {
      console.warn(
        "File path does not end with .png. Appending .png extension."
      );
      filePath += ".png";
    }

    console.log("URL:", url);
    console.log("File Path:", filePath);

    const response = await axios({
      url,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
};

const processImages = async (sections, user) => {
  const imageDownloadPromises = [];

  for (const section of sections) {
    for (const paragraph of section.content) {
      if (paragraph.url) {
        const imageName = path.basename(paragraph.title || "image", ".png");
        const imagePath = path.join(
          __dirname,
          `../${user}`,
          `${imageName}.png`
        );
        ensureDirectoryExists(path.dirname(imagePath));

        imageDownloadPromises.push(
          limit(() => downloadImage(paragraph.url, imagePath))
            .then(() => {
              paragraph.url = imagePath.replace(/\\/g, "/");
            })
            .catch((err) => {
              console.error(`Failed to download ${paragraph.url}:`, err);
            })
        );
      }
    }
  }

  await Promise.all(imageDownloadPromises);
};

exports.Paper = async (data, user) => {
  const formData = data;
  const sections = formData.sections && formData.sections.sections;

  if (sections && sections.length > 0) {
    await processImages(sections, user);
  }

  // Generate LaTeX content
  const latexContent = `
\\documentclass[conference]{IEEEtran}
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}

\\begin{document}

${
  formData.titleAndAuthors.title
    ? `\\title{${formData.titleAndAuthors.title}}`
    : ""
}

\\author{
  ${
    formData.titleAndAuthors.authors &&
    formData.titleAndAuthors.authors.length > 0
      ? formData.titleAndAuthors.authors
          .map((author) => {
            if (!author.name) return "";
            return `
\\IEEEauthorblockN{${author.name}}
\\IEEEauthorblockA{
${author.department ? `\\textit{${author.department}} \\\\` : ""}
${author.organization ? `\\textit{${author.organization}} \\\\` : ""}
${author.city ? `${author.city}, ` : ""}${author.country || ""} \\\\
${author.email || ""}}
`;
          })
          .filter(Boolean)
          .join("\\and\\n")
      : ""
  }
}

\\maketitle

${
  formData.abstractAndKeywords.abstract
    ? `\\begin{abstract}
${formData.abstractAndKeywords.abstract}
\\end{abstract}`
    : ""
}

${
  formData.abstractAndKeywords.keywords &&
  formData.abstractAndKeywords.keywords.length > 0
    ? `\\begin{IEEEkeywords}
${formData.abstractAndKeywords.keywords.join(", ")}
\\end{IEEEkeywords}`
    : ""
}

${
  sections && sections.length > 0
    ? sections
        .map((section) => {
          const sectionContent = section.content
            .map((paragraph) => {
              const images = paragraph.url
                ? `\\begin{figure}[htbp]
\\centering
\\includegraphics[width=0.4\\textwidth]{${paragraph.url}}
\\caption{${paragraph.title || "Figure"}}
\\label{fig:${paragraph._id}}
\\end{figure}`
                : "";

              return `${paragraph.text}\n\n${images}`;
            })
            .join("\n");

          return `\\section{${section.title || ""}}\n${sectionContent}`;
        })
        .join("\n")
    : ""
}

\\bibliographystyle{IEEEtran}
\\bibliography{references}

\\end{document}
`;

  return latexContent;
};

// exports.Paper = async (data, user) => {
//   const formData = data;
//   const sections = formData.sections && formData.sections.sections;

//   if (sections && sections.length > 0) {
//     await processImages(sections, user);
//   }

//   // Generate LaTeX content
//   const latexContent = `
// \\documentclass[conference]{IEEEtran}
// \\usepackage{cite}
// \\usepackage{amsmath,amssymb,amsfonts}
// \\usepackage{algorithmic}
// \\usepackage{graphicx}
// \\usepackage{textcomp}
// \\usepackage{xcolor}

// \\begin{document}

// ${
//   formData.titleAndAuthors.title
//     ? `\\title{${formData.titleAndAuthors.title}}`
//     : ""
// }

// \\author{
//   ${
//     formData.titleAndAuthors.authors &&
//     formData.titleAndAuthors.authors.length > 0
//       ? formData.titleAndAuthors.authors
//           .map((author) => {
//             if (!author.name) return "";
//             return `
// \\IEEEauthorblockN{${author.name}}
// \\IEEEauthorblockA{
// ${author.department ? `\\textit{${author.department}} \\\\` : ""}
// ${author.organization ? `\\textit{${author.organization}} \\\\` : ""}
// ${author.city ? `${author.city}, ` : ""}${author.country || " "} \\\\
// ${author.email || ""}}
// `;
//           })
//           .filter(Boolean)
//           .join("\\and\n")
//       : ""
//   }
// }

// \\maketitle

// ${
//   formData.abstractAndKeywords.abstract
//     ? `\\begin{abstract}
// ${formData.abstractAndKeywords.abstract}
// \\end{abstract}`
//     : ""
// }

// ${
//   formData.abstractAndKeywords.keywords &&
//   formData.abstractAndKeywords.keywords.length > 0
//     ? `\\begin{IEEEkeywords}
// ${formData.abstractAndKeywords.keywords.join(", ")}
// \\end{IEEEkeywords}`
//     : ""
// }

// ${
//   sections && sections.length > 0
//     ? sections
//         .map((section) => {
//           const sectionContent = section.content
//             .map((paragraph) => {
//               const images = paragraph.url
//                 ? `\\begin{figure}[htbp]
// \\centering
// \\includegraphics[width=0.4\\textwidth]{${paragraph.url}}
// \\caption{${paragraph.title || "Figure"}}
// \\label{fig:${paragraph._id}}
// \\end{figure}`
//                 : "";

//               return `${paragraph.text}\n\n${images}`;
//             })
//             .join("\n");

//           return `\\section{${section.title || ""}}\n${sectionContent}`;
//         })
//         .join("\n")
//     : ""
// }

// \\bibliographystyle{IEEEtran}
// \\bibliography{references}

// \\end{document}
// `;

//   return latexContent;
// };

// demo2
