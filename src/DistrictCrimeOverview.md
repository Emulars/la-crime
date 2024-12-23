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
```

<div class="grid grid-cols-1">
Los Angeles is not just one city but a multitude of communities coexisting side by side. From the star-studded streets of Hollywood to the bustling neighborhoods of Central and Rampart, L.A.’s crime mosaic spans every district. Which crimes are prevalent in Hollywood? Which hours of the day pose greater safety risks? And which districts have undergone the steepest rises or drops in crime over the years?<br>
</div>
<i>Methodological Note</i>
<div class="grid grid-cols-1">
The Crime Index used in these visualizations is a composite measure that integrates two key components:<br>
1) Weighted Crime Index, which assigns greater weight to more violent and serious crimes.
<br>
2) Crime Density, i.e., the number of crimes per square kilometer.
<br>
<br>
By blending these two, we aim for a balanced comparison between neighborhoods that differ in size and population.
</div>

<div class="grid grid-cols-1">
Los Angeles is ever-changing, and its crime patterns shift accordingly across different neighborhoods. Statistics show that each district has its own criminal “DNA,” with distinct crime types, peak hours, and historical trajectories that can vary significantly
<br>
</div>

## “Mapping L.A.’s Crime Hotspots”

<div class="grid grid-cols-1">
The map before you illustrates each area’s Crime Index, a standardized indicator of “danger level”.<br> Under the hood, Weighted Crime Index factors in the severity of each crime type (e.g., violent crimes carry a higher weight than petty theft) and its frequency, while Crime Density measures how many crimes occur per square kilometer. A high danger_index, therefore, can reflect either a large volume of less-severe crimes, a smaller volume of very severe crimes—or both.<br>
Notice how districts such as Olympic and Rampart show higher indices, suggesting a mix of highly severe crime types and high population density. This heatmap not only pinpoints trouble spots but also highlights that crime isn’t uniformly distributed across Los Angeles.<br>
</div>

<div class="grid grid-cols-1">For a more in detail look at the crime index computation and its components, check out the <a href="https://emulars.github.io/la-crime/dataPreparation#introduction-of-the-crime-relevance-column">Crime Index Calculation<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a></div>


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
  <div class="card">
    <h2>Crime Hotspots Revealed:</h2>
    <h3><em>A District-by-District Look at the City’s Crime Index</em></h3> 
    </br>
    ${resize((width) => choroplethMap(lapd_division_map, lapd_division_ids, data, selectedYear, divisionSelector, {width, height: 600}))}
  </div>

  <div class="card">
    <h2>Clocking Crime:</h2>
    <h3><em>A ${selectedYear} Hour-by-Hour Look at Offenses and Weapon Use in ${divisionSelector}</em></h3> 
    </br>
    ${resize((width) => scatterPlot(data_scatter, selectedYear, divisionSelector, {width, height: 600}))}
  </div>
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
  <div class="card">
    <h2>13 Years of Crime Trends:</h2>
    <h3><em>Tracking Each District's Rising and Falling Index from 2010–2023</em></h3> 
    </br>
    ${resize((width) => lineChartCrimeIndex(data, {width, height: 600}))}
  </div>
</div>

<div class="grid grid-cols-1">
One key insight is how local factors drive these trends. A district with fewer total crimes can still score high if those crimes are more severe, reflecting the weighting in the Crime Index. Moreover, changes in policing strategies or demographic shifts can bring sudden inflections in the graph. Observe how Central and Rampart sometimes converge or diverge in the timeline, hinting at broader forces, such as new housing developments, gentrification, or targeted law enforcement campaigns, that reshape the crime landscape. Ultimately, these lines underscore the reality that Los Angeles is in constant flux, with each district writing its own chapter in the city’s ongoing story of crime and community.
</div>

## A Closer Look at Who Lives in Each District

<div class="grid grid-cols-1"> Los Angeles is known for its immense diversity, and each district’s demographic makeup can shed light on the nuances of crime data. For instance, Rampart, known for a higher Crime Index—also has one of the highest percentages of Hispanic residents (60%). Meanwhile, Central Division houses a more even mix of ethnic groups, with around 27% Black residents, 14% Asian, and a notable 38% Hispanic population. These demographic patterns may intersect with economic, cultural, or linguistic factors that influence both the types of crimes reported and how communities respond to policing.<br><br> This lens helps us see that a high Crime Index isn’t just a numeric label—it impacts a unique mosaic of communities. It also prompts important questions: Are policing policies tailored to the cultural and linguistic needs of predominantly non-English-speaking neighborhoods? Do outreach programs differ in areas where a large proportion of residents are recent immigrants? As you read on, keep in mind how population characteristics play a pivotal role in shaping a district’s social dynamics—and thus its crime profile. </div>

### References

[Race and Ethnicity in Los Angeles](https://statisticalatlas.com/place/California/Los-Angeles/Race-and-Ethnicity)