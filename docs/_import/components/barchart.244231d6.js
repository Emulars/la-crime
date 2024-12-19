import * as Plot from "../../_npm/@observablehq/plot@0.6.16/e828d8c8.js";
import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

export function BarChart(yearlyCrimes, colorScale, {width} = {}) {
    // Calcola la media totale dei crimini
    const totalCrimes = [...yearlyCrimes.values()];
    const averageCrimes = d3.mean(totalCrimes);

    // Bar Chart: Creazione
    return Plot.plot({
        title: "Increasing of the crime trends over the years [2010-2023]",
        subtitle: "Deviation from the average crimes (" + averageCrimes.toFixed(0) + ")",
        height: 200,
        width: width,
        marginTop: 20,
        marginBottom: 50,
        x: { label: "Year", type: "band" },
        y: { 
            label: "Deviation from Average Crimes", 
            domain: [d3.min(totalCrimes, d => d - averageCrimes) * 1.2, d3.max(totalCrimes, d => d - averageCrimes) * 1.2] 
        },
        marks: [
            Plot.barY([...yearlyCrimes], {
                x: (d) => d[0].toString(), // Anno
                y: (d) => d[1] - averageCrimes, // Deviazione dalla media
                fill: (d) => colorScale(d[1]), // Colore basato sul valore originale
                title: (d) => `Year: ${d[0]}\nCrimes: ${d[1]}\nDeviation: ${(d[1] - averageCrimes).toFixed(0)}`,
                tip: true
            }),
            // Linea della media
            Plot.ruleY([0], {stroke: "lightgrey", strokeWidth: 1, strokeDasharray: "4 4", title: "Average"})
        ]
    });
}
