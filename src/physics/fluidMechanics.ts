/**
 * Fluid Mechanics function compendium
 */
namespace FluidMechanics {
  // This interface must be a class to get temperature dependent
  // viscosity, density, Cp and other properties.
  export interface fluid { density: number; viscosity: number; }
  export const water: fluid = {density: 1000, viscosity: 4e-7 }

  /**
   * Return the Reynolds number
   * @param {number} velocity - Flow velocity
   * @param {number} diameter - Pipe inner Diameter
   * @param {number} viscosity - Fluid kinematic viscosity
   */
  export function reynolds(velocity: number, diameter: number, viscosity: number): number {
    return velocity * diameter / viscosity;
  }

  /** 
   * Returns friction factor by Colebrook-White equation using 
   * Niazkar aproximation method.
   * @param {number} e - Pipe roughness
   * @param {number} d - Pipe inner diameter
   * @param {number} Re - Reynolds number
   */
  export function colebrookWhite(e: number, d: number, Re: number): number {
    let A = -2 * Math.log((e / d) / 3.7 + 4.5547 / Re ** 0.8784);
    let B = -2 * Math.log((e / d) / 3.7 + 2.51 * A / Re);
    let C = -2 * Math.log((e / d) / 3.7 + 2.51 * B / Re);

    let invSqrtFriction = A - (B - A) ** 2 / (C - 2 * B + A);
    return (1 / invSqrtFriction) ** 2;
  }
  
  /**
   * Pressure loss by the Darcy-Weisbach equation
   * @param {number} friction - Pipe friction factor given by flowrate
   * @param {number} density - Fluid density
   * @param {number} velocity - Flow velocity
   * @param {number} diameter - Pipe inner diameter
   */
  export function darcyWeisbach(friction: number, density: number, velocity: number, diameter: number): number {
    return friction * density * velocity ** 2 / (2 * diameter);
  }
}