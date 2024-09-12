const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { Configuration, OpenAI } = require("openai");
const Pdf = require("../models/pdf");
const openai = new OpenAI({
  apiKey: process.env.API,
});

exports.writeWithAi = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const { titleOfPaper, content, field, isChecked } = req.body;
    console.log("formData", req.body);
    let prompt = `Write a well-structured ${field} section for the technical paper titled ${titleOfPaper}. This section should integrate relevant concepts and ideas that are essential to the field. The writing should be academic in tone, providing a comprehensive discussion that deepens the reader's understanding of the subject.`;

    if (!isChecked) {
      if (content) {
        prompt += ` Here is the content to refer: ${content}`;
      }
    } else {
      const pdfDocument = await Pdf.findOne({ paperId });

      if (!pdfDocument) {
        if (content) {
          prompt += ` Here is the content: ${content}`;
        }
      }

      // Collect text from all pdfs with the matching title
      else {
        const allContent = pdfDocument.pdfs.flatMap((pdf) => pdf.content);

        // console.log("All content after flatMap:", allContent);

        const filteredContent = allContent.filter((content) => {
          if (content && content.title) {
            console.log("Content title:", content.title); // Log each title
            return content.title.toUpperCase() === field.toUpperCase();
          }
          return false;
        });

        if (filteredContent.length === 0) {
          if (content) {
            prompt += ` Here is the content: ${content}`;
          }
        } else {
          const matchingTexts = filteredContent.map((content) => content.text);

          const combinedText = matchingTexts.join(", ");

          if (content) {
            prompt += ` Here is additional content to refer: ${content}.`;
          }

          prompt += `Incorporate the following references from the reference paper provided: ${combinedText} alongside the content provided by the user: ${content} to develop a ${field} section for the technical paper titled ${titleOfPaper}. The writing should demonstrate a deep understanding of the topic by integrating both sources of information. Focus on creating a coherent, technically sound, and comprehensive section that enhances the overall structure of the paper.`;
        }
      }
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a technical paper writer and provide the content in great detail.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 400,
    });

    console.log(prompt, response);
    console.log("response", response.choices[0].message.content);
    res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
