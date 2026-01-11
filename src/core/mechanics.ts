import { CoreStats } from '../models/types';

export const randomInRange = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

export const calculateSuccessRate = (currentHealth: number, resistance: number): number => {
  // 체력이 낮을수록 저항하기 힘들어짐 (성공률 상승)
  // 저항 수치가 높을수록 성공률 하락
  
  const baseRate = 70;
  const healthPenalty = Math.floor((100 - currentHealth) / 20) * 10; 
  // 체력이 100이면 penalty 0, 체력이 20이면 penalty 40
  
  // 저항이 높으면 성공률이 깎임 (저항 50 -> -25%)
  const resistanceFactor = Math.floor(resistance / 2);

  let finalRate = baseRate - healthPenalty - resistanceFactor;
  
  // 최소 성공률 10%, 최대 95% 보정
  return Math.max(Math.min(finalRate, 95), 10);
};

export const calculateRank = (stats: CoreStats): string => {
  if (stats.corruption >= 80 && stats.obedience >= 80) return "Platinum (Dark)";
  if (stats.resistance >= 80 && stats.corruption < 20) return "Platinum (Pure)";
  if (stats.corruption >= 50) return "Gold";
  if (stats.resistance <= 20) return "Silver";
  return "Bronze";
};
