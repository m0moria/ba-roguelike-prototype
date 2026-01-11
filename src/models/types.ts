export interface CoreStats {
  resistance: number;       // 저항 (높을수록 성공률 낮음)
  sensitivity: number;      // 감도 (쾌락 내성의 기반)
  obedience: number;        // 순종 (명령 수행률)
  pleasureTolerance: number;// 쾌락 내성 (높을수록 심도 깊어짐)
  corruption: number;       // 타락 (엔딩 분기 결정)
}

export interface Student {
  name: string;
  maxHealth: number;
  currentHealth: number;
  stats: CoreStats;
}

export interface Record {
  id: number;
  finalStats: CoreStats;
  totalTurns: number;
  date: string;
  rank: string; // S, A, B, C...
}

export interface TrainingAction {
  id: string;
  label: string;
  description: string;
  statImpact: Partial<CoreStats>; // 훈련 성공 시 오르는 스탯
  hpCostMin: number;
  hpCostMax: number;
}
