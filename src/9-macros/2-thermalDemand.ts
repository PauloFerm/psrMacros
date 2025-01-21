import { Radiator } from "../3-mechanical/0-radiators";
import { InterfaceUtils } from "../8-interface/0-utils";

import { Ranges } from "./0-ranges";

export namespace ThermalDemand {
  /**
   * Insert radiator model validation
   */
  export const validateRadiator = (): void => {
    let range = SpreadsheetApp.getActiveRange();

    let radiatorList = Radiator.allModels();
    let rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(radiatorList)
      .build();

    range.clearDataValidations();
    range.setDataValidation(rule);
  };

  /**
   * Update radiator data
   */
  export const updateRadiator = (): void => {
    let range = Ranges.radiators;
    let values = range.getValues();
    let formulas = range.getFormulas();

    if (values[0].length != 7) {
      throw "Number of columns must be 7";
    }

    for (let i = 2; i < values.length; i++) {
      if (InterfaceUtils.isEmptyLine(values[i])) {
        continue;
      } else if (!InterfaceUtils.isEmptyLine(formulas[i])) {
        values[i] = formulas[i];
        continue;
      }

      let model = values[i][1];
      let radiator = Radiator.select(model);

      values[i][2] = radiator.power.kw;
      values[i][3] = radiator.power.kcalh;
      values[i][4] = radiator.flow;
      values[i][5] = radiator.volume;
      values[i][6] = radiator.price;
    }

    range.setValues(values);
  };
}
