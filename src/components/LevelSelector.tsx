import { useEffect, useRef } from 'react'
import type { Level } from '../game/types'
import type { PlayerProgress } from '../storage/progressStorage'

type LevelSelectorProps = {
  levels: Level[]
  activeLevelId: number
  progress: PlayerProgress
  onSelectLevel: (levelIndex: number) => void
}

const badgeStyles = [
  'border-amber-500/40 bg-amber-500/10 text-amber-400',
  'border-sky-500/40 bg-sky-500/10 text-sky-400',
  'border-violet-500/40 bg-violet-500/10 text-violet-400',
]

export function LevelSelector({
  levels,
  activeLevelId,
  progress,
  onSelectLevel,
}: LevelSelectorProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeLevelId])

  const completedCount = levels.filter((l) => progress.completedLevels[l.id]).length

  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-4">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a3530]">
          Campaign
        </p>
        <p className="text-[10px] tabular-nums text-[#3a3530]">
          {completedCount} / {levels.length}
        </p>
      </div>

      {/* Scrollable level list */}
      <div
        role="group"
        aria-label="Select level"
        className="mt-3 max-h-[420px] space-y-1.5 overflow-y-auto pr-1"
      >
        {levels.map((level, index) => {
          const isUnlocked = level.id <= progress.highestUnlockedLevelId
          const isActive = level.id === activeLevelId
          const levelProgress = progress.completedLevels[level.id]
          const badge = badgeStyles[index % badgeStyles.length]

          return (
            <button
              key={level.id}
              ref={isActive ? activeRef : undefined}
              type="button"
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(index)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Level ${level.id}, ${level.name}. ${level.difficulty} difficulty. Target ${level.estimatedMoves} moves. ${
                isUnlocked ? 'Unlocked.' : 'Locked.'
              } ${
                levelProgress
                  ? `Best score ${levelProgress.bestScore} points in ${levelProgress.bestMoves} moves.`
                  : 'No completed score yet.'
              }`}
              className={`w-full rounded-2xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-1 focus:ring-offset-[#0e0d0b] ${
                isActive
                  ? 'border-amber-500/25 bg-amber-500/[0.07]'
                  : isUnlocked
                    ? 'border-[#1e1c18] bg-transparent hover:border-[#2e2c28] hover:bg-white/[0.03]'
                    : 'cursor-not-allowed border-transparent bg-transparent opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Level number badge */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${badge}`}
                >
                  {level.id}
                </span>

                {/* Name + difficulty */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-semibold ${
                      isActive ? 'text-[#e8e2d8]' : 'text-[#7a7470]'
                    }`}
                  >
                    {level.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#3a3530]">
                    {level.difficulty} · {level.estimatedMoves} moves
                  </p>
                </div>

                {/* Status badge */}
                {levelProgress ? (
                  <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                    Done
                  </span>
                ) : !isUnlocked ? (
                  <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                    🔒 Locked
                  </span>
                ) : isActive ? (
                  <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300">
                    Current
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300">
                    Open
                  </span>
                )}
              </div>

              {/* Best score row — only when completed */}
              {levelProgress && (
                <p className="mt-1.5 pl-[34px] text-[10px] font-medium text-amber-500/70">
                  {levelProgress.bestScore} pts · {levelProgress.bestMoves} moves
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
