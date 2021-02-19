import Konva from "konva";
import React from "react";

const WheelZoom = () => {
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

    let circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 50,
      fill: "green",
    });
    layer.add(circle);

    layer.draw();

    let scaleBy = 1.1;
    stage.on("wheel", (e) => {
      e.evt.preventDefault();
      let oldScale = stage.scaleX();

      let pointer = stage.getPointerPosition();

      let mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      /* The deltaY property returns a positive value when scrolling down, and a negative value when scrolling up, otherwise 0 */

      stage.scale({ x: newScale, y: newScale });

      let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    });
  };

  return <div id="container"></div>;
};

export default WheelZoom;
