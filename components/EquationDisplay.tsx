import React from 'react';
import type { Equation } from '../types';
import Formula from './Formula';
import { ArrowRightShortIcon } from './Icons';

interface EquationDisplayProps {
  equation: Equation;
  coefficients: {
    reactants: (number | string)[];
    products: (number | string)[];
  };
  onCoefficientChange: (type: 'reactants' | 'products', index: number, value: string) => void;
  isSolved: boolean;
}

const EquationDisplay: React.FC<EquationDisplayProps> = ({ equation, coefficients, onCoefficientChange, isSolved }) => {

  const renderSide = (formulas: string[], type: 'reactants' | 'products') => {
    return formulas.map((formula, index) => (
      <React.Fragment key={`${type}-${index}`}>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            value={coefficients[type][index]}
            onChange={(e) => onCoefficientChange(type, index, e.target.value)}
            disabled={isSolved}
            aria-label={`Coefficient for ${formula}`}
            className={`w-16 h-12 text-center text-2xl font-bold rounded-md bg-slate-800 border-2 transition-all duration-200
              ${isSolved ? 'border-emerald-500 text-emerald-300' : 'border-slate-600 hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none'}
            `}
          />
          <Formula formula={formula} />
        </div>
        {index < formulas.length - 1 && <span className="text-3xl font-light text-slate-400 mx-2 md:mx-4">+</span>}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 my-6">
      <div className="flex items-center justify-center flex-wrap gap-2 md:gap-0">
        {renderSide(equation.reactants, 'reactants')}
      </div>
      
      <div className="text-slate-400 mx-4 my-4 md:my-0">
        <ArrowRightShortIcon className="w-10 h-10 transform transition-transform duration-300" />
      </div>

      <div className="flex items-center justify-center flex-wrap gap-2 md:gap-0">
        {renderSide(equation.products, 'products')}
      </div>
    </div>
  );
};

export default EquationDisplay;