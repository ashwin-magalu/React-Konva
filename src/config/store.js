import { configureStore } from "@reduxjs/toolkit";
import lineReducer from "./lineSlice";
import tempLineReducer from "./tempLineSlice";
import circleReducer from "./circleSlice";
import historyReducer from "./historySlice";
import tempLineHistoryReducer from "./tempLineHistorySlice";

export default configureStore({
  reducer: {
    lines: lineReducer,
    tempLine: tempLineReducer,
    circles: circleReducer,
    history: historyReducer,
    tempLineHistory: tempLineHistoryReducer,
  },
});
