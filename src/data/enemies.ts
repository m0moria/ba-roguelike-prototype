
import { Enemy } from '../models/types';

export const BOSS_POOL: Omit<Enemy, 'hp' | 'maxHp' | 'attack' | 'defense'>[] = [
  { name: 'KAITEN FX Mk.0', description: '무한 회전의 초밥 로봇' },
  { name: 'Hieronymus', description: '고대 교리의 인공 천사' },
  { name: 'Binah', description: '데카그라마톤의 예언자' },
  { name: 'Shiro & Kuro', description: '슬럼피아의 장난꾸러기들' },
  { name: 'Goz', description: '슬럼피아의 마술사' },
];

export const generateBoss = (loopCount: number): Enemy => {
  const scale = 1 + (loopCount * 0.6); // 난이도 스케일링
  const base = BOSS_POOL[Math.floor(Math.random() * BOSS_POOL.length)];

  return {
    ...base,
    maxHp: Math.floor(1200 * scale),
    hp: Math.floor(1200 * scale),
    attack: Math.floor(60 * scale),
    defense: Math.floor(30 * scale),
  };
};
