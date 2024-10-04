import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: false,
  message: "",
  loading: false,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAlerts, setMessage, setLoading } =
  applicationStatesSlice.actions;
export default applicationStatesSlice.reducer;
