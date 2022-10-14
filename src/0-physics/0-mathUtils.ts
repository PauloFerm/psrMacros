/**
 * Math Utils compendium
 */
namespace MathUtils {
  /**
   * Polynomial coefficient and evaluator
   */
  export class Polynomial {
    coefficients: number[];
  
    constructor(coefficients: number[]) {
      this.coefficients = coefficients;
    }
  
    evaluate(x: number): number {
      return this.coefficients
        .map(c => c * x)
        .reduce((sum, now) => sum + now, 0);
    }
  }

  /**
   * Dot product between two arrays
   * @param array0 - a_i
   * @param array1 - b_i
   * @returns sum(a_i * a_b)
   */
  export function dotProduct(
    array0: number[],
    array1: number[]
  ): number {
    
    if (array0.length != array1.length) {
      throw 'Arrays must have same sizes!';
    }

    return array0.map((x, i) => array0[i] * array1[i])
      .reduce((sum, now) => sum + now, 0);
  }

  /**
   * Pick the closest value in array
   * @param array - Array with values
   * @param value - Value to search
   * @param up - Round up?
   */
  export function closestValue(
    array: readonly number[],
    value: number,
    up: boolean = true
  ) {

    let response = NaN;

    if (up) {
      response = Math.min(...array.filter( v => v > value ));
    } else {
      response = Math.max(...array.filter( v => v < value ));
    }

    return response;
  }
}
