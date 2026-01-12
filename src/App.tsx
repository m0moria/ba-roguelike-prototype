
import React, { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { StatusDisplay } from './components/StatusDisplay';
import { ActionControls } from './components/ActionControls';
import { LogViewer } from './components/LogViewer';
import { RecordHistory } from './components/RecordHistory';
import { CombatOverlay } from './components/CombatOverlay';

const App: React.FC = () => {
  const { 
    student, player, turn, logs, isGameOver, records,
    performAction, rest, resetGame, loadRecords 
  } = useGameStore();

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-2 md:p-6 font-mono relative overflow-hidden">
      <CombatOverlay />

      <div className="max-w-6xl mx-auto h-[95vh] flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-blue-500 tracking-tighter">
              BA: <span className="text-white">Möbius</span>
            </h1>
            <p className="text-xs text-gray-600">Schale Tactical Guidance System v2.0</p>
          </div>
          <div className="text-right text-xs text-gray-500">
             Target: {student.name}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          
          {/* Left: Status (4 cols) */}
          <div className="lg:col-span-4 overflow-y-auto pr-2">
            <StatusDisplay student={student} player={player} turn={turn} />
            <RecordHistory records={records} />
          </div>

          {/* Center: Logs (4 cols) */}
          <div className="lg:col-span-4 flex flex-col min-h-0">
             <div className="bg-gray-900 rounded-t-lg border border-gray-700 p-2 text-xs text-gray-400 text-center">
               Operation Logs
             </div>
             <div className="flex-1 min-h-0">
               <LogViewer logs={logs} />
             </div>
          </div>

          {/* Right: Actions (4 cols) */}
          <div className="lg:col-span-4 h-full min-h-0">
            <ActionControls 
              student={student}
              player={player}
              onTrain={performAction}
              onRest={rest}
              isGameOver={isGameOver}
              onReset={resetGame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
