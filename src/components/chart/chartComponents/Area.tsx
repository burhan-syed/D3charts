// @ts-nocheck 
//checked
import {useEffect, useRef, useMemo} from 'react'

import * as d3 from "d3";



// Area.propTypes = {
//   xScale: PropTypes.func.isRequired,
//   yScale: PropTypes.func.isRequired,
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       date: PropTypes.date,
//       value: PropTypes.number
//     })
//   ),
//   color: PropTypes.string,
//   disableAnimation: PropTypes.bool
// };

const Area = ({ xScale, yScale, color = "white", data = [], disableAnimation = false, ...props }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (disableAnimation) {
      d3.select(ref.current).attr("opacity", 1);
      return;
    }
    d3.select(ref.current)
      .transition()
      .duration(750)
      .ease(d3.easeBackIn)
      .attr("opacity", 1);
  }, [disableAnimation]);

  const d = useMemo(() => {
    const area = d3
      .area()
      .x(({ date }) => xScale(date))
      .y1(({ open }) => yScale(open))
      .y0(() => yScale(yScale.domain()[0]));
    return area(data);
  }, [xScale, yScale, data]);

  return (
    <>
      <path
        ref={ref}
        d={d}
        fill={`url(#gradient-${color})`}
        opacity={0}
        {...props}
      />
      <defs>
        <linearGradient
          id={`gradient-${color}`}
          x1="0%"
          x2="0%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};




export default Area;
