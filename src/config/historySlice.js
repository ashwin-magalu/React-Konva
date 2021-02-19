import { createSlice } from "@reduxjs/toolkit";

export const historySlice = createSlice({
  name: "history",
  initialState: {
    history: [],
  },
  reducers: {
    updateHistory: (state, acion) => {
      state.history = acion.payload;
    },
  },
});

export const { updateHistory } = historySlice.actions;

export const getHistory = (state) => state.history.history;

export default historySlice.reducer;
