import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

export function choroplethMap(geoData, divisionData, Alldata, year, district_name, { width, height } = {}) {
    // Calculate global min and max DistrictIndex across all years
    const allDistrictIndexes = Alldata.map(d => d.DistrictIndex);
    const globalMinIndex = d3.min(allDistrictIndexes);
    const globalMaxIndex = d3.max(allDistrictIndexes);

    // Define color scale using global min and max
    const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([globalMinIndex, globalMaxIndex]);

    // Filter data for the selected year
    const data = Alldata.filter(d => d.Year === year);

    // Map crime data to division IDs
    const crimesByDivision = new Map(
        data.map(d => [
            divisionData.find(div => div.name === d.District)?.id,
            { 
                divisionName: divisionData.find(div => div.name === d.District)?.name,
                totalCrimes: d.TotalCrimes, 
                mostFrequentCrime: d.MostFrequentCrime, 
                districtIndex: d.DistrictIndex,
                districTotalCrime: d.TotalCrimes,
                mostFrequentCrimeCount: d.CrimeCount 
            }
        ])
    );

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
        .attr("stroke", d => {
            const crimeData = crimesByDivision.get(d.id);
            return district_name !== "All Districts" && crimeData?.divisionName === district_name ? "#000" : "#444";
        })
        .attr("stroke-width", d => {
            const crimeData = crimesByDivision.get(d.id);
            return district_name !== "All Districts" && crimeData?.divisionName === district_name ? 3 : 0.8;
        })
        .attr("stroke-linejoin", "round")
        .style("opacity", d => {
            const crimeData = crimesByDivision.get(d.id);
            return district_name !== "All Districts" && crimeData?.divisionName !== district_name ? 0.3 : 1;
        }) // Reduce opacity for non-selected districts
        .style("filter", d => {
            const crimeData = crimesByDivision.get(d.id);
            return district_name !== "All Districts" && crimeData?.divisionName === district_name
                ? "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))"
                : "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2))";
        })
        .on("mouseover", (event, d) => {
            const divisionId = d.id;
            const crimeData = crimesByDivision.get(divisionId);

            // Highlight the hovered division
            d3.select(event.target)
                .attr("stroke-width", 2) // Thicker border on hover
                .attr("stroke", "#000") // Highlighted border color
                .style("filter", "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))"); // More pronounced shadow

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
                    <strong>${crimeData?.divisionName || "Unknown"}</strong><br>
                    District Index: ${crimeData?.districtIndex?.toFixed(2) || "No data"}<br>
                    Total Crimes: ${crimeData?.districTotalCrime || "No data"}<br>
                    Most Frequent Crime: ${crimeData?.mostFrequentCrime || "No data"} (${crimeData?.mostFrequentCrimeCount || "No data"} cases)
                `);
        })
        .on("mouseout", (event) => {
            d3.select(event.target)
                .attr("stroke-width", d => {
                    const crimeData = crimesByDivision.get(d.id);
                    return district_name !== "All Districts" && crimeData?.divisionName === district_name ? 3 : 0.8;
                })
                .attr("stroke", d => {
                    const crimeData = crimesByDivision.get(d.id);
                    return district_name !== "All Districts" && crimeData?.divisionName === district_name ? "#000" : "#444";
                })
                .style("filter", "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2))");

            d3.select(".tooltip").remove();
        });

    // Add legend in the top-left corner
    const legendGroup = svg.append("g")
        .attr("transform", `translate(20, 20)`)
        .attr("class", "legend");

    const legendHeight = 150;
    const legendWidth = 20;

    // Define legend scale
    const legendScale = d3.scaleLinear()
        .domain(colorScale.domain())
        .range([legendHeight, 0]);

    // Draw legend gradient
    const legendAxis = d3.axisRight(legendScale).ticks(5);

    const gradient = legendGroup.append("defs")
        .append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    gradient.selectAll("stop")
        .data(d3.ticks(0, 1, 10))
        .join("stop")
        .attr("offset", d => `${d * 100}%`)
        .attr("stop-color", d => colorScale(globalMinIndex + d * (globalMaxIndex - globalMinIndex)));

    legendGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");

    // Add legend axis
    legendGroup.append("g")
        .attr("transform", `translate(${legendWidth}, 0)`)
        .call(legendAxis);

    legendGroup.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .text("District's Crime Index")
        .style("font-size", "12px")
        .style("fill", "#fff")
        .style("font-weight", "bold");

    return svg.node();
}
