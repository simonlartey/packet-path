export type LevelProgress = {
  levelId: number
  bestScore: number
  bestMoves: number
  completedAt: string
}

export type PlayerProgress = {
  highestUnlockedLevelId: number
  completedLevels: Record<number, LevelProgress>
}

const STORAGE_KEY = 'packet-path-progress'

const defaultProgress: PlayerProgress = {
  highestUnlockedLevelId: 1,
  completedLevels: {},
}

export function loadProgress(): PlayerProgress {
  const storedProgress = localStorage.getItem(STORAGE_KEY)

  if (!storedProgress) {
    return defaultProgress
  }

  try {
    return JSON.parse(storedProgress) as PlayerProgress
  } catch {
    return defaultProgress
  }
}

export function saveLevelProgress(
  levelId: number,
  score: number,
  moves: number,
  nextLevelId?: number,
): PlayerProgress {
  const progress = loadProgress()
  const existingLevelProgress = progress.completedLevels[levelId]

  const bestScore = existingLevelProgress
    ? Math.max(existingLevelProgress.bestScore, score)
    : score

  const bestMoves = existingLevelProgress
    ? Math.min(existingLevelProgress.bestMoves, moves)
    : moves

  const updatedProgress: PlayerProgress = {
    highestUnlockedLevelId: nextLevelId
      ? Math.max(progress.highestUnlockedLevelId, nextLevelId)
      : progress.highestUnlockedLevelId,
    completedLevels: {
      ...progress.completedLevels,
      [levelId]: {
        levelId,
        bestScore,
        bestMoves,
        completedAt: new Date().toISOString(),
      },
    },
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress))

  return updatedProgress
}

export function resetProgress(): PlayerProgress {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress))
  return defaultProgress
}