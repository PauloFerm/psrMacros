import { InterfaceUtils, LogUtils } from "../8-interface/0-utils";
import { StatusBoard } from "../8-interface/1-boards";
import { PPR } from "../1-piping/2-ppr";

export namespace HeatSystem {

  /**
   * Update heat loss on piping sections
   */
  export const updatePipeHeatLoss = (): void => {
    let heatSystemConditions = InterfaceUtils.rangeByName("HeatSystemConditions");
    let pipeSection = InterfaceUtils.rangeByName("PipeSection");
    let pipeSectionHeat = InterfaceUtils.rangeByName("PipeSectionHeat")

    let conditions = StatusBoard.parseBoard(heatSystemConditions).sections
                    .filter(s => s.title == "Condiciones" )[0];

    let tempHigh = conditions.properties
                    .filter(p => p.name == "Temperatura Superior")[0].value;
    
    let tempLow = conditions.properties
                    .filter(p => p.name == "Temperatura Inferior")[0].value;

    let tempEx = conditions.properties
                    .filter(p => p.name == "Temperatura Exterior")[0].value;
    
    let PPRpressure = conditions.properties
                    .filter(p => p.name == "PPR Presión Nominal")[0].value;

    if (typeof tempHigh != 'number' ||
      typeof tempLow != 'number' ||
      typeof tempEx != 'number' ||
      typeof PPRpressure != 'string') {
      throw 'Something happend with system conditions';
    }

    if (PPRpressure != "PN20" && PPRpressure != "PN16") {
      throw 'PPR Nominal Pressure must be PN16 or PN20';
    }

    let deltaTempHigh = tempHigh - tempEx;
    let deltaTempLow = tempLow - tempEx;

    let pipeValues = pipeSection.getValues();
    let insulatedValues = pipeSectionHeat.getValues();

    for (let i = 2; i < pipeValues.length; i++) {
      if (InterfaceUtils.isEmptyLine(pipeValues[i]) ||
        // pipeValues[i][0].length != pipeValues[i][1].length ||
        insulatedValues[i][0] == "") {  // insulated value non zero
        continue;
      }
      
      let diameter = pipeValues[i][2];
      let insulationThickness = insulatedValues[i][0];

      insulatedValues[i][1] = PPR.heatLoss(PPRpressure, diameter, deltaTempHigh, insulationThickness);
      insulatedValues[i][2] = PPR.heatLoss(PPRpressure, diameter, deltaTempLow, insulationThickness);

      LogUtils.checkVariables([
        [ "Diameter", diameter ],
        [ "Insulation", insulationThickness ],
        [ "HeatHigh", insulatedValues[i][1] ],
        [ "HeatLow", insulatedValues[i][2] ]
      ]);
    }

    pipeSectionHeat.setValues(insulatedValues);
  }

  /**
  * Update Flow State on piping sections
  */
  export const updatePipeFlowState = (): void => {
    let heatSystemConditions = InterfaceUtils.rangeByName("HeatSystemConditions");
    let pipeSectionRange = InterfaceUtils.rangeByName("PipeSection");
    let pipeSectionFlowState = InterfaceUtils.rangeByName("PipeSectionFlowState");

    let PPRpressure = StatusBoard.parseBoard(heatSystemConditions).sections
      .filter(s => s.title == "Condiciones")[0].properties
      .filter(p => p.name == "PPR Presión Nominal")[0].value;

    if (PPRpressure != "PN20" && PPRpressure != "PN16") {
      throw 'PPR Nominal Pressure must be PN16 or PN20';
    }
    
    let pipeSectionValues = pipeSectionRange.getValues();
    let pipeFlowValues = pipeSectionFlowState.getValues();
    let pipeFlowFormulas = pipeSectionFlowState.getFormulas();

    let radiatorData = InterfaceUtils.rangeByName("Radiators").getValues();

    for (let i = 2; i < pipeSectionValues.length; i++) {
      if (InterfaceUtils.isEmptyLine(pipeSectionValues[i])) {
          continue;
      }

      let flow = pipeFlowValues[i][0];
      let diameter = pipeSectionValues[i][2];
      let thisPipe = PPR.Pipe(PPRpressure, diameter);

      let velocity = (flow / 3600) / thisPipe.area;
      let pressureLoss = PPR.pressureLoss(PPRpressure, diameter, flow);

      // if (pressureLoss == NaN) {
      //   Logger.log([flow, diameter, thisPipe, velocity, pressureLoss]);
      // }

      LogUtils.checkVariables([
        ["Function", "updatePipeFlowState"],
        [ "Flow", flow ],
        [ "Diameter", diameter ],
        [ "Pipe", thisPipe ],
        [ "Velocity", velocity ],
        [ "PressureLoss", pressureLoss ]
      ]);

      pipeFlowValues[i][1] = velocity;
      pipeFlowValues[i][3] = pressureLoss;

      let pipeLength = pipeSectionValues[i][3];
      let volume = thisPipe.area * pipeLength * 1000;   // m3 -> lts

      if (pipeSectionValues[i][1].indexOf("RAD") > -1) {
        let radiatorCode = pipeSectionValues[i][1];
        let radiatorSelected = radiatorData.filter(row => row[0] == radiatorCode)[0];

        volume += radiatorSelected[5];
      }
      
      pipeFlowValues[i][0] = pipeFlowFormulas[i][0];
      pipeFlowValues[i][2] = volume;
    }

    pipeSectionFlowState.setValues(pipeFlowValues);
  }

}