import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  abstract: "",
  keywords: [],
};

const abstractAndKeywordsSlice = createSlice({
  name: "abstractAndKeywords", // Updated name to match the purpose
  initialState,
  reducers: {
    setAbstract: (state, action) => {
      state.abstract = action.payload;
    },
    setKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    addKeyword: (state, action) => {
      state.keywords.push(action.payload);
    },
  },
});

export const { setAbstract, setKeywords, addKeyword } =
  abstractAndKeywordsSlice.actions;
export default abstractAndKeywordsSlice.reducer;
