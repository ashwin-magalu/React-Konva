import React, { useEffect, useState } from "react";
import { Layer, Line, Stage, Text, Circle } from "react-konva";
import { updateLine, getLine } from "../config/lineSlice";
import { updateCircle, getCircle } from "../config/circleSlice";
import { updateHistory, getHistory } from "../config/historySlice";
import { useDispatch, useSelector } from "react-redux";

const MovableAnchorLine = () => {
  const [x, setX] = useState();
  const [y, setY] = useState();
  const [tool, setTool] = useState("draw"); // setting default tool to be "draw"
  const dispatch = useDispatch(); // creating dispatch variable
  const lines = useSelector(getLine); // creating lines array and assigning values from store
  const circles = useSelector(getCircle); // creating circles array and assigning values from store
  const history = useSelector(getHistory); // creating history array and assigning values from store
  const [id, setId] = useState(0); // setting id for circles

  const handleMouseDown = (e) => {
    if (tool === "draw") {
      const pos = e.target.getStage().getPointerPosition(); // getting present cursor position
      setX(pos.x); // setting x and y values with present cursor position
      setY(pos.y);

      /* Dispatching new circle array to store for updation */
      dispatch(
        updateCircle([...circles, [x, y, x - 10, x + 10, y - 10, y + 10, id]])
      );
      setId(id + 1);
    }
  };

  const handleMouseMove = (e) => {
    /* if (tool === "draw") {
      const pos = e.target.getStage().getPointerPosition();
      setX(pos.x);
      setY(pos.y);
    } */
  };

  const handleMouseUp = () => {
    if (tool === "draw") {
      if (circles.length > 1) {
        /* Getting last two circle's values, t create a line between them */
        let lastTwoPoints = circles.slice(circles.length - 2, circles.length);

        dispatch(
          /* Dispatching new line array to store for updation */
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
    let _x = e.target.attrs.x; // getting present cursor position value and setting it onto x and y
    let _y = e.target.attrs.y;
    let _id = e.target.attrs.id; //getting old circles id using event

    let newCircle = circles.slice(0, circles.length); // copying circles array values to new variable
    /* put old value to history in here */
    /* Updating the x,y co-ordinates of circle in old circles array */
    newCircle[_id] = [_x, _y, _x - 10, _x + 10, _y - 10, _y + 10, _id];
    dispatch(updateCircle(newCircle));

    if (_id === 0) {
      /* Changing first circle's position and line connected to it */
      let newline = lines.slice(0, lines.length);
      newline[_id] = [_x, _y, newCircle[_id + 1][0], newCircle[_id + 1][1]];
      dispatch(updateLine(newline));
    } else if (_id === newCircle.length - 1) {
      /* Changing last circle's position and line connected to it */
      let newline = lines.slice(0, lines.length - 1);
      newline[_id - 1] = [newCircle[_id - 1][0], newCircle[_id - 1][1], _x, _y];
      dispatch(updateLine(newline));
    } else {
      /* Changing middles circle's position and line's connected to it */
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
    /* getting value of line which is going to be removed */
    let deletedLine = lines.slice(lines.length - 1, lines.length);
    /* getting value of circle which is going to be removed */
    let deletedCircle = circles.slice(circles.length - 1, circles.length);
    /* getting value of line which is going to be kept */
    let newline = lines.slice(0, lines.length - 1);
    /* getting value of line which is going to be kept */
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
    /* getting value of circle which is going to be added */
    let addingCircle = newHistory[newHistory.length - 1];
    /* getting value of line which is going to be added */
    let addingLine = newHistory[newHistory.length - 2]; // one for circle and one for line
    /* getting value of history which is going to be kept */
    let latestHistory = newHistory.slice(0, newHistory.length - 2);

    dispatch(updateHistory(latestHistory));
    /* getting value of line which is going to be kept */
    let newLines = lines.slice(0, lines.length);
    /* getting value of circle which is going to be kept */
    let newCircles = circles.slice(0, circles.length);
    let latestLines = [];
    let latestCircles = [];
    /* adding value's of lines which is going to be kept */
    latestLines = newLines.concat(addingLine);
    /* adding value's of circles which is going to be kept */
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
                onDragMove={(e) => nodeUpdate(e)}
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
