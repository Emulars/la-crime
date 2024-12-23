import * as Inputs from "npm:@observablehq/inputs";

export function dropdown(elementList, label)
{
    return Inputs.select(elementList, {
        label: label,
        value: elementList[0], // Default value (first division name)
      });
}