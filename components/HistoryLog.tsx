import React from 'react';
import type { HistoryEntry } from '../types';
import Formula from './Formula';
import { ArrowRightShortIcon, CheckIcon, QuestionMarkCircleIcon, SparklesIcon } from './Icons';

interface HistoryLogProps {
  history: HistoryEntry[];
}

const statusInfo: Record<HistoryEntry['status'], { icon: React.ReactNode, text: string, color: string }> = {
    solved: {
        icon: <CheckIcon className="w-5 h-5" />,
        text: 'Resolvido',
        color: 'text-emerald-400'
    },
    solved_with_hint: {
        icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
        text: 'Resolvido com Dica',
        color: 'text-yellow-400'
    },
    revealed: {
        icon: <SparklesIcon className="w-5 h-5" />,
        text: 'Revelado',
        color: 'text-sky-400'
    }
}

const difficultyBadge: Record<HistoryEntry['equation']['difficulty'], string> = {
    easy: 'bg-emerald-500/20 text-emerald-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    hard: 'bg-red-500/20 text-red-300',
}

const FormattedEquation: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
    const { equation } = entry;
    const { reactants, products } = equation.solution;

    const renderSide = (formulas: string[], coeffs: number[]) => {
        return formulas.map((formula, index) => (
            <React.Fragment key={index}>
                <div className="flex items-center space-x-1">
                    <span className="font-bold text-xl text-cyan-300">{coeffs[index] > 1 ? coeffs[index] : ''}</span>
                    <Formula formula={formula} />
                </div>
                {index < formulas.length - 1 && <span className="text-2xl font-light text-slate-400 mx-1">+</span>}
            </React.Fragment>
        ));
    }

    return (
        <div className="flex items-center justify-center flex-wrap gap-1">
            {renderSide(equation.reactants, reactants)}
            <ArrowRightShortIcon className="w-6 h-6 text-slate-400 mx-2" />
            {renderSide(equation.products, products)}
        </div>
    )
}


const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        <p>Nenhuma equação resolvida ainda. Comece a jogar!</p>
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-2">
      <ul className="space-y-3">
        {history.map(entry => (
          <li key={entry.id} className="bg-slate-700/50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-grow">
                <FormattedEquation entry={entry} />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
               <span className={`capitalize text-xs font-semibold px-2 py-1 rounded-full ${difficultyBadge[entry.equation.difficulty]}`}>
                    {entry.equation.difficulty}
                </span>
                <div className={`flex items-center gap-1.5 text-sm font-medium ${statusInfo[entry.status].color}`}>
                    {statusInfo[entry.status].icon}
                    <span>{statusInfo[entry.status].text}</span>
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryLog;
