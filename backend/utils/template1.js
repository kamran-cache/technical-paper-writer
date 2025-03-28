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

  return text.replace(/([\\{}$%&_#^~<>|])/g, (match) => replacements[match]);
};

// Helper function to detect and replace Greek letters in a string
// const replaceGreekLetters = (text) => {
//   if (!text || typeof text !== "string") return text;

//   const greekLetterMap = {
//     α: "\\alpha",
//     β: "\\beta",
//     γ: "\\gamma",
//     δ: "\\delta",
//     ε: "\\epsilon",
//     ϵ: "\\epsilon",
//     ζ: "\\zeta",
//     η: "\\eta",
//     θ: "\\theta",
//     ι: "\\iota",
//     κ: "\\kappa",
//     λ: "\\lambda",
//     μ: "\\mu",
//     ν: "\\nu",
//     ξ: "\\xi",
//     ο: "\\omicron",
//     π: "\\pi",
//     ρ: "\\rho",
//     σ: "\\sigma",
//     τ: "\\tau",
//     υ: "\\upsilon",
//     φ: "\\phi",
//     χ: "\\chi",
//     ψ: "\\psi",
//     ω: "\\omega",
//   };

//   return text.replace(
//     /α|β|γ|δ|ε|ϵ|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω/g,
//     (match) => greekLetterMap[match]
//   );
// };

const replaceGreekLetters = (text) => {
  if (!text || typeof text !== "string") return text;

  const greekLetterMap = {
    // Lowercase Greek letters
    α: "\\alpha ",
    β: "\\beta ",
    γ: "\\gamma ",
    δ: "\\delta ",
    ε: "\\epsilon ",
    ϵ: "\\epsilon ", // Alternate epsilon
    ζ: "\\zeta ",
    η: "\\eta ",
    θ: "\\theta ",
    ϑ: "\\vartheta ", // Alternate theta
    ι: "\\iota ",
    κ: "\\kappa ",
    λ: "\\lambda ",
    μ: "\\mu ",
    ν: "\\nu ",
    ξ: "\\xi ",
    ο: "\\omicron ",
    π: "\\pi ",
    ϖ: "\\varpi ", // Alternate pi
    ρ: "\\rho ",
    ς: "\\varsigma ", // Alternate sigma
    σ: "\\sigma ",
    τ: "\\tau ",
    υ: "\\upsilon ",
    φ: "\\phi ",
    ϕ: "\\varphi ", // Alternate phi
    χ: "\\chi ",
    ψ: "\\psi ",
    ω: "\\omega ",

    // Uppercase Greek letters
    Α: "\\Alpha ",
    Β: "\\Beta ",
    Γ: "\\Gamma ",
    Δ: "\\Delta ",
    Ε: "\\Epsilon ",
    Ζ: "\\Zeta ",
    Η: "\\Eta ",
    Θ: "\\Theta ",
    Ι: "\\Iota ",
    Κ: "\\Kappa ",
    Λ: "\\Lambda ",
    Μ: "\\Mu ",
    Ν: "\\Nu ",
    Ξ: "\\Xi ",
    Ο: "\\Omicron ",
    Π: "\\Pi ",
    Ρ: "\\Rho ",
    Σ: "\\Sigma ",
    Τ: "\\Tau ",
    Υ: "\\Upsilon ",
    Φ: "\\Phi ",
    Χ: "\\Chi ",
    Ψ: "\\Psi ",
    Ω: "\\Omega ",

    // Additional symbols
    "∂": "\\partial ",
    "∇": "\\nabla ",
    "∞": "\\infty ",
    "∩": "\\cap ",
    "∪": "\\cup ",
    "±": "\\pm ",
    "∑": "\\sum ",
    "∏": "\\prod ",
    "∫": "\\int ",
    "√": "\\sqrt ",
    "∀": "\\forall ",
    "∃": "\\exists ",
    "⊂": "\\subset ",
    "⊃": "\\supset ",
    "∈": "\\in ",
    "∉": "\\notin ",
    "≠": "\\neq ",
    "≈": "\\approx ",
    "≤": "\\leq ",
    "≥": "\\geq ",
    "∧": "\\wedge ",
    "∨": "\\vee ",
    "⊕": "\\oplus ",
    "⊗": "\\otimes ",
    "⇒": "\\Rightarrow ",
    "⇔": "\\Leftrightarrow ",
  };

  return text.replace(
    /α|β|γ|δ|ε|ϵ|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ϖ|ρ|ς|σ|τ|υ|φ|ϕ|χ|ψ|ω|Α|Β|Γ|Δ|Ε|Ζ|Η|Θ|Ι|Κ|Λ|Μ|Ν|Ξ|Ο|Π|Ρ|Σ|Τ|Υ|Φ|Χ|Ψ|Ω|∂|∇|∞|∩|∪|±|∑|∏|∫|√|∀|∃|⊂|⊃|∈|∉|≠|≈|≤|≥|∧|∨|⊕|⊗|⇒|⇔/g,
    (match) => greekLetterMap[match] || match
  );
};

// Function to process section content (replace Greek letters and handle equations)
const processSectionContent = (sections) => {
  if (!sections || !Array.isArray(sections)) return sections;

  for (const section of sections) {
    console.log(section, 1234);
    for (const paragraph of section.content) {
      console.log(paragraph, 123);
      if (paragraph.equations) {
        // Detect and replace Greek letters in the paragraph text
        paragraph.equations = replaceGreekLetters(paragraph.equations);

        // console.log(paragraph.text, 123);
        // Detect equations and wrap them in LaTeX math mode
        // Assuming equations are marked with some identifier
        paragraph.equations = paragraph.equations.replace(
          /\[equation\](.*?)\[\/equation\]/g,
          "\\begin{equation}$1\\end{equation}"
        );
      }
    }
  }

  return sections;
};

// Main function to generate the LaTeX document
exports.Paper = async (data, user) => {
  const formData = data;
  let sections = formData.sections && formData.sections.sections;

  if (sections && sections.length > 0) {
    await processImages(sections, user);
    sections = processSectionContent(sections); // Process sections to replace Greek letters and handle equations
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
            if (!author.name) return ""; // Ensure author name exists

            let authorBlock = `\\IEEEauthorblockN{${escapeText(
              author.name
            )}}\n`;
            let details = [];

            if (author.department) {
              details.push(`\\textit{${escapeText(author.department)}}`);
            }
            if (author.organization) {
              details.push(`\\textit{${escapeText(author.organization)}}`);
            }
            if (author.city || author.country) {
              let location = `${escapeText(author.city || "")}`;
              if (author.city && author.country) {
                location += ", ";
              }
              location += escapeText(author.country || "");
              details.push(location);
            }
            if (author.email) {
              details.push(`${escapeText(author.email)}`);
            }

            // Only include \IEEEauthorblockA if there are details
            if (details.length > 0) {
              authorBlock += `\\IEEEauthorblockA{${details.join(" \\\\ ")}}\n`;
            }

            return authorBlock;
          })
          .filter(Boolean)
          .join("\\and\n") // Separate multiple authors
      : `\\IEEEauthorblockN{Anonymous}` // Fallback when no authors exist
  }
}

  
  \\maketitle
  
  ${
    formData.abstractAndKeywords.abstract
      ? `\\begin{abstract}\n${escapeText(
          formData.abstractAndKeywords.abstract
        )}\n\\end{abstract}`
      : ""
  }
  
  ${
    formData.abstractAndKeywords.keywords &&
    formData.abstractAndKeywords.keywords.length > 0
      ? `\\begin{IEEEkeywords}\n${escapeText(
          formData.abstractAndKeywords.keywords.join(", ")
        )}\n\\end{IEEEkeywords}`
      : ""
  }
  
  ${
    sections && sections.length > 0
      ? sections
          .map((section) => {
            const sectionContent = section.content
              .map((paragraph) => {
                let content = escapeText(paragraph.text || "");

                // Handle equations if present
                if (paragraph.equations) {
                  content += `\n\\begin{equation}\n${paragraph.equations}\n\\end{equation}`;
                }

                const images = paragraph.url
                  ? `\\begin{figure}[htbp]
  \\centering
  \\includegraphics[width=0.4\\textwidth]{${escapeText(paragraph.url)}}
  \\caption{${escapeText(paragraph.title || "Figure")}}
  \\label{fig:${paragraph._id}}
  \\end{figure}`
                  : "";

                return `${content}\n\n${images}`;
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
