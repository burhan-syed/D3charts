import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

// Line.propTypes = {
//   xScale: PropTypes.func.isRequired,
//   yScale: PropTypes.func.isRequired,
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       date: PropTypes.date,
//       value: PropTypes.number
//     })
//   ),
//   color: PropTypes.string,
//   isSmooth: PropTypes.bool,
//   animation: PropTypes.oneOf(["left", "fadeIn", "none"])
// };

// Line.defaultProps = {
//   data: [],
//   color: "white",
//   isSmooth: false,
//   animation: "left"
// };

const Line = ({
  xScale,
  yScale,
  color = "white",
  data = [],
  isSmooth = false,
  animation = "left",
  ...props
}) => {
  const ref = useRef(null);
  // Define different types of animation that we can use
  const animateLeft = useCallback(() => {
    // NOTE: for some reason getTotalLength() doesn't work in tests
    // in this codesandbox so we added default value just for tests
    const totalLength = ref.current.getTotalLength
      ? ref.current.getTotalLength()
      : 500;
    d3.select(ref.current)
      .attr("opacity", 1)
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
    // d3.select(ref.current).attr("stroke-dasharray", length + " " + length)
    //     .attr("stroke-dashoffset", 0)
    //       .transition()
    //       .ease(d3.easeLinear)
    //       .attr("stroke-dashoffset", length)
    //       .duration(6000)
  }, []);
  const animateFadeIn = useCallback(() => {
    d3.select(ref.current)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr("opacity", 1);
  }, []);
  const noneAnimation = useCallback(() => {
    d3.select(ref.current).attr("opacity", 1);
  }, []);

  useEffect(() => {
    switch (animation) {
      case "left":
        animateLeft();
        break;
      case "fadeIn":
        animateFadeIn();
        break;
      case "none":
      default:
        noneAnimation();
        break;
    }
  }, [animateLeft, animateFadeIn, noneAnimation, animation]);

  // Recalculate line length if scale has changed
  useEffect(() => {
    if (animation === "left") {
      const totalLength = ref.current.getTotalLength
        ? ref.current.getTotalLength()
        : 500;
      d3.select(ref.current).attr(
        "stroke-dasharray",
        `${totalLength},${totalLength}`
      );
    }
  }, [xScale, yScale, animation]);

  const line = d3
    .line()
    .x((d) => xScale(d["date"]))
    .y((d) => yScale(d["open"]));

  const d = line(data);

  return (
    <path
      ref={ref}
      d={d?.match(/NaN|undefined/) ? "" : d}
      stroke={color}
      strokeWidth={3}
      fill="none"
      opacity={0}
      {...props}
    />
  );
};

export default Line;
