import React from 'react';
import type { Difficulty } from '../types';
import { TrophyIcon } from './Icons';

interface StatsDisplayProps {
  score: number;
  stats: Record<Difficulty, number>;
}

const difficultyColors: Record<Difficulty, string> = {
    easy: 'text-emerald-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
};

const difficultyLabels: Record<Difficulty, string> = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ score, stats }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-slate-900/50 rounded-lg p-4 border border-slate-700 backdrop-blur-sm flex justify-around items-center text-center animate-fade-in">
      <div className="flex items-center gap-3">
        <TrophyIcon className="w-8 h-8 text-amber-400" />
        <div>
          <span className="text-2xl font-bold text-white">{score}</span>
          <p className="text-sm text-slate-400">Pontos</p>
        </div>
      </div>
      <div className="h-12 border-l border-slate-700"></div>
      <div className="flex gap-4 md:gap-8">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
            <div key={diff}>
                <span className={`text-2xl font-bold ${difficultyColors[diff]}`}>{stats[diff]}</span>
                <p className="text-sm text-slate-400">{difficultyLabels[diff]}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDisplay;
