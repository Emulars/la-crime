import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function LineChart(data, yearlyCrimes, maxYear, monthLabels, monthlyAvg, overallAvg , colorScale, {width} = {}) {

    // Prepare label data with collision adjustments
    const labelData = avoidCollisions(
        data
            .filter(
                (d) =>
                    d.Month === 12 &&
                    (d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) >=
                        overallAvg || d.Year === maxYear || d.Year === 2020)
            )
            .map((d) => ({
                Month: d.Month,
                MonthlyCrimeCount: d.MonthlyCrimeCount,
                Year: d.Year,
                y: d.MonthlyCrimeCount // Use y-position for sorting
            }))
    );


    return Plot.plot({
        title: "Monthly Crime Trends over the Years [2010-2023]",
        height: 650,
        width: width,
        marginBottom: 50,
        marginLeft: 60,
        x: { domain: d3.range(1, 13), label: "Month", tickFormat: (d) => monthLabels[d - 1] },
        y: { label: "Number of Crimes", grid: true },
        marks: [
            // Linee con Gray-Out per linee sotto la media e linea speciale per maxYear
            Plot.line(data, {
            x: "Month",
            y: "MonthlyCrimeCount",
            z: "Year",
            stroke: (d) =>
                (d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) >
                    overallAvg) || (d.Year === 2020)
                ? colorScale(yearlyCrimes.get(d.Year))
                : "lightgray"
            ,
            strokeWidth: (d) => (d.Year === maxYear ? 3.5 : 1),
            strokeOpacity: (d) =>
                d.Year === maxYear || d.Year === 2020
                ? 1
                : d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) <
                    overallAvg
                ? 0.3
                : 0.5, // Trasparenza per linee sotto la media
            }),
    
            // Linea tratteggiata che rappresenta la media mensile complessiva
            Plot.line([...monthlyAvg], {
                x: (d) => d[0],
                y: (d) => d[1],
                stroke: "white",
                strokeDasharray: "4 4",
                strokeWidth: 2,
                tip: true
            }),
            // Label "Mean" vicino alla linea della media
            Plot.text(
                [{ 
                    x: 12, 
                    y: overallAvg, 
                    text: "AVG" 
                }], 
                // Posizione e testo della label
                {
                    x: "x",
                    y: "y",
                    text: "text",
                    fill: "white",
                    textAnchor: "start", // Allineamento a sinistra
                    dx: 5, // Piccolo offset orizzontale
                    fontWeight: "bold"
                }
            ),
            // Labels for lines above average or special cases with refined collision avoidance

            Plot.text(labelData, {
                x: "Month",
                y: "y",
                text: (d) => d.Year,
                fill: (d) => (d.Year === maxYear ? "red" : colorScale(yearlyCrimes.get(d.Year))),
                textAnchor: "start",
                dx: 5,
                fontWeight: (d) => (d.Year === maxYear ? "bold" : "normal")
            })
        ]
    });
}

// Prevent label overlaps using collision avoidance
function avoidCollisions(labels, spacing = 10) {
    labels.sort((a, b) => a.y - b.y); // Sort labels by y position
    for (let i = 1; i < labels.length; i++) {
        if (labels[i].y - labels[i - 1].y < spacing) {
            labels[i].y = labels[i - 1].y + spacing; // Push label downward
        }
    }
    return labels;
}