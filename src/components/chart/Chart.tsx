import * as d3 from "d3";
import { useState, useEffect, useRef, SVGProps } from "react";

const Chart = ({
  data = [
    {
      name: "",
      color: "",
      items: [
        {
          open: 0,
          date: new Date(),
        },
      ],
    },
  ],
  dimensions = {
    width: 0,
    height: 0,
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
  },
}) => {
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  const svgRef = useRef();

  // useEffect(() => {
  //   //setup svg
  //   const w = width;
  //   const h = height;
  //   const svg = d3
  //     .select(svgRef?.current)
  //     .attr("width", w)
  //     .attr("height", h)
  //     .style("background", "#d3d3d3")
  //     .style("margin-top", "50")
  //     .style("overflow", "visible");

  //   //setup scaling
  //   const xScale = d3
  //     .scaleLinear()
  //     .domain([0, data.length - 1])
  //     .range([0, w]);
  //   const yScale = d3.scaleLinear().domain([0, h]).range([h, 0]);
  //   const generateScaledLine = d3
  //     .line()
  //     .x((d, i) => xScale(i))
  //     .y(yScale)
  //     .curve(d3.curveCardinal);

  //   //setup axes
  //   const xAxis = d3
  //     .axisBottom(xScale)
  //     .ticks(data.length)
  //     .tickFormat((i) => i + 1);
  //   const yAxis = d3.axisLeft(yScale).tickFormat((i) => i +1);
  //   svg.append("g").call(xAxis).attr("transform", `translate(0,${h})`);
  //   svg.append("g").call(yAxis);

  //   //setup data
  //   svg
  //     .selectAll(".line")
  //     .data([data])
  //     .join("path")
  //     .attr("d", (d) => generateScaledLine(d))
  //     .attr("fill", "none")
  //     .attr("stroke", "black");

  //   return () => {
  //     //
  //   };
  // }, [data, height, width]);

  

  useEffect(() => {

    let alldataitems = [].concat(data.map(d => d.items)).flat();
    // data.forEach(d => [...alldata, ...d.items])
    // console.log(alldataitems);
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(alldataitems, (d) => d.date))
      .range([0, width]);
   
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(alldataitems, (d) => d?.open) -50 ,
        d3.max(alldataitems, (d) => d?.open) +50 ,
        // 0,height
      ])
      .range([height, 0]);
    // Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      ;
    // Add X grid lines with labels
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickSize(-height);
    const xAxisGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    xAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "white")
      .attr("font-size", "0.75rem");
    // Add Y grid lines with labels
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-width)
      .tickFormat((val) => `${val}`);
    const yAxisGroup = svg.append("g").call(yAxis);
    yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    yAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "white")
      .attr("font-size", "0.75rem");
    // Draw the lines
    const line = d3
      .line()
      .x((d) => xScale(d["date"]))
      .y((d) => yScale(d["open"]));

    const generateScaledLine = d3
      .line()
      .x((d, i) => xScale(i))
      .curve(d3.curveCardinal);

    svg
      .selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr('overflow', 'visible')
      .attr("stroke-width", 3)
      .attr("d", (d) => {
        //console.log(d.items);
        const items = [];
        d.items.forEach((i) => {
          items.push({ date: i.date, "open": i?.open });
        });
        //console.log(items);
        return line(items);
      });
  }, [data]);

  return (
    <div className="">
      <svg className="bg-black" ref={svgRef} width={svgWidth} height={svgHeight}></svg>
    </div>
  );
};

export default Chart;
