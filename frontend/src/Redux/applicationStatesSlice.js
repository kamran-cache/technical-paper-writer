import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: false,
  message: "",
};

const applicationStatesSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setAlerts, setMessage } = applicationStatesSlice.actions;
export default applicationStatesSlice.reducer;
