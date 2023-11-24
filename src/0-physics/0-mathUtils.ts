/**
 * Math Utils compendium
 */
export namespace MathUtils {
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
        .map((c, i) => c * x ** i)
        .reduce((sum, now) => sum + now, 0);
    }
  }

  /**
   * Dot product between two arrays
   * @param array0 - a_i
   * @param array1 - b_i
   * @returns sum(a_i * a_b)
   */
  export const dotProduct = (
    array0: number[],
    array1: number[]
  ): number => {
    
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
  export const closestValue = (
    array: readonly number[],
    value: number,
    up: boolean = true
  ): number => {

    let response = NaN;

    if (up) {
      response = Math.min(...array.filter( v => v >= value ));
    } else {
      response = Math.max(...array.filter( v => v <= value ));
    }

    return response;
  }

  const zeros = (n: number): number[] => {
    return new Array(n).fill(0)
  }

  const denominator = (i: number, points: number[][]): number => {
    let result = 1;
    let x_i = points[i][0];
    for (let j = points.length; j--;) {
      if (i != j) {
        result *= x_i - points[j][0]
      }
    }

    return result
  }

  const polynomialInterpolation = (i: number, points: number[][]): number[] => {
    let coefficients = zeros(points.length);
    coefficients[0] = 1 / denominator(i, points);

    let newCoefficients;

    for (let k = 0; k < points.length; k++) {
      if (k == i) {
        continue;
      }

      newCoefficients = zeros(points.length);

      for (let j = (k < i) ? k+1 : k; j--;) {
        newCoefficients[j+1] += coefficients[j];
        newCoefficients[j] -= points[k][0] * coefficients[j];
      }

      coefficients = newCoefficients;
    }

    return coefficients
  }

  /**
   * Coefficients by Lagrange Interpolation
   * @param points Points array to generate polynomial coefficients
   */
  export const LagrangeInterpolation = (points: number[][]): number[] => {
    let polynomial = zeros(points.length);
    let coefficients;

    for (let i = 0; i < points.length; ++i) {
      coefficients = polynomialInterpolation(i, points);

      for (let k = 0; k < points.length; ++k) {
        polynomial[k] += points[i][1] * coefficients[k];
      }
    }

    return polynomial
  }
}
