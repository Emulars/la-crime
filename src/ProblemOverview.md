---
title: Problem overview
---

# Rising Tide of Crime: A Deep Dive into Los Angeles Crime Trends (2010–2023)
## How economic shifts, legislative reforms, and unprecedented events have shaped LA’s crime landscape over the last decade
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

Los Angeles has long been a mirror for nationwide debates on policing, social services, and economic justice. This article marks the first of three parts, taking us through the data on citywide crimes between 2010 and 2023. Upcoming pages will focus on the geographical distribution and timing of crimes, as well as deeper social dimensions, including victim demographics.

In this initial overview, we reveal broad trends, seeing how some years defy the norm, how the city’s monthly rhythms shift crime patterns, and which pivotal events may have nudged these numbers up or down. Whether driven by economic stresses, policy changes, or global crises, these statistics hold valuable lessons on the forces that shape city life.

Here, each year’s deviation from the long‐term citywide average (about 213,374 crimes) jumps out in bold. 2013 and 2014 fall sharply below the mean, offering hints that some combination of improved economic conditions or targeted policing strategies temporarily subdued criminal behavior. By contrast, 2016, 2017, and 2018 show pronounced spikes, each well above the average, an uptick that some commentators link to easing of certain penalties and the resulting shifts in law enforcement tactics.

Interestingly, 2020 records a moderate dip, likely owing to COVID‐19 restrictions and stay‐at‐home orders; yet 2022 and 2023 see renewed climbs, suggesting that once lockdowns eased and normal life resumed, underlying issues such as rising poverty and social tensions reasserted their influence.

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => BarChart(yearlyCrimes, colorScale, {width}))}
    ${resize((width) => LineChart(data, yearlyCrimes, colorScale, {width}))}
  </div>
</div>

The lines in this visualization showcase the cyclical nature of crime across the calendar year. Many years register a steep dip in February, possibly reflecting increased police presence after the holiday season or simply the lull before spring activity ramps up. Summers, especially in years like 2022, tend to surge past the 20,000‐crime mark, aligning with higher foot traffic, tourism, and broader economic pressures.

Notably, 2020 stands out with a sharper decline during early spring, coinciding with strict lockdowns that kept many people at home. As restrictions loosened, some forms of crime rebounded, emphasizing how external conditions can heavily shape the rhythm of criminal activity.

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => timeline(events, data, {width}))}
  </div>
</div>

Policy reforms, such as Proposition 57 and new rehabilitation programs, both reflect and contribute to shifting crime rates. Early legislative measures introduced around 2016–2017 coincided with a bump in recorded incidents, as the city negotiated new approaches to sentencing and parole.

When COVID‐19 hit in 2020, crime numbers initially dropped, a correlation easily spotted on the chart. However, a series of other stressors soon emerged: rising homelessness, intensifying gang conflicts, and debates over police funding. By 2022, these factors contributed to heightened volatility, before tapering slightly as COVID‐19 restrictions ended in 2023.

#Looking Ahead

Los Angeles’ crime story from 2010 to 2023 shows a tapestry of policy reforms, social programs, and disruptive events shaping the city’s safety landscape. Many fluctuations align with local legislation or major incidents, from rehabilitation initiatives to a global pandemic; indicating how deeply external forces can mold criminal activity.

But this is only the beginning. In our next installment, we’ll zoom in on how crime varies by neighborhood, examining the stark contrasts across diverse areas of LA, and the significance of day‐night patterns. From there, our final page broadens the lens to explore the social challenges behind the numbers, comparing victim demographics by ethnicity, gender, and age; analyzing how broader socio‐political climates influenced who was most at risk.

Throughout the 2010s and early 2020s, news headlines were filled with discussions of rising housing costs, changing policing strategies, and debates over systemic inequality. Each facet has woven itself into LA’s crime narrative. By reading this data in tandem with real‐world events, we gain a clearer view of not just the statistics, but the human stories they represent—stories that continue to unfold as the city carves its path forward.