import { create } from 'zustand';
import { CoreStats, Record, Student, TrainingAction } from '../models/types';
import { calculateSuccessRate, randomInRange, calculateRank } from '../core/mechanics';
import { TRAINING_ACTIONS } from '../data/actions';

interface GameState {
  turn: number;
  maxTurns: number;
  student: Student;
  logs: string[];
  records: Record[];
  isGameOver: boolean;

  // Actions
  performTraining: (actionId: string) => void;
  rest: () => void;
  resetGame: () => void;
  loadRecords: () => void;
}

const INITIAL_STATS: CoreStats = {
  resistance: 50,
  sensitivity: 0,
  obedience: 0,
  pleasureTolerance: 0,
  corruption: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  turn: 1,
  maxTurns: 20,
  logs: ['Turn 1: 시뮬레이션 개시. 학생의 저항이 감지됩니다.'],
  records: [],
  isGameOver: false,
  student: {
    name: 'Unknown Student', // 나중에 학생 선택 기능 추가 가능
    maxHealth: 100,
    currentHealth: 100,
    stats: { ...INITIAL_STATS },
  },

  loadRecords: () => {
    const saved = localStorage.getItem('eraBlueArchiveRecords');
    if (saved) {
      set({ records: JSON.parse(saved) });
    }
  },

  performTraining: (actionId: string) => {
    const { turn, maxTurns, student, isGameOver, logs, records } = get();
    if (turn > maxTurns || isGameOver) return;

    const action = TRAINING_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    // 1. 체력 소모
    const hpDrain = randomInRange(action.hpCostMin, action.hpCostMax);
    const newHealth = Math.max(student.currentHealth - hpDrain, 0);

    // 2. 성공 여부 판정
    // Note: App.tsx 로직을 계승하되, 분리된 mechanics 사용
    const successRate = calculateSuccessRate(student.currentHealth, student.stats.resistance); 
    // *원작자 의도: 체력이 낮을수록(패널티가 클수록) 성공률이 오르는 구조였음. 
    // mechanics.ts에서 로직을 약간 수정하여 체력이 낮으면 -> 저항하기 힘듦 -> 성공률 상승으로 구현함.

    const roll = Math.random() * 100;
    const isSuccess = roll < successRate;

    let logMsg = `Turn ${turn}: [${action.label}] 시도. 체력 소모 -${hpDrain}. `;
    let newStats = { ...student.stats };

    if (isSuccess) {
      const boosts: string[] = [];
      Object.entries(action.statImpact).forEach(([key, val]) => {
        if (!val) return;
        const boostAmount = randomInRange(1, Math.abs(val));
        const actualChange = val > 0 ? boostAmount : -boostAmount;
        
        newStats[key as keyof CoreStats] += actualChange;
        
        // 스탯 Min/Max 보정 (0~100)
        newStats[key as keyof CoreStats] = Math.max(0, Math.min(100, newStats[key as keyof CoreStats]));
        
        boosts.push(`${key} ${actualChange > 0 ? '+' : ''}${actualChange}`);
      });
      logMsg += `성공 (확률 ${successRate}%). ${boosts.join(', ')}.`;
    } else {
      logMsg += `실패 (확률 ${successRate}%). 학생이 완강히 거부합니다.`;
    }

    // 3. 턴 진행 및 게임 오버 체크
    const nextTurn = turn + 1;
    let gameOverStatus = isGameOver;
    let newRecords = [...records];

    if (nextTurn > maxTurns) {
      gameOverStatus = true;
      logMsg += " [시뮬레이션 종료]";
      
      const newRec: Record = {
        id: Date.now(),
        finalStats: { ...newStats },
        totalTurns: maxTurns,
        date: new Date().toLocaleString(),
        rank: calculateRank(newStats)
      };
      newRecords.push(newRec);
      localStorage.setItem('eraBlueArchiveRecords', JSON.stringify(newRecords));
    }

    set({
      turn: nextTurn,
      logs: [...logs, logMsg],
      student: { ...student, currentHealth: newHealth, stats: newStats },
      isGameOver: gameOverStatus,
      records: newRecords
    });
  },

  rest: () => {
    const { turn, maxTurns, student, logs, isGameOver } = get();
    if (turn > maxTurns || isGameOver) return;

    const recover = randomInRange(20, 30);
    const newHealth = Math.min(student.currentHealth + recover, 100);
    
    set({
      turn: turn + 1,
      student: { ...student, currentHealth: newHealth },
      logs: [...logs, `Turn ${turn}: 휴식. 체력이 ${recover} 회복되었습니다.`],
    });
  },

  resetGame: () => {
    set({
      turn: 1,
      isGameOver: false,
      logs: ['New Run: 새로운 시뮬레이션을 시작합니다.'],
      student: {
        name: 'Unknown Student',
        maxHealth: 100,
        currentHealth: 100,
        stats: { ...INITIAL_STATS }
      }
    });
  }
}));
