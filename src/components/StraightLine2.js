/* Draws line when mouseUp action is called */
import React, { useRef, useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";

const StraightLine2 = () => {
  const isDrawing = useRef(false);
  const [x1, setX1] = useState();
  const [y1, setY1] = useState();
  const [x2, setX2] = useState();
  const [y2, setY2] = useState();
  const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([]);

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
    setLines([...lines, [x1, y1, x2, y2]]);
    // console.log(lines);
    setX1();
    setX2();
    setY1();
    setY2();
  };

  const undo = () => {
    if (lines.length === 0) {
      return;
    }
    const _lines = lines;
    const _history = history;
    const removedLine = _lines.slice(_lines.length - 1, _lines.length);
    _history.push(removedLine);
    _lines.pop();
    setLines(_lines);
    setHistory(_history);
  };

  const redo = () => {
    if (history.length === 0) {
      return;
    }
    const _lines = lines;
    const _history = history;
    const addingLine = _history.slice(_history.length - 1, _history.length);
    //console.log("addingLine", addingLine[0]);
    addingLine.forEach((add1) => {
      add1.forEach((add2) => {
        _lines.push(add2);
      });
    });
    _history.pop();
    setLines(_lines);
    setHistory(_history);
    /* console.log("lines:", _lines);
    console.log("history:", _history); */
  };

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

export default StraightLine2;
