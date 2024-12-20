import * as d3 from "d3";

export function lineChartCrimeIndex(data, { width, height, margin = { top: 20, right: 150, bottom: 50, left: 50 } } = {}) {
    // Create SVG
    const svg = d3.create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "auto")
        .style("font-family", "sans-serif");

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Group data by district
    const groupedData = d3.group(data, d => d.District);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.DistrictIndex)])
        .range([chartHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([...groupedData.keys()]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Append chart group
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d.DistrictIndex));

    // Plot lines
    groupedData.forEach((districtData, district) => {
        chartGroup.append("path")
            .datum(districtData)
            .attr("fill", "none")
            .attr("stroke", colorScale(district))
            .attr("stroke-width", 2)
            .attr("d", line);
    });

    // Add legend
    const legendGroup = svg.append("g")
        .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    [...groupedData.keys()].forEach((district, i) => {
        const yOffset = i * 20;

        legendGroup.append("rect")
            .attr("x", 0)
            .attr("y", yOffset)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(district));

        legendGroup.append("text")
            .attr("x", 15)
            .attr("y", yOffset + 10)
            .text(district)
            .attr("font-size", "12px")
            .attr("alignment-baseline", "middle");
    });

    return svg.node();
}
