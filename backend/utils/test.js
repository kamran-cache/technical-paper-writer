const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Helper function to ensure the directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Function to download a single image
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

// Function to process images in parallel
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
          downloadImage(paragraph.url, imagePath)
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
// Function to escape LaTeX special characters
const escapeLatexSpecialChars = (text) => {
  if (!text || typeof text !== "string") return text;

  const replacements = {
    "\\": "\\textbackslash{}",
    "{": "\\{",
    "}": "\\}",
    $: "\\$",
    "&": "\\&",
    "%": "\\%",
    _: "\\_",
    "#": "\\#",
    "^": "\\^{}",
    "~": "\\textasciitilde{}",
    "<": "\\textless{}",
    ">": "\\textgreater{}",
    "|": "\\textbar{}",
  };

  // Replace all special characters in the text
  return text.replace(/([\\{}$%&_#^~<>|])/g, (match) => replacements[match]);
};

exports.Paper = async (data, user) => {
  const formData = data;
  const sections = formData.sections && formData.sections.sections;

  if (sections && sections.length > 0) {
    await processImages(sections, user);
  }

  // Escape special LaTeX characters in the dynamic content
  const escapeText = (text) => escapeLatexSpecialChars(text);

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
    ? `\\title{${escapeText(formData.titleAndAuthors.title)}}`
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
\\IEEEauthorblockN{${escapeText(author.name)}}
\\IEEEauthorblockA{
${author.department ? `\\textit{${escapeText(author.department)}} \\\\` : ""}
${
  author.organization ? `\\textit{${escapeText(author.organization)}} \\\\` : ""
}
${author.city ? `${escapeText(author.city)}, ` : ""}${escapeText(
              author.country || " "
            )} \\\\
${escapeText(author.email || "")}}
`;
          })
          .filter(Boolean)
          .join("\\and\n")
      : ""
  }
}

\\maketitle

${
  formData.abstractAndKeywords.abstract
    ? `\\begin{abstract}
${escapeText(formData.abstractAndKeywords.abstract)}
\\end{abstract}`
    : ""
}

${
  formData.abstractAndKeywords.keywords &&
  formData.abstractAndKeywords.keywords.length > 0
    ? `\\begin{IEEEkeywords}
${escapeText(formData.abstractAndKeywords.keywords.join(", "))}
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
\\includegraphics[width=0.4\\textwidth]{${escapeText(paragraph.url)}}
\\caption{${escapeText(paragraph.title || "Figure")}}
\\label{fig:${paragraph._id}}
\\end{figure}`
                : "";

              return `${escapeText(paragraph.text)}\n\n${images}`;
            })
            .join("\n");

          return `\\section{${escapeText(
            section.title || ""
          )}}\n${sectionContent}`;
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
