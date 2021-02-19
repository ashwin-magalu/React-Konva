import { createSlice } from "@reduxjs/toolkit";

export const lineSlice = createSlice({
  name: "lines",
  initialState: {
    lines: [],
  },
  reducers: {
    updateLine: (state, acion) => {
      state.lines = acion.payload;
    },
  },
});

export const { updateLine } = lineSlice.actions;

export const getLine = (state) => state.lines.lines;

export default lineSlice.reducer;
