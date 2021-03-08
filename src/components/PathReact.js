import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Path, Transformer } from "react-konva";

const PathReact = () => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const paths = [
    {
      data:
        "M331,183.5625L794,102.5625C794,122.6625 1018.1,303.5625 1043,303.5625L827,616.5625L419,570.5625L331,183.5625",
      id: 1,
      name: "path",
    },
    {
      data:
        "M165,64.5625L310,152.5625L211,205.5625L125,169.5625C125,159 161,64.5625 165,64.5625",
      id: 2,
      name: "path",
    },
  ];

  return (
    <div>
      <Stage
        style={{ border: "2px dashed black" }}
        width={window.innerWidth - 5}
        height={window.innerHeight - 5}
      >
        <Layer>
          {paths.map((path) => (
            <Path
              x={50}
              y={50}
              fill={"#F4ECF7"}
              scale={{
                x: 1,
                y: 1,
              }}
              data={path.data}
              draggable
              key={path.id}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default PathReact;
