import type { PerformanceRating } from '../game/scoring'

type CompletionModalProps = {
  levelName: string
  score: number
  moves: number
  rating: PerformanceRating
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
  hasNextLevel,
  onNextLevel,
  onRetry,
  onClose,
}: CompletionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-2xl border border-[#252220] bg-[#141210] p-8 text-center shadow-xl shadow-black/50">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5a5550]">
          Level Complete
        </p>

        <h2 className="mt-4 text-3xl font-bold text-[#e8e2d8]">{levelName}</h2>

        <p className="mt-3 text-sm leading-6 text-[#6b6460]">
          Route restored successfully. Here is how you performed.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#252220] bg-[#1a1814] p-4">
            <p className="text-xs text-[#5a5550]">Score</p>
            <p className="mt-1 text-2xl font-bold text-amber-400">{score}</p>
          </div>

          <div className="rounded-xl border border-[#252220] bg-[#1a1814] p-4">
            <p className="text-xs text-[#5a5550]">Moves</p>
            <p className="mt-1 text-2xl font-bold text-[#e8e2d8]">{moves}</p>
          </div>

          <div className="rounded-xl border border-[#252220] bg-[#1a1814] p-4">
            <p className="text-xs text-[#5a5550]">Rating</p>
            <p className="mt-1 text-sm font-bold text-emerald-400">{rating}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-emerald-800/30 bg-emerald-950/20 p-4 text-sm text-emerald-400">
          {hasNextLevel
            ? 'Nice work. Route restored. Head to the next level.'
            : 'Great work. You restored every route in PacketPath.'}
        </div>

        <div className="mt-6 grid gap-3">
          {hasNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Next Level
            </button>
          )}

          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-[#252220] px-5 py-3 font-semibold text-[#c8c0b4] transition hover:bg-[#2e2b26] hover:text-[#e8e2d8]"
          >
            Retry Level
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#252220] px-5 py-3 font-semibold text-[#6b6460] transition hover:border-[#403c36] hover:text-[#c8c0b4]"
          >
            Back to Levels
          </button>
        </div>
      </section>
    </div>
  )
}
