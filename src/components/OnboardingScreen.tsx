import { TutorialPanel } from './TutorialPanel'

type OnboardingScreenProps = {
  onStart: () => void
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            Network Routing Puzzle
          </p>

          <h1 className="max-w-3xl text-6xl font-bold tracking-tight">
            PacketPath
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Restore broken network routes by rotating cable tiles, avoiding
            firewalls, and guiding packets from the source to the destination.
          </p>

          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-cyan-300">Logic</p>
              <p className="mt-2 text-sm text-slate-400">
                Solve each route by planning tile connections.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-cyan-300">Scoring</p>
              <p className="mt-2 text-sm text-slate-400">
                Fewer moves earn stronger scores.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-cyan-300">Progress</p>
              <p className="mt-2 text-sm text-slate-400">
                Unlock levels by meeting the score requirement.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-10 rounded-xl bg-cyan-400 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            Start Game
          </button>
        </div>

        <TutorialPanel />
      </section>
    </main>
  )
}