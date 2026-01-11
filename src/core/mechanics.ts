import { CoreStats, Student, Enemy, CombatLog } from '../models/types';

export const randomInRange = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// [변경] 더 다이나믹한 성공률 계산
export const calculateSuccessRate = (student: Student): number => {
  const { currentHealth, maxHealth, stats } = student;
  
  // 1. 기본 확률 50%
  let rate = 50;

  // 2. 체력 보정 (체력이 낮을수록 저항할 힘이 없어 성공률 상승, 하지만 너무 낮으면 기절 위험으로 하락)
  const hpPercent = (currentHealth / maxHealth) * 100;
  if (hpPercent > 80) rate -= 10;       // 건강하면 저항함
  else if (hpPercent < 30) rate += 20;  // 지치면 저항 못함

  // 3. 스탯 보정 (곡선형 적용)
  // 저항(Resistance): 높을수록 성공률 대폭 하락 (지수적)
  rate -= Math.pow(stats.resistance / 10, 1.5); 

  // 순종(Obedience): 높을수록 성공률 상승
  rate += stats.obedience * 0.5;

  // 감도(Sensitivity) & 타락(Corruption): 높을수록 성공률 상승
  rate += (stats.sensitivity + stats.corruption) * 0.3;

  // 4. 최소/최대 캡 (5% ~ 95%)
  return Math.max(Math.min(Math.floor(rate), 95), 5);
};

// [신규] 학생 전투력 계산
export const calculateStudentCombatStats = (stats: CoreStats) => {
  // 화력 = (순종 + 타락) * 2 + 저항 (저항이 높으면 깡다구로 때림)
  const attack = (stats.obedience + stats.corruption) * 2 + stats.resistance + 20;
  
  // 방어 = 쾌락내성 + 감도 (맷집)
  const defense = (stats.pleasureTolerance + stats.sensitivity) + 10;
  
  return { attack, defense };
};

// [신규] 전투 턴 처리 (단순 자동 전투)
export const resolveCombatTurn = (student: Student, boss: Enemy, turnCount: number): { 
  studentDmg: number; 
  bossDmg: number; 
  logs: CombatLog[] 
} => {
  const sStats = calculateStudentCombatStats(student.stats);
  const logs: CombatLog[] = [];

  // 1. 학생 공격
  // 방어력 적용 데미지 공식 (간소화)
  const rawStudentDmg = Math.max(sStats.attack - (boss.defense / 2), 5);
  // 크리티컬 (감도가 높으면 약점 포착?)
  const isCrit = Math.random() < (student.stats.sensitivity / 200);
  const finalStudentDmg = Math.floor(isCrit ? rawStudentDmg * 1.5 : rawStudentDmg);
  
  logs.push({
    turn: turnCount,
    isPlayerAction: true,
    message: `${student.name}의 공격! ${boss.name}에게 ${finalStudentDmg} 피해! ${isCrit ? '(Critical!)' : ''}`
  });

  // 2. 보스 공격
  let finalBossDmg = 0;
  if (boss.hp - finalStudentDmg > 0) { // 보스가 살아있다면 반격
    const rawBossDmg = Math.max(boss.attack - (sStats.defense / 2), 5);
    finalBossDmg = Math.floor(rawBossDmg);
    
    logs.push({
      turn: turnCount,
      isPlayerAction: false,
      message: `${boss.name}의 반격! ${finalBossDmg} 피해를 입었습니다.`
    });
  }

  return { studentDmg: finalBossDmg, bossDmg: finalStudentDmg, logs };
};

export const calculateRank = (stats: CoreStats): string => {
  if (stats.corruption >= 80 && stats.obedience >= 80) return "Platinum (Dark)";
  if (stats.resistance >= 80 && stats.corruption < 20) return "Platinum (Pure)";
  if (stats.corruption >= 50) return "Gold";
  if (stats.resistance <= 20) return "Silver";
  return "Bronze";
};