import Konva from "konva";
import React from "react";

const Mirror = () => {
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

    let text1 = new Konva.Text({
      x: 280,
      y: 100,
      text: "Default text with no offset. Its origin is in top left corner.",
      align: "center",
      width: 200,
    });
    layer.add(text1);

    let text2 = new Konva.Text({
      text: "Text with the origin in its center",
      width: 200,
      align: "center",
      y: 150,
      x: 370,
    });
    layer.add(text2);
    // set horizontal origin in the center of the text
    text2.offsetX(text2.width() / 2);

    layer.draw();

    document.querySelector("#flipX").addEventListener("click", () => {
      layer
        .find("Text")
        .toArray()
        .forEach((text) => {
          text.to({
            scaleX: -text.scaleX(),
          });
        });
    });

    document.querySelector("#flipY").addEventListener("click", () => {
      layer
        .find("Text")
        .toArray()
        .forEach((text) => {
          text.to({
            scaleY: -text.scaleY(),
          });
        });
    });
  };

  return (
    <div>
      <button id="flipX">Flip horizontally</button>
      <button id="flipY">Flip Vertically</button>
      <div id="container"></div>
    </div>
  );
};

export default Mirror;
