import type { Equation } from '../types';

export const EQUATIONS: Equation[] = [
  // Nível Fácil
  {
    id: 1,
    reactants: ['H2', 'O2'],
    products: ['H2O'],
    difficulty: 'easy',
    solution: { reactants: [2, 1], products: [2] },
  },
  {
    id: 2,
    reactants: ['C', 'O2'],
    products: ['CO2'],
    difficulty: 'easy',
    solution: { reactants: [1, 1], products: [1] },
  },
  {
    id: 3,
    reactants: ['Na', 'Cl2'],
    products: ['NaCl'],
    difficulty: 'easy',
    solution: { reactants: [2, 1], products: [2] },
  },
    {
    id: 10,
    reactants: ['Mg', 'O2'],
    products: ['MgO'],
    difficulty: 'easy',
    solution: { reactants: [2, 1], products: [2] },
  },
  {
    id: 11,
    reactants: ['H2', 'Cl2'],
    products: ['HCl'],
    difficulty: 'easy',
    solution: { reactants: [1, 1], products: [2] },
  },

  // Nível Médio
  {
    id: 4,
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    difficulty: 'medium',
    solution: { reactants: [1, 2], products: [1, 2] },
  },
  {
    id: 5,
    reactants: ['N2', 'H2'],
    products: ['NH3'],
    difficulty: 'medium',
    solution: { reactants: [1, 3], products: [2] },
  },
   {
    id: 6,
    reactants: ['K', 'H2O'],
    products: ['KOH', 'H2'],
    difficulty: 'medium',
    solution: { reactants: [2, 2], products: [2, 1] },
  },
  {
    id: 12,
    reactants: ['C3H8', 'O2'],
    products: ['CO2', 'H2O'],
    difficulty: 'medium',
    solution: { reactants: [1, 5], products: [3, 4] },
  },
  {
    id: 13,
    reactants: ['Fe', 'H2O'],
    products: ['Fe3O4', 'H2'],
    difficulty: 'medium',
    solution: { reactants: [3, 4], products: [1, 4] },
  },
  {
    id: 14,
    reactants: ['Al', 'HCl'],
    products: ['AlCl3', 'H2'],
    difficulty: 'medium',
    solution: { reactants: [2, 6], products: [2, 3] },
  },

  // Nível Difícil
  {
    id: 7,
    reactants: ['C2H6', 'O2'],
    products: ['CO2', 'H2O'],
    difficulty: 'hard',
    solution: { reactants: [2, 7], products: [4, 6] },
  },
  {
    id: 8,
    reactants: ['Fe2O3', 'CO'],
    products: ['Fe', 'CO2'],
    difficulty: 'hard',
    solution: { reactants: [1, 3], products: [2, 3] },
  },
  {
    id: 9,
    reactants: ['C6H12O6', 'O2'],
    products: ['CO2', 'H2O'],
    difficulty: 'hard',
    solution: { reactants: [1, 6], products: [6, 6] },
  },
    {
    id: 15,
    reactants: ['NH3', 'CuO'],
    products: ['Cu', 'N2', 'H2O'],
    difficulty: 'hard',
    solution: { reactants: [2, 3], products: [3, 1, 3] },
  },
  {
    id: 16,
    reactants: ['FeS2', 'O2'],
    products: ['Fe2O3', 'SO2'],
    difficulty: 'hard',
    solution: { reactants: [4, 11], products: [2, 8] },
  },
  {
    id: 17,
    reactants: ['KMnO4', 'HCl'],
    products: ['KCl', 'MnCl2', 'H2O', 'Cl2'],
    difficulty: 'hard',
    solution: { reactants: [2, 16], products: [2, 2, 8, 5] },
  },
];