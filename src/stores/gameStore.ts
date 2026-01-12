
import { create } from 'zustand';
import { CoreStats, Record, Student, Player, GamePhase, Enemy, CombatLog } from '../models/types';
import { calculateSuccessRate, randomInRange, calculateRank, resolveCombatTurn, checkRequirements } from '../core/mechanics';
import { ACTIONS } from '../data/actions';
import { generateBoss } from '../data/enemies';
import { RANDOM_EVENTS } from '../data/randomEvents';

interface GameState {
  turn: number;
  phase: GamePhase;
  loopCount: number;
  
  student: Student;
  player: Player;
  currentBoss: Enemy | null;
  combatLogs: CombatLog[];
  
  logs: string[];
  records: Record[];
  isGameOver: boolean;

  // Actions
  performAction: (actionId: string) => void;
  rest: () => void;
  processCombatTurn: () => void;
  resetGame: () => void;
  loadRecords: () => void;
}

const INITIAL_STATS: CoreStats = {
  resistance: 60,   // 초기 저항 높음
  sensitivity: 0,
  obedience: 0,
  pleasureTolerance: 0,
  corruption: 0,
  mystic: 20,       // 초기 신비
};

export const useGameStore = create<GameState>((set, get) => ({
  turn: 1,
  phase: 'TRAINING',
  loopCount: 0,
  student: {
    name: '아로나(Target)',
    maxHealth: 100,
    currentHealth: 100,
    stress: 0,
    hypnosisDepth: 0,
    stats: { ...INITIAL_STATS },
  },
  player: {
    ap: 50,
    maxAp: 100,
    hackingLevel: 1
  },
  currentBoss: null,
  combatLogs: [],
  logs: ['Turn 1: 목표 학생 확인. 싯딤의 상자 접속 완료.'],
  records: [],
  isGameOver: false,

  loadRecords: () => {
    const saved = localStorage.getItem('eraBlueArchiveRecords');
    if (saved) set({ records: JSON.parse(saved) });
  },

  performAction: (actionId: string) => {
      const { turn, student, player, isGameOver, logs, phase, records, loopCount } = get();
      if (isGameOver || phase !== 'TRAINING') return;

      const action = ACTIONS.find(a => a.id === actionId);
      if (!action) return;

      // 0. 조건 재확인 (UI에서 막았어도 한번 더 체크)
      const reqCheck = checkRequirements(student, player, action.requirements);
      if (!reqCheck.ok) {
        set({ logs: [...logs, `[거부됨] ${reqCheck.reason}`] });
        return;
      }

      // 1. AP 및 체력 소모
      const hpCost = randomInRange(action.hpCostMin, action.hpCostMax);
      const apCost = action.requirements.minAp || 0;
      
      let currentHp = Math.max(student.currentHealth - hpCost, 0);
      let currentAp = player.ap - apCost;

      // 2. 성공 여부 판정
      const successRate = calculateSuccessRate(student, action.category);
      const isSuccess = Math.random() * 100 < successRate;

      let logMsg = `Turn ${turn}: [${action.label}] `;
      let newStats = { ...student.stats };
      let newStress = student.stress;
      let newDepth = student.hypnosisDepth;

      if (isSuccess) {
        logMsg += `성공!`;
        
        // 스탯 변동 적용
        Object.entries(action.statImpact).forEach(([key, val]) => {
          if (!val) return;
          const boost = randomInRange(1, Math.abs(val));
          const change = val > 0 ? boost : -boost;
          newStats[key as keyof CoreStats] = Math.max(0, newStats[key as keyof CoreStats] + change);
        });
        
        // 스트레스 변동
        newStress = Math.max(0, Math.min(100, newStress + action.stressChange));

        // 심도 증가 (확률)
        if (action.depthImpact && Math.random() > 0.5) {
            newDepth = Math.min(4, newDepth + action.depthImpact);
            logMsg += ` (심도 상승 Lv.${newDepth}!)`;
        }

      } else {
        logMsg += `실패...`;
        // 실패 시 스트레스만 조금 오름
        newStress = Math.min(100, newStress + 10);
      }

      // 3. 랜덤 이벤트 (스트레스가 높으면 나쁜 이벤트 확률 증가)
      if (Math.random() < 0.3 || newStress > 80) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        
        // 스트레스 폭주 이벤트 처리
        if (newStress > 80 && Math.random() < 0.5) {
            logMsg += `
   ⚠️ (스트레스 과부하!) 학생이 훈련을 거부하고 발작합니다!`;
            currentHp -= 10;
            newStats.obedience = Math.max(0, newStats.obedience - 5);
        } else {
            const eventHp = randomInRange(event.hpChangeMin, event.hpChangeMax);
            currentHp = Math.max(0, Math.min(100, currentHp + eventHp));
            if (event.stressChange) newStress = Math.max(0, Math.min(100, newStress + event.stressChange));
            logMsg += `
   ↳ (Event) ${event.message} (HP ${eventHp})`;
        }
      }

      // 4. 게임 오버 체크 (HP 0)
      if (currentHp <= 0) {
        // ... (이전과 동일한 사망 로직)
        const record: Record = {
          id: Date.now(),
          finalStats: newStats,
          totalTurns: turn,
          date: new Date().toLocaleString(),
          rank: 'F',
          result: 'Collapsed'
        };
        const updatedRecords = [...records, record];
        localStorage.setItem('eraBlueArchiveRecords', JSON.stringify(updatedRecords));
        set({
           student: { ...student, currentHealth: 0, stats: newStats },
           isGameOver: true,
           logs: [...logs, logMsg, "☠️ 학생이 쓰러졌습니다."],
           records: updatedRecords
        });
        return;
      }

      // 5. 턴 종료 처리
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
        student: { ...student, currentHealth: currentHp, stress: newStress, hypnosisDepth: newDepth, stats: newStats },
        player: { ...player, ap: currentAp },
        combatLogs: []
      });
  },

  rest: () => {
    const { turn, student, player, logs, phase, loopCount } = get();
    if (phase !== 'TRAINING') return;

    // 휴식 효과: 체력 회복, 스트레스 대폭 감소, AP 회복
    const recoverHp = randomInRange(20, 30);
    const recoverAp = 20;
    const recoverStress = 30;

    const newHp = Math.min(student.currentHealth + recoverHp, 100);
    const newAp = Math.min(player.ap + recoverAp, player.maxAp);
    const newStress = Math.max(0, student.stress - recoverStress);
    
    let logMsg = `Turn ${turn}: 휴식. (HP+${recoverHp}, AP+${recoverAp}, Stress-${recoverStress})`;

    // ... 보스 출현 로직 (동일) ...
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
      student: { ...student, currentHealth: newHp, stress: newStress },
      player: { ...player, ap: newAp },
      logs: nextLogs,
      phase: nextPhase,
      currentBoss: nextBoss,
      combatLogs: []
    });
  },

  processCombatTurn: () => {
    // ... 이전과 동일한 전투 로직 ...
     const { student, currentBoss, combatLogs, loopCount, records, logs } = get();
    if (!currentBoss || student.currentHealth <= 0) return;

    const result = resolveCombatTurn(student, currentBoss, combatLogs.length + 1);
    
    const newStudentHp = Math.max(0, student.currentHealth - result.studentDmg);
    const newBossHp = Math.max(0, currentBoss.hp - result.bossDmg);
    const newCombatLogs = [...combatLogs, ...result.logs];

    if (newStudentHp <= 0) {
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
        logs: [...logs, `☠️ 패배...`]
      });
    } else if (newBossHp <= 0) {
      set({
        phase: 'TRAINING',
        loopCount: loopCount + 1,
        currentBoss: null,
        student: { ...student, currentHealth: newStudentHp }, 
        logs: [...logs, `🎉 승리! ${currentBoss.name} 격파!`]
      });
    } else {
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
      logs: ['New Run: 초기화 완료.'],
      student: {
        name: '아로나(Target)',
        maxHealth: 100,
        currentHealth: 100,
        stress: 0,
        hypnosisDepth: 0,
        stats: { ...INITIAL_STATS }
      },
      player: { ap: 50, maxAp: 100, hackingLevel: 1 }
    });
  }
}));
