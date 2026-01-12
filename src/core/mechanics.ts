
import { Student, CoreStats, Enemy, CombatLog, ActionRequirements, Player } from '../models/types';

export const randomInRange = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// [조건 충족 여부 확인]
export const checkRequirements = (student: Student, player: Player, reqs: ActionRequirements): { ok: boolean; reason?: string } => {
  if (reqs.minAp && player.ap < reqs.minAp) return { ok: false, reason: `AP 부족 (${player.ap}/${reqs.minAp})` };
  if (reqs.maxResistance && student.stats.resistance > reqs.maxResistance) return { ok: false, reason: `저항이 너무 높음 (${student.stats.resistance}/${reqs.maxResistance})` };
  if (reqs.minObedience && student.stats.obedience < reqs.minObedience) return { ok: false, reason: `순종 부족 (${student.stats.obedience}/${reqs.minObedience})` };
  if (reqs.minDepth && student.hypnosisDepth < reqs.minDepth) return { ok: false, reason: `심도 부족 (Lv.${reqs.minDepth} 필요)` };
  if (reqs.maxStress && student.stress > reqs.maxStress) return { ok: false, reason: `스트레스 과다 (${student.stress})` };
  return { ok: true };
};

// [성공률 계산]
export const calculateSuccessRate = (student: Student, category: string): number => {
  let rate = 60; // 기본 성공률

  // 1. 스트레스 페널티 (스트레스가 50 넘어가면 성공률 급감)
  if (student.stress > 50) rate -= (student.stress - 50);

  // 2. 카테고리별 보정
  if (category === 'COMMUNICATION') {
    // 대화는 저항이 높으면 잘 안됨
    rate -= student.stats.resistance * 0.5;
    rate += student.stats.obedience * 0.2;
  } else if (category === 'TRAINING') {
    // 훈련은 순종이 높으면 잘됨
    rate += student.stats.obedience * 0.5;
    rate -= (100 - student.currentHealth) * 0.2; // 아프면 훈련 힘듦
  } else if (category === 'HYPNOSIS') {
    // 세뇌는 저항을 거의 무시하지만(AP로 뚫음), 그래도 저항이 너무 높으면...
    rate += 20; // 기본 보정
    rate -= student.stats.resistance * 0.2;
  } else if (category === 'CONDITIONING') {
    // 조교는 감도와 타락이 높으면 성공률 폭증
    rate += (student.stats.sensitivity + student.stats.corruption) * 0.4;
  }

  return Math.max(Math.min(Math.floor(rate), 95), 5);
};

// [전투 스탯 계산] - 신비(그릇) vs 타락(출력)
export const calculateStudentCombatStats = (stats: CoreStats) => {
  // 공격력 = 신비 * (1 + 타락%)
  // 타락이 100이면 공격력 2배. 타락이 0이면 신비 수치 그대로.
  const multiplier = 1 + (stats.corruption / 100);
  const attack = Math.floor(stats.mystic * multiplier * 2) + 10;
  
  // 방어력 = 신비 + 감도/2 + 쾌락내성
  const defense = stats.mystic + Math.floor(stats.sensitivity / 2) + stats.pleasureTolerance;
  
  return { attack, defense };
};

// [전투 로직]
export const resolveCombatTurn = (student: Student, boss: Enemy, turnCount: number): { 
  studentDmg: number; 
  bossDmg: number; 
  logs: CombatLog[] 
} => {
  const sStats = calculateStudentCombatStats(student.stats);
  const logs: CombatLog[] = [];

  // 1. 학생 공격
  const rawStudentDmg = Math.max(sStats.attack - (boss.defense / 2), 5);
  // 치명타: 감도가 높을수록 확률 증가
  const isCrit = Math.random() * 100 < (student.stats.sensitivity / 2); 
  const finalStudentDmg = Math.floor(isCrit ? rawStudentDmg * 1.5 : rawStudentDmg);
  
  logs.push({
    turn: turnCount,
    isPlayerAction: true,
    message: `${student.name}의 공격! ${finalStudentDmg} 피해! ${isCrit ? '(약점 포착!)' : ''}`
  });

  // 2. 보스 공격
  let finalBossDmg = 0;
  if (boss.hp - finalStudentDmg > 0) {
    // 타락이 높으면 받는 피해도 약간 증가 (방심)
    const corruptionPenalty = 1 + (student.stats.corruption / 200);
    const rawBossDmg = Math.max(boss.attack - (sStats.defense / 3), 5);
    finalBossDmg = Math.floor(rawBossDmg * corruptionPenalty);
    
    logs.push({
      turn: turnCount,
      isPlayerAction: false,
      message: `${boss.name}의 반격! ${finalBossDmg} 피해.`
    });
  }

  return { studentDmg: finalBossDmg, bossDmg: finalStudentDmg, logs };
};

export const calculateRank = (stats: CoreStats): string => {
  if (stats.corruption >= 80 && stats.obedience >= 80) return "Platinum (Dominator)";
  if (stats.mystic >= 100 && stats.corruption < 20) return "Platinum (Savior)";
  if (stats.corruption >= 50) return "Gold";
  if (stats.resistance <= 20) return "Silver";
  return "Bronze";
};
