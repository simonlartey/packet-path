import type { Level } from '../game/types'
import type { PlayerProgress } from '../storage/progressStorage'

type LevelSelectorProps = {
  levels: Level[]
  activeLevelId: number
  progress: PlayerProgress
  onSelectLevel: (levelIndex: number) => void
}

export function LevelSelector({
  levels,
  activeLevelId,
  progress,
  onSelectLevel,
}: LevelSelectorProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
        Levels
      </p>

      <div className="mt-5 grid gap-3">
        {levels.map((level, index) => {
          const isUnlocked = level.id <= progress.highestUnlockedLevelId
          const isActive = level.id === activeLevelId
          const levelProgress = progress.completedLevels[level.id]

          return (
            <button
              key={level.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(index)}
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : isUnlocked
                    ? 'border-slate-800 bg-slate-950/70 hover:border-cyan-400'
                    : 'border-slate-800 bg-slate-950/30 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-100">
                    Level {level.id}: {level.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </p>
                </div>

                {!isUnlocked && (
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
                    Locked
                  </span>
                )}
              </div>

              {levelProgress && (
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs text-slate-400">Best Result</p>
                  <p className="mt-1 text-sm font-bold text-cyan-300">
                    {levelProgress.bestScore} pts · {levelProgress.bestMoves} moves
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}