import Konva from "konva";
import React from "react";

const ImageResize = () => {
  window.onload = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const update = (activeAnchor) => {
      if (activeAnchor) {
        /* Selected circle*/
        let group = activeAnchor.getParent();
        // console.log(activeAnchor);
        let topLeft = group.get(".topLeft")[0];
        let topRight = group.get(".topRight")[0];
        let bottomRight = group.get(".bottomRight")[0];
        let bottomLeft = group.get(".bottomLeft")[0];
        let image = group.get("Image")[0];

        /* Get active x and y positions */
        let anchorX = activeAnchor.getX();
        let anchorY = activeAnchor.getY();

        // update anchor positions of x and y
        switch (activeAnchor.getName()) {
          case "topLeft":
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
          case "topRight":
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
          case "bottomRight":
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
          case "bottomLeft":
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
        }

        /* fix starting point of rectangle */
        image.position(topLeft.position());

        let width = topRight.getX() - topLeft.getX();
        let height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
          image.width(width);
          image.height(height);
        }
      } else {
        alert("Can't update");
      }
    };

    const addAnchor = (group, x, y, name) => {
      /* Creating circle */
      let stage = group.getStage();
      let layer = group.getLayer();

      let anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: "#666",
        fill: "#fff",
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false,
      });

      anchor.on("dragmove", () => {
        update(anchor);
        layer.draw();
      });
      anchor.on("mousedown touchstart", () => {
        group.draggable(false);
        //this.moveToTop();
      });
      anchor.on("dragend", () => {
        group.draggable(true);
        layer.draw();
      });
      // add hover styling
      anchor.on("mouseover", () => {
        let layer = group.getLayer();
        document.body.style.cursor = "pointer";
        anchor.strokeWidth(3);
        anchor.stroke("blue");
        anchor.fill("red");
        layer.draw();
      });
      anchor.on("mouseout", () => {
        let layer = group.getLayer();
        document.body.style.cursor = "default";
        anchor.strokeWidth(2);
        anchor.stroke("#666");
        anchor.fill("#fff");
        layer.draw();
      });

      group.add(anchor);
    };

    let stage = new Konva.Stage({
      container: "container",
      width: width,
      height: height,
    });

    let layer = new Konva.Layer();
    stage.add(layer);

    // darth vader
    let darthVaderImg = new Konva.Image({
      width: 200,
      height: 137,
    });

    // yoda
    let yodaImg = new Konva.Image({
      width: 93,
      height: 104,
    });

    let darthVaderGroup = new Konva.Group({
      x: 180,
      y: 50,
      draggable: true,
    });
    layer.add(darthVaderGroup);
    darthVaderGroup.add(darthVaderImg);
    addAnchor(darthVaderGroup, 0, 0, "topLeft");
    addAnchor(darthVaderGroup, 200, 0, "topRight");
    addAnchor(darthVaderGroup, 200, 137, "bottomRight");
    addAnchor(darthVaderGroup, 0, 137, "bottomLeft");

    let yodaGroup = new Konva.Group({
      x: 20,
      y: 110,
      draggable: true,
    });
    layer.add(yodaGroup);
    yodaGroup.add(yodaImg);
    addAnchor(yodaGroup, 0, 0, "topLeft");
    addAnchor(yodaGroup, 93, 0, "topRight");
    addAnchor(yodaGroup, 93, 104, "bottomRight");
    addAnchor(yodaGroup, 0, 104, "bottomLeft");

    let imageObj1 = new Image();
    imageObj1.onload = () => {
      darthVaderImg.image(imageObj1);
      layer.draw();
    };
    imageObj1.src =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdpggfO2In5bx7rm9CnhFREhG8KO5udkch_Q&usqp=CAU";

    let imageObj2 = new Image();
    imageObj2.onload = () => {
      yodaImg.image(imageObj2);
      layer.draw();
    };
    imageObj2.src =
      "https://lumiere-a.akamaihd.net/v1/images/Yoda-Retina_2a7ecc26.jpeg?region=0%2C0%2C1536%2C864&width=960";
  };

  return <div id="container"></div>;
};

export default ImageResize;
