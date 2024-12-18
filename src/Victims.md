---
title: Victims demographic groups
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
//const width = 
const height = 800;
const padding = 20;

const colorScale = {
  Gender: d3.scaleOrdinal()
    .domain(["M", "F"])
    .range(["#2c7bb6", "#ffccff"]),
  
  Ethnicity: d3.scaleOrdinal()
    .domain(["Hispanic", "White", "Black", "Other", "Other Asian", "Unknown", "Korean", "Filipino"])
    .range(["#7b3294", "#22a9cf", "#a6dba0", "#008837", "#e66101", "#999999","#997599","#01329A"]),
  
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
    .text(d => `${d.name} (${d.value})`)
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
  <div class="card">
  <h2>Alluvial Diagram of .... (2010–2023)</h2>
  <p><em>Clickable nodes and tooltip on links</em></p>
  <div id="alluvial-container"></div>
  </div>
</div>