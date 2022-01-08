// @ts-nocheck
// need to fix
import { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
// import { MultiLineDataPropTypes } from "../utils/propTypes";
import { formatPercent, formatPriceUSD } from "../utils/commonUtils";

// Tooltip.propTypes = {
//   width: PropTypes.number,
//   height: PropTypes.number,
//   margin: PropTypes.shape({
//     top: PropTypes.number,
//     bottom: PropTypes.number,
//     left: PropTypes.number,
//     right: PropTypes.number
//   }),
//   data: MultiLineDataPropTypes,
//   xScale: PropTypes.func.isRequired,
//   yScale: PropTypes.func.isRequired,
//   anchorEl: PropTypes.instanceOf(Element)
// };

// Tooltip.defaultProps = {
//   width: 0,
//   height: 0,
//   margin: {
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0
//   },
//   data: [],
//   anchorEl: null
// };

// function ascending$3(a, b) {
//   let v =
//     a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;

//   // console.log(v, ":", a.toDateString(),b.toDateString());
//   return v;
// }

//reverse bisector function for reverse sorted data
// function bisector(f) {
//   let delta = f;
//   let compare1 = f;
//   let compare2 = f;
//   //console.log(f?.length);
//   if (f.length !== 2) {
//     delta = (d, x) => f(d) - x;
//     compare1 = ascending$3;
//     compare2 = (d, x) => ascending$3(f(d), x);
//   }

//   function left(a, x, lo = 0, hi = a.length) {
//     if (lo < hi) {
//       //console.log(compare1(x,x))
//       if (compare1(x, x) !== 0) return hi;
//       do {
//         const mid = (lo + hi) >>> 1;
//         // console.log(lo, mid, hi, x.toDateString());
//         //had to change below from < to >
//         if (compare2(a[mid], x) > 0) lo = mid + 1;
//         else hi = mid;
//       } while (lo < hi);
//     }
//     //console.log(lo);
//     return lo;
//   }

//   function right(a, x, lo = 0, hi = a.length) {
//     if (lo < hi) {
//       if (compare1(x, x) !== 0) return hi;
//       do {
//         const mid = (lo + hi) >>> 1;
//         if (compare2(a[mid], x) <= 0) lo = mid + 1;
//         else hi = mid;
//       } while (lo < hi);
//     }
//     return lo;
//   }

//   function center(a, x, lo = 0, hi = a.length) {
//     const i = left(a, x, lo, hi - 1);
//     return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
//   }

//   return { left, center, right };
// }

const Tooltip = ({
  xScale,
  yScale,
  width = 0,
  height = 0,
  data = [],
  margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  anchorEl = null,
  children,
  ...props
}) => {
  const ref = useRef(null);
  const drawLine = useCallback(
    (x) => {
      d3.select(ref.current)
        .select(".tooltipLine")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", -margin.top)
        .attr("y2", height);
    },
    [ref, height, margin]
  );

  const drawContent = useCallback(
    (x) => {
      const tooltipContent = d3.select(ref.current).select(".tooltipContent");
      tooltipContent.attr("transform", (cur, i, nodes: HTMLElement[]) => {
        const nodeWidth = nodes[i]?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 12 : x + 8;
        return `translate(${translateX}, ${-margin.top})`;
      });
      tooltipContent
        .select(".contentTitle")
        .text(d3.timeFormat("%b %d, %Y")(xScale.invert(x)));
    },
    [xScale, margin, width]
  );

  const drawBackground = useCallback(() => {
    // reset background size to defaults
    const contentBackground = d3
      .select(ref.current)
      .select(".contentBackground");
    contentBackground.attr("width", 125).attr("height", 40);

    // calculate new background size
    const tooltipContentElement = d3
      .select(ref.current)
      .select(".tooltipContent")
      .node();
    if (!tooltipContentElement) return;

    const contentSize = tooltipContentElement.getBoundingClientRect();
    contentBackground
      .attr("width", contentSize.width + 8)
      .attr("height", contentSize.height + 4);
  }, []);

  const onChangePosition = useCallback((d, i, isVisible) => {
    d3.selectAll(".performanceItemValue")
      .filter((td, tIndex) => tIndex === i)
      // .text(isVisible ? formatPercent(d.value) : "");
      .text(isVisible ? d.open : "");
    // d3.selectAll(".performanceItemMarketValue")
    //   .filter((td, tIndex) => tIndex === i)
    //   .text(
    //     d.marketvalue && !isVisible ? "No data" : formatPriceUSD(d.marketvalue)
    //   );

    const maxNameWidth = d3.max(
      d3.selectAll(".performanceItemName").nodes(),
      (node) => node.getBoundingClientRect().width
    );
    d3.selectAll(".performanceItemValue").attr(
      "transform",
      (datum, index, nodes) =>
        `translate(${
          nodes[index].previousSibling.getBoundingClientRect().width + 14
        },4)`
    );

    // d3.selectAll(".performanceItemMarketValue").attr(
    //   "transform",
    //   `translate(${maxNameWidth + 60},4)`
    // );
  }, []);

  const followPoints = useCallback(
    (e) => {
      const [x] = d3.pointer(e, anchorEl);
      const xDate = xScale.invert(x);
      const bisectDate = d3.bisector((d) => {
        return d.date;
      }).left;
      let baseXPos = 0;
      // draw circles on line
      d3.select(ref.current)
        .selectAll(".tooltipLinePoint")
        .attr("transform", (cur, i) => {
          // console.log("||||||||||||||||||||||||||||||||||");
          const index = bisectDate(data[i].items, xDate, 1);
          const d0 = data[i].items[index - 1];
          const d1 = data[i].items[index];
          const d = xDate - d0?.date > d1?.date - xDate ? d1 : d0;
          if (d.date === undefined && d.open === undefined) {
            // move point out of container
            return "translate(-100,-100)";
          }
          const xPos = xScale(d.date);
          if (i === 0) {
            baseXPos = xPos;
          }
          baseXPos = xPos;

          let isVisible = true;
          if (xPos !== baseXPos) {
            console.log(xPos, baseXPos);
            isVisible = false;
          }
          const yPos = yScale(d.open);
          //console.log(xPos,yPos);
          onChangePosition(d, i, isVisible);

          return isVisible
            ? `translate(${xPos}, ${yPos})`
            : "translate(-100,-100)";
        });

      drawLine(baseXPos);
      drawContent(baseXPos);
      drawBackground();
    },
    [
      anchorEl,
      drawLine,
      drawContent,
      drawBackground,
      xScale,
      yScale,
      data,
      onChangePosition,
    ]
  );

  useEffect(() => {
    d3.select(anchorEl)
      .on("mouseout.tooltip", () => {
        d3.select(ref.current).attr("opacity", 0);
      })
      .on("mouseover.tooltip", () => {
        d3.select(ref.current).attr("opacity", 1);
      })
      .on("mousemove.tooltip", (e) => {
        d3.select(ref.current)
          .selectAll(".tooltipLinePoint")
          .attr("opacity", 1);
        followPoints(e);
      });
  }, [anchorEl, followPoints]);

  if (!data.length) return null;

  return (
    <g ref={ref} opacity={0} {...props}>
      <line className="tooltipLine stroke-white" />
      <g className="tooltipContent ">
        <rect className="contentBackground" rx={4} ry={4} opacity={0.2} />
        <text className="contentTitle" transform="translate(4,14)" />
        <g className="content" transform="translate(4,32)">
          {data.map(({ name, color }, i) => (
            <g key={name} transform={`translate(6,${22 * i})`}>
              <circle r={6} fill={color} />
              <text className="performanceItemName" transform="translate(10,4)">
                {name}
              </text>
              <text
                className="performanceItemValue"
                opacity={0.5}
                fontSize={10}
              />
              {/* <text className="performanceItemMarketValue" /> */}
            </g>
          ))}
        </g>
      </g>
      {data.map(({ name }) => (
        <circle
          className="tooltipLinePoint fill-red-600"
          r={6}
          key={name}
          opacity={0}
        />
      ))}
    </g>
  );
};

export default Tooltip;
