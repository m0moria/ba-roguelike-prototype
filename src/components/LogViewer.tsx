import React, { useEffect, useRef } from 'react';

export const LogViewer: React.FC<{ logs: string[] }> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black p-4 rounded-lg border border-gray-700 font-mono text-sm h-48 overflow-y-auto shadow-inner">
      {logs.map((log, i) => (
        <div key={i} className="mb-1 border-b border-gray-900 pb-1 last:border-0 text-gray-300">
          <span className="text-blue-500 mr-2">{'>'}</span>
          {log}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};
