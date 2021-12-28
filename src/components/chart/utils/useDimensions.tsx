import { useRef } from "react";
import useResize from "./useResize";

const useDimensions = ({
  maxHeight,
  margin = { left: 0, right: 0, top: 0, bottom: 0 },
  scaleCoef = 0.5,
}) => {
  const ref = useRef(null);
  const { width } = useResize(ref);

  const height =
    !maxHeight || width * scaleCoef < maxHeight ? width * scaleCoef : maxHeight;
  const innerWidth = width - (margin.left || 0) - (margin.right || 0);
  const innerHeight = height - (margin.top || 0) - (margin.bottom || 0);

  return [
    ref,
    {
      svgWidth: width,
      svgHeight: height,
      width: innerWidth,
      height: innerHeight,
    },
  ];
};

export default useDimensions;
