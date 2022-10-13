
namespace HeatTransfer {

  export function cylindricResistence(
    externalDiameter: number, 
    internalDiameter: number, 
    conductivity: number
  ): number {

    return Math.log(externalDiameter / internalDiameter) 
                      / (2 * Math.PI * conductivity );
  }

  export function planarResistence(
    thickness: number,    // mm
    conductivity: number  // W/mK
  ): number {
    return thickness * conductivity;
  }

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

      return MathUtils.dotProduct(conductivities, thicknesses);
      
    }
}
