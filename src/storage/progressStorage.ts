export type LevelProgress = {
  levelId: number
  bestScore: number
  bestMoves: number
  completedAt: string
}

export type PlayerProgress = {
  highestUnlockedLevelId: number
  completedLevels: Record<number, LevelProgress>
  endlessHighestDepth: number
  dailyCompletions: Record<string, LevelProgress>
}

const STORAGE_KEY = 'packet-path-progress'

const defaultProgress: PlayerProgress = {
  highestUnlockedLevelId: 1,
  completedLevels: {},
  endlessHighestDepth: 0,
  dailyCompletions: {},
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
    ...progress,
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

export function saveEndlessDepth(depth: number): PlayerProgress {
  const progress = loadProgress()
  const updatedProgress: PlayerProgress = {
    ...progress,
    endlessHighestDepth: Math.max(progress.endlessHighestDepth, depth),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress))
  return updatedProgress
}

export function saveDailyProgress(
  dateKey: string,
  score: number,
  moves: number,
): PlayerProgress {
  const progress = loadProgress()
  const existing = progress.dailyCompletions[dateKey]
  const updatedProgress: PlayerProgress = {
    ...progress,
    dailyCompletions: {
      ...progress.dailyCompletions,
      [dateKey]: {
        levelId: 0,
        bestScore: existing ? Math.max(existing.bestScore, score) : score,
        bestMoves: existing ? Math.min(existing.bestMoves, moves) : moves,
        completedAt: new Date().toISOString(),
      },
    },
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress))
  return updatedProgress
}