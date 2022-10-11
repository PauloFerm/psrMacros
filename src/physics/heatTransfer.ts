
namespace HeatTransfer {

  export function cylindricResistence(
    externalDiameter: number, 
    internalDiameter: number, 
    conductivity: number
  ): number {

    return Math.log(externalDiameter / internalDiameter) / conductivity;
  }

  export function planarResistence(
    thickness: number,    // mm
    conductivity: number  // W/mK
  ): number {
    return thickness * conductivity;
  }

  export function pipeInsulated(
    pipe: Piping.pipe,
    insulation: Piping.tube
  ): number {

    let pipeResistence = HeatTransfer.cylindricResistence(
          pipe.diameter.external, 
          pipe.diameter.internal, 
          pipe.conductivity);

    let insuResistence = HeatTransfer.cylindricResistence(
          insulation.diameter.external, 
          pipe.diameter.external, 
          insulation.conductivity);

    return (2 * Math.PI) / (pipeResistence + insuResistence);
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
          return material.thermalConductivity.evaluate(25); // 25 deg C
        }
      });

      return MathUtils.dotProduct(conductivities, thicknesses);
      
    }
}
