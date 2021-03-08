import React, { Fragment, useRef, useEffect, useState } from "react";
import { Stage, Layer, Transformer, Path } from "react-konva";

const Shape = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Fragment>
      <Path
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        fill={"#F4ECF7"}
        scale={{
          x: 1,
          y: 1,
        }}
      />
      {isSelected && (
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
      )}
    </Fragment>
  );
};

const initialPaths = [
  {
    data:
      "M331,183.5625L794,102.5625C794,122.6625 1018.1,303.5625 1043,303.5625L827,616.5625L419,570.5625L331,183.5625",
    id: 1,
    name: "path",
    x: 331,
    y: 13.5625,
  },
  {
    data:
      "M165,64.5625L310,152.5625L211,205.5625L125,169.5625C125,159 161,64.5625 165,64.5625",
    id: 2,
    name: "path",
    x: 165,
    y: 64.5625,
  },
];

const PathWithSelect = () => {
  const [shapes, setShapes] = useState(initialPaths);
  const [selectedId, setSelectedId] = useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <Stage
      style={{ border: "2px dashed black" }}
      width={window.innerWidth - 5}
      height={window.innerHeight - 5}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {shapes.map((shape, i) => {
          return (
            <Shape
              key={i}
              shapeProps={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => {
                setSelectedId(shape.id);
              }}
              onChange={(newAttrs) => {
                const _shapes = shapes.slice();
                // slice() method makes a (shallow) copy of an array, Calling it with no arguments just copies the entire array.
                _shapes[i] = newAttrs;
                setShapes(_shapes);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default PathWithSelect;
