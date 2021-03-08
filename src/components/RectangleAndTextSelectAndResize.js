import React, { useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text, Transformer } from "react-konva";

const TransformerComponent = (props) => {
  const transformerRef = useRef();

  const checkNode = () => {
    // here we need to manually attach or detach Transformer node
    const stage = transformerRef.current.getStage();
    const { selectedShapeName } = props;
    let selectedNode = stage.findOne("." + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === transformerRef.current) {
      return;
    }
    if (selectedNode) {
      const type = selectedNode.getType();
      if (type != "Group") {
        selectedNode = selectedNode.findAncestor("Group");
      }
      // attach to another node
      transformerRef.current.attachTo(selectedNode);
    } else {
      // remove transformer
      transformerRef.current.detach();
    }
    transformerRef.current.getLayer().batchDraw();
  };

  useEffect(() => {
    checkNode();
    return () => {};
  }, [checkNode]);

  const onTransformStart = () => {
    console.log("Transformation started");
  };

  const onTransform = () => {
    console.log("Transforming");
  };

  const onTransformEnd = () => {
    console.log("Transformation ended");
  };

  return (
    <Transformer
      ref={transformerRef}
      onTransformStart={onTransformStart}
      onTransform={onTransform}
      onTransformEnd={onTransformEnd}
    />
  );
};

const RectangleAndTextSelectAndResize = () => {
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
    // const rect = this.state.rectangles.find(r => r.name === name);
    if (name) {
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
        <Group
          name="group"
          x={225}
          y={295}
          width={120}
          height={60}
          fill="red"
          draggable
        >
          <Rect
            name="rect"
            fill="red"
            width={100}
            height={50}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
          <Text
            name="text"
            fontSize={16}
            fontFamily="Calibri"
            fill="#555"
            width={100}
            padding={15}
            align="center"
            text="some text"
          />
        </Group>
        <TransformerComponent selectedShapeName={selectedShapeName} />
      </Layer>
    </Stage>
  );
};

export default RectangleAndTextSelectAndResize;
