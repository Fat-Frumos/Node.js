import {simpleCalculator, Action} from './index';

const testCases = [
  {a: 1, b: 2, action: Action.Add, expected: 3},
  {a: 2, b: 2, action: Action.Add, expected: 4},
  {a: 3, b: 2, action: Action.Add, expected: 5},
  {a: 3, b: 2, action: Action.Subtract, expected: 1},
  {a: 5, b: 2, action: Action.Subtract, expected: 3},
  {a: 4, b: 2, action: Action.Subtract, expected: 2},
  {a: 3, b: 2, action: Action.Multiply, expected: 6},
  {a: 4, b: 2, action: Action.Multiply, expected: 8},
  {a: 3, b: 2, action: Action.Multiply, expected: 6},
  {a: 8, b: 2, action: Action.Divide, expected: 4},
  {a: 10, b: 2, action: Action.Divide, expected: 5},
  {a: 5, b: 2, action: Action.Divide, expected: 2.5},
  {a: 9, b: 3, action: Action.Divide, expected: 3},
  {a: 2, b: 3, action: Action.Exponentiate, expected: 8},
  {a: 3, b: 2, action: Action.Exponentiate, expected: 9},
  {a: 4, b: 3, action: Action.Exponentiate, expected: 64},
  // Test cases with one operand as 0
  { a: 0, b: 5, action: Action.Add, expected: 5 },
  { a: 5, b: 0, action: Action.Subtract, expected: 5 },
  { a: 0, b: 5, action: Action.Multiply, expected: 0 },
  { a: 0, b: 5, action: Action.Divide, expected: 0 },
  { a: 5, b: 0, action: Action.Divide, expected: Infinity },
  { a: 0, b: 5, action: Action.Exponentiate, expected: 0 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
  // Test cases with negative operands
  { a: -3, b: 2, action: Action.Add, expected: -1 },
  { a: 3, b: -2, action: Action.Subtract, expected: 5 },
  { a: -3, b: 2, action: Action.Multiply, expected: -6 },
  { a: -6, b: 2, action: Action.Divide, expected: -3 },
  { a: 6, b: -2, action: Action.Divide, expected: -3 },
  { a: -5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 5, b: -2, action: Action.Exponentiate, expected: 0.04 },
];

describe('simpleCalculator', () => {
  testCases.forEach(({a, b, action, expected}) => {
    test(`should perform ${action} operation correctly`, () => {
      const result = simpleCalculator({a, b, action});
      expect(result).toEqual(expected);
    });
  });
});
