import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Equation, Difficulty, HistoryEntry, SolveStatus } from './types';
import { getRandomEquation, checkBalance } from './services/gameLogic';
import EquationDisplay from './components/EquationDisplay';
import AtomHintTable from './components/AtomHintTable';
import Modal from './components/Modal';
import ToggleSwitch from './components/ToggleSwitch';
import StatsDisplay from './components/StatsDisplay';
import HistoryLog from './components/HistoryLog';
import { CheckIcon, SparklesIcon, BeakerIcon, XCircleIcon, QuestionMarkCircleIcon, ArrowRightShortIcon, InfoIcon, ClockIcon } from './components/Icons';

type GameStatus = 'playing' | 'correct' | 'incorrect' | 'solved';

const difficultyMap: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil'
};

const pointsMap: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30
};

const MAX_HISTORY_LENGTH = 30;

const DifficultyButton: React.FC<{
  difficulty: Difficulty;
  current: Difficulty | null;
  onClick: (d: Difficulty) => void;
}> = ({ difficulty, current, onClick }) => {
  const isActive = current === difficulty;
  const baseClasses = "px-4 py-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 capitalize text-sm md:text-base";
  const activeClasses = "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105";
  const inactiveClasses = "bg-slate-700 hover:bg-slate-600 text-slate-300";

  return (
    <button
      onClick={() => onClick(difficulty)}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {difficultyMap[difficulty]}
    </button>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  title: string;
}> = ({ onClick, disabled = false, children, className = '', title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`flex items-center justify-center gap-2 font-bold py-2 px-5 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:scale-100 ${className}`}
    >
        {children}
    </button>
);


const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [coefficients, setCoefficients] = useState<{
    reactants: (number | string)[];
    products: (number | string)[];
  }>({ reactants: [], products: [] });
  const [showHint, setShowHint] = useState(false);
  const [hintUsedForCurrent, setHintUsedForCurrent] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAutoNextEnabled, setIsAutoNextEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const nextEquationTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (nextEquationTimeout.current) {
        clearTimeout(nextEquationTimeout.current);
      }
    };
  }, []);

  const startNewGame = useCallback((newDifficulty: Difficulty, currentId?: number) => {
    if (nextEquationTimeout.current) {
      clearTimeout(nextEquationTimeout.current);
    }
    const newEquation = getRandomEquation(newDifficulty, currentId);
    setCurrentEquation(newEquation);
    setCoefficients({
      reactants: Array(newEquation.reactants.length).fill(''),
      products: Array(newEquation.products.length).fill(''),
    });
    setShowHint(false);
    setHintUsedForCurrent(false);
    setGameStatus('playing');
    setFeedbackMessage('');
  }, []);
  
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    startNewGame(newDifficulty, currentEquation?.id);
  }

  const handleCoefficientChange = (type: 'reactants' | 'products', index: number, value: string) => {
    if (gameStatus === 'solved' || gameStatus === 'correct') return;
    const newCoefficients = { ...coefficients };
    newCoefficients[type][index] = value;
    setCoefficients(newCoefficients);
    setGameStatus('playing');
    setFeedbackMessage('');
  };

  const addHistoryEntry = (status: SolveStatus) => {
      if (!currentEquation) return;
      const newEntry: HistoryEntry = {
        id: Date.now(),
        equation: currentEquation,
        status: status,
      };
      setHistory(prev => [newEntry, ...prev].slice(0, MAX_HISTORY_LENGTH));
  };

  const handleCheck = () => {
    if (!currentEquation || !difficulty) return;
    const isBalanced = checkBalance(currentEquation, coefficients);
    setFeedbackKey(k => k + 1);
    if (isBalanced) {
      let message = 'Correto! Muito bem!';
      if (!hintUsedForCurrent) {
          const points = pointsMap[difficulty];
          setScore(s => s + points);
          setStats(s => ({ ...s, [difficulty]: s[difficulty] + 1 }));
          addHistoryEntry('solved');
          message = `Correto! +${points} pontos!`;
      } else {
          addHistoryEntry('solved_with_hint');
      }

      setGameStatus('correct');

      if (isAutoNextEnabled) {
        setFeedbackMessage(`${message} Preparando próximo desafio...`);
        nextEquationTimeout.current = window.setTimeout(() => {
          startNewGame(difficulty, currentEquation.id);
        }, 2500);
      } else {
        setFeedbackMessage(message);
      }
    } else {
      setGameStatus('incorrect');
      setFeedbackMessage('Ops! Ainda não está balanceado. Tente novamente!');
    }
  };

  const handleSolve = () => {
    if (!currentEquation) return;
    setCoefficients(currentEquation.solution);
    setGameStatus('solved');
    setShowHint(true);
    setFeedbackKey(k => k + 1);
    setFeedbackMessage('Aqui está a solução. Estude-a para a próxima!');
    addHistoryEntry('revealed');
  };

  const handleToggleHint = () => {
      setShowHint(!showHint);
      if (!showHint) {
          setHintUsedForCurrent(true);
      }
  };

  const handleNewEquation = () => {
    if(difficulty){
      startNewGame(difficulty, currentEquation?.id);
    }
  }
  
  const getStatusInfo = () => {
    switch(gameStatus) {
        case 'correct': return {
            classes: 'bg-emerald-500/10 border-emerald-500 text-emerald-300',
            icon: <CheckIcon className="w-6 h-6 mr-2" />
        };
        case 'incorrect': return {
            classes: 'bg-red-500/10 border-red-500 text-red-300',
            icon: <XCircleIcon className="w-6 h-6 mr-2" />
        };
        case 'solved': return {
            classes: 'bg-sky-500/10 border-sky-500 text-sky-300',
            icon: <SparklesIcon className="w-6 h-6 mr-2" />
        };
        default: return {
            classes: 'border-transparent text-slate-400',
            icon: null
        };
    }
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-4">
          <div className="flex items-center justify-center gap-4">
            <BeakerIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Balanceamento Químico
            </h1>
          </div>
          <p className="text-slate-400 mt-2 text-lg">Teste suas habilidades de química!</p>
        </header>

        <StatsDisplay score={score} stats={stats} />

        <main className="relative bg-slate-800/50 backdrop-blur-lg border border-slate-700/80 rounded-xl shadow-2xl shadow-cyan-900/20 p-6 md:p-8 mt-6">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="text-slate-500 hover:text-cyan-400 transition-colors"
                aria-label="Ver histórico"
                title="Ver histórico"
              >
                <ClockIcon className="w-7 h-7" />
              </button>
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="text-slate-500 hover:text-cyan-400 transition-colors"
                aria-label="Como jogar"
                title="Como jogar"
              >
                <InfoIcon className="w-7 h-7" />
              </button>
            </div>
          
            <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => 
                    <DifficultyButton key={d} difficulty={d} current={difficulty} onClick={handleDifficultyChange} />
                )}
            </div>

            {currentEquation ? (
              <div key={currentEquation.id} className="animate-fade-in">
                <div 
                    key={feedbackKey}
                    className={`flex items-center justify-center text-center p-3 mb-6 rounded-lg border text-base md:text-lg font-semibold transition-all duration-300 ${statusInfo.classes}
                    ${gameStatus === 'correct' ? 'animate-bounce-in' : ''}
                    ${gameStatus === 'incorrect' ? 'animate-shake' : ''}
                  `}>
                    {statusInfo.icon}
                    {feedbackMessage || 'Insira os coeficientes para balancear a equação.'}
                </div>

                <EquationDisplay
                  equation={currentEquation}
                  coefficients={coefficients}
                  onCoefficientChange={handleCoefficientChange}
                  isSolved={gameStatus === 'solved' || gameStatus === 'correct'}
                />

                <div className="flex justify-center items-center gap-3 my-6">
                  <label htmlFor="auto-next-switch" className="text-slate-300 font-medium cursor-pointer">Avançar Automaticamente</label>
                  <ToggleSwitch
                    id="auto-next-switch"
                    checked={isAutoNextEnabled}
                    onChange={setIsAutoNextEnabled}
                  />
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <ActionButton onClick={handleCheck} disabled={gameStatus === 'solved' || gameStatus === 'correct'} className="bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-400" title="Verificar Resposta">
                    <CheckIcon /> Verificar
                  </ActionButton>
                  <ActionButton onClick={handleToggleHint} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 focus:ring-yellow-300" title="Mostrar/Esconder Dica">
                     <QuestionMarkCircleIcon /> {showHint ? 'Esconder' : 'Dica'}
                  </ActionButton>
                   <ActionButton onClick={handleSolve} disabled={gameStatus === 'solved' || gameStatus === 'correct'} className="bg-sky-600 hover:bg-sky-500 text-white focus:ring-sky-400" title="Resolver Equação">
                    <SparklesIcon /> Resolver
                  </ActionButton>
                   <ActionButton onClick={handleNewEquation} className="bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-400" title="Próxima Equação">
                    <ArrowRightShortIcon /> Próxima
                  </ActionButton>
                </div>

                <div className={`transition-all duration-500 ease-in-out ${showHint ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                  {showHint && currentEquation && (
                    <AtomHintTable equation={currentEquation} coefficients={coefficients} />
                  )}
                </div>
              </div>
            ) : (
                <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-4">
                    <SparklesIcon className="w-12 h-12 text-cyan-500" />
                    <p className="text-xl">Por favor, selecione um nível de dificuldade para começar.</p>
                </div>
            )}
        </main>
      </div>

      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title="Como Jogar">
        <div className="space-y-4 text-slate-300">
            <p>
              O objetivo do jogo é balancear equações químicas. Uma equação está balanceada quando o número de átomos de cada elemento é o mesmo nos reagentes (lado esquerdo) e nos produtos (lado direito).
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
                <li><strong>Escolha a Dificuldade:</strong> Comece selecionando um nível: Fácil, Médio ou Difícil.</li>
                <li><strong>Insira os Coeficientes:</strong> Digite os números (coeficientes) nas caixas em branco para balancear a equação. Você não pode usar o número zero.</li>
                <li><strong>Use a Dica:</strong> Clique em <strong>"Dica"</strong> para ver a tabela de "Contagem de Átomos". Ela mostra quantos átomos de cada elemento existem em cada lado da equação em tempo real. A linha ficará vermelha se a contagem estiver desbalanceada.</li>
                <li><strong>Verifique sua Resposta:</strong> Quando achar que a equação está correta, clique em <strong>"Verificar"</strong>.</li>
                <li><strong>Ganhe Pontos:</strong> Você ganha pontos por resolver equações sem usar a "Dica" ou o botão "Resolver".</li>
                <li><strong>Próximo Desafio:</strong> Clique em <strong>"Próxima"</strong> para carregar uma nova equação. Você também pode ativar o modo de <strong>Avanço Automático</strong> para pular essa etapa.</li>
            </ol>
        </div>
      </Modal>

      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title="Histórico de Equações">
        <HistoryLog history={history} />
      </Modal>

      <footer className="text-center text-slate-500 mt-8 text-sm">
        <p>Desenvolvido com React e TypeScript.</p>
      </footer>
    </div>
  );
};

export default App;
