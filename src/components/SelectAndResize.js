import Konva from "konva";
import React from "react";

const SelectAndResize = () => {
  window.onload = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let stage = new Konva.Stage({
      container: "container",
      width: width,
      height: height,
    });

    // layer for all shapes
    let layer = new Konva.Layer();
    stage.add(layer);
    for (let i = 0; i < 10000; i++) {
      let rect = new Konva.Circle({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 10,
        name: "shape",
        fill: Konva.Util.getRandomColor(),
      });
      layer.add(rect);
    }
    layer.draw();

    // top layer for transforming group
    let topLayer = new Konva.Layer();
    stage.add(topLayer);

    let group = new Konva.Group();
    topLayer.add(group);

    let tr = new Konva.Transformer();
    topLayer.add(tr);

    // add a new feature, lets add ability to draw selection rectangle
    let selectionRectangle = new Konva.Rect({
      fill: "rgba(0,0,255,0.25)",
    });
    topLayer.add(selectionRectangle);

    let x1, y1, x2, y2;
    stage.on("mousedown touchstart", (e) => {
      // do nothing if we mousedown on eny shape
      if (e.target.getParent() === tr) {
        return;
      }
      x1 = stage.getPointerPosition().x;
      y1 = stage.getPointerPosition().y;
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;

      selectionRectangle.setAttrs({
        x: x1,
        y: y1,
        width: 0,
        height: 0,
        visible: true,
      });

      // move old selection back to original layer
      group.children.toArray().forEach((shape) => {
        const transform = shape.getAbsoluteTransform();
        shape.moveTo(layer);
        shape.setAttrs(transform.decompose());
      });
      // reset group transforms
      group.setAttrs({
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      });
      group.clearCache();
      stage.draw();
    });

    stage.on("mousemove touchmove", () => {
      // do nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;

      selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });
      topLayer.batchDraw();
    });

    stage.on("mouseup touchend", () => {
      // no nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      // update visibility in timeout, so we can check it in click event
      setTimeout(() => {
        selectionRectangle.visible(false);
        topLayer.batchDraw();
      });

      let shapes = stage.find(".shape").toArray();
      let box = selectionRectangle.getClientRect();

      // remove all children for better performance
      layer.removeChildren();

      // then check intersections and add all shape into correct container
      shapes.forEach((shape) => {
        let intersected = Konva.Util.haveIntersection(
          box,
          shape.getClientRect()
        );
        if (intersected) {
          group.add(shape);
          shape.stroke("red");
        } else {
          layer.add(shape);
          shape.stroke(null);
        }
      });

      if (group.children.length) {
        tr.nodes([group]);
        group.cache();
      }

      stage.batchDraw();
    });

    // clicks should select/deselect shapes
    stage.on("click tap", (e) => {
      // if we are selecting with rect, do nothing
      if (selectionRectangle.visible()) {
        return;
      }

      // if click on empty area - remove all selections
      if (e.target === stage) {
        tr.nodes([]);
        stage.draw();
        return;
      }
    });
  };

  return <div id="container"></div>;
};

export default SelectAndResize;
