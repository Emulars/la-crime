import { text } from "d3";
import * as Plot from "npm:@observablehq/plot";

export function timeline(events, crimeData, {width, height} = {}) {
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
      "December": 12
    };
    return months[month] || 0;
  };

  // Transform events to include a "date" field
  const transformedEvents = events.map(event => {
    return {
      ...event,
      date: new Date(event.year, monthToNumber(event.month) - 1)
    };
  });

  // Group crime data by quadrimester
  const groupedCrimeData = crimeData.reduce((acc, row) => {
    const quadrimester = Math.ceil(row.Month / 4);
    const key = `${row.Year}-Q${quadrimester}`;
    acc[key] = acc[key] || { year: row.Year, quadrimester, totalCrime: 0, date: new Date(row.Year, (quadrimester - 1) * 4) };
    acc[key].totalCrime += row.MonthlyCrimeCount;
    return acc;
  }, {});

  const quadrimesterCrimeData = Object.values(groupedCrimeData).map(d => {
    return {
      date: d.date,
      totalCrime: d.totalCrime,
      label: `${d.year}-Q${d.quadrimester}`
    };
  });

  return Plot.plot({
    title: "Major events and crime trends in Los Angeles",
    width,
    height,
    marginTop: 30,
    marginLeft: 30,
    x: {nice: true, label: "Date", tickFormat: "%b %Y", type: "time"},
    y: {label: "Total Crimes", grid: true},
    marks: [
      // Event markers
      Plot.ruleX(transformedEvents, {x: "date", y: "y", markerEnd: "dot", strokeWidth: 2.5, strokeOpacity: 0.2}),
      Plot.text(transformedEvents, {
        x: "date",
        y: "y",
        text: "name",
        lineAnchor: "bottom",
        textAnchor: "end",
        dy: -10,
        lineWidth: 10,
        fontSize: 12,
      }),

      // Quadrimester crime line chart
      Plot.line(quadrimesterCrimeData, {x: "date", y: "totalCrime", stroke: "steelblue", strokeWidth: 2}),
      Plot.dot(quadrimesterCrimeData, {x: "date", y: "totalCrime", fill: "steelblue", tip: true, title: d => `${d.label}, \nTotal Crimes: ${d.totalCrime}`})
    ]
  });
}
