
import { TrainingAction } from '../models/types';

export const ACTIONS: TrainingAction[] = [
  // 1. 대화 (COMMUNICATION) - 저항 감소, 스트레스 완화
  {
    id: 'visit',
    category: 'COMMUNICATION',
    label: '면담',
    description: '학생을 만나 이야기를 들어줍니다. 저항과 스트레스가 감소합니다.',
    requirements: { maxStress: 90 },
    hpCostMin: 0,
    hpCostMax: 0,
    stressChange: -15,
    statImpact: { resistance: -3, obedience: 1 }
  },
  {
    id: 'gift',
    category: 'COMMUNICATION',
    label: '선물 공세',
    description: '물량 공세로 호감을 삽니다. (AP 소모)',
    requirements: { minAp: 10 },
    hpCostMin: 0,
    hpCostMax: 0,
    stressChange: -20,
    statImpact: { resistance: -5, obedience: 3 }
  },

  // 2. 훈련 (TRAINING) - 신비(기초체급) 증가, 스트레스 증가
  {
    id: 'basic_training',
    category: 'TRAINING',
    label: '기초 전술 훈련',
    description: '사격과 전술을 가르칩니다. 신비가 오릅니다.',
    requirements: { maxResistance: 80, maxStress: 80 },
    hpCostMin: 10,
    hpCostMax: 15,
    stressChange: 10,
    statImpact: { mystic: 3, obedience: 1 }
  },
  {
    id: 'hell_march',
    category: 'TRAINING',
    label: '지옥 행군',
    description: '극한의 체력 훈련입니다. 신비가 크게 오르지만 힘들어요.',
    requirements: { maxResistance: 60, minObedience: 20 },
    hpCostMin: 20,
    hpCostMax: 30,
    stressChange: 25,
    statImpact: { mystic: 8, pleasureTolerance: 2 }
  },

  // 3. 세뇌 (HYPNOSIS) - 싯딤의 상자 해킹 (AP 소모, 저항 무시)
  {
    id: 'hypno_app',
    category: 'HYPNOSIS',
    label: '최면 어플 가동',
    description: '싯딤의 권한으로 정신에 간섭합니다. (AP 대량 소모)',
    requirements: { minAp: 30 },
    hpCostMin: 5,
    hpCostMax: 10,
    stressChange: 5,
    statImpact: { resistance: -10, obedience: 5 },
    depthImpact: 1 // 심도 스택 확률적 증가 로직은 Store에서 처리
  },
  {
    id: 'deep_sleep',
    category: 'HYPNOSIS',
    label: '수면 학습',
    description: '잠든 사이 무의식에 명령을 심습니다.',
    requirements: { minAp: 50, minDepth: 1 },
    hpCostMin: 0,
    hpCostMax: 5,
    stressChange: -10, // 오히려 스트레스가 풀림 (모르니까)
    statImpact: { obedience: 10, resistance: -10 }
  },

  // 4. 조교 (CONDITIONING) - 타락(출력) 폭발, 신비(그릇) 손상
  {
    id: 'mind_break',
    category: 'CONDITIONING',
    label: '정신 개조',
    description: '상식과 윤리관을 다시 씁니다. 타락이 오르고 신비가 깎입니다.',
    requirements: { minDepth: 2, minObedience: 50 },
    hpCostMin: 10,
    hpCostMax: 20,
    stressChange: 20,
    statImpact: { corruption: 10, sensitivity: 5, mystic: -2 }
  },
  {
    id: 'body_dev',
    category: 'CONDITIONING',
    label: '신체 개발',
    description: '전투 병기로서의 감각을 깨웁니다. 공격력이 폭증합니다.',
    requirements: { minDepth: 3 },
    hpCostMin: 30,
    hpCostMax: 50,
    stressChange: 40,
    statImpact: { corruption: 20, sensitivity: 15, mystic: -5, pleasureTolerance: 10 }
  }
];
