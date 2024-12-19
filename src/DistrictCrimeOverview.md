---
title: LAPD Crime Districts Overview
---

# LAPD Crime Districts Overview

```js
// Import and CONSTANTS
import {viewSlider} from "./components/inputs/yearSelector.js";
import {dropdown} from "./components/inputs/dropdown.js";
import {choroplethMap} from "./components/choropleth.js";
import {scatterPlot} from "./components/scatter.js";

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
