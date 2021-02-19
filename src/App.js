import React from "react";
import "./App.css";
import Animation from "./components/Animation";
import BasicShapes from "./components/BasicShapes";
import ChangeZIndex from "./components/ChangeZIndex";
import CollisionDetection from "./components/CollisionDetection";
import CustomShapes from "./components/CustomShapes";
import DragAndDrop from "./components/DragAndDrop";
import DropImage from "./components/DropImage";
import ExportImage from "./components/ExportImage";
import FreeDrawing from "./components/FreeDrawing";
import GenerateShapes from "./components/GenerateShapes";
import Grid from "./components/Grid";
import GuideLine from "./components/GuideLine";
import ImageResize from "./components/ImageResize";
import Mirror from "./components/Mirror";
import ModifyCurves from "./components/ModifyCurves";
import ResizeAndRotate from "./components/ResizeAndRotate";
import SavePdf from "./components/SavePdf";
import SelectAndResize from "./components/SelectAndResize";
import StraightLine from "./components/StraightLine";
import StraightLine2 from "./components/StraightLine2";
import StraightLineWithSlice from "./components/StraightLineWithSlice";
import UndoRedo from "./components/UndoRedo";
import WheelZoom from "./components/WheelZoom";
import ZIndex from "./components/ZIndex";
import ZoomInAnOut from "./components/ZoomInAnOut";

function App() {
  return (
    <div className="App">
      {/* <GenerateShapes /> */}
      {/* <BasicShapes /> */}
      {/* <CustomShapes /> */}
      {/* <DragAndDrop /> */}
      {/* <ZoomInAnOut /> */}
      {/* <ResizeAndRotate /> */}
      {/* <Animation /> */}
      {/* <ZIndex /> */}
      {/* <ExportImage /> */}
      {/* <UndoRedo /> */}
      {/* <ChangeZIndex /> */}
      {/* <DropImage /> */}
      {/* <FreeDrawing /> */}
      {/* <Grid /> */}
      {/* <GuideLine /> */}
      {/* <Mirror /> */}
      {/* <SelectAndResize /> */}
      {/* <ImageResize /> */}
      {/* <ModifyCurves /> */}
      {/* <CollisionDetection /> */}
      {/* <WheelZoom /> */}
      {/* <SavePdf /> */}
      {/* <StraightLine /> */}
      {/* <StraightLine2 /> */}
      <StraightLineWithSlice />
    </div>
  );
}

export default App;
