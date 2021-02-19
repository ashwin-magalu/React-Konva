import { configureStore } from "@reduxjs/toolkit";
import lineReducer from "./lineSlice";
import historyReducer from "./historySlice";

export default configureStore({
  reducer: {
    lines: lineReducer,
    history: historyReducer,
  },
});
