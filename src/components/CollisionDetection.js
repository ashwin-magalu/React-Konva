import Konva from "konva";
import React from "react";

const CollisionDetection = () => {
  window.onload = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let stage = new Konva.Stage({
      container: "container",
      width: width,
      height: height,
    });

    let layer = new Konva.Layer();
    stage.add(layer);

    const createShape = () => {
      // Create a group
      let group = new Konva.Group({
        x: Math.random() * width,
        y: Math.random() * height,
        draggable: true,
      });
      // Create a shape
      let shape = new Konva.Rect({
        width: 30 + Math.random() * 30,
        height: 30 + Math.random() * 30,
        fill: "lightgray",
        rotation: 360 * Math.random(),
        name: "fillShape",
      });
      group.add(shape);

      let boundingBox = shape.getClientRect({ relativeTo: group });
      // Creating a red bounding box
      let box = new Konva.Rect({
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
        stroke: "red",
        strokeWidth: 1,
      });
      // Adding bounding box to shapes
      group.add(box);
      return group;
    };

    for (let i = 0; i < 10; i++) {
      layer.add(createShape());
      // Creates 10 rectangular boxes
    }
    // Draw those designs on screen
    layer.draw();

    // Moving designs
    layer.on("dragmove", (e) => {
      let target = e.target; // shape, which is being dragged
      let targetRect = e.target.getClientRect(); // design on which the shape is dragged
      layer.children.each((group) => {
        // do not check intersection with itself
        if (group === target) {
          return;
        }
        // check intersection with another shape
        if (haveIntersection(group.getClientRect(), targetRect)) {
          // (dragged rectangle, target rectangle)
          group.findOne(".fillShape").fill("red"); // finding by name
        } else {
          group.findOne(".fillShape").fill("lightgray");
        }
        // do not need to call layer.draw() here
        // because it will be called by dragmove action
      });
    });

    const haveIntersection = (draggedRectangle, targetRectangle) => {
      // Only returns the value if there is an intersection
      return !(
        targetRectangle.x > draggedRectangle.x + draggedRectangle.width ||
        targetRectangle.x + targetRectangle.width < draggedRectangle.x ||
        targetRectangle.y > draggedRectangle.y + draggedRectangle.height ||
        targetRectangle.y + targetRectangle.height < draggedRectangle.y
      );
    };
  };

  return <div id="container"></div>;
};

export default CollisionDetection;
