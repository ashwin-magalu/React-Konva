import jsPDF from "jspdf";
import Konva from "konva";
import React from "react";

const SavePdf = () => {
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

    let back = new Konva.Rect({
      width: stage.width(),
      height: stage.height(),
      fill: "#f8f8f8",
    });
    layer.add(back);

    let text = new Konva.Text({
      text: "This is the Darth Vader",
      x: 15,
      y: 40,
      rotation: -10,
      filters: [Konva.Filters.Blur],
      blurRadius: 4,
      fontSize: 18,
    });
    text.cache();
    layer.add(text);

    let arrow = new Konva.Arrow({
      points: [70, 50, 100, 80, 150, 100, 190, 100],
      tension: 0.5,
      stroke: "black",
      fill: "black",
    });
    layer.add(arrow);
    layer.draw();

    // alternative API:
    Konva.Image.fromURL(
      "https://konvajs.org//assets/darth-vader.jpg",
      function (darthNode) {
        darthNode.setAttrs({
          x: 200,
          y: 50,
          scaleX: 0.75,
          scaleY: 0.75,
        });
        layer.add(darthNode);
        layer.batchDraw();
      }
    );

    document.getElementById("save").addEventListener("click", () => {
      let pdf = new jsPDF("l", "px", [stage.width(), stage.height()]);
      pdf.setTextColor("#000000");
      // first add texts
      stage.find("Text").forEach((text) => {
        const size = text.fontSize() / 0.75; // convert pixels to points
        pdf.setFontSize(size);
        pdf.text(text.text(), text.x(), text.y(), {
          baseline: "top",
          angle: -text.getAbsoluteRotation(),
        });
      });

      // then put image on top of texts (so texts are not visible)
      pdf.addImage(
        stage.toDataURL({ pixelRatio: 2 }),
        0,
        0,
        stage.width(),
        stage.height()
      );

      pdf.save("canvas.pdf");
    });
  };

  return (
    <div>
      <button id="save">Save as PDF</button>
      <div id="container"></div>
    </div>
  );
};

export default SavePdf;
