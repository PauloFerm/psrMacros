import {MathUtils} from "../src/0-physics/0-mathUtils";

const vec0 = [0, 0, 0, 0, 0];
const vec1 = [1, 2, 3, 4, 5];
const vec2 = [3, 4, 1, 8, 12];
const vecN = [1, 2, 3, 4, 5, 7];

describe("dotProduct", () => {
  test("keep 0", () => {
    expect(MathUtils.dotProduct(vec0, vec0)).toBe(0);
  });
  test("to zero", () => {
    expect(MathUtils.dotProduct(vec0, vec1)).toBe(0);
  });
  test("square", () => {
    expect(MathUtils.dotProduct(vec1, vec1)).toBe(55);
  });
  test("not equal lengths", () => {
    expect(MathUtils.dotProduct(vec1, vecN)).toThrow('Arrays must have same sizes!');
  });
});

describe("closestValue", () => {
  test("exact match", () => {
    expect(MathUtils.closestValue(vec1, 3)).toBe(3);
  });
  test("up match", () => {
    expect(MathUtils.closestValue(vec1, 3.1, true)).toBe(4);
  });
  test("down match", () => {
    expect(MathUtils.closestValue(vec1, 3.1, false)).toBe(3);
  });
});

describe("Polynoms", () => {
  const coeffs = new MathUtils.Polynomial(vec1);
  const coords = vec1.map((x, i) => {
    return [x, vec2[i]]
  });
  const poly = new MathUtils.Polynomial(
    MathUtils.LagrangeInterpolation(coords)
  );

  test("constructor", () => {
    expect(coeffs.coefficients).toEqual(vec1);
  });
  test("lagrange", () => {
    for (let j = 0; j < vec1.length; j++) {
      expect(poly.evaluate(vec1[j])).toBeCloseTo(vec2[j], 6);
    }
  });
});

