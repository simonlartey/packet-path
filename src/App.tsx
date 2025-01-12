import { useState } from 'react'
import { CompletionModal } from './components/CompletionModal'
import { GameBoard } from './components/GameBoard'
import { LevelSelector } from './components/LevelSelector'
import { OnboardingScreen } from './components/OnboardingScreen'
import { createGameState, rotateTile } from './game/engine'
import { levels } from './game/levels'
import { calculateLevelScore } from './game/scoring'
import { loadProgress, saveLevelProgress } from './storage/progressStorage'

function App() {
  const [hasStartedGame, setHasStartedGame] = useState(false)
  const [activeLevelIndex, setActiveLevelIndex] = useState(0)
  const [gameState, setGameState] = useState(() => createGameState(levels[0]))
  const [progress, setProgress] = useState(() => loadProgress())
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const hasNextLevel = activeLevelIndex < levels.length - 1

  const levelScore =
    gameState.status === 'completed'
      ? calculateLevelScore(gameState.level, gameState.moves)
      : null

  const currentLevelProgress = progress.completedLevels[gameState.level.id]

  function handleRotateTile(row: number, col: number) {
    setGameState((currentState) => {
      const nextState = rotateTile(currentState, row, col)

      if (
        currentState.status !== 'completed' &&
        nextState.status === 'completed'
      ) {
        setShowCompletionModal(true)
      }

      return nextState
    })
  }

  function handleRestart() {
    setShowCompletionModal(false)
    setGameState(createGameState(levels[activeLevelIndex]))
  }

  function handleSelectLevel(levelIndex: number) {
    const selectedLevel = levels[levelIndex]

    if (selectedLevel.id > progress.highestUnlockedLevelId) return

    setShowCompletionModal(false)
    setActiveLevelIndex(levelIndex)
    setGameState(createGameState(selectedLevel))
  }

  function handleNextLevel() {
    if (!hasNextLevel || !levelScore?.canAdvance) return

    const nextLevelIndex = activeLevelIndex + 1
    const nextLevel = levels[nextLevelIndex]

    const updatedProgress = saveLevelProgress(
      gameState.level.id,
      levelScore.score,
      gameState.moves,
      nextLevel.id,
    )

    setShowCompletionModal(false)
    setProgress(updatedProgress)
    setActiveLevelIndex(nextLevelIndex)
    setGameState(createGameState(nextLevel))
  }

  if (!hasStartedGame) {
    return <OnboardingScreen onStart={() => setHasStartedGame(true)} />
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {showCompletionModal && levelScore && (
        <CompletionModal
          levelName={gameState.level.name}
          score={levelScore.score}
          moves={gameState.moves}
          rating={levelScore.rating}
          canAdvance={levelScore.canAdvance}
          hasNextLevel={hasNextLevel}
          onNextLevel={handleNextLevel}
          onRetry={handleRestart}
          onClose={() => setShowCompletionModal(false)}
        />
      )}

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
              Level {gameState.level.id} of {levels.length}
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

              {levelScore && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Score</p>
                  <p className="mt-1 text-3xl font-bold">{levelScore.score}</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-300">
                    {levelScore.rating}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Minimum to advance: 700
                  </p>
                </div>
              )}

              {currentLevelProgress && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Best Result</p>
                  <p className="mt-1 text-xl font-bold">
                    {currentLevelProgress.bestScore} pts
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Best moves: {currentLevelProgress.bestMoves}
                  </p>
                </div>
              )}
            </div>

            {gameState.status === 'completed' && (
              <div
                className={`mt-6 rounded-2xl border p-4 ${
                  levelScore?.canAdvance
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                    : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-100'
                }`}
              >
                {levelScore?.canAdvance
                  ? hasNextLevel
                    ? 'Nice work. You scored high enough to unlock the next route.'
                    : 'Great job. You restored every route.'
                  : 'Route restored, but your score is too low. Restart the level and solve it in fewer moves to advance.'}
              </div>
            )}

            <div className="mt-6 grid gap-3">
              {gameState.status === 'completed' && hasNextLevel && levelScore?.canAdvance && (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
                >
                  Next Level
                </button>
              )}

              <button
                type="button"
                onClick={handleRestart}
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
              >
                Restart Level
              </button>
            </div>
          </aside>

          <LevelSelector
            levels={levels}
            activeLevelId={gameState.level.id}
            progress={progress}
            onSelectLevel={handleSelectLevel}
          />
        </div>
      </section>
    </main>
  )
}

export default App