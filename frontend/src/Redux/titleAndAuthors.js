import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  authors: [
    {
      name: "",
      department: "",
      organization: "",
      city: "",
      country: "",
      email: "",
    },
  ],
};

// const titleAndAuthorsSlice = createSlice({
//   name: "titleAndAuthors",
//   initialState,
//   reducers: {
//     setTitle: (state, action) => {
//       state.title = action.payload;
//     },
//     setAuthors: (state, action) => {
//       const { index, field, value } = action.payload;
//       if (state.authors[index]) {
//         state.authors[index][field] = value;
//       }
//     },
//     addAuthor: (state) => {
//       state.authors.push({
//         name: "",
//         department: "",
//         organization: "",
//         city: "",
//         country: "",
//         email: "",
//       });
//     },
//   },
// });

const titleAndAuthorsSlice = createSlice({
  name: "titleAndAuthors",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setAuthors: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.authors[index]) {
        state.authors[index] = {
          ...state.authors[index], // Spread the current author object
          [field]: value, // Update only the field that has changed
        };
      }
    },
    displayAuthor: (state, action) => {
      state.authors = action.payload;
    },
    addAuthor: (state) => {
      state.authors.push({
        name: "",
        department: "",
        organization: "",
        city: "",
        country: "",
        email: "",
      });
    },
  },
});
export const { setTitle, setAuthors, addAuthor, displayAuthor } =
  titleAndAuthorsSlice.actions;
export default titleAndAuthorsSlice.reducer;
