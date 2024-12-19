import * as Inputs from "npm:@observablehq/inputs";

export function viewSlider(minYear, maxYear)
{
    return Inputs.range([minYear, maxYear], { 
        label: "📅 Choose a Year", 
        value: maxYear, // valore iniziale
        step: 1, // incrementi di 1 anno
        min: minYear, // valore minimo
        max: maxYear // valore massimo
      });
}