import type { PerformanceRating } from '../game/scoring'

type CompletionModalProps = {
  levelName: string
  score: number
  moves: number
  rating: PerformanceRating
  canAdvance: boolean
  hasNextLevel: boolean
  onNextLevel: () => void
  onRetry: () => void
  onClose: () => void
}

export function CompletionModal({
  levelName,
  score,
  moves,
  rating,
  canAdvance,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onClose,
}: CompletionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-100 shadow-2xl shadow-cyan-950/40">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Level Complete
        </p>

        <h2 className="mt-4 text-3xl font-bold">{levelName}</h2>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Route restored successfully. Here is how you performed.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">Score</p>
            <p className="mt-1 text-2xl font-bold text-cyan-300">{score}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">Moves</p>
            <p className="mt-1 text-2xl font-bold">{moves}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">Rating</p>
            <p className="mt-1 text-sm font-bold text-emerald-300">{rating}</p>
          </div>
        </div>

        <div
          className={`mt-6 rounded-2xl border p-4 text-sm ${
            canAdvance
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
              : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-100'
          }`}
        >
          {canAdvance
            ? hasNextLevel
              ? 'Great work. You scored high enough to unlock the next route.'
              : 'Great work. You restored every route in PacketPath.'
            : 'Route restored, but your score is too low to advance. Try again with fewer moves.'}
        </div>

        <div className="mt-6 grid gap-3">
          {canAdvance && hasNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Next Level
            </button>
          )}

          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            Retry Level
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
          >
            Back to Levels
          </button>
        </div>
      </section>
    </div>
  )
}