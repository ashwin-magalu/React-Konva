import React, { useEffect, useRef } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";

const ColoredRect = () => {
  const handleTransform = () => {
    console.log("Transformed");
    // we can read attrs here and send them to store
  };

  const handleClick = () => {};

  return (
    <Rect
      name="rectangle-name"
      x={120}
      y={120}
      width={50}
      height={50}
      fill="red"
      draggable
      onClick={handleClick}
      onTransform={handleTransform}
    />
  );
};

const Handler = () => {
  const transformerRef = useRef();

  useEffect(() => {
    console.log(transformerRef.current.getStage());
    const stage = transformerRef.current.getStage();
    const rectangle = stage.findOne(".rectangle-name");
    transformerRef.current.attachTo(rectangle);
    transformerRef.current.getLayer().batchDraw();
    return () => {
      //
    };
  }, []);

  return <Transformer ref={transformerRef} />;
};

const RectangleSelectAndResize = () => {
  return (
    <Stage width={window.innerWidth - 5} height={window.innerHeight - 5}>
      <Layer>
        <ColoredRect />
        <Handler />
      </Layer>
    </Stage>
  );
};

export default RectangleSelectAndResize;
