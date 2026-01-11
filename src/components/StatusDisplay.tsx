import React from 'react';
import { Student } from '../models/types';
import { calculateSuccessRate } from '../core/mechanics';

interface Props {
  student: Student;
  turn: number;
  maxTurns: number;
}

const ProgressBar = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export const StatusDisplay: React.FC<Props> = ({ student, turn, maxTurns }) => {
  const successRate = calculateSuccessRate(student);
  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">
        Student Status (Turn {turn > maxTurns ? maxTurns : turn}/{maxTurns})
      </h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Health & Vitality</p>
        <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-600">
           <div 
             className="bg-red-600 h-full rounded-full transition-all duration-300" 
             style={{ width: `${student.currentHealth}%` }}
           ></div>
        </div>
        <p className="text-right text-xs mt-1 text-red-400">{student.currentHealth} / 100</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ProgressBar label="Resistance (저항)" value={student.stats.resistance} colorClass="bg-yellow-600" />
        <ProgressBar label="Sensitivity (감도)" value={student.stats.sensitivity} colorClass="bg-pink-500" />
        <ProgressBar label="Obedience (순종)" value={student.stats.obedience} colorClass="bg-blue-500" />
        <ProgressBar label="Corruption (타락)" value={student.stats.corruption} colorClass="bg-purple-600" />
      </div>

      <div className="mt-4 p-2 bg-gray-800 rounded text-center">
        <span className="text-sm text-gray-400">Current Success Rate: </span>
        <span className="text-lg font-bold text-green-400">{successRate}%</span>
      </div>
    </div>
  );
};
