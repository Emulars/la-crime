import * as Plot from "../../_npm/@observablehq/plot@0.6.16/6fc5a277.js";
import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

export function scatterPlot(data, year, district, { width = 800, height = 500 } = {}) {
    // Filter the data
    const filteredData =
      district === "All Districts"
        ? data.find((d) => d.Year === year && d.District === "All Districts")
        : data.find((d) => d.Year === year && d.District === district);

    if (!filteredData) {
        throw new Error(`No data found for year ${year} and district ${district}`);
    }

    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Extract the crimes and weapon percentages from the row
    const crimes = hours.map((hour) => filteredData[`Hour_${hour}`] || 0);
    const weaponPercentages = hours.map(
      (hour) => filteredData[`Hour_${hour}_WeaponPercentage`] || 0
    );

    // Define colors based on time of day
    const hourColors = hours.map((hour) => {
        if (hour >= 6 && hour < 12) return "#E5DE44"; // Morning
        if (hour >= 12 && hour < 18) return "#EF810E"; // Afternoon
        return "#985eff"; // Night
    });

    // Prepare data for Plot
    const plotData = hours.map((hour, i) => ({
        hour,
        crimes: crimes[i],
        weaponPercentage: weaponPercentages[i],
        color: hourColors[i],
        highlight: weaponPercentages[i] > 50,
    }));

    // Define constants for y-scale domains
    const districtCrimesMax = d3.max(
        data.filter((d) => d.District !== "All Districts"),
        (d) => Math.max(...Array.from({ length: 24 }, (_, i) => d[`Hour_${i}`]))
    );

    const allDistrictsCrimesMax = d3.max(
        data.filter((d) => d.District === "All Districts"),
        (d) => Math.max(...Array.from({ length: 24 }, (_, i) => d[`Hour_${i}`]))
    );

    // Determine consistent scales
    const yDomain = district === "All Districts" ? [0, allDistrictsCrimesMax] : [0, districtCrimesMax];

    const plot = Plot.plot({
        height,
        width,
        marks: [
            // Scatter points
            Plot.dot(plotData, {
                x: "hour",
                y: "crimes",
                stroke: "color",
                fill: "color",
                r: 5,
                tip: true,
                title: (d) => `Hour: ${d.hour}, \nCrimes: ${d.crimes}, \nWeapon %: ${d.weaponPercentage.toFixed(1)}%`,
            }),
            // Highlighted points (Weapon % > 50)
            Plot.dot(plotData.filter((d) => d.highlight), {
                x: "hour",
                y: "crimes",
                stroke: "red",
                fill: "none",
                r: 8,
                strokeWidth: 2,
            }),
        ],
        x: {
            domain: [0, 23],
            label: "Hours",
            tickFormat: (d) => `${d}`,
            ticks: 24, // Show all hours
        },
        y: {
            domain: yDomain,
            label: "Average Number of Crimes",
        },
        color: {
            legend: true,
            type: "ordinal",
            domain: ["Morning (6–12)", "Afternoon (12–18)", "Night (18–6)"],
            range: ["#E5DE44", "#EF810E", "#985eff"],
        },
    });

    // Create a custom title element
    // const titleElement = document.createElement("div");
    // titleElement.style.fontSize = "18px";
    // titleElement.style.fontWeight = "bold";
    // titleElement.style.textAlign = "center";
    // titleElement.style.marginBottom = "10px";
    // titleElement.style.fontFamily = "Roboto";
    // titleElement.innerText = `Crimes by Hour in ${district} (${year})`;

    // Create a custom red circle legend
    const customLegend = document.createElement("div");
    customLegend.style.display = "flex";
    customLegend.style.alignItems = "center";
    customLegend.style.marginBottom = "10px";
    customLegend.innerHTML = `
        <svg width="20" height="20">
            <circle cx="10" cy="10" r="8" stroke="red" fill="none" stroke-width="2"></circle>
        </svg>
        <span style="margin-left: 5px;">Weapon % > 50</span>
    `;

    // Combine the title, custom legend, and plot in a single container
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    // container.appendChild(titleElement); // Add the HTML title
    container.appendChild(customLegend); // Add the custom legend
    container.appendChild(plot); // Add the plot

    return container;
}
