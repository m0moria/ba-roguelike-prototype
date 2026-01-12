
import React from 'react';
import { Student, Player } from '../models/types';

interface Props {
  student: Student;
  player: Player;
  turn: number;
}

const StatRow = ({ label, value, max=100, color }: { label: string, value: number, max?: number, color: string }) => (
  <div className="mb-1">
    <div className="flex justify-between text-xs text-gray-400">
      <span>{label}</span>
      <span>{value} {max !== 100 && max > 0 ? `/ ${max}` : ''}</span>
    </div>
    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.min(100, (value / (max || 100)) * 100)}%` }}></div>
    </div>
  </div>
);

export const StatusDisplay: React.FC<Props> = ({ student, player, turn }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-700 pb-2 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-blue-400">{student.name}</h2>
          <span className="text-xs text-gray-500">Target Student</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-mono text-white">Day {turn}</span>
        </div>
      </div>

      {/* Vitals */}
      <div className="space-y-3">
        <StatRow label="Health (체력)" value={student.currentHealth} color="bg-red-500" />
        <StatRow label="Stress (스트레스)" value={student.stress} color="bg-orange-500" />
        <StatRow label="Hypnosis Depth (최면 심도)" value={student.hypnosisDepth} max={4} color="bg-purple-600" />
      </div>

      {/* Shittim Chest (Player) */}
      <div className="bg-gray-800 p-3 rounded border border-gray-600">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-blue-300">Shittim Chest (G.S.C)</span>
          <span className="text-xs text-blue-200">Lv.{player.hackingLevel}</span>
        </div>
        <StatRow label="AP (Action Points)" value={player.ap} max={player.maxAp} color="bg-blue-500" />
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <StatRow label="Mystic (신비)" value={student.stats.mystic} max={200} color="bg-cyan-400" />
          <StatRow label="Resistance (저항)" value={student.stats.resistance} color="bg-yellow-600" />
        </div>
        <div>
           <StatRow label="Corruption (타락)" value={student.stats.corruption} color="bg-fuchsia-600" />
           <StatRow label="Obedience (순종)" value={student.stats.obedience} color="bg-green-500" />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
         <StatRow label="Sensitivity (감도)" value={student.stats.sensitivity} color="bg-pink-500" />
         <StatRow label="Pleasure Tol. (내성)" value={student.stats.pleasureTolerance} color="bg-indigo-500" />
       </div>
    </div>
  );
};
