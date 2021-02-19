import React, { useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Text } from "react-konva";
import { Spring, animated } from "react-spring/renderprops-konva";

const ColoredRect = () => {
  const [flag, setFlag] = useState(false);

  const handleClick = () => setFlag(!flag);

  return (
    <Spring
      native
      from={{ x: 0, shadowBlur: 0, fill: "rgb(10,50,19)" }}
      to={{
        x: flag ? 150 : 50,
        shadowBlur: flag ? 25 : 5,
        fill: flag ? "seagreen" : "hotpink",
        width: flag ? 300 : 50,
        height: flag ? 300 : 50,
      }}
    >
      {(props) => <animated.Rect {...props} y={50} onClick={handleClick} />}
    </Spring>
  );
};

const Animation = () => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try clicking the rectangle" />
        <ColoredRect />
      </Layer>
    </Stage>
  );
};

export default Animation;
