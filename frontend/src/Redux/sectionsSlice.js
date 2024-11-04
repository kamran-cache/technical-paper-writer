import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [
    {
      title: "Introduction",
      content: [],
    },
    {
      title: "Methodology",
      content: [],
    },
    {
      title: "Background and Related Work",
      content: [],
    },
    {
      title: "Conclusion and Future Work",
      content: [],
    },
    {
      title: "References",
      content: [],
    },
  ],
};

const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    setSection: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.sections[index]) {
        state.sections[index] = {
          ...state.sections[index],
          [field]: value,
        };
      }
    },
    addSectionContent: (state, action) => {
      const { index, content } = action.payload;
      if (state.sections[index]) {
        state.sections[index].content.push(content); // Add new content object
      }
    },
    updateSectionContent: (state, action) => {
      const { sectionIndex, contentIndex, field, value } = action.payload;
      if (
        state.sections[sectionIndex] &&
        state.sections[sectionIndex].content[contentIndex]
      ) {
        state.sections[sectionIndex].content[contentIndex] = {
          ...state.sections[sectionIndex].content[contentIndex],
          [field]: value,
        };
      }
    },
    deleteSectionContent: (state, action) => {
      const { sectionIndex, contentIndex } = action.payload;
      if (state.sections[sectionIndex]) {
        state.sections[sectionIndex].content.splice(contentIndex, 1);
      }
    },
    addSection: (state, action) => {
      const { title } = action.payload;
      state.sections.push({
        title: title,
        content: [{ text: "", url: "", title: "", equations: "" }],
      });
    },
    displaySection: (state, action) => {
      state.sections = action.payload;
    },
    reorderSection: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [movedSection] = state.sections.splice(sourceIndex, 1);
      state.sections.splice(destinationIndex, 0, movedSection);
    },
    addNextSection: (state, action) => {
      const { sectionIndex } = action.payload;
      const emptySection = {
        title: "New Section",
        content: [{ text: "", url: "", title: "", equations: "" }],
      };
      state.sections.splice(sectionIndex, 0, emptySection);
    },
    deleteSection: (state, action) => {
      const { index } = action.payload;
      state.sections.splice(index, 1);
    },
    moveContentUp: (state, action) => {
      const { sectionIndex, contentIndex } = action.payload;
      if (state.sections[sectionIndex] && contentIndex > 0) {
        const content = state.sections[sectionIndex].content;
        const [movedContent] = content.splice(contentIndex, 1);
        content.splice(contentIndex - 1, 0, movedContent);
      }
    },
    moveContentDown: (state, action) => {
      const { sectionIndex, contentIndex } = action.payload;
      const section = state.sections[sectionIndex];
      if (section && contentIndex < section.content.length - 1) {
        const content = section.content;
        const [movedContent] = content.splice(contentIndex, 1);
        content.splice(contentIndex + 1, 0, movedContent);
      }
    },
    reorderSectionContent: (state, action) => {
      const { sectionIndex, sourceIndex, destinationIndex } = action.payload;
      const section = state.sections[sectionIndex];
      if (section && section.content.length > 1) {
        const [movedContent] = section.content.splice(sourceIndex, 1);
        section.content.splice(destinationIndex, 0, movedContent);
      }
    },
  },
});

export const {
  setSection,
  addSectionContent,
  updateSectionContent,
  addSection,
  displaySection,
  deleteSectionContent,
  reorderSection,
  addNextSection,
  deleteSection,
  moveContentUp,
  moveContentDown,
  reorderSectionContent,
} = sectionsSlice.actions;
export default sectionsSlice.reducer;
