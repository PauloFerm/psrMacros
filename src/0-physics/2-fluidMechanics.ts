import { MathUtils } from "./0-mathUtils";
import { Material } from "./1-materials";
import { LogUtils } from "../8-interface/0-utils";

/**
 * Fluid Mechanics function compendium
 */
export namespace FluidMechanics {
  // This interface must be a class to get temperature dependent
  // viscosity, density, Cp and other properties.
  export interface fluid extends Material.material {
    density: number;
    viscosity: number | MathUtils.Polynomial;
  }

  export const water: fluid = {
    name: "Water",
    thermalConductivity: 0.58,
    density: 1000,
    viscosity: 4.116e-4, // 70 C
  };

  export const air: fluid = {
    name: "Air",
    thermalConductivity: 0.024,
    density: 1.2922, // 0 C
    viscosity: 1.349e-5, // 0 C
  };

  /**
   * Return the Reynolds number
   * @param {number} velocity - Flow velocity
   * @param {number} diameter - Pipe inner Diameter
   * @param {number} viscosity - Fluid kinematic viscosity
   */
  export const reynolds = (
    velocity: number,
    diameter: number,
    viscosity: number
  ): number => {
    return (velocity * diameter) / viscosity;
  };

  /**
   * Friction factor by Colebrook-White equation
   */
  export const colebrookWhite = {
    /**
     * Returns friction factor by Colebrook-White equation using
     * Niazkar aproximation method.
     * @param {number} e - Pipe roughness
     * @param {number} d - Pipe inner diameter
     * @param {number} Re - Reynolds number
     */
    Niazkar: (e: number, d: number, Re: number): number => {
      let A = -2 * Math.log10(e / d / 3.7 + 4.5547 / Re ** 0.8784);
      let B = -2 * Math.log10(e / d / 3.7 + (2.51 * A) / Re);
      let C = -2 * Math.log10(e / d / 3.7 + (2.51 * B) / Re);

      let invSqrtFriction = A - (B - A) ** 2 / (C - 2 * B + A);
      let friction = invSqrtFriction ** -2;

      // LogUtils.checkVariables([
      //   ["Function", "colebrookWhite_Niazkar"],
      //   ["A", A],
      //   ["B", B],
      //   ["C", C],
      //   ["invSqrtFriction", invSqrtFriction],
      //   ["friction", friction],
      // ]);

      return friction;
    },
    /**
     * Returns friction factor by Colebrook-White equation using
     * Buzzelli aproximation method.
     * @param {number} e - Pipe roughness
     * @param {number} d - Pipe inner diameter
     * @param {number} Re - Reynolds number
     */
    Buzzelli: (e: number, d: number, Re: number): number => {
      let A = (0.774 * Math.log(Re) - 1.41) / (1 + 1.32 * Math.sqrt(e / d));
      let B = (e / (3.7 * d)) * Re + 2.51 * A;

      let friction = (A - (A + 2 * Math.log10(B / Re)) / (1 + 2.18 / B)) ** -2;

      // LogUtils.checkVariables([
      //   ["Function", "colebrookWhite_Buzzelli"],
      //   ["A", A],
      //   ["B", B],
      //   ["friction", friction],
      // ]);

      return friction;
    },
    /**
     * Returns friction factor by Colebrook-White equation using
     * Cheng aproximation method.
     * @param {number} e - Pipe roughness
     * @param {number} d - Pipe inner diameter
     * @param {number} Re - Reynolds number
     */
    Cheng: (e: number, d: number, Re: number): number => {
      let a = 1 / (1 + (Re / 850) ** 9);
      let b = 1 / (1 + (Re / (160 * (d / e))) ** 2);

      let first = (Re / 64) ** a;
      let second = (1.8 * Math.log10(Re / 6.8)) ** (2 * (1 - a) * b);
      let third = (2 * Math.log10(3.7 * (d / e))) ** (2 * (1 - a) * (1 - b));

      return 1 / (first * second * third);
    },
    /**
     * Returns friction factor by Colebrook-White equation using
     * Swamee aproximation method.
     * @param {number} e - Pipe roughness
     * @param {number} d - Pipe inner diameter
     * @param {number} Re - Reynolds number
     */
    Swamee: (e: number, d: number, Re: number): number => {
      let first = (64 / Re) ** 8;
      let turb = Math.log(e / (3.7 * d) + 5.74 / Re ** 0.9) - (2500 / Re) ** 6;
      let second = 9.5 * turb ** -16;

      let friction = (first + second) ** (1 / 8);

      // LogUtils.checkVariables([
      //   ["Function", "colebrookWhite_Swamee"],
      //   ["A", A],
      //   ["B", B],
      //   ["friction", friction],
      // ]);

      return friction;
    },
    /**
     * Returns friction factor by Colebrook-White equation using
     * Bellos aproximation method.
     * @param {number} e - Pipe roughness
     * @param {number} d - Pipe inner diameter
     * @param {number} Re - Reynolds number
     */
    Bellos: (e: number, d: number, Re: number): number => {
      let a = 1 / (1 + (Re / 2712) ** 8.4);
      let b = 1 / (1 + Re / (150 * (d / e)) ** 1.8);

      let first = (64 / Re) ** a;
      let second = (0.75 * Math.log(Re / 5.37)) ** (2 * (a - 1) * b);
      let third = (0.88 * Math.log(3.41 * (d / e))) ** (2 * (a - 1) * (1 - b));

      let friction = first * second * third;

      // LogUtils.checkVariables([
      //   ["Function", "colebrookWhite_Bellos"],
      //   ["A", A],
      //   ["B", B],
      //   ["friction", friction],
      // ]);

      return friction;
    },
  };

  /**
   * Pressure loss by the Darcy-Weisbach equation
   * @param {number} friction - Pipe friction factor given by flowrate
   * @param {number} density - Fluid density
   * @param {number} velocity - Flow velocity
   * @param {number} diameter - Pipe inner diameter
   */
  export const darcyWeisbach = (
    friction: number,
    density: number,
    velocity: number,
    diameter: number
  ): number => {
    return (friction * density * velocity ** 2) / (2 * diameter);
  };
}
