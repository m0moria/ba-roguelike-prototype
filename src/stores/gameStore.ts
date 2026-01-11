import { create } from 'zustand';
import { CoreStats, Record, Student, TrainingAction, GamePhase, Enemy, CombatLog } from '../models/types';
import { calculateSuccessRate, randomInRange, calculateRank, resolveCombatTurn } from '../core/mechanics';
import { TRAINING_ACTIONS } from '../data/actions';
import { generateBoss } from '../data/enemies';
import { RANDOM_EVENTS } from '../data/randomEvents'; // 추가

interface GameState {
  turn: number;
  phase: GamePhase; // 'TRAINING' | 'COMBAT'
  loopCount: number; // 보스전 클리어 횟수
  
  student: Student;
  currentBoss: Enemy | null;
  combatLogs: CombatLog[];
  
  logs: string[];
  records: Record[];
  isGameOver: boolean;

  // Actions
  performTraining: (actionId: string) => void;
  rest: () => void;
  processCombatTurn: () => void; // 전투 1턴 진행 (UI에서 호출)
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
  phase: 'TRAINING',
  loopCount: 0,
  student: {
    name: '아로나(Student)',
    maxHealth: 100,
    currentHealth: 100,
    stats: { ...INITIAL_STATS },
  },
  currentBoss: null,
  combatLogs: [],
  logs: ['Turn 1: 시뮬레이션 개시. 학생 육성을 시작합니다.'],
  records: [],
  isGameOver: false,

  loadRecords: () => {
    const saved = localStorage.getItem('eraBlueArchiveRecords');
    if (saved) set({ records: JSON.parse(saved) });
  },

  performTraining: (actionId: string) => {
      const { turn, student, isGameOver, logs, phase, records, loopCount } = get();
      if (isGameOver || phase !== 'TRAINING') return;

      const action = TRAINING_ACTIONS.find(a => a.id === actionId);
      if (!action) return;

      // --- [기존 로직] 훈련 실행 ---
      const hpDrain = randomInRange(action.hpCostMin, action.hpCostMax);
      let currentHp = Math.max(student.currentHealth - hpDrain, 0); // 임시 변수로 HP 관리
      
      // 성공 확률 계산 (mechanics.ts의 로직 사용)
      // 체력이 낮을수록 성공률이 오르지만, 0이 되면 끝장임
      const successRate = calculateSuccessRate({ ...student, currentHealth: currentHp });
      const isSuccess = Math.random() * 100 < successRate;

      let logMsg = `Turn ${turn}: [${action.label}] `;
      let newStats = { ...student.stats };

      if (isSuccess) {
        Object.entries(action.statImpact).forEach(([key, val]) => {
          if (!val) return;
          const boost = randomInRange(1, Math.abs(val));
          const change = val > 0 ? boost : -boost;
          newStats[key as keyof CoreStats] = Math.max(0, Math.min(100, newStats[key as keyof CoreStats] + change));
        });
        logMsg += `성공! 체력 -${hpDrain}.`;
      } else {
        logMsg += `실패... 체력 -${hpDrain}.`;
      }

      // --- [추가 기능 1] 랜덤 이벤트 발생 (30% 확률) ---
      if (Math.random() < 0.3) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        
        // 체력 변동
        const eventHp = randomInRange(event.hpChangeMin, event.hpChangeMax);
        currentHp = Math.max(0, Math.min(100, currentHp + eventHp)); // 0~100 보정

        // 스탯 변동
        if (event.statImpact) {
          Object.entries(event.statImpact).forEach(([key, val]) => {
            if (!val) return;
            newStats[key as keyof CoreStats] = Math.max(0, Math.min(100, newStats[key as keyof CoreStats] + val));
          });
        }

        logMsg += `\n   ↳ (Event) ${event.message} (HP ${eventHp > 0 ? '+' : ''}${eventHp})`;
      }

      // --- [추가 기능 2] 체력 0 사망 체크 ---
      if (currentHp <= 0) {
        const record: Record = {
          id: Date.now(),
          finalStats: newStats,
          totalTurns: turn,
          date: new Date().toLocaleString(),
          rank: 'F (Collapsed)',
          result: 'Collapsed from Exhaustion'
        };
        const updatedRecords = [...records, record];
        localStorage.setItem('eraBlueArchiveRecords', JSON.stringify(updatedRecords));

        set({
          student: { ...student, currentHealth: 0, stats: newStats },
          isGameOver: true,
          logs: [...logs, logMsg, "☠️ 학생이 쓰러졌습니다. 더 이상 진행할 수 없습니다."],
          records: updatedRecords
        });
        return; // 여기서 종료
      }

      // --- 기존 턴 넘김 로직 ---
      const nextTurn = turn + 1;
      let nextPhase: GamePhase = 'TRAINING';
      let nextBoss = null;
      let nextLogs = [...logs, logMsg];

      if (turn % 20 === 0) {
        nextPhase = 'COMBAT';
        nextBoss = generateBoss(loopCount);
        nextLogs.push(`⚠️ WARNING: 강적 [${nextBoss.name}] 출현!`);
      }

      set({
        turn: nextTurn,
        phase: nextPhase,
        currentBoss: nextBoss,
        logs: nextLogs,
        student: { ...student, currentHealth: currentHp, stats: newStats },
        combatLogs: []
      });
    },

    // rest 함수에도 유사하게 이벤트 로직 적용 가능 (생략하거나 간단히 추가)
    rest: () => {
      // ... (기존 rest 로직에 랜덤 이벤트만 살짝 섞어주시면 됩니다)
      const { turn, student, logs, phase } = get();
      if (phase !== 'TRAINING') return;

      let currentHp = student.currentHealth;
      const recover = randomInRange(20, 30);
      currentHp = Math.min(currentHp + recover, 100);
      
      let logMsg = `Turn ${turn}: 휴식. 체력 +${recover}.`;

      // 휴식 중에도 이벤트 발생 가능 (예: 10% 확률)
      if (Math.random() < 0.1) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        const eventHp = randomInRange(event.hpChangeMin, event.hpChangeMax);
        currentHp = Math.max(0, Math.min(100, currentHp + eventHp));
        logMsg += `\n   ↳ (Event) ${event.message} (HP ${eventHp})`;
      }

      set({
        turn: turn + 1,
        student: { ...student, currentHealth: currentHp },
        logs: [...logs, logMsg]
        // ... 보스전 체크 로직 필요 (performTraining과 동일)
      });
    },
  rest: () => {
    // ... 기존 휴식 로직 ...
    const { turn, student, logs, phase } = get();
    if (phase !== 'TRAINING') return;
    
    const recover = randomInRange(20, 30);
    const newHealth = Math.min(student.currentHealth + recover, 100);
    
    let nextPhase: GamePhase = 'TRAINING';
    let nextBoss = null;
    let nextLogs = [...logs, `Turn ${turn}: 휴식. 체력 회복 (+${recover})`];

    if (turn % 20 === 0) {
      nextPhase = 'COMBAT';
      nextBoss = generateBoss(get().loopCount);
      nextLogs.push(`⚠️ WARNING: 강적 [${nextBoss.name}] 출현!`);
    }

    set({
      turn: turn + 1,
      phase: nextPhase,
      currentBoss: nextBoss,
      student: { ...student, currentHealth: newHealth },
      logs: nextLogs
    });
  },

  // [신규] 전투 진행 로직 (UI에서 버튼 클릭 시 1턴씩 진행 or 자동 진행)
  processCombatTurn: () => {
    const { student, currentBoss, combatLogs, loopCount, records, logs } = get();
    if (!currentBoss || student.currentHealth <= 0) return;

    // 전투 계산
    const result = resolveCombatTurn(student, currentBoss, combatLogs.length + 1);
    
    // 상태 업데이트
    const newStudentHp = Math.max(0, student.currentHealth - result.studentDmg);
    const newBossHp = Math.max(0, currentBoss.hp - result.bossDmg);
    const newCombatLogs = [...combatLogs, ...result.logs];

    // 전투 종료 판정
    if (newStudentHp <= 0) {
      // 패배 (게임 오버)
      const record: Record = {
        id: Date.now(),
        finalStats: student.stats,
        totalTurns: get().turn,
        date: new Date().toLocaleString(),
        rank: calculateRank(student.stats),
        result: `Defeated by ${currentBoss.name}`
      };
      const updatedRecords = [...records, record];
      localStorage.setItem('eraBlueArchiveRecords', JSON.stringify(updatedRecords));

      set({
        student: { ...student, currentHealth: 0 },
        isGameOver: true,
        records: updatedRecords,
        logs: [...logs, `☠️ 패배... ${currentBoss.name}에게 당했습니다.`]
      });

    } else if (newBossHp <= 0) {
      // 승리 (게임 계속)
      set({
        phase: 'TRAINING',
        loopCount: loopCount + 1,
        currentBoss: null,
        student: { ...student, currentHealth: newStudentHp }, // 체력 유지된 채로 복귀
        logs: [...logs, `🎉 승리! ${currentBoss.name} 격파! 육성을 재개합니다.`]
      });
    } else {
      // 전투 계속
      set({
        student: { ...student, currentHealth: newStudentHp },
        currentBoss: { ...currentBoss, hp: newBossHp },
        combatLogs: newCombatLogs
      });
    }
  },

  resetGame: () => {
    set({
      turn: 1,
      phase: 'TRAINING',
      loopCount: 0,
      isGameOver: false,
      currentBoss: null,
      logs: ['New Run: 시뮬레이션 재개.'],
      student: {
        name: '아로나(Student)',
        maxHealth: 100,
        currentHealth: 100,
        stats: { ...INITIAL_STATS }
      }
    });
  }
}));