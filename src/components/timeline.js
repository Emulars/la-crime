import * as Plot from "npm:@observablehq/plot";

export function timeline(events, {width, height} = {}) {
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

  return Plot.plot({
    title: "Major events in Los Angeles",
    width,
    height,
    marginTop: 30,
    marginLeft: 30,
    x: {nice: true, label: "Date", tickFormat: "%b %Y", type: "time"},
    y: {axis: null},
    marks: [
      Plot.ruleX(transformedEvents, {x: "date", y: "y", markerEnd: "dot", strokeWidth: 2.5}),
      Plot.ruleY([0]),
      Plot.text(transformedEvents, {
        x: "date",
        y: "y",
        text: "name",
        lineAnchor: "bottom",
        dy: -10,
        lineWidth: 10,
        fontSize: 12
      })
    ]
  });
}
