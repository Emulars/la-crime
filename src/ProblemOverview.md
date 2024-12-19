---
title: Problem overview
---

# Problem overview

```js
import { LineChart } from "./components/linechart.js";
import { BarChart } from "./components/barchart.js";
import {timeline} from "./components/timeline.js";
```

```js
// Caricamento dati
const data = FileAttachment("data/yearly_monthly_crime_summary.csv").csv({ typed: true });
const events = FileAttachment("./data/la_events.json").json();
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

// Mapping mesi in abbreviazioni inglesi
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Trova il massimo anno per crimini (es. 2022)
const maxYear = d3.rollups(
  data,
  (v) => d3.sum(v, (d) => d.MonthlyCrimeCount),
  (d) => d.Year
).sort((a, b) => d3.descending(a[1], b[1]))[0][0];

// Creazione del gradiente di colori per i valori
const colorScale = d3.scaleSequential(d3.interpolateReds).domain(d3.extent([...yearlyCrimes.values()]));
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => LineChart(data, yearlyCrimes, maxYear, monthLabels, monthlyAvg, overallAvg, colorScale, {width}))}
    ${resize((width) => BarChart(yearlyCrimes, colorScale, {width}))}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => timeline(events, data, {width}))}
  </div>
</div>

