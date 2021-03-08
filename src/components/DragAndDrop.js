import React, { useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Text } from "react-konva";

const DragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  const dragEnd = (e) => {
    setIsDragging(false);
    // Update x and y values based on latest position data
    setX(e.target._lastPos.x);
    setY(e.target._lastPos.y);
    // console.log(e.target);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text
          text="Draggable Text"
          x={x}
          y={y}
          draggable
          fill={isDragging ? "green" : "black"}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e) => dragEnd(e)}
        />
      </Layer>
    </Stage>
  );
};

export default DragAndDrop;
