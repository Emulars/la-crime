import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

// Utility to encode district names into valid class names
// Utility to encode district names into valid class names
function encodeDistrictName(name) {
    return name.replace(/\s+/g, '-'); // Replace spaces with dashes
}

export function lineChartCrimeIndex(data, { width = 800, height = 400, margin = { top: 30, right: 50, bottom: 30, left: 45 } } = {}) {
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

    const colorScale = d3.scaleOrdinal()
        .domain([...groupedData.keys()])
        .range([
            "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
            "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", 
            "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", 
            "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2", "#a6cee3", 
            "#b2df8a"
        ]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Append chart group
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // Add y-axis
    chartGroup.append("g").call(yAxis);

    // Y-axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text("District's Crime Index");

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d.DistrictIndex));

    // Add lines for each district
    const linesGroup = chartGroup.append("g");
    const districtPaths = new Map();

    const enabledDistricts = new Set(["Central", "Hollenbeck", "Rampart", "West LA","Hollywood", "Olympic"]);
    const visibleDistricts = new Set([...enabledDistricts]);

    groupedData.forEach((districtData, district) => {
        const encodedDistrict = encodeDistrictName(district);

        const path = linesGroup.append("path")
            .datum(districtData)
            .attr("fill", "none")
            .attr("stroke", colorScale(district))
            .attr("stroke-width", 2)
            .attr("d", line)
            .attr("data-district", district)
            .attr("class", `line line-${encodedDistrict}`)
            .style("opacity", enabledDistricts.has(district) ? 1 : 0);

        districtPaths.set(district, path);
    });

    // Add labels at the end of each line
    groupedData.forEach((districtData, district) => {
        const encodedDistrict = encodeDistrictName(district);
        const lastPoint = districtData[districtData.length - 1]; // Get the last data point

        chartGroup.append("text")
            .attr("x", xScale(lastPoint.Year) + 5) // Position slightly to the right of the line end
            .attr("y", yScale(lastPoint.DistrictIndex))
            .attr("fill", colorScale(district))
            .attr("font-size", "12px")
            .attr("alignment-baseline", "middle")
            .text(district)
            .attr("class", `label label-${encodedDistrict}`)
            .style("opacity", enabledDistricts.has(district) ? 1 : 0);
    });

    // Add legend
    const legendGroup = svg.append("g")
        .attr("transform", `translate(${width - margin.right - 350}, ${margin.top})`);

    legendGroup.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("Toggle Districts")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "white");

    [...groupedData.keys()].forEach((district, i) => {
        const encodedDistrict = encodeDistrictName(district);
        const xOffset = (i % 4) * 100; // Arrange items in rows of 3
        const yOffset = Math.floor(i / 4) * 20;

        // Add legend rectangle
        legendGroup.append("rect")
            .attr("x", xOffset)
            .attr("y", yOffset)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", enabledDistricts.has(district) ? colorScale(district) : "white")
            .attr("class", `legend-rect legend-${encodedDistrict}`)
            .style("cursor", "pointer")
            .on("click", () => toggleDistrict(district));

        // Add legend text
        legendGroup.append("text")
            .attr("x", xOffset + 15)
            .attr("y", yOffset + 7)
            .text(district)
            .attr("font-size", "12px")
            .attr("alignment-baseline", "middle")
            .attr("fill", enabledDistricts.has(district) ? "white" : "gray")
            .style("cursor", "pointer")
            .attr("class", `legend-text legend-text-${encodedDistrict}`)
            .on("click", () => toggleDistrict(district));
    });

    // Toggle visibility of district lines
    function toggleDistrict(district) {
        const encodedDistrict = encodeDistrictName(district);
        const isSelected = visibleDistricts.has(district);

        if (isSelected) {
            // Hide the district
            visibleDistricts.delete(district);
            districtPaths.get(district).style("opacity", 0);
            svg.select(`.label-${encodedDistrict}`).style("opacity", 0); // Hide label
            svg.select(`.legend-${encodedDistrict}`).attr("fill", "white");
            svg.select(`.legend-text-${encodedDistrict}`).attr("fill", "gray");
        } else {
            // Show the district
            visibleDistricts.add(district);
            districtPaths.get(district).style("opacity", 1);
            svg.select(`.label-${encodedDistrict}`).style("opacity", 1); // Show label
            svg.select(`.legend-${encodedDistrict}`).attr("fill", colorScale(district));
            svg.select(`.legend-text-${encodedDistrict}`).attr("fill", "white");
        }
    }

    return svg.node();
}



