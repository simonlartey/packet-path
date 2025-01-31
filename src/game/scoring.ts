import type { Level } from './types'

export type PerformanceRating = 'Excellent' | 'Efficient' | 'Complete'

export type LevelScore = {
  score: number
  rating: PerformanceRating
}


const DIFFICULTY_BONUS: Record<Level['difficulty'], number> = {
  Easy: 0,
  Medium: 100,
  Hard: 200,
}

const TIME_RULES: Record<
  Level['difficulty'],
  {
    secondsPerTargetMove: number
    penaltyPerInterval: number
    penaltyIntervalSeconds: number
    bonusPerInterval: number
    bonusIntervalSeconds: number
  }
> = {
  Easy: {
    secondsPerTargetMove: 8,
    penaltyPerInterval: 25,
    penaltyIntervalSeconds: 10,
    bonusPerInterval: 10,
    bonusIntervalSeconds: 8,
  },
  Medium: {
    secondsPerTargetMove: 10,
    penaltyPerInterval: 20,
    penaltyIntervalSeconds: 12,
    bonusPerInterval: 10,
    bonusIntervalSeconds: 10,
  },
  Hard: {
    secondsPerTargetMove: 14,
    penaltyPerInterval: 15,
    penaltyIntervalSeconds: 15,
    bonusPerInterval: 10,
    bonusIntervalSeconds: 12,
  },
}

export function calculateLevelScore(
  level: Level,
  moves: number,
  elapsedSeconds = 0,
): LevelScore {
  const rules = TIME_RULES[level.difficulty]
  const targetMoves = level.estimatedMoves
  const targetSeconds = targetMoves * rules.secondsPerTargetMove

  const extraMoves = Math.max(0, moves - targetMoves)
  const savedMoves = Math.max(0, targetMoves - moves)

  const extraSeconds = Math.max(0, elapsedSeconds - targetSeconds)
  const savedSeconds = Math.max(0, targetSeconds - elapsedSeconds)

  const baseScore = 850
  const difficultyBonus = DIFFICULTY_BONUS[level.difficulty]
  const levelBonus = level.id * 10

  const moveBonus = savedMoves * 35
  const movePenalty = extraMoves * 60

  // Time modifiers only apply when timing is tracked (elapsedSeconds > 0)
  const timeBonus =
    elapsedSeconds > 0
      ? Math.floor(savedSeconds / rules.bonusIntervalSeconds) * rules.bonusPerInterval
      : 0
  const timePenalty =
    Math.floor(extraSeconds / rules.penaltyIntervalSeconds) * rules.penaltyPerInterval

  const rawScore =
    baseScore +
    difficultyBonus +
    levelBonus +
    moveBonus +
    timeBonus -
    movePenalty -
    timePenalty

  const score = Math.max(100, Math.round(rawScore))

  if (score >= 1000) {
    return { score, rating: 'Excellent' }
  }

  if (score >= 700) {
    return { score, rating: 'Efficient' }
  }

  return { score, rating: 'Complete' }
}

export function getMaxDisplayScore(levelId: number): number {
  return 1000 + levelId * 25
}
