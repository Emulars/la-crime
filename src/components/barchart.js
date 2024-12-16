import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function BarChart(yearlyCrimes, colorScale, {width} = {})
{
    // Bar Chart: Creazione
    return Plot.plot({
        height: 100,
        width: width,
        marginTop: 20,
        marginBottom: 50,
        x: { label: "Year" },
        y: { label: "Total Crimes" },
        marks: [
            Plot.barY([...yearlyCrimes], {
            x: (d) => d[0], // Anno
            y: (d) => d[1], // Totale crimini
            fill: (d) => colorScale(d[1]),
            title: (d) => `Year: ${d[0]}\nCrimes: ${d[1]}`
            })
        ]
    });
}