---
title: Victims demographic groups
toc: true
theme: ["dashboard", "slate", "alt"]
---

# Behind the Numbers: Who Are the Victims?
## Exploring how age, gender, and ethnicity intersect to reveal the human impact of crime in Los Angeles (2010–2023)
```js
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { groupedBar } from "./components/grouped_barchart.js";

// Load and process the data
const nodesData = FileAttachment("data/nodes.json").json();
```

```js
const linksData = FileAttachment("data/links.json").json();
```

```js
const data = FileAttachment("data/grouped_bar_chart_data.csv").csv();
```

```js
// Constants for visualization
const height = 800;
const padding = 20;

const colorScale = {
  Gender: d3.scaleOrdinal()
    .domain(["M", "F"])
    .range(["#2c7bb6", "#ffccff"]),
  
  Ethnicity: d3.scaleOrdinal()
    .domain(["Hispanic", "White", "Black", "Other", "Asian", "Unknown"])
    .range(["#7b3294", "#22a9cf", "#a6dba0", "#008837", "#e66101", "#999999"]),
  
  AgeRange: d3.scaleOrdinal()
    .domain(["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "Unknown"])
    .range(d3.schemeBlues[9].concat("#999999"))
};
```

```js
const convertToAlluvial = (nodesD, linksD) => {
  const alluvialData = {
  nodes: nodesD.map(d => ({ 
    id: d.id,
    name: d.name,
    category: d.category 
  })),
  links: linksD.map(link => ({
    source: link.source,
    target: link.target,
    value: link.value,
    sourceCategory: link.source_category,
    targetCategory: link.target_category,
    percentage: link.percentage
  }))
  };

  return alluvialData;
};
```

```js
const alluvialData = convertToAlluvial(nodesData, linksData);
```

```js
const drawAlluvialDiagram = () => {
  d3.select("#alluvial-container").selectAll("svg").remove();

  const svg = d3.select("#alluvial-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${padding},${padding})`);

  // Configure Sankey generator with node alignment
  const sankeyGenerator = sankey()
    .nodeId(d => d.id)
    .nodeWidth(15)
    .nodePadding(10)
    .nodeSort((a, b) => a.category.localeCompare(b.category))
    .extent([[0, 0], [width - padding * 2, height - padding * 2]]);

  sankeyGenerator(alluvialData);

  // Create tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("font-size", "12px");

  let selectedNodeId = null; // Track the currently selected node
  // Function to handle node click and highlight related links
  const highlightLinks = (nodeId) => {
    if (selectedNodeId === nodeId) {
      // If the same node is clicked again, reset the highlighting
      svg.selectAll("path").attr("stroke-opacity", 0.4);
      svg.selectAll("rect").attr("opacity", 1);
      selectedNodeId = null; // Reset the selected node
    } else {
      // Highlight the links related to the new node
      svg.selectAll("path")
        .attr("stroke-opacity", d => d.source.id === nodeId || d.target.id === nodeId ? 0.8 : 0.1);
      svg.selectAll("rect")
        .attr("opacity", d => d.id === nodeId ? 1 : 0.3);
      selectedNodeId = nodeId; // Update the selected node
    }
  };

  // Function to update the tooltip content
  const updateTooltipContent = (d) => {
    tooltip.html(`
        ${d.source.name} → ${d.target.name}<br/>
        Count: ${d.value}<br/>
        Percentage: ${d.percentage.toFixed(1)}%
      `);
  };

  // Draw links
  svg.append("g")
    .selectAll("path")
    .data(alluvialData.links)
    .join("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("fill", "none")
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("stroke", d => d3.rgb(colorScale[d.sourceCategory.split('_')[0]](d.source.name)).darker(0.3))
    .attr("stroke-opacity", 0.5)
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      updateTooltipContent(d)
      tooltip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // Draw nodes
  svg.append("g")
    .selectAll("rect")
    .data(alluvialData.nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => colorScale[d.category.split('_')[0]](d.name))
    .attr("stroke", "#000")
    .on("click", (event, d) => {
      highlightLinks(d.id);
    });

  // Add labels
  svg.append("g")
    .selectAll("text")
    .data(alluvialData.nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => `${d.name} (${((d.value)/100000).toFixed(2)})`)
    .style("font-size", "10px")
    .attr("fill", "#fff");

  return svg.node();
};

// Style definitions
const styles = `
.tooltip {
  pointer-events: none;
  z-index: 100;
}
`;

// Add styles to document
d3.select("head")
  .append("style")
  .html(styles);

  // Draw the diagram
drawAlluvialDiagram();
```

<div class="grid grid-cols-1">
Los Angeles is not merely a map of districts and statistics: behind every crime there’s a face, an age, a story. To truly understand how crime shapes urban life, it’s essential to explore who suffers and under what circumstances. The following visualizations shine a spotlight on a frequently overlooked theme: the disparity in victim distribution by gender, ethnicity, and age group.
<br>
Data shows that men (M) have slightly higher victimization rates than women (F). However, when zooming in on specific subgroups, some disparities immediately stand out. Young Hispanic males aged 20–29, for instance, show significantly higher incidence rates compared to the general population. This spike is likely the result of a complex mix of factors, including economic instability, gang violence exposure, and greater participation in social activities in high-risk areas.
<br>
Women, on the other hand, present a different picture. While their overall victimization level is lower, females aged 20–29 record higher numbers of violent crimes tied to family conflicts and domestic violence. This specificity raises key questions about power dynamics within the home and the need to strengthen support centers and protection programs.
<br>
As age increases, the data shows a drop in crimes affecting both men and women. However, those over 60 remain more vulnerable to fraud and financial crimes—evidence of how “invisible crime,” from online scams to identity theft, can target people with fixed or retirement incomes, or those less familiar with emerging forms of deception.
<br>
These patterns offer valuable insights for rethinking prevention priorities. While socioeconomic and job-inclusion interventions may prove crucial for young adults, women of childbearing age require robust support against gender-based violence. Finally, seniors would benefit from financial literacy and digital assistance, helping curb their vulnerability in an increasingly tech-driven criminal landscape.
<br>
By comparing age brackets in the charts, one quickly sees the significance of the social context in which crimes occur. The intersections of age, gender, and ethnicity confirm how targeted interventions, such as programs addressing domestic violence or rehabilitation for youth in disadvantaged areas, can significantly reduce exposure to specific offenses.
</div>
<div class="grid grid-cols-1">
  <div class="card">
  <h2>Victim Demographics: A Telling Flow of Crime’s Impact</h2>
  <h3><em>How gender, ethnicity, and age converge in shaping victimization rates <br> Clickable nodes and tooltip on links</em></h3> 
  </br>
  <p><em>Unit of measure: victims per 100,000 inhabitants</em></p>
  <div id="alluvial-container"></div>
  </div>
</div>

<div class="grid grid-cols-1">
The alluvial chart above provides an in-depth view of how gender, ethnicity, and age interconnect in the victimization landscape of Los Angeles. By illustrating the flow between demographic groups and crime types, it becomes evident that certain subgroups are disproportionately affected.<br>
Young Hispanic males in the 20–29 age bracket emerge as one of the most vulnerable groups, with higher incidences of violent crime. This vulnerability may be attributed to socioeconomic challenges and gang-related violence prevalent in certain neighborhoods. Women in the same age group, on the other hand, are more frequently victims of domestic violence and family-related assaults, highlighting the need for stronger support systems and protection programs.
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => groupedBar(data, {width}))}
  </div>
</div>

<div class="grid grid-cols-1">
The bar chart further clarifies these trends by showing that the highest crime volumes for both men and women occur between the ages of 20 and 29. While women in this range are primarily affected by domestic violence, men are more frequently involved in property crimes, car thefts, and break-ins. Over time, as age increases, a shift occurs: fraud and financial crimes become the predominant concern, particularly among the elderly. This shift underscores the importance of enhancing financial literacy and digital awareness to protect older populations from modern scams.
</div>

# The Human Face of Safety in Los Angeles

<div class="grid grid-cols-1">
In such a complex setting, understanding “who” bears the brunt of criminal acts is just as crucial as “how much” and “where.” Seeing how age, gender, and ethnicity map onto different victimization patterns paves the way for reflections on legislative reforms and social programs. From specialized task forces for domestic abuse to financial literacy for older adults and integrated interventions in the most vulnerable districts, institutional and community efforts can make all the difference.
<br>
These numbers aren’t simply figures on a graph; they are the stories of people living, working, and seeking safety in one of the world’s most dynamic cities. As analysts and social workers caution, a one-size-fits-all approach seldom works in such a multifaceted context. Instead, a mosaic of tailored actions is needed to tackle specific vulnerabilities, from combating gender violence to preventing youth gang recidivism and protecting the elderly from online scams.
<br>
Future developments partly hinge on political will to invest in economic inclusion projects, expand law enforcement training, and support neighborhoods that are most at risk. Moving forward, every effort to protect the most vulnerable, provide adequate resources, and strengthen community trust can bring Los Angeles one step closer to becoming a safer and more equitable city.
</div>