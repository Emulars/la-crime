import * as Inputs from "../../../_observablehq/stdlib/inputs.d397b6a8.js";

export function dropdown(elementList, label)
{
    return Inputs.select(elementList, {
        label: label,
        value: elementList[elementList.length - 1], // Default value (first division name)
      });
}