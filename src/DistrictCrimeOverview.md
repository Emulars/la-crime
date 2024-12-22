---
title: LAPD Crime Districts Overview
theme: ["dashboard", "slate", "alt"]
---

<!-- CSS Style file reference -->
<link rel="stylesheet" href="style.css">

# A Glimpse into the Districts and Their Changing Faces

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

<div class="grid grid-cols-1">
Los Angeles is many different cities rolled into one. From Hollywood’s star-studded streets to the bustling neighborhoods of Central and Rampart, the tapestry of L.A. crime has woven itself into each district’s identity. But which crimes are most rampant in Hollywood? How do the hours of the day affect overall safety? And which districts have seen the steepest climb or drop in crime over time?<br><br>
As you read, keep in mind that the Crime Index used throughout these visualizations is a composite measure that combines a Weighted Crime Index (capturing both severity and frequency of crimes) and Crime Density (crimes per square kilometer). This method ensures a fair comparison across vastly different neighborhoods and geographies.
</div>

## “Mapping L.A.’s Crime Hotspots”

<div class="grid grid-cols-1">
The map before you illustrates each area’s Crime Index, a standardized indicator of “danger level” computed as:  <code> danger_index = (alpha * weighted_crime_index) + (beta * crime_density)</code> with α set to 0.6 and β set to 0.4. Under the hood, Weighted Crime Index factors in the severity of each crime type (e.g., violent crimes carry a higher weight than petty theft) and its frequency, while Crime Density measures how many crimes occur per square kilometer. A high danger_index, therefore, can reflect either a large volume of less-severe crimes, a smaller volume of very severe crimes—or both.<br>
Notice how districts such as Olympic and Rampart show higher indices, suggesting a mix of highly severe crime types and high population density. This heatmap not only pinpoints trouble spots but also highlights that crime isn’t uniformly distributed across Los Angeles.
</div>

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

## “Crimes by the Clock: Daytime vs. Nighttime Trends”

<div class="grid grid-cols-1">
Ever wondered if there’s truly a “witching hour” for crime? According to the chart that breaks down offenses by hour of the day, the answer may surprise you. While the highest peaks tend to cluster in the late afternoon (12–18) and early evening hours (18–6), the morning slot (6–12) still shows a significant volume of reported incidents—often around 8,000 to 9,000 crimes on average.<br>
Interestingly, however, some of the frequent spikes—such as the one around noon—may not stem from a genuine surge in criminal activity. Instead, they can be attributed to officers changing shifts, as they often log all reported incidents together just before clocking out. This administrative practice can artificially inflate numbers at certain times of day, underscoring the importance of reading the data with an eye toward operational factors as well as actual crime trends.
</div>

## “From 2010 to Now: Charting a Decade of Change”

<div class="grid grid-cols-1">
No city stays the same for long, and that is especially true for Los Angeles. The line chart tracking the Crime Index over time is a testament to how certain areas have experienced slow and steady declines, while others have skyrocketed—due to shifts in local populations, policing strategies, and social factors.<br>
By examining these lines together, we see how each district’s story is intertwined yet unique—revealing the city’s crime narrative on a grand scale. The interplay between Weighted Crime Index and Crime Density helps explain why even districts with fewer total crimes can still have a higher Danger Index if those offenses are more severe.
</div>

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => lineChartCrimeIndex(data, {width, height: 600}))}</div>
</div>

## Conclusion and next steps

<div class="grid grid-cols-1">
From morning thefts in Hollywood to the sharp climb in Rampart’s crime index, each district paints a distinct picture of Los Angeles. The data underscores which districts combine both higher crime density and more severe offenses, leading to a higher overall index. At the same time, it showcases areas that have improved over the years, demonstrating that policy initiatives, community involvement, and demographic shifts can alter a district’s narrative for better or worse.<br>
In the upcoming pages, we’ll dive deeper into specific victims demographic groups...
</div>
