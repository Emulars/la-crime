---
theme: [dashboard]
title: Problem overview
toc: true
---

# Problem overview

```js
// Caricamento dati
const data = FileAttachment("data/yearly_monthly_crime_summary.csv").csv({ typed: true });
```

```js
// Aggregazione dei dati annuali per il barchart
const yearlyCrimes = d3.rollup(
  data,
  (v) => d3.sum(v, (d) => d.MonthlyCrimeCount),
  (d) => d.Year
);

// Calcolo della media mensile complessiva rispetto a tutti gli anni
const monthlyAvg = d3.rollup(
  data,
  (v) => d3.mean(v, (d) => d.MonthlyCrimeCount),
  (d) => d.Month
);

// Calcolo della media complessiva annuale
const overallAvg = d3.mean(data, (d) => d.MonthlyCrimeCount);

// Trova il massimo anno per crimini (es. 2022)
const maxYear = d3.rollups(
  data,
  (v) => d3.sum(v, (d) => d.MonthlyCrimeCount),
  (d) => d.Year
).sort((a, b) => d3.descending(a[1], b[1]))[0][0];

// Creazione del gradiente di colori per i valori
const colorScale = d3.scaleSequential(d3.interpolateReds).domain(d3.extent([...yearlyCrimes.values()]));

// Mapping mesi in abbreviazioni inglesi
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

```

```js
function LineChart(yearlyCrimes, monthlyAvg, colorScale, {width} = {}) {
  return Plot.plot({
    height: 500,
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
        strokeWidth: (d) => (d.Year === maxYear ? 3 : 1),
        strokeOpacity: (d) =>
          d.Year === maxYear || d.Year === 2020
            ? 1
            : d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) <
              overallAvg
            ? 0.3
            : 0.5, // Trasparenza per linee sotto la media
        tip: true
      }),

      // Linea tratteggiata che rappresenta la media mensile complessiva
      Plot.line([...monthlyAvg], {
        x: (d) => d[0],
        y: (d) => d[1],
        stroke: "black",
        strokeDasharray: "4 4",
        strokeWidth: 2,
        tip: true
      }),
      // Label "Mean" vicino alla linea della media
      Plot.text(
          [
            { x: 12, 
            y: overallAvg, 
            text: "Mean" 
            }
          ], // Posizione e testo della label
          {
              x: "x",
              y: "y",
              text: "text",
              fill: "black",
              textAnchor: "start", // Allineamento a sinistra
              dx: 5, // Piccolo offset orizzontale
              fontWeight: "bold"
          }
      ),
      // Label solo per le linee sopra la media o speciali
      Plot.text(
        data.filter(
          (d) =>
            d.Month === 12 &&
            (d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) >=
              overallAvg || d.Year === maxYear || d.Year === 2020 )
        ),
        {
          x: "Month",
          y: "MonthlyCrimeCount",
          text: (d) => d.Year,
          fill: (d) => (d.Year === maxYear ? "red" : colorScale(yearlyCrimes.get(d.Year))),
          textAnchor: "start",
          dx: 5,
          dy: -5,
          fontWeight: (d) => (d.Year === maxYear ? "bold" : "normal")
        }
      )
    ]
  });
}

function BarChart(yearlyCrimes, colorScale, {width} = {})
{
    // Bar Chart: Creazione
    return Plot.plot({
        height: 120,
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
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => LineChart(yearlyCrimes, monthlyAvg, colorScale, {width}))}
    ${resize((width) => BarChart(yearlyCrimes, colorScale, {width}))}
  </div>
</div>