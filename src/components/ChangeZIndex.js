import React, { useState } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Circle } from "react-konva";

function generateItems() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      id: "node-" + i,
      color: Konva.Util.getRandomColor(),
    });
  }
  return items;
}

const ChangeZIndex = () => {
  const [items, setItems] = useState(generateItems());

  const handleDragStart = (e) => {
    const id = e.target.name();
    const items = items.slice();
    const item = items.find((i) => i.id === id);
    const index = items.indexOf(item);
    // remove from the list:
    items.splice(index, 1);
    // add to the top
    items.push(item);
    setItems(items);
  };

  const onDragEnd = (e) => {
    const id = e.target.name();
    const items = items.slice();
    const item = items.find((i) => i.id === id);
    const index = items.indexOf(item);
    // update item position
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    setItems(items);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {items.map((item) => (
          <Circle
            key={item.id}
            name={item.id}
            draggable
            x={item.x}
            y={item.y}
            fill={item.color}
            radius={50}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default ChangeZIndex;
