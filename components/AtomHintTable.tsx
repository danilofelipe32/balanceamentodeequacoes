import React, { useMemo } from 'react';
import type { Equation } from '../types';
import { calculateAtomCounts } from '../services/gameLogic';

interface AtomHintTableProps {
  equation: Equation;
  coefficients: {
    reactants: (number | string)[];
    products: (number | string)[];
  };
}

const AtomHintTable: React.FC<AtomHintTableProps> = ({ equation, coefficients }) => {
  const { reactantAtoms, productAtoms, allElements } = useMemo(() => {
    const reactantAtoms = calculateAtomCounts(equation.reactants, coefficients.reactants);
    const productAtoms = calculateAtomCounts(equation.products, coefficients.products);
    const allElements = Array.from(new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)])).sort();
    return { reactantAtoms, productAtoms, allElements };
  }, [equation, coefficients]);

  if (allElements.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-slate-900/50 rounded-lg p-4 border border-slate-700 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-center mb-3 text-cyan-400">Contagem de Átomos</h3>
      <table className="w-full text-center">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="py-2 px-4 font-semibold text-slate-300">Elemento</th>
            <th className="py-2 px-4 font-semibold text-slate-300">Reagentes</th>
            <th className="py-2 px-4 font-semibold text-slate-300">Produtos</th>
          </tr>
        </thead>
        <tbody>
          {allElements.map(element => {
            const reactantCount = reactantAtoms[element] || 0;
            const productCount = productAtoms[element] || 0;
            const isBalanced = reactantCount === productCount;

            return (
              <tr key={element} className={`border-t border-slate-800 transition-colors duration-300 ${isBalanced ? 'text-slate-300' : 'text-red-400 font-bold'}`}>
                <td className="py-2 px-4 font-mono text-cyan-300 text-lg">{element}</td>
                <td className="py-2 px-4 font-mono text-lg">{reactantCount}</td>
                <td className="py-2 px-4 font-mono text-lg">{productCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AtomHintTable;