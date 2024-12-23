import * as Plot from "../../_npm/@observablehq/plot@0.6.16/6fc5a277.js";
import * as d3 from "../../_node/d3@7.9.0/index.e21134d2.js";

export function timeline(events, crimeData, { width, height } = {}) {
  // Function to convert month names to numeric values
  const monthToNumber = (month) => {
    const months = {
      "January": 1,
      "February": 2,
      "March": 3,
      "April": 4,
      "May": 5,
      "June": 6,
      "July": 7,
      "August": 8,
      "September": 9,
      "October": 10,
      "November": 11,
      "December": 12,
    };
    return months[month] || 0;
  };

  // Define y-axis domain
  const yDomain = [40000, 70000];

  // Normalize event y values
  const normalizeY = (value, domain) => {
    const [min, max] = domain;
    const range = (max || 80000) - min; // Assuming 80000 as the approximate upper bound if max is undefined
    return min + (value / 100) * range;
  };

  // Transform events to include a "date" field and normalize y values
  const transformedEvents = events.map((event) => {
    return {
      ...event,
      date: new Date(event.year, monthToNumber(event.month) - 1),
      y: normalizeY(event.y, yDomain),
    };
  });

  // Group crime data by quadrimester
  const groupedCrimeData = crimeData.reduce((acc, row) => {
    const quadrimester = Math.ceil(row.Month / 3);
    const key = `${row.Year}-Q${quadrimester}`;
    acc[key] = acc[key] || { year: row.Year, quadrimester, totalCrime: 0, date: new Date(row.Year, (quadrimester - 1) * 3) };
    acc[key].totalCrime += row.MonthlyCrimeCount;
    return acc;
  }, {});

  const quadrimesterCrimeData = Object.values(groupedCrimeData).map((d) => {
    return {
      date: d.date,
      totalCrime: d.totalCrime,
      label: `${d.year}-Q${d.quadrimester}`,
    };
  });

  // Calculate overall average
  const averageCrime = d3.mean(quadrimesterCrimeData, (d) => d.totalCrime);

  return Plot.plot({
    title: "Major Milestones in Crime and Policy: A Los Angeles Timeline (2010–2024)",
    subtitle: "A chronicle of social, legislative, and global events that influenced LA’s crime trajectory",
    width,
    height,
    marginTop: 30,
    marginLeft: 30,
    x: { nice: true, label: "Date", tickFormat: "%b %Y", type: "time" },
    y: { label: "Total Crimes", grid: true, domain: yDomain },
    marks: [
      // Event markers
      Plot.ruleX(transformedEvents, { x: "date", y1: yDomain[0], y2: "y", markerEnd: "dot", strokeWidth: 2.5, strokeOpacity: 0.2 }),
      Plot.text(transformedEvents, {
        x: "date",
        y: "y",
        text: "name",
        lineAnchor: "bottom",
        dy: -10,
        lineWidth: 10,
        fontSize: 12,
      }),

      // Quadrimester crime line chart
      Plot.line(quadrimesterCrimeData, { x: "date", y: "totalCrime", stroke: "steelblue", strokeWidth: 2 }),
      Plot.dot(quadrimesterCrimeData, { x: "date", y: "totalCrime", fill: "steelblue", tip: true, title: (d) => `${d.label}, Total Crimes: ${d.totalCrime}` }),

      // Average crime line
      Plot.ruleY([averageCrime], { stroke: "lightgrey", strokeDasharray: "4 4", strokeWidth: 2 }),

      // Label for the average line
      Plot.text([{ x: quadrimesterCrimeData[quadrimesterCrimeData.length - 1].date, y: averageCrime, text: "AVG" }], {
        x: "x",
        y: "y",
        text: "text",
        textAnchor: "end",
        dx: 45,
        fill: "lightgrey",
        fontWeight: "bold",
      }),
    ],
  });
}

