
import { RandomEvent } from '../models/types';

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'trip',
    message: '학생이 훈련 중 넘어졌습니다.',
    hpChangeMin: -10,
    hpChangeMax: -5,
    stressChange: 5,
    statImpact: { resistance: -1 }
  },
  {
    id: 'lucky',
    message: '네잎클로버를 발견했습니다.',
    hpChangeMin: 5,
    hpChangeMax: 10,
    stressChange: -10,
    statImpact: { sensitivity: 2 }
  },
  {
    id: 'nightmare',
    message: '학생이 악몽을 꿨습니다. 멘탈이 흔들립니다.',
    hpChangeMin: -5,
    hpChangeMax: -5,
    stressChange: 15,
    statImpact: { stress: 10 }
  },
  {
    id: 'secret_snack',
    message: '몰래 간식을 먹다 들켰습니다.',
    hpChangeMin: 5,
    hpChangeMax: 10,
    stressChange: -5,
    statImpact: { obedience: 1 }
  },
  {
    id: 'rain',
    message: '갑작스러운 소나기입니다.',
    hpChangeMin: -5,
    hpChangeMax: 0,
    stressChange: 5
  }
];
