import { InterfaceUtils } from "../8-interface/0-utils";

export namespace Ranges {
  let rangeByName = InterfaceUtils.rangeByName;
  export const pipeSection = rangeByName("PipeSection");
  export const pipeSectionHeat = rangeByName("PipeSectionHeat");
  export const heatSystemConditions = rangeByName("HeatSystemConditions");
  export const pipeSectionFlowState = rangeByName("PipeSectionFlowState");
  export const radiators = rangeByName("Radiators");
}
