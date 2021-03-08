import React, { useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Transformer } from "react-konva";

const DragAndSelectShape = () => {
  const [selectRect, setSelectRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  let rectangles = [
    [60, 60, 100, 90, "red", "rect"],
    [250, 100, 150, 90, "green", "rect"],
  ];
  let x1, y1, x2, y2;

  const layerRef = useRef();
  const stageRef = useRef();
  const groupRef = useRef();
  const trRef = useRef();

  const mouseDragStart = (e) => {
    if (e.target.getParent() === trRef.current) {
      return;
    }
    x1 = e.evt.clientX;
    y1 = e.evt.clientY;
    x2 = e.evt.clientX;
    y2 = e.evt.clientY;

    setSelectRect({
      x: x1,
      y: y1,
      width: 0,
      height: 0,
      visible: true,
    });
    //console.log(groupRef.current.getStage());
    groupRef.current.children.toArray().forEach((shape) => {
      const transform = shape.getAbsoluteTransform();
      shape.moveTo(layerRef.current);
      shape.setAttrs(transform.decompose());
    });
    groupRef.current.setAttrs({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    });
    groupRef.current.clearCache();
  };

  const mouseDragMove = (e) => {
    if (!selectRect.visible) {
      return;
    }
    x2 = e.evt.clientX;
    y2 = e.evt.clientY;
    setSelectRect({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      visible: true,
    });
    layerRef.current.batchDraw();
  };

  const mouseDragEnd = (e) => {
    console.log(stageRef.current.pointerPos);
    x2 = e.evt.clientX;
    y2 = e.evt.clientY;
    if (!selectRect.visible) {
      return;
    }
    setTimeout(() => {
      setSelectRect({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
        visible: false,
      });
    });
  };

  return (
    <Stage
      style={{ border: "2px dashed black" }}
      width={window.innerWidth - 5}
      height={window.innerHeight - 5}
      ref={stageRef}
      onMouseDown={(e) => mouseDragStart(e)}
      onMouseMove={mouseDragMove}
      onMouseUp={mouseDragEnd}
    >
      <Layer ref={layerRef}>
        {rectangles.map((rect, i) => (
          <Rect
            key={i}
            x={rect[0]}
            y={rect[1]}
            width={rect[2]}
            height={rect[3]}
            fill={rect[4]}
            name={rect[5]}
            draggable
          />
        ))}
        <Group ref={groupRef}>
          <Transformer ref={trRef} />
          <Rect fill={"rgba(0,0,255,0.5)"} />
        </Group>
      </Layer>
    </Stage>
  );
};

export default DragAndSelectShape;
