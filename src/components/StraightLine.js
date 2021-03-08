/* Draws line when mouseUp action is called */
import React, { useRef, useState } from "react";
import { Layer, Line, Stage, Text } from "react-konva";

const StraightLine = () => {
  const isDrawing = useRef(false);
  const [x1, setX1] = useState();
  const [y1, setY1] = useState();
  const [x2, setX2] = useState();
  const [y2, setY2] = useState();
  const [lines, setLines] = useState([]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
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
    isDrawing.current = false;
    setLines([...lines, [x1, y1, x2, y2]]);
    console.log(lines);
    setX1();
    setX2();
    setY1();
    setY2();
  };

  return (
    <div>
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
            <Line
              key={i}
              points={line}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default StraightLine;
