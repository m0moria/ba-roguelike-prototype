import React from 'react';
import { Record } from '../models/types';

export const RecordHistory: React.FC<{ records: Record[] }> = ({ records }) => {
  if (records.length === 0) return null;

  return (
    <div className="mt-8 bg-gray-900 p-4 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-400">Previous Records</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-800">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Corruption</th>
              <th className="px-4 py-2">Obedience</th>
              <th className="px-4 py-2">Sensitivity</th>
            </tr>
          </thead>
          <tbody>
            {records.slice().reverse().map((rec) => (
              <tr key={rec.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2">{rec.date}</td>
                <td className="px-4 py-2 font-bold text-yellow-500">{rec.rank}</td>
                <td className="px-4 py-2">{rec.finalStats.corruption}</td>
                <td className="px-4 py-2">{rec.finalStats.obedience}</td>
                <td className="px-4 py-2">{rec.finalStats.sensitivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
