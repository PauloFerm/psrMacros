import { MathUtils } from "../0-physics/0-mathUtils";
import { FluidMechanics } from "../0-physics/2-fluidMechanics";
import { HeatTransfer } from "../0-physics/3-heatTransfer";
import { Piping } from "./0-pipe";
import { InsulationEE } from "./1-insulation";

/**
 * PPR Pipes data compendium
 */
export namespace PPR {
  const diametersNominal = <const>[20, 25, 32, 40, 50, 63, 75, 90, 110];
  const pressuresNominal = <const>["PN16", "PN20"];

  // export type pprDiameter = 20|25|32|40|50|63|75|90|110;
  export type pprDiameter = (typeof diametersNominal)[number];
  export type pprPressure = (typeof pressuresNominal)[number];

  const roughness = 2e-4;
  const conductivity = 0.2;

  const thickness = [
    [2.8, 3.5, 4.5, 5.6, 6.9, 8.7, 10.4, 12.5, 15.2],
    [3.4, 4.2, 5.4, 6.7, 8.4, 10.5, 12.5, 15.0, 18.4],
  ];

  /**
   * PPR Pipe selection
   * @param pressure - Nominal pressure PN16 | PN20
   * @param diameter - Nominal diameter
   * @returns Pipe Object
   */
  export const Pipe = (
    pressure: "PN20" | "PN16",
    diameter: PPR.pprDiameter
  ): Piping.pipe => {
    let pressureIndex = pressuresNominal.indexOf(pressure);
    let diameterIndex = diametersNominal.indexOf(diameter);

    let thisInternal = diameter - 2 * thickness[pressureIndex][diameterIndex];
    let thisArea = (Math.PI * (thisInternal / 1000) ** 2) / 4;

    let thisPipe: Piping.pipe = {
      material: "PPR",
      roughness: roughness,
      conductivity: conductivity,
      thickness: thickness[pressureIndex][diameterIndex],
      diameter: {
        nominal: diameter,
        internal: thisInternal,
        external: diameter,
      },
      area: thisArea,
    };

    return thisPipe;
  };

  /**
   * Returns pressure loss in a PPR pipe by length unit
   * @param {string} pressure - Pipe nominal pressure
   * @param {number} diameter - Pipe nominal diameter
   * @param {number} flowrate - Flowrate in m^3/h
   */
  export const pressureLoss = (
    pressure: "PN20" | "PN16",
    diameter: PPR.pprDiameter,
    flowrate: number
  ): number => {
    let thisPipe: Piping.pipe = PPR.Pipe(pressure, diameter);
    let diameterIndex = diametersNominal.indexOf(diameter);
    let velocity = flowrate / 3600 / thisPipe.area;

    let coeffs = [...pprLossPoly[pressure][diameterIndex]];
    let pressureLoss = new MathUtils.Polynomial(coeffs.reverse());

    Logger.log([diameter, velocity, coeffs, pressureLoss]);

    return pressureLoss.evaluate(velocity) / 1000; //

    // return Piping.pressureLoss(FluidMechanics.water, thisPipe, flowrate);
  };

  /**
   * Heat Loss in a PPR pipe
   * @param pressure - Nominal pressure: PN16 | PN20
   * @param diameter - Nominal diameter in mm
   * @param temperatureDelta - Temperature difference between fluid and exterior
   * @param insulationThickness - Insulation thickness in mm
   * @returns Heat loss rate in W/m
   */
  export const heatLoss = (
    pressure: "PN20" | "PN16",
    diameter: PPR.pprDiameter,
    temperatureDelta: number,
    insulationThickness?: 9 | 13 | 19 | 25
  ): number => {
    let thisPipe: Piping.pipe = PPR.Pipe(pressure, diameter);
    let resistence = NaN;

    if (insulationThickness == null) {
      resistence = HeatTransfer.cylindricResistence(
        thisPipe.diameter.external / 1000,
        thisPipe.diameter.internal / 1000,
        thisPipe.conductivity
      );
    } else if (insulationThickness != null) {
      let thisInsulation: Piping.tube = InsulationEE.thisTube(
        thisPipe.diameter.external,
        insulationThickness
      );

      resistence = Piping.insulatedResistence(thisPipe, thisInsulation);
    } else {
      throw "Something is wrong with the pprHeatLoss";
    }

    return temperatureDelta / resistence;
  };

  const pprLossPoly = {
    PN16: [
      [0.298047, -3.307224, 74.344211, 25.197989, -2.592265],
      [0.22128, -2.461615, 56.380267, 18.418335, -1.93531],
      [0.162222, -1.800924, 41.715362, 13.048689, -1.392719],
      [0.11956, -1.334306, 31.636005, 9.572291, -1.040834],
      [0.091969, -1.01815, 23.995412, 6.921392, -0.751219],
      [0.06965, -0.766406, 18.144607, 5.028381, -0.549036],
      [0.056004, -0.613923, 14.710502, 3.984857, -0.439828],
      [0.042156, -0.470973, 11.775327, 3.142913, -0.349523],
      [0.031631, -0.356778, 9.203795, 2.426478, -0.287463],
    ],
    PN20: [
      [0.33761507, -3.73337382, 82.89544821, 28.43748341, -2.88767127],
      [0.25022832, -2.7693283, 62.40210529, 20.55139907, -2.12697953],
      [0.18141627, -2.01170813, 46.14544265, 14.57380612, -1.53206949],
      [0.13257605, -1.47578369, 34.85105942, 10.71269504, -1.16347301],
      [0.09863986, -1.10608193, 26.58693872, 7.86086667, -0.8571749],
      [0.07511455, -0.83466988, 20.01042567, 5.65676059, -0.61740793],
      [0.06123051, -0.6730818, 16.19873592, 4.4665236, -0.49457802],
      [0.11285, -0.94218567, 13.86229321, 2.77324422, -0.20462028],
      [0.19532127, -1.64084516, 13.3173804, -0.1029126, 0.43204734],
    ],
  };
}
