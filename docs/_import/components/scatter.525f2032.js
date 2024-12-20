import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

export function scatterPlot(data, year, district, { width, height } = {}) {
    // Define constants for y-scale domains
    const districtCrimesMax = d3.max(data.filter(d => d.District !== "All Districts"), d => {
        return Math.max(...Array.from({ length: 24 }, (_, i) => d[`Hour_${i}`]));
    });

    const allDistrictsCrimesMax = d3.max(data.filter(d => d.District === "All Districts"), d => {
        return Math.max(...Array.from({ length: 24 }, (_, i) => d[`Hour_${i}`]));
    });

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
    const margin = { top: 40, right: 30, bottom: 50, left: 50 }; // Increased top margin for title spacing
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, 23])
        .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, district === "All Districts" ? allDistrictsCrimesMax : districtCrimesMax])
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
        .attr("fill", "red") // Changed dot color to red
        .on("mouseover", (event, d) => {
            // Show tooltip
            d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "rgba(0, 0, 0, 0.8)")
                .style("color", "#fff")
                .style("padding", "5px")
                .style("border-radius", "5px")
                .style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`)
                .text(`Hour: ${d}, Crimes: ${crimes[d]}`);
        })
        .on("mouseout", () => {
            d3.select(".tooltip").remove();
        });

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
        .style("font-size", "10px")
        .style("fill", "#fff")
        .text("Hour of the Day");

    plotGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -plotHeight / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#fff")
        .text("Number of Crimes");

    // Add title
    svg.append("text")
        .attr("x", margin.left + plotWidth / 2)
        .attr("y", margin.top / 2) // Adjusted for better spacing
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#fff")
        .text(`Average Crimes by Hour for ${district} in ${year}`);

    return svg.node();
}
