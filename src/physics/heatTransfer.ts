
namespace HeatTransfer {

  export function cylindricResistence(
    externalDiameter: number, 
    internalDiameter: number, 
    conductivity: number): number {

    return Math.log(externalDiameter / internalDiameter) / conductivity;
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
}
