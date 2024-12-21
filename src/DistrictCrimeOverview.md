---
title: LAPD Crime Districts Overview
theme: ["dashboard", "slate", "alt"]
---

# LAPD Crime Districts Overview

```js
// Import and CONSTANTS
import {viewSlider} from "./components/inputs/yearSelector.js";
import {dropdown} from "./components/inputs/dropdown.js";
import {choroplethMap} from "./components/choropleth.js";
import {scatterPlot} from "./components/scatter.js";
import {lineChartCrimeIndex} from "./components/lineChartCrimeIndex.js";

const MIN_YEAR = 2010;
const MAX_YEAR = 2023;
```

```js
const data = FileAttachment("data/district_crime_analysis.csv").csv({ typed: true });
const lapd_division_ids = FileAttachment("./data/LAPD_Division_IDs.json").json();
const lapd_division_map = FileAttachment("./data/LAPD_Division_5922489107755548254.geojson").json();

const data_scatter = FileAttachment("data/hourly_crime_analysis.csv").csv({ typed: true });
```

```js
// Extract division names for the dropdown options
const divisionNames = lapd_division_ids.map(division => division.name);
divisionNames.push("All Districts");
```

<p><i>Year selector for the maps below</i></p>

<div class="grid grid-cols-2">
  <div class="card">

  ```js
  // Crea un range slider per selezionare l'anno
  const selectedYear = view(viewSlider(MIN_YEAR, MAX_YEAR));
  ```

  </div>
  <div class="card">

  ```js
  // Division selector using names
  const divisionSelector = view(dropdown(divisionNames, "🗾 LAPD District"));
  ```

  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">${resize((width) => choroplethMap(lapd_division_map, lapd_division_ids, data, selectedYear, divisionSelector, {width, height: 600}))}</div>
  <div class="card">${resize((width) => scatterPlot(data_scatter, selectedYear, divisionSelector, {width, height: 600}))}</div>
</div>

<p><i>(Bozza) - Districts' crime index trend over the years</i></p>
<div class="grid grid-cols-1">
  <div class="card">${resize((width) => lineChartCrimeIndex(data, {width, height: 600}))}</div>
</div>

<div class="card">
  <h3>Crime Index Computation</h3>
  <p>The crime index is a composite measure designed to represent the relative danger level of different districts. It combines two key components:</p>
  <div class="grid grid-cols-2">
    <div class="card">
      <h4>Weighted Crime Index</h4>
      <p>This considers the severity and frequency of each crime type, computed as the weighted sum of crimes divided by the maximum weighted crime value in the dataset.</p>
    </div>
    <div class="card">
      <h4>Crime Density</h4>
      <p>The total number of crimes in a district divided by its area in square kilometers.</p>
    </div>
  </div>
  <div class="card">
    <h4>Computation Formula</h4>
    <pre>
    danger_index = (alpha * weighted_crime_index) + (beta * crime_density)
    </pre>
    <p>Where:</p>
    <ul>
      <li><code>alpha</code> and <code>beta</code> are coefficients that adjust the importance of each component. Currently, <code>alpha</code> is set to 0.6 and <code>beta</code> is set to 0.4.</li>
      <li><code>crime_severity</code> mapping crime types to their severity values.</li>
      <li><code>crime_count</code> mapping crime types to their frequencies in the district.</li>
      <li><code>area</code> is the district area in square kilometers.</li>
    </ul>
    <p>The computed indices are normalized across districts to facilitate comparison.</p>
  </div>
</div>
