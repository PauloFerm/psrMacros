namespace MathUtils {
  export class Polynomial{
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

  export function dotProduct(
    array0: number[], 
    array1: number[]
  ): number {
    
    if (array0.length != array1.length) {
      throw 'Arrays have different sizes!';
    }

    return array0.map((x, i) => array0[i] * array1[i] )
      .reduce((sum, now) => sum + now, 0);
  }

  export function closestValue(
    array: number[],
    value: number,
    up: boolean = true 
  ): number {

    let response = NaN;

    if (up) {
      response = Math.min(...array.filter( v => v > value ));
    } else {
      response = Math.max(...array.filter( v => v < value ));
    }

    return response;
  }
}