import { FluidMechanics } from "../0-physics/2-fluidMechanics";
import { HeatTransfer } from "../0-physics/3-heatTransfer";
import { LogUtils } from "../8-interface/0-utils";

/**
 * Piping resources compendium
 */
export namespace Piping {
  export interface tube {
    material: string;
    conductivity: number; // W/mK
    thickness: number;    // mm
    diameter: {
      nominal: number;    // mm
      internal: number;   // mm
      external: number;   // mm
    }
    price?: number;
  }

  export interface pipe extends tube {
    roughness: number;    // m?
    area: number;         // m^2
  }

  /**
   * Returns pressure loss in a pipe by length unit
   * @param {Object} fluid - Fluid selected
   * @param {Object} pipe - Pipe selected
   * @param {number} flowrate - Flowrate in m^3/h
   */
  export const pressureLoss = (
    fluid: FluidMechanics.fluid,
    pipe: Piping.pipe,
    flowrate: number): number => {

    let velocity = flowrate * (1 / 3600) / pipe.area; // m^3/h -> m^3/s
    let diameter = pipe.diameter.internal / 1000;     // mm -> m
    let viscosity = typeof fluid.viscosity == 'number' ? 
      fluid.viscosity : fluid.viscosity.evaluate(60);

    let reynolds = FluidMechanics.reynolds(velocity, diameter, viscosity);
    let friction = FluidMechanics.colebrookWhite.Niazkar(pipe.roughness, diameter, reynolds);
    let loss = FluidMechanics.darcyWeisbach(friction, fluid.density, velocity, diameter);

    LogUtils.checkVariables([
      ["Function", "pressureLoss"],
      [ "Velocity", velocity ],
      [ "Diameter", diameter ],
      [ "Viscosity", viscosity],
      [ "Reynolds", reynolds ],
      [ "Friction", friction ],
      [ "Loss", loss]
    ]);

    if (isNaN(loss)) {
      loss = 0;
    }

    return loss * (1.02e-4);
  }

    /**
   * Thermal resistence of an insutlated pipe
   * @param pipe - Pipe Object
   * @param insulation - Insulation Tube Object
   * @returns Total thermal resistence
   */
    export const insulatedResistence = (
      pipe: Piping.pipe,
      insulation: Piping.tube
    ): number => {
  
      let pipeResistence = HeatTransfer.cylindricResistence(
            pipe.diameter.external / 1000, 
            pipe.diameter.internal / 1000, 
            pipe.conductivity);
  
      let insuResistence = HeatTransfer.cylindricResistence(
            insulation.diameter.external / 1000, 
            pipe.diameter.external / 1000, 
            insulation.conductivity);
  
      return pipeResistence + insuResistence;
    }
}
