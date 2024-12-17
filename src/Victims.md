---
theme: [dashboard]
title: Problem overview
toc: true
---

# Victims Demographic Group

```js
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

// Load and process the data
const nodesData = FileAttachment("data/nodes.json").json();
```

```js
const linksData = FileAttachment("data/links.json").json();
```

```js
// Constants for visualization
const width = 800;
const height = 600;
const padding = 20;

const colorScale = {
  Gender: d3.scaleOrdinal()
    .domain(["M", "F", "Unknown"])
    .range(["#2c7bb6", "#d7191c", "#999999"]),
  
  Ethnicity: d3.scaleOrdinal()
    .domain(["H", "W", "B", "A", "O", "Unknown"])
    .range(["#7b3294", "#c2a5cf", "#a6dba0", "#008837", "#e66101", "#999999"]),
  
  AgeRange: d3.scaleOrdinal()
    .domain(["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "Unknown"])
    .range(d3.schemeBlues[9].concat("#999999"))
};
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
    .nodeAlign(d3.sankeyLeft) // Force left-to-right alignment
    .extent([[0, 0], [width - padding * 2, height - padding * 2]]);

  // Prepare data structure
  const sankeyData = {
    nodes: nodesData.map(node => ({
      ...node,
      name: node.name,
      category: node.category
    })),
    links: linksData.map(d => ({
      source: d.source,
      target: d.target,
      value: d.value,
      sourceCategory: d.source_category,
      targetCategory: d.target_category,
      percentage: d.percentage
    }))
  };

  // Generate layout
  const { nodes: layoutNodes, links: layoutLinks } = sankeyGenerator(sankeyData);

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

  // Draw links
  svg.append("g")
    .selectAll("path")
    .data(layoutLinks)
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
      tooltip.html(`
        ${d.source.name} → ${d.target.name}<br/>
        Count: ${d.value}<br/>
        Percentage: ${d.percentage.toFixed(1)}%
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // Draw nodes
  svg.append("g")
    .selectAll("rect")
    .data(layoutNodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => colorScale[d.category.split('_')[0]](d.name))
    .attr("stroke", "#000");

  // Add labels
  svg.append("g")
    .selectAll("text")
    .data(layoutNodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => `${d.name} (${d.value})`)
    .style("font-size", "10px");

  // Add category headers
  const categories = ["Gender", "Ethnicity", "AgeRange"];
  const categoryWidth = width / (categories.length + 1);
  
  svg.append("g")
    .selectAll("text")
    .data(categories)
    .join("text")
    .attr("x", (d, i) => categoryWidth * (i + 0.5))
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text(d => d);

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
  <div class="card">
  <h2>Alluvial Diagram of .... (2010–2023)</h2>
  <p><em>Clickable nodes and tooltip on links</em></p>
  <div id="alluvial-container"></div>
  </div>
</div>