import { MathUtils } from "./0-mathUtils";

/**
 * Material objects and interface
 */
export namespace Material {

  export interface material {
    name: string;
    thermalConductivity: number | MathUtils.Polynomial;
    strength?: {
      yield?: number;
      compressive?: number;
      tensile?: number;
      fatigue?: number;
      impact?: number;
    }
    youngModulus?: number;
  }


  /**
   *  @param thermalConductivity is a density dependent polinomial
   */
  export const mineralWool: material = {
    name: 'Mineral Wool',
    thermalConductivity: new MathUtils.Polynomial([ 5.16e-2, 3.94e-4, 2.32e-6 ])
  };

  export const elastomericFoam: material = { name: 'Elastomeric Foam', thermalConductivity: 0.031 };
  export const plasterboard: material = { name: 'Plasterboard', thermalConductivity: 0.26 };
  export const fibreCement: material = { name: 'Fibre Cement', thermalConductivity: 1 };
  export const instapanel: material = { name: 'Instapanel', thermalConductivity: 0.4 };
  export const vulcanite: material = { name: 'Vulcanite', thermalConductivity: 0.28 };
  export const concrete: material = { name: 'Concrete', thermalConductivity: 1.63 };
  export const aluminum: material = { name: 'Aluminum', thermalConductivity: 209 };
  export const plywood: material = { name: 'Plywood', thermalConductivity: 0.24 };
  export const steel: material = { name: 'Steel', thermalConductivity: 50 };
  export const glass: material = { name: 'Glass', thermalConductivity: 1 };
  export const wood: material = { name: 'Wood', thermalConductivity: 0.12 };
  export const ppr: material = { name: 'PPR', thermalConductivity: 0.2 };
  export const osb: material = { name: 'OSB', thermalConductivity: 0.15 };
  export const pvc: material = { name: 'PVC', thermalConductivity: 0.16 };
  export const air: material = { name: 'Air', thermalConductivity: 0.024 };
  export const eps: material = { name: 'EPS', thermalConductivity: 0.037 };
  export const fst: material = { name: 'Fisterm', thermalConductivity: 0.058 };
  export const epe: material = { name: 'Expanded Poliethilene', thermalConductivity: 0.034};
  export const clt: material = { name: 'Cross Laminated Timber', thermalConductivity: 0.153 };
  
}
