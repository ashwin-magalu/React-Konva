import React, { useRef, Fragment } from "react";
import { Stage, Layer, Rect } from "react-konva";

// function from https://stackoverflow.com/a/15832662/512042
const downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportImage = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const stageRef = useRef(null);

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    /* toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG). The returned image is in a resolution of 96 dpi. If the height or width of the canvas is 0 or larger than the maximum canvas size, the string "data:," is returned */
    // console.log(uri);
    // we also can save uri as file
    downloadURI(uri, "stage.png");
  };

  return (
    <Fragment>
      <button onClick={handleExport}>Click here to log stage data URL</button>
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          <Rect x={0} y={0} width={80} height={80} fill="red" />
          <Rect x={width - 80} y={0} width={80} height={80} fill="red" />
          <Rect
            x={width - 80}
            y={height - 80}
            width={80}
            height={80}
            fill="red"
          />
          <Rect x={0} y={height - 80} width={80} height={80} fill="red" />
        </Layer>
      </Stage>
    </Fragment>
  );
};

export default ExportImage;
