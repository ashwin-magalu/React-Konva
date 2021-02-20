import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Stage, Text, Circle } from "react-konva";
import { updateLine, getLine } from "../config/lineSlice";
import { updateCircle, getCircle } from "../config/circleSlice";
import { updateHistory, getHistory } from "../config/historySlice";
import { useDispatch, useSelector } from "react-redux";

const MovableAnchorLine = () => {
  const [x, setX] = useState();
  const [y, setY] = useState();
  const [tool, setTool] = useState("draw");
  const dispatch = useDispatch();
  const lines = useSelector(getLine);
  const circles = useSelector(getCircle);
  const history = useSelector(getHistory);
  const [id, setId] = useState(0);

  const handleMouseDown = (e) => {
    if (tool === "draw") {
      const pos = e.target.getStage().getPointerPosition();
      setX(pos.x);
      setY(pos.y);

      dispatch(
        updateCircle([...circles, [x, y, x - 10, x + 10, y - 10, y + 10, id]])
      );
      setId(id + 1);
    }
  };

  const handleMouseMove = (e) => {
    if (tool === "draw") {
      const pos = e.target.getStage().getPointerPosition();
      setX(pos.x);
      setY(pos.y);
    }
  };

  const handleMouseUp = () => {
    if (tool === "draw") {
      if (circles.length > 1) {
        let lastTwoPoints = circles.slice(circles.length - 2, circles.length);

        dispatch(
          updateLine([
            ...lines,
            [
              lastTwoPoints[0][0],
              lastTwoPoints[0][1],
              lastTwoPoints[1][0],
              lastTwoPoints[1][1],
            ],
          ])
        );
      }
      setX();
      setX();
    }
  };

  const nodeUpdate = (e) => {
    let _x = e.target.attrs.x;
    let _y = e.target.attrs.y;
    let _id = e.target.attrs.id;
    let newCircle = circles.slice(0, circles.length);
    newCircle[_id] = [_x, _y, _x - 10, _x + 10, _y - 10, _y + 10, _id];
    dispatch(updateCircle(newCircle));

    if (_id === 0) {
      let newline = lines.slice(0, lines.length);
      newline[_id] = [_x, _y, newCircle[_id + 1][0], newCircle[_id + 1][1]];
      dispatch(updateLine(newline));
    } else if (_id === newCircle.length - 1) {
      let newline = lines.slice(0, lines.length - 1);
      newline[_id - 1] = [newCircle[_id - 1][0], newCircle[_id - 1][1], _x, _y];
      dispatch(updateLine(newline));
    } else {
      let newline = lines.slice(0, lines.length);
      newline[_id - 1] = [newCircle[_id - 1][0], newCircle[_id - 1][1], _x, _y];
      newline[_id] = [_x, _y, newCircle[_id + 1][0], newCircle[_id + 1][1]];
      dispatch(updateLine(newline));
    }
  };

  const undo = () => {
    if (lines.length === 0 || circles.length === 0) {
      return;
    }
    let deletedLine = lines.slice(lines.length - 1, lines.length);
    let deletedCircle = circles.slice(circles.length - 1, circles.length);
    let newline = lines.slice(0, lines.length - 1);
    let newCircle = circles.slice(0, circles.length - 1);

    dispatch(updateLine(newline));
    dispatch(updateCircle(newCircle));
    dispatch(updateHistory([...history, deletedLine, deletedCircle]));
  };

  const redo = () => {
    if (history.length === 0) {
      return;
    }

    let newHistory = [];
    history.forEach((history1) => {
      newHistory.push(history1);
    });
    let addingCircle = newHistory[newHistory.length - 1];
    let addingLine = newHistory[newHistory.length - 2];
    let latestHistory = newHistory.slice(0, newHistory.length - 2);

    dispatch(updateHistory(latestHistory));

    let newLines = lines.slice(0, lines.length);
    let newCircles = circles.slice(0, circles.length);
    let latestLines = [];
    let latestCircles = [];
    latestLines = newLines.concat(addingLine);
    latestCircles = newCircles.concat(addingCircle);

    dispatch(updateLine(latestLines));
    dispatch(updateCircle(latestCircles));
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
      <input
        type="radio"
        id="selection"
        checked={tool === "selection"}
        onChange={() => setTool("selection")}
      />
      <label htmlFor="selection">Selection</label>
      <input
        type="radio"
        id="draw"
        checked={tool === "draw"}
        onChange={() => setTool("draw")}
      />
      <label htmlFor="draw">Draw</label>
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
          <Text text="Start drawing" x={25} y={30} />
          {lines.map((line) => (
            <>
              <Line
                key={Math.abs(Math.random() * 12345)}
                points={line}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
              />
            </>
          ))}
          {circles.map((circle) => (
            <>
              <Circle
                key={circle[6]}
                x={circle[0]}
                y={circle[1]}
                radius={8}
                stroke={"black"}
                fill={"white"}
                strokeWidth={2}
                draggable
                onDragEnd={(e) => nodeUpdate(e)}
                id={circle[6]}
              />
            </>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MovableAnchorLine;
