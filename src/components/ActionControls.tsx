
import React, { useState } from 'react';
import { ACTIONS } from '../data/actions';
import { Student, Player, ActionCategory } from '../models/types';
import { checkRequirements } from '../core/mechanics';

interface Props {
  student: Student;
  player: Player;
  onTrain: (id: string) => void;
  onRest: () => void;
  isGameOver: boolean;
  onReset: () => void;
}

const TABS: { id: ActionCategory; label: string }[] = [
  { id: 'COMMUNICATION', label: '대화' },
  { id: 'TRAINING', label: '훈련' },
  { id: 'HYPNOSIS', label: '세뇌' },
  { id: 'CONDITIONING', label: '조교' },
];

export const ActionControls: React.FC<Props> = ({ student, player, onTrain, onRest, isGameOver, onReset }) => {
  const [activeTab, setActiveTab] = useState<ActionCategory>('COMMUNICATION');

  if (isGameOver) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg border border-red-900 text-center">
        <h3 className="text-2xl text-red-500 font-bold mb-4">SIMULATION FAILED</h3>
        <button onClick={onReset} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Reboot System
        </button>
      </div>
    );
  }

  const filteredActions = ACTIONS.filter(a => a.category === activeTab);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === tab.id 
                ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action List */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {filteredActions.map(action => {
          const check = checkRequirements(student, player, action.requirements);
          
          return (
            <button
              key={action.id}
              onClick={() => onTrain(action.id)}
              disabled={!check.ok}
              className={`w-full text-left p-3 rounded border transition-all group relative ${
                check.ok 
                  ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-blue-500' 
                  : 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-bold ${check.ok ? 'text-gray-200' : 'text-gray-600'}`}>
                  {action.label}
                </span>
                {action.requirements.minAp && (
                  <span className="text-xs text-blue-400">AP -{action.requirements.minAp}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{action.description}</p>
              
              {/* Lock Reason Tooltip (Simple Text) */}
              {!check.ok && (
                <div className="mt-2 text-xs text-red-500 font-mono">
                  🔒 {check.reason}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer (Rest) */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onRest}
          className="w-full py-3 bg-green-900 hover:bg-green-800 text-green-100 font-bold rounded border border-green-700 transition-colors"
        >
          REST (휴식 & AP회복)
        </button>
      </div>
    </div>
  );
};
