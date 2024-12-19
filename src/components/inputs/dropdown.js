import * as Inputs from "npm:@observablehq/inputs";

export function dropdown(elementList, label)
{
    return Inputs.select(elementList, {
        label: label,
        value: elementList[elementList.length - 1], // Default value (first division name)
      });
}