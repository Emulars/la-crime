import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function BarChart(yearlyCrimes, colorScale, {width} = {}) {
    // Calcola la media totale dei crimini
    const totalCrimes = [...yearlyCrimes.values()];
    const averageCrimes = d3.mean(totalCrimes);

    // Bar Chart: Creazione
    return Plot.plot({
        title: "Above or Below the Norm? LA Crime Deviations from the Average (2010–2023)",
        subtitle: "Where do the biggest divergences occur, and what might explain them?",
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
            Plot.ruleY([0], {stroke: "lightgrey", strokeWidth: 1, title: "Average"}),
            Plot.text([`AVG: ${averageCrimes.toLocaleString("en-EN").split(".")[0]}`], {
                x: "2024", // Posizionamento al centro
                y: -4000, // Posizionamento sotto l'asse
                textAnchor: "middle",
                //dy: "5em", // Offset verticale per migliorare il posizionamento
                fill: "white",
                fontSize: 12
            })
        ]
    });
}
