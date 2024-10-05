// const initialState = {
//   pdfs: [
//     {
//       link: "",
//     },
//   ],
// };

// const pdfSlice = createSlice({
//   name: "pdf",
//   initialState,
//   reducers: {
//     addPdf: (state, action) => {
//       state.pdfs.push(action.payload);
//     },
//     deletePdf: (state, action) => {
//       const index = action.payload;
//       state.pdfs.splice(index, 1);
//     },
//     setPdf: (state, action) => {
//       state.pdfs = action.payload;
//     },
//   },
// });

// export const { addPdf, deletePdf, setPdf } = pdfSlice.actions;
// export default pdfSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pdfs: [
    {
      link: "",
      _id: "",
    },
  ],
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    addPdf: (state, action) => {
      // Expect action.payload to be an object with both link and _id
      state.pdfs.push(action.payload);
    },

    // old kamran 
    deletePdf: (state, action) => {
      const index = action.payload;
      state.pdfs.splice(index, 1);
    },

    // new sahil 
    // deletePdf: (state, action) => {
    //   const pdfId = action.payload; // We're passing the _id of the PDF as the payload
    //   state.pdfs = state.pdfs.filter(pdf => pdf._id !== pdfId); // Remove the PDF with matching _id
    // },

    setPdf: (state, action) => {
      state.pdfs = action.payload;
    },
  },
});

export const { addPdf, deletePdf, setPdf } = pdfSlice.actions;
export default pdfSlice.reducer;
