import { TrainingAction } from '../models/types';

export const TRAINING_ACTIONS: TrainingAction[] = [
  {
    id: 'tease',
    label: 'Tease',
    description: '가벼운 애무로 감각을 깨웁니다.',
    statImpact: { sensitivity: 5, corruption: 2 },
    hpCostMin: 5,
    hpCostMax: 8
  },
  {
    id: 'caress',
    label: 'Caress',
    description: '부드럽게 쓰다듬어 순종심을 기릅니다.',
    statImpact: { pleasureTolerance: 5, obedience: 3 },
    hpCostMin: 5,
    hpCostMax: 10
  },
  {
    id: 'humiliate',
    label: 'Humiliate',
    description: '말로 수치심을 주어 저항을 꺾습니다.',
    statImpact: { resistance: -5, corruption: 5 },
    hpCostMin: 8,
    hpCostMax: 15
  },
  {
    id: 'bind',
    label: 'Bind',
    description: '구속하여 자유를 박탈합니다.',
    statImpact: { obedience: 5, sensitivity: 3 },
    hpCostMin: 10,
    hpCostMax: 20
  },
  {
    id: 'intensify',
    label: 'Intensify',
    description: '강도 높은 행위로 타락을 가속합니다.',
    statImpact: { corruption: 8, pleasureTolerance: 6, resistance: -2 },
    hpCostMin: 15,
    hpCostMax: 25
  }
];
