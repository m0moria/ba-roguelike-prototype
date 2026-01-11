import React, { useEffect, useRef } from 'react';

export const LogViewer: React.FC<{ logs: string[] }> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  // 로그가 추가될 때마다 자동으로 맨 아래로 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    // h-64: 높이 고정 (약 16줄 정도), overflow-y-auto: 넘치면 스크롤
    <div className="bg-black p-4 rounded-lg border border-gray-700 font-mono text-sm h-64 overflow-y-auto shadow-inner">
      {logs.map((log, i) => (
        <div key={i} className="mb-2 border-b border-gray-900 pb-1 last:border-0 text-gray-300 whitespace-pre-wrap">
          {/* whitespace-pre-wrap: 줄바꿈(\n)이 있을 경우 그대로 표현 */}
          <span className="text-blue-500 mr-2">{'>'}</span>
          {log}
        </div>
      ))}
      {/* 이 빈 div가 항상 보이도록 스크롤됨 */}
      <div ref={endRef} />
    </div>
  );
};