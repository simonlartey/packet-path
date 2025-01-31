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

function persist(progress: PlayerProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function loadProgress(): PlayerProgress {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultProgress

  try {
    const parsed = JSON.parse(raw) as PlayerProgress
    return { ...defaultProgress, ...parsed }
  } catch {
    return defaultProgress
  }
}

export function saveLevelProgress(
  current: PlayerProgress,
  levelId: number,
  score: number,
  moves: number,
  nextLevelId?: number,
): PlayerProgress {
  const existing = current.completedLevels[levelId]
  const updated: PlayerProgress = {
    ...current,
    highestUnlockedLevelId: nextLevelId
      ? Math.max(current.highestUnlockedLevelId, nextLevelId)
      : current.highestUnlockedLevelId,
    completedLevels: {
      ...current.completedLevels,
      [levelId]: {
        levelId,
        bestScore: existing ? Math.max(existing.bestScore, score) : score,
        bestMoves: existing ? Math.min(existing.bestMoves, moves) : moves,
        completedAt: new Date().toISOString(),
      },
    },
  }
  persist(updated)
  return updated
}

export function saveEndlessDepth(current: PlayerProgress, depth: number): PlayerProgress {
  const updated: PlayerProgress = {
    ...current,
    endlessHighestDepth: Math.max(current.endlessHighestDepth, depth),
  }
  persist(updated)
  return updated
}

export function saveDailyProgress(
  current: PlayerProgress,
  dateKey: string,
  score: number,
  moves: number,
): PlayerProgress {
  const existing = current.dailyCompletions[dateKey]
  const updated: PlayerProgress = {
    ...current,
    dailyCompletions: {
      ...current.dailyCompletions,
      [dateKey]: {
        levelId: 0,
        bestScore: existing ? Math.max(existing.bestScore, score) : score,
        bestMoves: existing ? Math.min(existing.bestMoves, moves) : moves,
        completedAt: new Date().toISOString(),
      },
    },
  }
  persist(updated)
  return updated
}

export function resetProgress(): PlayerProgress {
  persist(defaultProgress)
  return defaultProgress
}
