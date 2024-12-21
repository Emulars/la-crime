import * as d3 from "d3";

// Utility to encode district names into valid class names
function encodeDistrictName(name) {
    return name.replace(/\s+/g, '-'); // Replace spaces with dashes
}

export function lineChartCrimeIndex(data, { width = 800, height = 400, margin = { top: 20, right: 150, bottom: 50, left: 50 } } = {}) {
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

    // Add lines for each district
    const linesGroup = chartGroup.append("g");
    const districtPaths = new Map();

    groupedData.forEach((districtData, district) => {
        const encodedDistrict = encodeDistrictName(district);

        const path = linesGroup.append("path")
            .datum(districtData)
            .attr("fill", "none")
            .attr("stroke", colorScale(district))
            .attr("stroke-width", 2)
            .attr("d", line)
            .attr("data-district", district)
            .attr("class", `line line-${encodedDistrict}`);

        districtPaths.set(district, path);
    });

    // Add legend
    const legendGroup = svg.append("g")
        .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    // Add "Toggle Districts" text above the legend
    legendGroup.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("Toggle Districts")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "white");

    const enabledDistricts = new Set(["Central", "Hollenbeck", "Rampart", "West LA", "Wilshire"]);
    const visibleDistricts = new Set(); // Track currently visible districts

    [...groupedData.keys()].forEach((district, i) => {
        const encodedDistrict = encodeDistrictName(district);
        const yOffset = i * 20;

        // Add legend rectangle
        legendGroup.append("rect")
            .attr("x", 0)
            .attr("y", yOffset)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", enabledDistricts.has(district) ? colorScale(district) : "white")
            .attr("class", `legend-rect legend-${encodedDistrict}`)
            .style("cursor", "pointer")
            .on("click", () => toggleDistrict(district));

        // Add legend text
        legendGroup.append("text")
            .attr("x", 15)
            .attr("y", yOffset + 10)
            .text(district)
            .attr("font-size", "12px")
            .attr("alignment-baseline", "middle")
            .attr("fill", enabledDistricts.has(district) ? "white" : "gray") // Adjust initial text color
            .style("cursor", "pointer")
            .attr("class", `legend-text legend-text-${encodedDistrict}`)
            .on("click", () => toggleDistrict(district));

        // Set initial visibility of the district line
        if (enabledDistricts.has(district)) {
            visibleDistricts.add(district);
        } else {
            districtPaths.get(district).style("opacity", 0);
        }
    });

    // Toggle visibility of district lines
    function toggleDistrict(district) {
        const encodedDistrict = encodeDistrictName(district);
        const isSelected = visibleDistricts.has(district);

        if (isSelected) {
            // Hide the district
            visibleDistricts.delete(district);
            districtPaths.get(district).style("opacity", 0); // Hide the line
            svg.select(`.legend-${encodedDistrict}`).attr("fill", "white"); // White box
            svg.select(`.legend-text-${encodedDistrict}`).attr("fill", "gray"); // Gray text
        } else {
            // Show the district
            visibleDistricts.add(district);
            districtPaths.get(district).style("opacity", 1); // Show the line
            svg.select(`.legend-${encodedDistrict}`).attr("fill", colorScale(district)); // Original color box
            svg.select(`.legend-text-${encodedDistrict}`).attr("fill", "white"); // White text
        }
    }

    return svg.node();
}
