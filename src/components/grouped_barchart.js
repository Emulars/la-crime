import * as Plot from "npm:@observablehq/plot";

export function groupedBar(data, { width} = {}) {

  return Plot.plot({
    title: "Crime Across Ages: Who Suffers Most?",
    subtitle: "Unpacking how victimization rates vary between men and women, and what crimes define each age group",
    width: width,
    height: 500,
    x: {axis: null, label: "" }, // Nasconde l'asse X
    y: {tickFormat: "s", grid: true, label: "Number of Crimes"}, // Formatta i tick sull'asse Y
    color: {
      domain: ["M", "F"], // Mappa i valori di genere
      range: ["#2c7bb6", "#ffccff"], // Azzurro per maschi, rosa per femmine
    },
    marks: [
      Plot.barY(data, {
        x: "group",         
        y: "y",         
        fill: "group",  
        fx: "x",
        tip: true,
        title: (d) => `Crimes: ${d.y}\nCrime Type: ${d.most_common_crime_type}\nCrime Subtype: ${d.most_common_crime_subtype}`, // Tooltip personalizzato
      }),
      Plot.ruleY([0]) // Linea di base sull'asse Y
      // Plot.text(data, {
      //   x: "group",
      //   y: "y",
      //   text: d => Math.round(d.y), // Quantità di crimini
      //   dy: 5, // Posiziona leggermente a destra per evitare sovrapposizione con il nome
      //   textAnchor: "start", // Allinea il testo a sinistra
      //   fill: "white", // Colore del testo delle emissioni
      //   fontWeight: "bold"
      // })
    ]
  });
}