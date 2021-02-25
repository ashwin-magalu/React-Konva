import { createSlice } from "@reduxjs/toolkit";

export const circleSlice = createSlice({
  name: "circles",
  initialState: {
    circles: [],
  },
  reducers: {
    updateCircle: (state, acion) => {
      state.circles = acion.payload;
    },
  },
});

export const { updateCircle } = circleSlice.actions;

export const getCircle = (state) => state.circles.circles;

export default circleSlice.reducer;
