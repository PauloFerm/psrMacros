/**
 * Heat transfer compendium
 */
namespace HeatTransfer {
  
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
   * Thermal resistence of an insutlated pipe
   * @param pipe - Pipe Object
   * @param insulation - Insulation Tube Object
   * @returns Total thermal resistence
   */
  export function pipeInsulatedResistence(
    pipe: Piping.pipe,
    insulation: Piping.tube
  ): number {

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
}
