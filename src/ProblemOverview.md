---
title: Problem overview
---

# Problem overview

```js
import { LineChart } from "./components/linechart.js";
import { BarChart } from "./components/barchart.js";
```

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

// Trova il massimo conteggio crimini per mese con l'anno corrispondente
const maxCrimeByMonth = d3.rollups(
  data,
  (v) => {
    const maxEntry = d3.max(v, (d) => d.MonthlyCrimeCount);
    const maxRecord = v.find((d) => d.MonthlyCrimeCount === maxEntry);
    return { year: maxRecord.Year, count: maxRecord.MonthlyCrimeCount };
  },
  (d) => d.Month
);

// Creazione del gradiente di colori per i valori
const colorScale = d3.scaleSequential(d3.interpolateReds).domain(d3.extent([...yearlyCrimes.values()]));

// Mapping mesi in abbreviazioni inglesi
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>January ❄️ [${maxCrimeByMonth[0][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[0][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>February 💘 [${maxCrimeByMonth[1][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[1][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>March 🌱 [${maxCrimeByMonth[2][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[2][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>April 🌷 [${maxCrimeByMonth[3][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[3][1].count.toLocaleString('it-IT')}</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => LineChart(data, yearlyCrimes, maxYear, monthLabels, monthlyAvg, overallAvg , colorScale, {width}))}
    ${resize((width) => BarChart(yearlyCrimes, colorScale, {width}))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h2>May 🌺 [${maxCrimeByMonth[4][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[4][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>June 🏖️ [${maxCrimeByMonth[5][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[5][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>July 🍉 [${maxCrimeByMonth[6][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[6][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>August ☀️ [${maxCrimeByMonth[7][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[7][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>September 🍂 [${maxCrimeByMonth[8][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[8][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>October 🎃 [${maxCrimeByMonth[9][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[9][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>November 🦃 [${maxCrimeByMonth[10][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[10][1].count.toLocaleString('it-IT')}</span>
  </div>
  <div class="card">
    <h2>December 🎄 [${maxCrimeByMonth[11][1].year}]</h2>
    <span class="big">${maxCrimeByMonth[11][1].count.toLocaleString('it-IT')}</span>
  </div>
</div>