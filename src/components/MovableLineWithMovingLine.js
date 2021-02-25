import React, { useEffect, useState } from "react";
import { Layer, Line, Stage, Text, Circle } from "react-konva";
import { updateLine, getLine } from "../config/lineSlice";
import { updateTempLine, getTempLine } from "../config/tempLineSlice";
import { updateCircle, getCircle } from "../config/circleSlice";
import { updateHistory, getHistory } from "../config/historySlice";
import {
  updateTempLineHistory,
  getTempLineHistory,
} from "../config/tempLineHistorySlice";
import { useDispatch, useSelector } from "react-redux";

const MovableLineWithMovingLine = () => {
  const [x, setX] = useState();
  const [y, setY] = useState();
  const [tool, setTool] = useState("draw"); // setting default tool to be "draw"
  const dispatch = useDispatch(); // creating dispatch variable
  const lines = useSelector(getLine); // creating lines array and assigning values from store
  const tempLine = useSelector(getTempLine); // creating temp lines array and assigning values from store
  const circles = useSelector(getCircle); // creating circles array and assigning values from store
  const history = useSelector(getHistory); // creating history array and assigning values from store
  const tempLineHistory = useSelector(getTempLineHistory); // creating temporary line history array and assigning values from store
  const [id, setId] = useState(0); // setting id for circles

  const handleMouseDown = (e) => {
    let _id = e.target.attrs.id; //getting old circles id using event
    if (tool === "draw") {
      const pos = e.target.getStage().getPointerPosition(); // getting present cursor position
      setX(pos.x); // setting x and y values with present cursor position
      setY(pos.y);
      let oldCircle = circles.slice(0, circles.length);
      if (_id === 0) {
        oldCircle.push([
          oldCircle[0][0],
          oldCircle[0][1],
          oldCircle[0][2],
          oldCircle[0][3],
          oldCircle[0][4],
          oldCircle[0][5],
          id,
        ]);
      } else {
        oldCircle.push([x, y, x - 10, x + 10, y - 10, y + 10, id]);
      }
      // console.log(oldCircle);
      dispatch(
        /* Dispatching new circle array to store for updation */
        updateCircle(oldCircle)
      );

      setId(id + 1);
    }
  };

  const handleMouseMove = (e) => {
    if (tool === "draw") {
      const pos = e.target.getStage().getPointerPosition();
      setX(pos.x);
      setY(pos.y);
      if (circles.length > 0) {
        /* loading last circle's data */
        let lastPoint = circles[circles.length - 1];
        /* dispatching temporary line's positions */
        dispatch(updateTempLine([lastPoint[0], lastPoint[1], pos.x, pos.y]));
      }
    }
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
      /* setting temporary lines data to [], so it won't affect next temporary line */
      dispatch(updateTempLine([]));
    }
  };

  const nodeUpdate = (e) => {
    if (tool === "selection") {
      let _x = e.target.attrs.x; // getting present cursor position value and setting it onto x
      let _y = e.target.attrs.y; // getting present cursor position value and setting it onto y
      let _id = e.target.attrs.id; //getting old circles id using event

      // copying circles array values to new variable
      let newCircle = circles.slice(0, circles.length);
      /* put old value to history in here, as of now it can't be done */
      /* Updating the x,y co-ordinates of circle in old circles array */
      newCircle[_id] = [_x, _y, _x - 10, _x + 10, _y - 10, _y + 10, _id];
      dispatch(updateCircle(newCircle));

      if (circles.length > 1) {
        // allows dragging only single circle created without line
        if (_id === 0) {
          /* Changing first circle's position and line connected to it */
          let newline = lines.slice(0, lines.length);
          newline[_id] = [_x, _y, newCircle[_id + 1][0], newCircle[_id + 1][1]];
          dispatch(updateLine(newline));
        } else if (_id === newCircle.length - 1) {
          /* Changing last circle's position and line connected to it */
          let newline = lines.slice(0, lines.length - 1);
          newline[_id - 1] = [
            newCircle[_id - 1][0],
            newCircle[_id - 1][1],
            _x,
            _y,
          ];
          dispatch(updateLine(newline));
        } else {
          /* Changing middles circle's position and line's connected to it */
          let newline = lines.slice(0, lines.length);
          newline[_id - 1] = [
            newCircle[_id - 1][0],
            newCircle[_id - 1][1],
            _x,
            _y,
          ];
          newline[_id] = [_x, _y, newCircle[_id + 1][0], newCircle[_id + 1][1]];
          dispatch(updateLine(newline));
        }
      }
    }
  };

  const reset = () => {
    dispatch(updateTempLine([]));
    dispatch(updateLine([]));
    dispatch(updateCircle([]));
    dispatch(updateHistory([]));
  };

  const undo = () => {
    if (lines.length === 0 || circles.length === 0) {
      return;
    } else {
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
      dispatch(updateTempLineHistory(tempLine));
      dispatch(
        updateTempLine([
          lines[lines.length - 1][0],
          lines[lines.length - 1][1],
          tempLine[2],
          tempLine[3],
        ])
      );
    }
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
    dispatch(updateTempLine(tempLineHistory));
    dispatch(updateTempLineHistory([]));
  };

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
        undo();
      } else if (event.ctrlKey && (event.key === "y" || event.key === "Y")) {
        redo();
      }
    };

    const drawSelect = (event) => {
      if (event.key === "p" || event.key === "P") {
        changeTool();
      } else if (event.key === "v" || event.key === "V") {
        changeTool();
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    document.addEventListener("keydown", drawSelect);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
      document.removeEventListener("keydown", drawSelect);
    };
  }, [undo, redo]);

  const changeTool = () => {
    if (tool === "draw") {
      setTool("selection");
      dispatch(updateTempLineHistory(tempLine));
      dispatch(updateTempLine([]));
    } else {
      setTool("draw");
      dispatch(updateTempLine(tempLineHistory));
      dispatch(updateTempLineHistory([]));
    }
  };

  return (
    <div>
      <input
        type="radio"
        id="selection"
        checked={tool === "selection"}
        onChange={changeTool}
      />
      <label htmlFor="selection">Selection</label>
      <input
        type="radio"
        id="draw"
        checked={tool === "draw"}
        onChange={changeTool}
      />
      <label htmlFor="draw">Draw</label>
      <button
        onClick={undo}
        style={{
          padding: "5px 15px",
          background: "red",
          color: "white",
          margin: "5px",
          outlineWidth: 0,
          border: "1px solid black",
          borderRadius: "999px",
          boxShadow: "2px 2px 3px 1px rgba(0,0,0,0.3)",
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
          outlineWidth: 0,
          border: "1px solid black",
          borderRadius: "999px",
          boxShadow: "2px 2px 3px 1px rgba(0,0,0,0.3)",
        }}
      >
        Redo
      </button>
      <button
        onClick={reset}
        style={{
          padding: "5px 15px",
          background: "dimgray",
          color: "white",
          margin: "5px",
          outlineWidth: 0,
          border: "1px solid black",
          borderRadius: "999px",
          boxShadow: "2px 2px 3px 1px rgba(0,0,0,0.3)",
        }}
      >
        Reset
      </button>
      <Stage
        style={{ border: "2px dashed black" }}
        width={window.innerWidth - 30}
        height={window.innerHeight - 45}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMousemove={handleMouseMove}
      >
        <Layer>
          {/* <Text text="Start drawing" x={25} y={30} /> */}
          <Line
            key={Math.abs(Math.random() * 12345)}
            points={tempLine}
            //stroke="#df4b26"
            stroke="#959595"
            strokeWidth={1}
            tension={0.5}
            lineCap="round"
          />
          {lines.map((line) => (
            <>
              <Line
                key={Math.abs(Math.random() * 12345)}
                points={line}
                //stroke="#df4b26"
                stroke="#959595"
                strokeWidth={1}
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
                radius={4}
                stroke={"#adb5bd"}
                fill={"#adb5bd"}
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

export default MovableLineWithMovingLine;
