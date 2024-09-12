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
    deletePdf: (state, action) => {
      const index = action.payload;
      state.pdfs.splice(index, 1);
    },
    setPdf: (state, action) => {
      state.pdfs = action.payload;
    },
  },
});

export const { addPdf, deletePdf, setPdf } = pdfSlice.actions;
export default pdfSlice.reducer;
