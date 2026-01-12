
export type ActionCategory = 'COMMUNICATION' | 'TRAINING' | 'HYPNOSIS' | 'CONDITIONING';

export interface CoreStats {
  resistance: number;       // 저항: 낮춰야 함 (방어력 관여)
  sensitivity: number;      // 감도: 치명타 및 조교 효율
  obedience: number;        // 순종: 명중률 및 성공률
  pleasureTolerance: number;// 쾌락내성: 방어력 및 타락 저항
  corruption: number;       // 타락: 공격력 배율 (리스크)
  mystic: number;           // 신비: 기초 공격력/체력 (그릇)
}

export interface Student {
  name: string;
  maxHealth: number;
  currentHealth: number;
  stress: number;           // 스트레스 (0~100): 높으면 저항 증가/거부
  hypnosisDepth: number;    // 최면 심도 (0~4): 행동 해금 조건
  stats: CoreStats;
}

export interface Player {
  ap: number;               // 행동력 (싯딤의 상자 에너지)
  maxAp: number;
  hackingLevel: number;     // 해킹 레벨 (세뇌 커맨드 해금)
}

export interface ActionRequirements {
  minAp?: number;           // 필요 AP
  maxResistance?: number;   // 저항이 이 수치 이하여야 함
  minObedience?: number;    // 순종이 이 수치 이상이어야 함
  minDepth?: number;        // 심도가 이 단계 이상이어야 함
  maxStress?: number;       // 스트레스가 이 수치 이하여야 함
}

export interface TrainingAction {
  id: string;
  category: ActionCategory;
  label: string;
  description: string;
  requirements: ActionRequirements;
  
  // 결과
  hpCostMin: number;
  hpCostMax: number;
  stressChange: number;     // 스트레스 증감
  statImpact: Partial<CoreStats>;
  depthImpact?: number;     // 심도 증가량
}

export interface Enemy {
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface CombatLog {
  turn: number;
  message: string;
  isPlayerAction: boolean;
}

export interface Record {
  id: number;
  finalStats: CoreStats;
  totalTurns: number;
  date: string;
  rank: string;
  result: string;
}

export type GamePhase = 'TRAINING' | 'COMBAT';

export interface RandomEvent {
  id: string;
  message: string;
  hpChangeMin: number;
  hpChangeMax: number;
  stressChange?: number;
  statImpact?: Partial<CoreStats>;
}
