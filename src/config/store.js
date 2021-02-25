import { configureStore } from "@reduxjs/toolkit";
import lineReducer from "./lineSlice";
import circleReducer from "./circleSlice";
import historyReducer from "./historySlice";

export default configureStore({
  reducer: {
    lines: lineReducer,
    circles: circleReducer,
    history: historyReducer,
  },
});
