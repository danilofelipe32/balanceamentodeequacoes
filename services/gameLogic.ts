
import type { ElementCount, Equation, Difficulty } from '../types';
import { EQUATIONS } from '../constants/equations';

export const parseFormula = (formula: string): ElementCount => {
  const atoms: ElementCount = {};
  const regex = /([A-Z][a-z]*)(\d*)/g;
  let match;
  while ((match = regex.exec(formula)) !== null) {
    const [, symbol, countStr] = match;
    const count = countStr ? parseInt(countStr, 10) : 1;
    atoms[symbol] = (atoms[symbol] || 0) + count;
  }
  return atoms;
};

export const calculateAtomCounts = (formulas: string[], coefficients: (number | string)[]): ElementCount => {
  const totalAtoms: ElementCount = {};
  formulas.forEach((formula, index) => {
    const coefficient = Number(coefficients[index]) || 1;
    const atomsInFormula = parseFormula(formula);
    for (const symbol in atomsInFormula) {
      if (Object.prototype.hasOwnProperty.call(atomsInFormula, symbol)) {
        totalAtoms[symbol] = (totalAtoms[symbol] || 0) + atomsInFormula[symbol] * coefficient;
      }
    }
  });
  return totalAtoms;
};

export const checkBalance = (equation: Equation, userCoefficients: { reactants: (number|string)[], products: (number|string)[] }): boolean => {
  const reactantAtoms = calculateAtomCounts(equation.reactants, userCoefficients.reactants);
  const productAtoms = calculateAtomCounts(equation.products, userCoefficients.products);

  const allElements = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);

  if (allElements.size === 0) return false;

  for (const element of allElements) {
    if ((reactantAtoms[element] || 0) !== (productAtoms[element] || 0)) {
      return false;
    }
  }

  // Ensure all coefficients are filled
  const allCoefficients = [...userCoefficients.reactants, ...userCoefficients.products];
  if (allCoefficients.some(c => c === '' || c === 0 || Number(c) < 1)) {
    return false;
  }

  return true;
};

export const getRandomEquation = (difficulty: Difficulty, currentId?: number): Equation => {
    const filteredEquations = EQUATIONS.filter(eq => eq.difficulty === difficulty && eq.id !== currentId);
    if(filteredEquations.length === 0) {
        // Fallback if all equations of a difficulty are exhausted or only one exists
        return EQUATIONS.filter(eq => eq.difficulty === difficulty)[0];
    }
    const randomIndex = Math.floor(Math.random() * filteredEquations.length);
    return filteredEquations[randomIndex];
};
