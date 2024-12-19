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

// Creazione del gradiente di colori per i valori
const colorScale = d3.scaleSequential(d3.interpolateReds).domain(d3.extent([...yearlyCrimes.values()]));
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => BarChart(yearlyCrimes, colorScale, {width}))}
    ${resize((width) => LineChart(data, yearlyCrimes, colorScale, {width}))}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => timeline(events, data, {width}))}
  </div>
</div>

