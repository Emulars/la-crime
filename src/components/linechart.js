import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

export function LineChart(data, yearlyCrimes, colorScale, {width} = {}) {

    // Calcolo della media mensile complessiva rispetto a tutti gli anni
    const monthlyAvg = d3.rollup(
        data,
        (v) => d3.mean(v, (d) => d.MonthlyCrimeCount),
        (d) => d.Month
    );
    
    // Calcolo della media complessiva annuale
    const overallAvg = d3.mean(data, (d) => d.MonthlyCrimeCount);
    
    // Mapping mesi in abbreviazioni inglesi
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Trova il massimo anno per crimini (es. 2022)
    const maxYear = d3.rollups(
        data,
        (v) => d3.sum(v, (d) => d.MonthlyCrimeCount),
        (d) => d.Year
    ).sort((a, b) => d3.descending(a[1], b[1]))[0][0];

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
        height: 650,
        width: width,
        marginBottom: 50,
        marginLeft: 60,
        x: { 
            domain: d3.range(1, 13), 
            label: "Month", 
            tickFormat: (d) => monthLabels[d - 1] 
        },
        y: { 
            label: "Number of Crimes", 
            grid: true, 
            // Rendere il tick dell'origine in grassetto
            ticks: 5,
            tickFormat: (d) => d === 0 ? `**${d}**` : d // Grassetto per origine
        },
        marks: [
            // Linee tratteggiate manuali per l'origine dell'asse Y
            Plot.ruleY([14000], { //d3.min(data, d => d.MonthlyCrimeCount) 
                stroke: "lightgrey", 
                strokeDasharray: "4 4", 
                strokeWidth: 1 
            }),
            
            // Linee dei dati
            Plot.line(data, {
                x: "Month",
                y: "MonthlyCrimeCount",
                z: "Year",
                stroke: (d) =>
                    (d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) >
                        overallAvg) || (d.Year === 2020)
                    ? colorScale(yearlyCrimes.get(d.Year))
                    : "lightgray",
                strokeWidth: (d) => (d.Year === maxYear || d.Year === 2020 ? 2.5 : 1),
                strokeOpacity: (d) =>
                    d.Year === maxYear || d.Year === 2020
                    ? 1
                    : d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) <
                        overallAvg
                    ? 0.3
                    : 0.5
            }),
    
            // Linea tratteggiata per la media mensile complessiva
            Plot.line([...monthlyAvg], {
                x: (d) => d[0],
                y: (d) => d[1],
                stroke: "white",
                strokeDasharray: "4 4",
                strokeWidth: 2,
                tip: true
            }),
            
            // Etichetta della media
            Plot.text(
                [{ 
                    x: 12, 
                    y: overallAvg, 
                    text: "AVG" 
                }], 
                {
                    x: "x",
                    y: "y",
                    text: "text",
                    fill: "white",
                    textAnchor: "start",
                    dx: 5,
                    fontWeight: "bold"
                }
            ),
            
            // Etichette per linee sopra la media o casi speciali
            Plot.text(labelData, {
                x: "Month",
                y: "y",
                text: (d) => d.Year.toString(),
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