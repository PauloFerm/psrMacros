import { MathUtils } from "./0-mathUtils";
import { Material } from "./1-materials";

/**
 * Heat transfer compendium
 */
export namespace HeatTransfer {
  
  /**
   * Cilindric thermal resistence
   * @param externalDiameter - External wall diameter
   * @param internalDiameter - Internal wall diameter
   * @param conductivity - Material thermal conductivity
   * @returns thermal resistence in W/m k
   */
  export function cylindricResistence(
    externalDiameter: number, 
    internalDiameter: number, 
    conductivity: number
  ): number {

    return Math.log(externalDiameter / internalDiameter) 
                      / (2 * Math.PI * conductivity );
  }

  /**
   * Planar thermal resistence 
   * @param thickness - wall thickness in mm
   * @param conductivity - thermal conductivity in W/mK
   * @returns 
   */
  export function planarResistence(
    thickness: number,
    conductivity: number
  ): number {
    return conductivity / (thickness / 1000);
  }

  /**
   * Thermal resistence of a multilayer wall
   * @param materials - Layer's material array
   * @param thicknesses - Layer's thicknesses
   * @returns Total thermal resistence
   */
  export function multiLayerWall(
    materials: Material.material[], 
    thicknesses: number[]
  ): number | void {
    if (materials.length != thicknesses.length) {
      throw 'Materials and thicknesses arrays have different sizes!';
    }

    let conductivities = materials.map(material => {
      if (typeof material.thermalConductivity == 'number') {
        return material.thermalConductivity;
      } else {
        return material.thermalConductivity.evaluate(80); // wool density
      }
    });

    let resistences = materials.map((material, i) => {
      if (typeof material.thermalConductivity == 'number') {
        return planarResistence(
          thicknesses[i], 
          material.thermalConductivity);
      } else {
        return planarResistence(
          thicknesses[i], 
          material.thermalConductivity.evaluate(60));
      }
    });

    return resistences.reduce((sum, now) => sum + now, 0);
  }

  /**
   * Freeze Temperature by volume % glycol in water
   */
  export const freezeTemperatureData = [
    [0, 0],
    [-3, 10],
    [-8, 20],
    [-14, 30],
    [-22, 40],
    [-34, 50],
    [-48, 60]
  ];
}

/**
 * Water - PolypropyleneGlycol mixture freeze point by volume %
 */
function glycolWaterVolume(targetTemperature: number) {
  let volumeByTemperature = new MathUtils.Polynomial(
    MathUtils.LagrangeInterpolation(HeatTransfer.freezeTemperatureData)
  );

  return volumeByTemperature.evaluate(targetTemperature);
}
