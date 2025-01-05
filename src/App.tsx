import { useState } from 'react'
import { GameBoard } from './components/GameBoard'
import { TutorialPanel } from './components/TutorialPanel'
import { createGameState, rotateTile } from './game/engine'
import { levels } from './game/levels'


function App() {
  const [gameState, setGameState] = useState(() => createGameState(levels[0]))

  function handleRotateTile(row: number, col: number) {
    setGameState((currentState) => rotateTile(currentState, row, col))
  }

  function handleRestart() {
    setGameState(createGameState(levels[0]))
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            Network Routing Puzzle
          </p>

          <h1 className="text-5xl font-bold tracking-tight">PacketPath</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Rotate network tiles to restore a route from the source server to the destination.
            Avoid firewalls and complete the path in as few moves as possible.
          </p>

          <div className="mt-8">
            <GameBoard gameState={gameState} onRotateTile={handleRotateTile} />
          </div>
        </div>

        <div className="space-y-6">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              Level {gameState.level.id}
            </p>

            <h2 className="mt-3 text-2xl font-bold">{gameState.level.name}</h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {gameState.level.description}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Moves</p>
                <p className="mt-1 text-3xl font-bold">{gameState.moves}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p className="mt-1 text-xl font-semibold">
                  {gameState.status === 'completed' ? 'Route restored' : 'Routing in progress'}
                </p>
              </div>
            </div>

            {gameState.status === 'completed' && (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200">
                Nice work. The packet can now reach the destination.
              </div>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
            >
              Restart Level
            </button>
          </aside>

          <TutorialPanel />
        </div>
      </section>
    </main>
  )
}

export default App