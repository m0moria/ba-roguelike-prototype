export interface CoreStats {
  resistance: number;       
  sensitivity: number;      
  obedience: number;        
  pleasureTolerance: number;
  corruption: number;       
  // 전투용 파생 스탯 (자동 계산됨)
  attack?: number;
  defense?: number;
}

export interface Student {
  name: string;
  maxHealth: number;
  currentHealth: number;
  stats: CoreStats;
}

export interface RandomEvent {
  id: string;
  message: string;
  hpChangeMin: number; // 음수면 피해, 양수면 회복
  hpChangeMax: number;
  statImpact?: Partial<CoreStats>; // 스탯 변동 (선택사항)
}

export interface Enemy {
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  image?: string; // 나중에 이미지 추가 가능
}

export type GamePhase = 'TRAINING' | 'COMBAT';

export interface CombatLog {
  turn: number;
  message: string;
  isPlayerAction: boolean;
}

// ... (Record, TrainingAction 등 기존 인터페이스 유지)
export interface Record {
  id: number;
  finalStats: CoreStats;
  totalTurns: number;
  date: string;
  rank: string;
  result: string; // 'Cleared' | 'Game Over'
}

export interface TrainingAction {
  id: string;
  label: string;
  description: string;
  statImpact: Partial<CoreStats>;
  hpCostMin: number;
  hpCostMax: number;
}