import { useState } from 'react'
import {
  loadProgress,
  saveDailyProgress,
  saveEndlessDepth,
  saveLevelProgress,
  type PlayerProgress,
} from '../storage/progressStorage'

export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress)

  function recordCampaignLevel(
    levelId: number,
    score: number,
    moves: number,
    nextLevelId?: number,
  ) {
    setProgress(current => saveLevelProgress(current, levelId, score, moves, nextLevelId))
  }

  function recordDailyCompletion(dateKey: string, score: number, moves: number) {
    setProgress(current => saveDailyProgress(current, dateKey, score, moves))
  }

  function recordEndlessDepth(depth: number) {
    setProgress(current => saveEndlessDepth(current, depth))
  }

  return { progress, recordCampaignLevel, recordDailyCompletion, recordEndlessDepth }
}
