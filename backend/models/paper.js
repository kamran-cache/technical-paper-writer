const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  titleAndAuthors: {
    title: { type: String, required: true },
    authors: [
      {
        name: { type: String },
        department: { type: String },
        organization: { type: String },
        city: { type: String },
        country: { type: String },
        email: { type: String },
      },
    ],
  },
  abstractAndKeywords: {
    abstract: {
      type: String,
    },

    keywords: [{ type: String }],
  },

  sections: {
    sections: [
      {
        title: { type: String },
        content: [
          {
            text: { type: String },
            url: { type: String }, // This will store the Firebase URL of the image
            title: { type: String }, // This will store the title of the image
            equations: { type: String },
          },
        ],
      },
    ],
  },
  pdfs: { type: mongoose.Schema.Types.ObjectId, ref: "Pdf" },
});

const Papers = mongoose.model("Papers", paperSchema);

module.exports = Papers;
