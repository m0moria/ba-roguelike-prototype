import React, { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { StatusDisplay } from './components/StatusDisplay';
import { ActionControls } from './components/ActionControls';
import { LogViewer } from './components/LogViewer';
import { RecordHistory } from './components/RecordHistory';

const App: React.FC = () => {
  const { 
    student, 
    turn, 
    maxTurns, 
    logs, 
    isGameOver, 
    records,
    performTraining, 
    rest, 
    resetGame,
    loadRecords
  } = useGameStore();

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 md:p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-blue-900 pb-4">
          <h1 className="text-3xl font-bold text-blue-500 tracking-tighter">
            Blue Archive: <span className="text-white">Möbius of Desires</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            System Ver 0.1.0 // Connected to Shittim Chest...
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Status */}
          <div className="md:col-span-5 lg:col-span-4">
            <StatusDisplay student={student} turn={turn} maxTurns={maxTurns} />
          </div>

          {/* Right Column: Actions & Logs */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
            <LogViewer logs={logs} />
            <ActionControls 
              onTrain={performTraining} 
              onRest={rest} 
              onReset={resetGame}
              isGameOver={isGameOver}
            />
          </div>
        </div>

        {/* Bottom: History */}
        <RecordHistory records={records} />
      </div>
    </div>
  );
};

export default App;
