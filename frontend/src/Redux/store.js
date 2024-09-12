import { configureStore } from "@reduxjs/toolkit";
import titleAndAuthorsReducer from "./titleAndAuthors";
import abstractAndKeywordsReducer from "./abstractsAndKeywordsSlice";
import sectionsReducer from "./sectionsSlice";
import pdfReducer from "./pdfSlice";
import applicationReducer from "./applicationStatesSlice";
const store = configureStore({
  reducer: {
    titleAndAuthors: titleAndAuthorsReducer,
    abstractAndKeywords: abstractAndKeywordsReducer,
    sections: sectionsReducer,
    pdf: pdfReducer,
    application: applicationReducer,
  },
});

export default store;
