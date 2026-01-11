// src/data/randomEvents.ts
import { RandomEvent } from '../models/types';

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'trip',
    message: '학생이 훈련 중 발이 꼬여 넘어졌습니다.',
    hpChangeMin: -10,
    hpChangeMax: -5,
    statImpact: { resistance: -2 } // 아파서 저항이 조금 줄어듦
  },
  {
    id: 'lucky',
    message: '우연히 네잎클로버를 발견했습니다. 기분이 좋아 보입니다.',
    hpChangeMin: 5,
    hpChangeMax: 10,
    statImpact: { sensitivity: 2 }
  },
  {
    id: 'nightmare',
    message: '학생이 어젯밤 악몽을 꿨다고 합니다. 컨디션이 나쁩니다.',
    hpChangeMin: -15,
    hpChangeMax: -10,
    statImpact: { corruption: 3 } // 정신적 타격
  },
  {
    id: 'secret_snack',
    message: '몰래 간식을 먹다가 들켰습니다.',
    hpChangeMin: 2,
    hpChangeMax: 5,
    statImpact: { obedience: 2, resistance: 1 }
  },
  {
    id: 'sudden_rain',
    message: '갑자기 소나기가 쏟아져 훈련이 중단되었습니다.',
    hpChangeMin: -5,
    hpChangeMax: 0,
    statImpact: { pleasureTolerance: -1 }
  }
];