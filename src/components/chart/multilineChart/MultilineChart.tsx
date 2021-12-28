//@ts-nocheck
import {useRef, useEffect} from 'react'
// import PropTypes from "prop-types";
// import { MultiLineDataPropTypes } from "../../utils/propTypes";
import { Line, Axis, GridLine, Overlay, Tooltip, Area } from "../chartComponents";
import useController from "./MultilineChart.controller";
import useDimensions from "../utils/useDimensions";

// MultilineChart.propTypes = {
//   data: MultiLineDataPropTypes,
//   margin: PropTypes.shape({
//     top: PropTypes.number,
//     bottom: PropTypes.number,
//     left: PropTypes.number,
//     right: PropTypes.number
//   })
// };

// MultilineChart.defaultProps = {
//   data: [],
//   margin: {
//     top: 30,
//     right: 30,
//     bottom: 30,
//     left: 60
//   }
// };

const MultilineChart = ({ data = [], margin = {left: 0, top: 0, right: 0, bottom: 0} }) => {
  const overlayRef = useRef(null);
  const [containerRef, { svgWidth, svgHeight, width, height }] = useDimensions({
    maxHeight: 400,
    margin
  });
  const controller = useController({ data, width, height });
  const {
    yTickFormat,
    xTickFormat,
    xScale,
    yScale,
    yScaleForAxis
  } = controller;

 

  return (
    <div ref={containerRef}>
      <svg width={svgWidth} height={svgHeight} className='bg-black'>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridLine
            type="vertical"
            scale={xScale}
            ticks={5}
            size={height}
            transform={`translate(0, ${height})`}
          />
          <GridLine
            type="horizontal"
            scale={yScaleForAxis}
            ticks={5}
            size={width}
          />
          <GridLine
            type="horizontal"
            // className="baseGridLine"
            scale={yScale}
            ticks={1}
            size={width}
            disableAnimation
          />
          {data.map(({ name, items = [], color }) => (
            <Line
              key={name}
              data={items}
              xScale={xScale}
              yScale={yScale}
              color={color}
              // animation={'none'}
            />
          ))}
          <Area data={data[0].items} xScale={xScale} yScale={yScale} />
          <Axis
            type="left"
            scale={yScaleForAxis}
            transform="translate(0, -10)"
            ticks={5}
            tickFormat={yTickFormat}
          />
          <Overlay ref={overlayRef} width={width} height={height}>
            <Axis
              type="bottom"
              // className="axisX"
              anchorEl={overlayRef.current}
              scale={xScale}
              transform={`translate(10, ${height - height / 6})`}
              ticks={5}
              tickFormat={xTickFormat}
            />
            <Tooltip
              className="tooltip"
              anchorEl={overlayRef.current}
              width={width}
              height={height}
              margin={margin}
              xScale={xScale}
              yScale={yScale}
              data={data}
            />
          </Overlay>
        </g>
      </svg>
    </div>
  );
};



export default MultilineChart;
