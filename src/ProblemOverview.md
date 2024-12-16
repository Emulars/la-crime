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
```

```js
function LineChart(yearlyCrimes, monthlyAvg, colorScale, {width} = {}) {
  return Plot.plot({
    height: 500,
    width: width,
    marginBottom: 50,
    marginLeft: 60,
    x: { domain: d3.range(1, 13), label: "Month" },
    y: { label: "Number of Crimes", grid: true },
    marks: [
      // Linee con Gray-Out per linee sotto la media e linea speciale per maxYear
      Plot.line(data, {
        x: "Month",
        y: "MonthlyCrimeCount",
        z: "Year",
        stroke: (d) =>
          d.Year === maxYear
            ? "red" // Linea rossa per l'anno con il massimo dei crimini
            : d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) <
              overallAvg
            ? "lightgray" // Gray-out per linee sotto la media
            : colorScale(yearlyCrimes.get(d.Year)),
        strokeWidth: (d) => (d.Year === maxYear ? 3 : 1),
        strokeOpacity: (d) =>
          d.Year === maxYear || d.Year === 2020
            ? 1
            : d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) <
              overallAvg
            ? 0.3
            : 1, // Trasparenza per linee sotto la media
        tip: true
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

      // Label solo per le linee sopra la media o speciali
      Plot.text(
        data.filter(
          (d) =>
            d.Month === 12 &&
            (d3.mean(data.filter((e) => e.Year === d.Year), (e) => e.MonthlyCrimeCount) >=
              overallAvg || d.Year === maxYear )
        ),
        {
          x: "Month",
          y: "MonthlyCrimeCount",
          text: (d) => d.Year,
          fill: (d) => (d.Year === maxYear ? "red" : colorScale(yearlyCrimes.get(d.Year))),
          textAnchor: "start",
          dx: 5,
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
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => LineChart(yearlyCrimes, monthlyAvg, colorScale, {width}))}
    ${resize((width) => BarChart(yearlyCrimes, colorScale, {width}))}
  </div>
</div>