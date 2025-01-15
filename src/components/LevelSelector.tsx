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
  return (
    <div role="group" aria-label="Select level" className="grid w-full grid-cols-3 gap-3">
      {levels.map((level, index) => {
        const isUnlocked = level.id <= progress.highestUnlockedLevelId
        const isActive = level.id === activeLevelId
        const levelProgress = progress.completedLevels[level.id]
        const badge = badgeStyles[index % badgeStyles.length]

        return (
          <button
            key={level.id}
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
            className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-[#0e0d0b] ${
              isActive
                ? 'border-amber-500/30 bg-[#1a1814]'
                : isUnlocked
                  ? 'border-[#252220] bg-[#141210] hover:border-[#403c36] hover:bg-[#1a1814]'
                  : 'cursor-not-allowed border-[#1e1c18] bg-[#0e0d0b] opacity-40'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${badge}`}
              >
                {level.id}
              </span>

              {levelProgress ? (
                <span className="rounded-full border border-emerald-800/30 bg-emerald-950/20 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                  Done
                </span>
              ) : isUnlocked ? (
                <span className="rounded-full border border-[#252220] bg-[#252220] px-2 py-0.5 text-[10px] text-[#6b6460]">
                  Open
                </span>
              ) : (
                <span className="rounded-full border border-[#1e1c18] px-2 py-0.5 text-[10px] text-[#3a3530]">
                  Locked
                </span>
              )}
            </div>

            <p className="mt-2.5 text-sm font-semibold text-[#c8c0b4]">{level.name}</p>
            <p className="mt-0.5 text-xs text-[#4a4540]">
              {level.difficulty} · Target: {level.estimatedMoves} moves
            </p>

            {levelProgress && (
              <p className="mt-2 text-xs font-semibold text-amber-500">
                Best: {levelProgress.bestScore} pts · {levelProgress.bestMoves} moves
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}
