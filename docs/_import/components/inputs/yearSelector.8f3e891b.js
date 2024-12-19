import * as Inputs from "../../../_observablehq/stdlib/inputs.d397b6a8.js";

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