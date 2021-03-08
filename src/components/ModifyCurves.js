import Konva from "konva";
import React from "react";

const ModifyCurves = () => {
  window.onload = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    // function to build anchor point
    const buildAnchor = (x, y) => {
      let anchor = new Konva.Circle({
        x: x,
        y: y,
        radius: 10,
        stroke: "#666",
        fill: "#fff",
        strokeWidth: 2,
        draggable: true,
      });
      layer.add(anchor);

      // add hover styling
      anchor.on("mouseover", () => {
        document.body.style.cursor = "pointer";
        anchor.strokeWidth(3);
        anchor.fill("red");
        layer.draw();
      });
      anchor.on("mouseout", () => {
        document.body.style.cursor = "default";
        anchor.strokeWidth(2);
        anchor.fill("#fff");
        layer.draw();
      });

      anchor.on("dragmove", function () {
        updateDottedLines();
      });

      return anchor;
    };

    let stage = new Konva.Stage({
      container: "container",
      width: width,
      height: height,
    });

    let layer = new Konva.Layer();
    stage.add(layer);

    // function to update line points from anchors
    const updateDottedLines = () => {
      let q = quad;
      let b = bezier;

      let quadLinePath = layer.findOne("#quadLinePath");
      let bezierLinePath = layer.findOne("#bezierLinePath");

      quadLinePath.points([
        q.start.x(),
        q.start.y(),
        q.control.x(),
        q.control.y(),
        q.end.x(),
        q.end.y(),
      ]);

      bezierLinePath.points([
        b.start.x(),
        b.start.y(),
        b.control1.x(),
        b.control1.y(),
        b.control2.x(),
        b.control2.y(),
        b.end.x(),
        b.end.y(),
      ]);
      layer.draw();
    };

    // we will use custom shape for curve
    let quadraticLine = new Konva.Shape({
      stroke: "red",
      strokeWidth: 4,
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(quad.start.x(), quad.start.y());
        ctx.quadraticCurveTo(
          quad.control.x(),
          quad.control.y(),
          quad.end.x(),
          quad.end.y()
        );
        ctx.fillStrokeShape(shape);
      },
    });
    layer.add(quadraticLine);

    // we will use custom shape for curve
    let bezierLine = new Konva.Shape({
      stroke: "blue",
      strokeWidth: 5,
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(bezier.start.x(), bezier.start.y());
        ctx.bezierCurveTo(
          bezier.control1.x(),
          bezier.control1.y(),
          bezier.control2.x(),
          bezier.control2.y(),
          bezier.end.x(),
          bezier.end.y()
        );
        ctx.fillStrokeShape(shape);
      },
    });
    layer.add(bezierLine);

    /* Dashed lines */
    let quadLinePath = new Konva.Line({
      dash: [10, 10, 0, 10],
      strokeWidth: 3,
      stroke: "black",
      lineCap: "round",
      id: "quadLinePath",
      opacity: 0.3,
      points: [0, 0],
    });
    layer.add(quadLinePath);

    /* Dashed lines */
    let bezierLinePath = new Konva.Line({
      dash: [10, 10, 0, 10],
      strokeWidth: 3,
      stroke: "black",
      lineCap: "round",
      id: "bezierLinePath",
      opacity: 0.3,
      points: [0, 0],
    });
    layer.add(bezierLinePath);

    // special objects to save references to anchors
    let quad = {
      start: buildAnchor(60, 30),
      control: buildAnchor(240, 110),
      end: buildAnchor(80, 160),
    };

    let bezier = {
      start: buildAnchor(280, 20),
      control1: buildAnchor(530, 40),
      control2: buildAnchor(480, 150),
      end: buildAnchor(300, 150),
    };

    updateDottedLines();
  };

  return <div id="container"></div>;
};

export default ModifyCurves;
