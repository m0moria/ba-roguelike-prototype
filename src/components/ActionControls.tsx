import React from 'react';
import { TRAINING_ACTIONS } from '../data/actions';

interface Props {
  onTrain: (id: string) => void;
  onRest: () => void;
  onReset: () => void;
  isGameOver: boolean;
}

export const ActionControls: React.FC<Props> = ({ onTrain, onRest, onReset, isGameOver }) => {
  if (isGameOver) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center h-full">
        <h3 className="text-xl text-red-500 mb-4 font-bold">Simulation Ended</h3>
        <button 
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
        >
          Start New Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Actions</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {TRAINING_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onTrain(action.id)}
            className="flex flex-col items-start p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded transition-colors group"
          >
            <span className="font-bold text-blue-300 group-hover:text-blue-200">{action.label}</span>
            <span className="text-xs text-gray-500 group-hover:text-gray-400">{action.description}</span>
          </button>
        ))}
        
        <button
          onClick={onRest}
          className="mt-4 p-3 bg-green-900 hover:bg-green-800 border border-green-700 rounded text-green-100 font-bold transition-colors"
        >
          REST (Recover Health)
        </button>
      </div>
    </div>
  );
};
