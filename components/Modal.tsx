import React from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in-fast" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl border border-slate-700 transform animate-scale-in" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 id="modal-title" className="text-xl font-bold text-cyan-400">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 rounded-full p-1 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 text-slate-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Modal;
