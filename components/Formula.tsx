
import React from 'react';

interface FormulaProps {
  formula: string;
}

const Formula: React.FC<FormulaProps> = ({ formula }) => {
  const parts = formula.split(/(\d+)/);

  return (
    <span className="font-mono text-2xl md:text-3xl font-bold text-cyan-300">
      {parts.map((part, index) =>
        /^\d+$/.test(part) ? <sub key={index} className="text-xl md:text-2xl">{part}</sub> : <span key={index}>{part}</span>
      )}
    </span>
  );
};

export default Formula;
