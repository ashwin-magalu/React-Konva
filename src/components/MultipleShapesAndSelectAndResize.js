import React, { useEffect, useRef, useState } from "react";
import { Arrow, Layer, Rect, Stage, Transformer } from "react-konva";

const Rectangle = (props) => {
  return (
    <Rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      fill={props.fill}
      name={props.name}
      draggable
    />
  );
};

const KArrow = (props) => {
  return (
    <Arrow
      x={props.x}
      y={props.y}
      pointerWidth={props.width}
      pointerLength={props.height}
      fill={props.fill}
      name={props.name}
      draggable
    />
  );
};

const TransformerComponent = ({ selectedShapeName }) => {
  const trRef = useRef();
  const checkNode = () => {
    // here we need to manually attach or detach Transformer node
    const stage = trRef.current.getStage();

    const selectedNode = stage.findOne("." + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === trRef.current) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      trRef.current.attachTo(selectedNode);
    } else {
      // remove transformer
      trRef.current.detach();
    }
    trRef.current.getLayer().batchDraw();
  };

  useEffect(() => {
    checkNode();
    return () => {
      //
    };
  }, [checkNode]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        // limit resize
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

const MultipleShapesAndSelectAndResize = () => {
  const [rectangles] = useState([
    { x: 10, y: 10, width: 100, height: 100, fill: "red", name: "rect1" },
    { x: 150, y: 150, width: 100, height: 100, fill: "green", name: "rect2" },
  ]);
  const [arrows] = useState([
    { x: 500, y: 200, width: 200, height: 200, fill: "green", name: "arrow1" },
    { x: 700, y: 400, width: 200, height: 200, fill: "red", name: "arrow2" },
  ]);
  const [selectedShapeName, setSelectedShapeName] = useState("");

  const handleStageMouseDown = (e) => {
    // clicked on stage - clear selection
    if (e.target === e.target.getStage()) {
      setSelectedShapeName("");
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const shapes = [rectangles, arrows];
    const shape = shapes.find((shape) => shape.name === name);
    if (shape) {
      setSelectedShapeName(name);
    } else {
      setSelectedShapeName("");
    }
  };

  return (
    <Stage
      width={window.innerWidth - 5}
      height={window.innerHeight - 5}
      onMouseDown={handleStageMouseDown}
    >
      <Layer>
        {rectangles.map((rect, i) => (
          <Rectangle key={i} {...rect} />
        ))}
        {arrows.map((arrow, i) => (
          <KArrow key={i} {...arrow} />
        ))}
        <TransformerComponent selectedShapeName={selectedShapeName} />
      </Layer>
    </Stage>
  );
};

export default MultipleShapesAndSelectAndResize;
