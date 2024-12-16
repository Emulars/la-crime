import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function LineChart(yearlyCrimes, monthlyAvg, colorScale, {width} = {})
{
    // Line Chart: Creazione
    return Plot.plot({
        height: 500,
        width: width,
        marginBottom: 50,
        marginLeft: 60,
        x: { domain: d3.range(1, 13), label: "Month" },
        y: { label: "Number of Crimes", grid: true },
        marks: [
                // Linee dei singoli anni
                Plot.line(data, {
                x: "Month",
                y: "MonthlyCrimeCount",
                z: "Year",
                stroke: (d) => colorScale(yearlyCrimes.get(d.Year)),
                strokeWidth: 1.5,
                tip: true
            }),
            // Linea tratteggiata che rappresenta la media mensile
            Plot.line([...monthlyAvg], {   
                x: (d) => d[0], // Mese (1-12)
                y: (d) => d[1], // Media mensile
                stroke: "white",   
                strokeDasharray: "4 4",   
                strokeWidth: 3, 
                tip: true 
            }),
            // Label alla fine di ogni linea
            Plot.text(data.filter((d) => d.Month === 12), {
                x: "Month",
                y: "MonthlyCrimeCount",
                text: (d) => d.Year,
                fill: (d) => colorScale(yearlyCrimes.get(d.Year)),
                textAnchor: "start",
                dx: 5,
                fontWeight: "bold"
            })
        ]
    });
}