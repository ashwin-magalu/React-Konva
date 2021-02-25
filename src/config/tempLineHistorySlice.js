import { createSlice } from "@reduxjs/toolkit";

export const tempLineHistorySlice = createSlice({
  name: "tempLineHistory",
  initialState: {
    tempLineHistory: [],
  },
  reducers: {
    updateTempLineHistory: (state, acion) => {
      state.tempLineHistory = acion.payload;
    },
  },
});

export const { updateTempLineHistory } = tempLineHistorySlice.actions;

export const getTempLineHistory = (state) =>
  state.tempLineHistory.tempLineHistory;

export default tempLineHistorySlice.reducer;
