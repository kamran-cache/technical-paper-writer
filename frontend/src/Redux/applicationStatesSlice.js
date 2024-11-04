import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: false,
  message: "",
  errors: "",
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
    setError: (state, action) => {
      state.errors = action.payload;
    },
  },
});

export const { setAlerts, setMessage, setLoading, setError } =
  applicationStatesSlice.actions;
export default applicationStatesSlice.reducer;
