import {useEffect, useRef} from 'react'
import * as d3 from "d3";

// GridLine.propTypes = {
//   scale: PropTypes.func.isRequired,
//   type: PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
//   ticks: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
//   transform: PropTypes.string,
//   size: PropTypes.number,
//   disableAnimation: PropTypes.bool
// };

// GridLine.defaultProps = {
//   ticks: 0,
//   transform: "",
//   size: 0,
//   disableAnimation: false
// };

const GridLine = ({
  type,
  scale,
  ticks = 0,
  size = 0,
  transform = "",
  disableAnimation = false,
  ...props
}) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "vertical" ? d3.axisBottom : d3.axisLeft;
    const axis = axisGenerator(scale).ticks(ticks).tickSize(-size);

    const gridGroup = d3.select(ref.current);
    if (disableAnimation) {
      gridGroup.call(axis);
    } else {
      gridGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    gridGroup.select(".domain").remove();
    gridGroup.selectAll("text").remove();
    gridGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.1)");
  }, [scale, ticks, size, disableAnimation]);

  return <g ref={ref} transform={transform} {...props} />;
};



export default GridLine;
