import type { Level } from './types'

export type PerformanceRating = 'Excellent' | 'Efficient' | 'Complete'

export type LevelScore = {
  score: number
  rating: PerformanceRating
  canAdvance: boolean
}

export const MINIMUM_ADVANCE_SCORE = 700

export function calculateLevelScore(level: Level, moves: number): LevelScore {
  const baseScore = 1000
  const movePenalty = moves * 50
  const levelBonus = level.id * 25
  const score = Math.max(100, baseScore + levelBonus - movePenalty)

  if (score >= 850) {
    return {
      score,
      rating: 'Excellent',
      canAdvance: score >= MINIMUM_ADVANCE_SCORE,
    }
  }

  if (score >= 600) {
    return {
      score,
      rating: 'Efficient',
      canAdvance: score >= MINIMUM_ADVANCE_SCORE,
    }
  }

  return {
    score,
    rating: 'Complete',
    canAdvance: score >= MINIMUM_ADVANCE_SCORE,
  }
}