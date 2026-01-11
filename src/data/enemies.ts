import { Enemy } from '../models/types';

export const BOSS_POOL: Omit<Enemy, 'hp' | 'maxHp' | 'attack' | 'defense'>[] = [
  { name: 'Hieronymus', description: '고대 교리의 인공 천사' },
  { name: 'Binah', description: '데카그라마톤의 예언자' },
  { name: 'Shiro & Kuro', description: '슬럼피아의 장난꾸러기들' },
  { name: 'Goz', description: '슬럼피아의 마술사' },
];

export const generateBoss = (loopCount: number): Enemy => {
  // 20턴(1루프)마다 보스가 강해짐
  const scale = 1 + (loopCount * 0.5); 
  const base = BOSS_POOL[Math.floor(Math.random() * BOSS_POOL.length)];

  return {
    ...base,
    maxHp: Math.floor(1000 * scale),
    hp: Math.floor(1000 * scale),
    attack: Math.floor(50 * scale),
    defense: Math.floor(20 * scale),
  };
};