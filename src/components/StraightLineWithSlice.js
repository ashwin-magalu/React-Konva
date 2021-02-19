/* Draws line when mouseUp action is called */
import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";
import { updateLine, getLine } from "../config/lineSlice";
import { updateHistory, getHistory } from "../config/historySlice";
import { useDispatch, useSelector } from "react-redux";

const StraightLineWithSlice = () => {
  const isDrawing = useRef(false);
  const [x1, setX1] = useState();
  const [y1, setY1] = useState();
  const [x2, setX2] = useState();
  const [y2, setY2] = useState();
  /* const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([]); */
  const dispatch = useDispatch();
  const lines = useSelector(getLine);
  const history = useSelector(getHistory);

  const handleMouseDown = (e) => {
    isDrawing.current = !isDrawing;
    const pos = e.target.getStage().getPointerPosition();
    setX1(pos.x);
    setY1(pos.y);
  };

  const handleMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    setX2(pos.x);
    setY2(pos.y);
  };

  const handleMouseUp = () => {
    isDrawing.current = !isDrawing;
    //setLines([...lines, [x1, y1, x2, y2]]);
    dispatch(updateLine([...lines, [x1, y1, x2, y2]]));
    //console.log(lines);
    setX1();
    setX2();
    setY1();
    setY2();
  };

  const undo = () => {
    if (lines.length === 0) {
      return;
    }
    let deleted = lines.slice(lines.length - 1, lines.length);
    let newline = lines.slice(0, lines.length - 1);
    dispatch(updateLine(newline));
    //console.log(newline);
    dispatch(updateHistory([...history, deleted]));
    //console.log(history);
  };

  const redo = () => {
    if (history.length === 0) {
      return;
    }

    let newHistory = [];
    history.forEach((history1) => {
      newHistory.push(history1);
    });
    let adding = newHistory[newHistory.length - 1];
    let latestHistory = newHistory.slice(0, newHistory.length - 1);
    dispatch(updateHistory(latestHistory));

    let newLines = lines.slice(0, lines.length);
    let latestLines = [];
    latestLines = newLines.concat(adding);
    dispatch(updateLine(latestLines));
    //console.log(latestLines);
  };

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
        undo();
      } else if (event.ctrlKey && (event.key === "y" || event.key === "Y")) {
        redo();
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  return (
    <div>
      <button
        onClick={undo}
        style={{
          padding: "5px 15px",
          background: "red",
          color: "white",
          margin: "5px",
        }}
      >
        Undo
      </button>
      <button
        onClick={redo}
        style={{
          padding: "5px 15px",
          background: "green",
          color: "white",
          margin: "5px",
        }}
      >
        Redo
      </button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMousemove={handleMouseMove}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <>
              <Line
                key={i}
                points={line}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            </>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default StraightLineWithSlice;
