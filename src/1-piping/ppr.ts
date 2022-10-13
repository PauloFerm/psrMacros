/**
 * PPR Pipes data compendium
 */
namespace PPR {

  const diametersNominal = <const>[ 20, 25, 32, 40, 50, 63, 75, 90, 110 ];
  const pressuresNominal = <const>[ "PN16", "PN20" ];

  // export type pprDiameter = 20|25|32|40|50|63|75|90|110;
  export type pprDiameter = typeof diametersNominal[number];
  export type pprPressure = typeof pressuresNominal[number];

  const roughness = 2e-4;
  const conductivity = 0.2;
  
  const thickness = [
    [ 2.8, 3.5, 4.5, 5.6, 6.9, 8.7, 10.4, 12.5, 15.2 ],
    [ 3.4, 4.2, 5.4, 6.7, 8.4, 10.5, 12.5, 15.0, 18.4 ]
  ];

  export function Pipe(
    pressure: "PN20"|"PN16", 
    diameter: PPR.pprDiameter): Piping.pipe {

    let pressureIndex = pressuresNominal.indexOf(pressure);
    let diameterIndex = diametersNominal.indexOf(diameter);

    let thisInternal = diameter - 2 * thickness[pressureIndex][diameterIndex];
    let thisArea = Math.PI * (thisInternal / 1000) ** 2 / 4;

    let thisPipe: Piping.pipe = {
      material: "PPR",
      roughness: roughness,
      conductivity: conductivity,
      thickness: thickness[pressureIndex][diameterIndex],
      diameter: {
        nominal: diameter,
        internal: thisInternal,
        external: diameter
      },
      area: thisArea
    }

    return thisPipe
  }
}

/**
 * Returns pressure loss in a PPR pipe by length unit
 * @param {string} pressure - Pipe nominal pressure
 * @param {number} diameter - Pipe nominal diameter
 * @param {number} flowrate - Flowrate in m^3/h
 */
function pprPressureLoss(
  pressure: "PN20"|"PN16",
  diameter: PPR.pprDiameter,
  flowrate: number): number {

  let thisPipe: Piping.pipe = PPR.Pipe(pressure, diameter);
  
  return Piping.pressureLoss(FluidMechanics.water, thisPipe, flowrate);
}

function pprHeatLoss(
  pressure: "PN20"|"PN16",
  diameter: PPR.pprDiameter,
  temperatureDelta: number,
  insulationThickness?: 9|13|19|25): number {

  let thisPipe: Piping.pipe = PPR.Pipe(pressure, diameter);
  let resistence = NaN;

  if (insulationThickness == null) {

    resistence = HeatTransfer.cylindricResistence(
      thisPipe.diameter.external / 1000,
      thisPipe.diameter.internal / 1000,
      thisPipe.conductivity);

  } else if (insulationThickness != null) {

    let thisInsulation: Piping.tube = InsulationEE.thisTube(
      thisPipe.diameter.external,
      insulationThickness);

    resistence = HeatTransfer.pipeInsulatedResistence(thisPipe, thisInsulation);
    

  } else {
    throw "Something is wrong with the pprHeatLoss"
  }

  return temperatureDelta / resistence;

}