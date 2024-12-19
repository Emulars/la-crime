import * as d3 from "d3";
//import * as topojson from "topojson-client";

export function choroplethMap(geoData, divisionData, Alldata, year, { width, height} = {}) {
    // Filter data for the selected year
    const data = Alldata.filter(d => d.Year === year);

    // Map crime data to division IDs
    const crimesByDivision = new Map(
        data.map(d => [
            divisionData.find(div => div.name === d.District)?.id,
            { divsionName: divisionData.find(div => div.name === d.District)?.name, totalCrimes: d.TotalCrimes, mostFrequentCrime: d.MostFrequentCrime, districtIndex: d.DistrictIndex }
        ])
    );

    console.log("crimesByDivision", crimesByDivision);

    // Define color scale based on DistrictIndex
    const districtIndexes = data.map(d => d.DistrictIndex);
    const maxIndex = d3.max(districtIndexes);
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxIndex]);

    // Create SVG
    const svg = d3.create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto")
        .style("font-family", "sans-serif")
        .style("overflow", "hidden");

    // Define projection and path generator
    const projection = d3.geoAlbersUsa().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);

    // Draw divisions
    const mapGroup = svg.append("g");

    mapGroup.selectAll(".division")
        .data(geoData.features)
        .join("path")
        .attr("class", "division")
        .attr("d", path)
        .attr("fill", d => {
            const divisionId = d.id;
            const crimeData = crimesByDivision.get(divisionId);
            return crimeData ? colorScale(crimeData.districtIndex) : "#ccc"; // Default color for no data
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => {
            const divisionId = d.id;
            const crimeData = crimesByDivision.get(divisionId);

            // Highlight the hovered division
            d3.select(event.target).attr("stroke-width", 2).attr("stroke", "#000");

            // Show tooltip
            d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "rgba(0, 0, 0, 0.8)")
                .style("color", "#fff")
                .style("padding", "10px")
                .style("border-radius", "5px")
                .style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`)
                .html(`
                    <strong>${divisionData.find(div => div.id === divisionId)?.name || "Unknown"}</strong><br>
                    District Index: ${crimeData?.districtIndex || "No data"}<br>
                    Most Frequent Crime: ${crimeData?.mostFrequentCrime || "No data"}
                `);
        })
        .on("mouseout", (event) => {
            d3.select(event.target).attr("stroke-width", 0.5).attr("stroke", "#fff");
            d3.select(".tooltip").remove();
        });

    // Add legend
    const legendGroup = svg.append("g")
        .attr("transform", `translate(${width - 150}, ${height - 150})`)
        .attr("class", "legend");

    const legendScale = d3.scaleLinear()
        .domain(colorScale.domain())
        .range([0, 100]);

    const legendAxis = d3.axisRight(legendScale).ticks(5);

    legendGroup.append("g")
        .selectAll("rect")
        .data(d3.range(0, 1.01, 0.1))
        .join("rect")
        .attr("y", d => legendScale(d * maxIndex))
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", d => colorScale(d * maxIndex));

    legendGroup.append("g")
        .attr("transform", "translate(20, 0)")
        .call(legendAxis);

    legendGroup.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("District Index")
        .style("font-size", "12px")
        .style("font-weight", "bold");

    return svg.node();
}
