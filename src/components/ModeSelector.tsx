import type { Level } from '../game/types'
import type { PlayerProgress } from '../storage/progressStorage'
import { LevelSelector } from './LevelSelector'

type ModeSelectorProps = {
  gameMode: 'campaign' | 'endless' | 'daily'
  levels: Level[]
  activeLevelId: number
  progress: PlayerProgress
  endlessDepth: number
  dailyDateKey: string
  onSelectLevel: (index: number) => void
  onStartDaily: () => void
  onStartEndless: () => void
  onBackToCampaign: () => void
}

export function ModeSelector({
  gameMode,
  levels,
  activeLevelId,
  progress,
  endlessDepth,
  dailyDateKey,
  onSelectLevel,
  onStartDaily,
  onStartEndless,
  onBackToCampaign,
}: ModeSelectorProps) {
  if (gameMode === 'endless') {
    return (
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a3530]">
            Endless Mode
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-[#e8e2d8]">
            Route {endlessDepth}
          </p>
          {progress.endlessHighestDepth > 0 && (
            <p className="mt-1 text-xs text-[#4a4540]">
              Best: Route {progress.endlessHighestDepth}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onBackToCampaign}
          className="w-full rounded-xl border border-[#252220] px-4 py-2.5 text-sm text-[#6b6460] transition hover:border-[#403c36] hover:text-[#c8c0b4]"
        >
          ← Back to Campaign
        </button>
      </div>
    )
  }

  if (gameMode === 'daily') {
    return (
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a3530]">
            Daily Challenge
          </p>
          <p className="mt-2 text-lg font-bold text-[#e8e2d8]">{dailyDateKey}</p>
          {progress.dailyCompletions[dailyDateKey] && (
            <p className="mt-1 text-xs text-emerald-400">
              Best: {progress.dailyCompletions[dailyDateKey].bestScore} pts · {progress.dailyCompletions[dailyDateKey].bestMoves} moves
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onBackToCampaign}
          className="w-full rounded-xl border border-[#252220] px-4 py-2.5 text-sm text-[#6b6460] transition hover:border-[#403c36] hover:text-[#c8c0b4]"
        >
          ← Back to Campaign
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      <LevelSelector
        levels={levels}
        activeLevelId={activeLevelId}
        progress={progress}
        onSelectLevel={onSelectLevel}
      />
      <button
        type="button"
        onClick={onStartDaily}
        className="w-full rounded-xl border border-[#252220] px-4 py-3 text-sm font-semibold text-[#6b6460] transition hover:border-sky-500/30 hover:text-sky-400"
      >
        Daily Challenge →
      </button>
      <button
        type="button"
        onClick={onStartEndless}
        className="w-full rounded-xl border border-[#252220] px-4 py-3 text-sm font-semibold text-[#6b6460] transition hover:border-amber-500/30 hover:text-amber-400"
      >
        Endless Mode →
      </button>
    </div>
  )
}
