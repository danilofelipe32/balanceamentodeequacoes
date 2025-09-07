
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ElementCount {
  [symbol: string]: number;
}

export interface Equation {
  id: number;
  reactants: string[];
  products: string[];
  difficulty: Difficulty;
  solution: {
    reactants: number[];
    products: number[];
  };
}

export type SolveStatus = 'solved' | 'revealed' | 'solved_with_hint';

export interface HistoryEntry {
  id: number;
  equation: Equation;
  status: SolveStatus;
}
