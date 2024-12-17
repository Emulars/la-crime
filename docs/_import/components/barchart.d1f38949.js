import * as Plot from "../../_npm/@observablehq/plot@0.6.16/e828d8c8.js";
import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

export function BarChart(yearlyCrimes, colorScale, {width} = {})
{
    // Bar Chart: Creazione
    return Plot.plot({
        height: 200,
        width: width,
        marginTop: 20,
        marginBottom: 50,
        x: { label: "Year" },
        y: { label: "Total Crimes", domain: [0, d3.max([...yearlyCrimes.values()], (d) => d) * 1.2] },
        marks: [
            Plot.barY([...yearlyCrimes], {
            x: (d) => d[0], // Anno
            y: (d) => d[1], // Totale crimini
            fill: (d) => colorScale(d[1]),
            title: (d) => `Year: ${d[0]}\nCrimes: ${d[1]}`,
            tip: true
            })
        ]
    });
}