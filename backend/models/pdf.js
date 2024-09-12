const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
    required: true,
  },
  pdfs: [
    {
      link: { type: String },
      content: [
        {
          title: { type: String },
          text: { type: String },
        },
      ],
    },
  ],
});

const Pdf = mongoose.model("Pdf", pdfSchema);
module.exports = Pdf;
