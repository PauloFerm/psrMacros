import { MathUtils } from "../0-physics/0-mathUtils";
import { Piping } from "./0-pipe";

/**
 * Pipe Insulation Module
 */
export namespace InsulationEE {
  const conductivity = 0.034;
  const thicknesses = [ 9, 13, 19, 25 ];
  const diameters = [ 6, 12, 15, 10, 18, 22, 28, 42, 20, 25, 35, 48, 54, 60, 67, 76, 89, 108, 114 ];

  const price = [
    [ 1.53, 1.97, 4.87, NaN ],
    [ 1.98, 2.47, 5.17, 8.66 ],
    [ 2.17, 2.63, 4.28, 9.61 ],
    [ 1.67, 2.32, 4.87, NaN ],
    [ 2.47, NaN, NaN, NaN ],
    [ 2.78, 3.27, 5.01, 11.13 ],
    [ 3.28, 4.24, 6.11, 10.62 ],
    [ 4.88, 5.46, 9.45, 14.35 ],
    [ NaN, 2.9, 4.66, 9.38 ],
    [ NaN, 3.78, 5.37, 10.11 ],
    [ NaN, 4.5, 13.09, 12.95 ],
    [ NaN, 5.98, 10.56, 16.43 ],
    [ NaN, 6.4, 11.65, 19.25 ],
    [ NaN, 8.52, 13.09, 29.9 ],
    [ NaN, 11.78, 14.63, 31.13 ],
    [ NaN, 13.82, 17.46, 35.59 ],
    [ NaN, 15.52, 23.98, 36.23 ],
    [ NaN, 12.37, 18.99, 23.58 ],
    [ NaN, 15.13, 32.85, 53.99 ]
  ];

  /**
   * Insulation tube selection
   * @param pipeExternalDiameter - Pipe external piping 
   * @param thickness - Insulation tickness
   * @returns Tube Object selected
   */
  export const thisTube = (
    pipeExternalDiameter: number,
    thickness: number
  ): Piping.tube => {

    let thicknessIndex = thicknesses.indexOf(thickness);
    let closestDiameter = MathUtils.closestValue(diameters, pipeExternalDiameter);
    let diameterIndex = diameters.indexOf(closestDiameter);
    
    if (thicknessIndex < 0 || diameterIndex < 0) {
      throw `Insulation d: ${pipeExternalDiameter}, e: ${thickness} doesn't exists`;
    }

    let thisPrice = price[diameterIndex][thicknessIndex];

    if (Number.isNaN(thisPrice)) {
      throw `Insulation d: ${pipeExternalDiameter}, e: ${thickness} doesn't exists`;
    }

    return {
      material: "EE",
      thickness: thickness,
      conductivity: conductivity,
      diameter: {
        nominal: closestDiameter,
        internal: closestDiameter,
        external: closestDiameter + 2 * thickness
      },
      price: thisPrice
    }
  }
}
