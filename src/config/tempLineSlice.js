import { createSlice } from "@reduxjs/toolkit";

export const tempLineSlice = createSlice({
  name: "tempLine",
  initialState: {
    tempLine: [],
  },
  reducers: {
    updateTempLine: (state, acion) => {
      state.tempLine = acion.payload;
    },
  },
});

export const { updateTempLine } = tempLineSlice.actions;

export const getTempLine = (state) => state.tempLine.tempLine;

export default tempLineSlice.reducer;
