import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export const CombatOverlay: React.FC = () => {
  const { phase, currentBoss, student, processCombatTurn, combatLogs, isGameOver } = useGameStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // 전투 중이면 자동으로 1초마다 턴 진행 (자동 전투)
  useEffect(() => {
    if (phase === 'COMBAT' && !isGameOver && currentBoss) {
      const timer = setTimeout(() => {
        processCombatTurn();
      }, 1000); // 1초 간격
      return () => clearTimeout(timer);
    }
  }, [phase, currentBoss, student.currentHealth, combatLogs.length, isGameOver]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatLogs]);

  if (phase !== 'COMBAT' || !currentBoss) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-8 animate-pulse">WARNING</h1>
      
      <div className="w-full max-w-2xl bg-gray-900 border-2 border-red-600 rounded-lg p-6">
        {/* Boss Status */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-red-400">{currentBoss.name}</h2>
          <p className="text-sm text-gray-500 mb-2">{currentBoss.description}</p>
          <div className="w-full bg-gray-800 h-6 rounded-full overflow-hidden border border-red-800 relative">
             <div 
               className="bg-red-600 h-full transition-all duration-500"
               style={{ width: `${(currentBoss.hp / currentBoss.maxHp) * 100}%` }}
             />
             <span className="absolute inset-0 flex items-center justify-center text-xs font-bold shadow-black drop-shadow-md">
               {currentBoss.hp} / {currentBoss.maxHp}
             </span>
          </div>
        </div>

        {/* VS */}
        <div className="text-center font-black text-xl my-4 text-yellow-500">VS</div>

        {/* Student Status */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-blue-400">{student.name}</h2>
          <div className="w-full bg-gray-800 h-6 rounded-full overflow-hidden border border-blue-800 relative">
             <div 
               className="bg-blue-600 h-full transition-all duration-500"
               style={{ width: `${(student.currentHealth / student.maxHealth) * 100}%` }}
             />
             <span className="absolute inset-0 flex items-center justify-center text-xs font-bold shadow-black drop-shadow-md">
               {student.currentHealth} / {student.maxHealth}
             </span>
          </div>
        </div>

        {/* Combat Logs */}
        <div className="h-48 overflow-y-auto bg-black border border-gray-700 p-2 font-mono text-sm rounded">
          {combatLogs.map((log, idx) => (
            <div key={idx} className={`mb-1 ${log.isPlayerAction ? 'text-blue-300' : 'text-red-300'}`}>
              <span className="opacity-50">Turn {log.turn}:</span> {log.message}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};