import * as d3 from "d3";

export function scatterPlot(data, year, district, { width, height} = {}) {
    // Filter data for the selected year and district
    const filteredData = data.find(d => d.Year === year && d.District === district);
    if (!filteredData) {
        throw new Error(`No data found for year ${year} and district ${district}`);
    }

    // Prepare data for plotting
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const crimes = hours.map(hour => filteredData[`Hour_${hour}`]);
    const weaponPercentages = hours.map(hour => filteredData[`Hour_${hour}_WeaponPercentage`]);

    // Create SVG
    const svg = d3.create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "auto")
        .style("font-family", "sans-serif");

    // Define margins and scales
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, 23])
        .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(crimes)])
        .range([plotHeight, 0]);

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(24).tickFormat(d => `${d}:00`);
    const yAxis = d3.axisLeft(yScale);

    const plotGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    plotGroup.append("g")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    plotGroup.append("g").call(yAxis);

    // Add points
    const pointGroup = plotGroup.append("g");

    pointGroup.selectAll("circle")
        .data(hours)
        .join("circle")
        .attr("cx", d => xScale(d))
        .attr("cy", d => yScale(crimes[d]))
        .attr("r", 5)
        .attr("fill", "#69b3a2");

    // Add circles for weapon percentage > 50%
    pointGroup.selectAll(".highlight")
        .data(hours.filter(d => weaponPercentages[d] > 50))
        .join("circle")
        .attr("class", "highlight")
        .attr("cx", d => xScale(d))
        .attr("cy", d => yScale(crimes[d]))
        .attr("r", 8)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Add labels
    plotGroup.append("text")
        .attr("x", plotWidth / 2)
        .attr("y", plotHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Hour of the Day");

    plotGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -plotHeight / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of Crimes");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(`Crimes by Hour for ${district} in ${year}`);

    return svg.node();
}
