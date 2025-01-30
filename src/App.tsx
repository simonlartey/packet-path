import { useEffect, useRef, useState } from 'react'
import { CompletionModal } from './components/CompletionModal'
import { GameBoard } from './components/GameBoard'
import { LandingPage } from './components/LandingPage'
import { ModeSelector } from './components/ModeSelector'
import { playCompletionSound, playTileRotateSound } from './audio/soundEffects'
import { createGameState, rotateTile } from './game/engine'
import { levels } from './game/levels'
import { calculateLevelScore } from './game/scoring'
import { loadProgress, saveLevelProgress, saveEndlessDepth, saveDailyProgress } from './storage/progressStorage'
import { generateLevel } from './game/levelGenerator'
import { loadSettings, saveSettings } from './storage/settingsStorage'

const DAILY_DATE_KEY = new Date().toISOString().slice(0, 10)
const DAILY_SEED = parseInt(DAILY_DATE_KEY.replace(/-/g, ''), 10)

function App() {
  const [hasStartedGame, setHasStartedGame] = useState(false)
  const [activeLevelIndex, setActiveLevelIndex] = useState(0)
  const [gameState, setGameState] = useState(() => createGameState(levels[0]))
  const [progress, setProgress] = useState(() => loadProgress())
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [settings, setSettings] = useState(() => loadSettings())
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevStatusRef = useRef(gameState.status)
  const [gameMode, setGameMode] = useState<'campaign' | 'endless' | 'daily'>('campaign')
  const [endlessDepth, setEndlessDepth] = useState(0)
  const [endlessSeed] = useState(() => Date.now())

  const hasNextLevel = gameMode === 'endless' || (gameMode === 'campaign' && activeLevelIndex < levels.length - 1)

  const levelScore =
    gameState.status === 'completed' && gameState.completedAt !== null
      ? calculateLevelScore(
          gameState.level,
          gameState.moves,
          Math.floor((gameState.completedAt - gameState.startedAt) / 1000),
        )
      : null

  const currentLevelProgress = progress.completedLevels[gameState.level.id]
  const maxLevelScore = 1000 + gameState.level.id * 25

  function clearCompletionTimer() {
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current)
      completionTimerRef.current = null
    }
    setIsCelebrating(false)
  }

  useEffect(() => {
    if (prevStatusRef.current === 'playing' && gameState.status === 'completed') {
      if (settings.soundEnabled) playCompletionSound()
    }
    prevStatusRef.current = gameState.status
  }, [gameState.status, settings.soundEnabled])

  function handleRotateTile(row: number, col: number) {
    if (settings.soundEnabled && gameState.status === 'playing') {
      playTileRotateSound()
    }
    setGameState((currentState) => rotateTile(currentState, row, col))
  }

  function handleToggleSound() {
    const updated = { soundEnabled: !settings.soundEnabled }
    setSettings(updated)
    saveSettings(updated)
  }

  function handlePacketAnimationComplete() {
    setIsCelebrating(true)
    completionTimerRef.current = setTimeout(() => {
      completionTimerRef.current = null
      setIsCelebrating(false)
      setShowCompletionModal(true)
    }, 2500)
  }

  function handleRestart() {
    clearCompletionTimer()
    if (gameState.status === 'completed' && levelScore) {
      if (gameMode === 'campaign') {
        const updatedProgress = saveLevelProgress(gameState.level.id, levelScore.score, gameState.moves)
        setProgress(updatedProgress)
      } else if (gameMode === 'daily') {
        const updatedProgress = saveDailyProgress(DAILY_DATE_KEY, levelScore.score, gameState.moves)
        setProgress(updatedProgress)
      }
    }
    setShowCompletionModal(false)
    if (gameMode === 'endless') {
      setGameState(createGameState(generateLevel(endlessDepth, endlessSeed + endlessDepth)))
    } else if (gameMode === 'daily') {
      setGameState(createGameState(generateLevel(16, DAILY_SEED)))
    } else {
      setGameState(createGameState(levels[activeLevelIndex]))
    }
  }

  function handleSelectLevel(levelIndex: number) {
    const selectedLevel = levels[levelIndex]
    if (selectedLevel.id > progress.highestUnlockedLevelId) return
    clearCompletionTimer()
    setShowCompletionModal(false)
    setActiveLevelIndex(levelIndex)
    setGameState(createGameState(selectedLevel))
  }

  function handleStartEndless() {
    const depth = 1
    clearCompletionTimer()
    setShowCompletionModal(false)
    setGameMode('endless')
    setEndlessDepth(depth)
    setGameState(createGameState(generateLevel(depth, endlessSeed + depth)))
  }

  function handleStartDaily() {
    clearCompletionTimer()
    setShowCompletionModal(false)
    setGameMode('daily')
    setGameState(createGameState(generateLevel(16, DAILY_SEED)))
  }

  function handleBackToCampaign() {
    clearCompletionTimer()
    setShowCompletionModal(false)
    setGameMode('campaign')
    setEndlessDepth(0)
    setGameState(createGameState(levels[activeLevelIndex]))
  }

  function handleNextLevel() {
    if (!levelScore) return

    if (gameMode === 'endless') {
      const nextDepth = endlessDepth + 1
      const nextLevel = generateLevel(nextDepth, endlessSeed + nextDepth)
      const updatedProgress = saveEndlessDepth(nextDepth)
      clearCompletionTimer()
      setShowCompletionModal(false)
      setProgress(updatedProgress)
      setEndlessDepth(nextDepth)
      setGameState(createGameState(nextLevel))
      return
    }

    if (!hasNextLevel) return

    const nextLevelIndex = activeLevelIndex + 1
    const nextLevel = levels[nextLevelIndex]

    const updatedProgress = saveLevelProgress(
      gameState.level.id,
      levelScore.score,
      gameState.moves,
      nextLevel.id,
    )

    clearCompletionTimer()
    setShowCompletionModal(false)
    setProgress(updatedProgress)
    setActiveLevelIndex(nextLevelIndex)
    setGameState(createGameState(nextLevel))
  }

  if (!hasStartedGame) {
    return <LandingPage onStart={() => setHasStartedGame(true)} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      {showCompletionModal && levelScore && (
        <CompletionModal
          levelName={gameState.level.name}
          score={levelScore.score}
          moves={gameState.moves}
          rating={levelScore.rating}
          hasNextLevel={hasNextLevel}
          onNextLevel={handleNextLevel}
          onRetry={handleRestart}
          onClose={() => setShowCompletionModal(false)}
          onStartEndless={gameMode === 'campaign' && !hasNextLevel ? handleStartEndless : undefined}
        />
      )}

      {/* Nav bar */}
      <nav className="flex shrink-0 items-center border-b border-[#1e1c18] px-6 py-3">
        <span className="text-sm font-semibold text-[#c8c0b4]">PacketPath</span>
        <span className="mx-2.5 text-[#2c2926]">·</span>
        <span className="text-xs uppercase tracking-[0.18em] text-[#4a4540]">
          Network Routing Puzzle
        </span>
        <button
          type="button"
          onClick={handleToggleSound}
          className="ml-auto rounded-lg border border-[#252220] px-3 py-1.5 text-xs text-[#4a4540] transition hover:border-[#403c36] hover:text-[#c8c0b4]"
        >
          {settings.soundEnabled ? 'Sound On' : 'Sound Off'}
        </button>
      </nav>

      {/* Three-column main content */}
      <div className="flex min-h-0 flex-1">

        {/* Left column — title + campaign selector */}
        <div className="flex w-72 shrink-0 flex-col border-r border-[#1e1c18] px-6 py-8">
          <div className="shrink-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#e8e2d8]">
              Guide the packet.
            </h1>
            <p className="mt-1 text-3xl font-bold leading-tight tracking-tight text-amber-400">
              Solve the route.
            </p>
            <p className="mt-4 text-sm leading-6 text-[#4a4540]">
              Rotate tiles to connect source to destination. Avoid firewalls.
            </p>
          </div>

          <ModeSelector
            gameMode={gameMode}
            levels={levels}
            activeLevelId={gameState.level.id}
            progress={progress}
            endlessDepth={endlessDepth}
            dailyDateKey={DAILY_DATE_KEY}
            onSelectLevel={handleSelectLevel}
            onStartDaily={handleStartDaily}
            onStartEndless={handleStartEndless}
            onBackToCampaign={handleBackToCampaign}
          />
        </div>

        {/* Center column — board + legend + level selector */}
        <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-auto px-6 py-8">
          <GameBoard
            gameState={gameState}
            onRotateTile={handleRotateTile}
            onPacketAnimationComplete={handlePacketAnimationComplete}
          />

          {/* Celebration card */}
          {isCelebrating && levelScore && (
            <div className="celebration-card-in flex w-full max-w-[576px] items-center gap-6 rounded-2xl border border-emerald-800/25 bg-emerald-950/20 px-6 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/60">
                  Signal delivered
                </p>
                <p className="mt-1 text-4xl font-bold tabular-nums text-[#e8e2d8]">
                  {levelScore.score}
                </p>
                <p className="mt-0.5 text-xs text-[#3a3530]">/ {maxLevelScore} pts</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xl text-amber-400">
                  {levelScore.rating === 'Excellent' ? '★★★' : levelScore.rating === 'Efficient' ? '★★' : '★'}
                </p>
                <p className="mt-1 text-sm font-medium text-[#c8c0b4]">{levelScore.rating}</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 text-xs text-[#4a4540]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-amber-500/40 bg-[#1a1408]" />
              Source
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-sky-400/30 bg-[#0c1219]" />
              Destination
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded bg-[#4a4540]" />
              Cable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-3 w-3 items-center justify-center rounded border border-rose-500/30 bg-[#1a0d0d] text-[8px] leading-none text-rose-400/60">
                ×
              </span>
              Firewall
            </span>
          </div>

        </div>

        {/* Right panel — stats + controls */}
        <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-[#1e1c18]">
          <div className="flex-1 px-8 py-10">

            {/* Level identity */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
              {gameMode === 'endless'
                ? `Endless · Route ${endlessDepth}`
                : `Level ${gameState.level.id} of ${levels.length}`}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#e8e2d8]">
              {gameState.level.name}
            </h2>

            {/* Meta pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-[#252220] bg-[#1a1814] px-3 py-1 text-xs text-[#6b6460]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                {gameState.level.difficulty}
              </span>
              <span className="rounded-full border border-[#252220] bg-[#1a1814] px-3 py-1 text-xs text-[#6b6460]">
                {gameState.level.estimatedMoves} moves target
              </span>
              <span className="rounded-full border border-[#252220] bg-[#1a1814] px-3 py-1 text-xs text-[#6b6460]">
                {gameState.level.category}
              </span>
            </div>

            <div className="mt-8 border-t border-[#1e1c18]" />

            {/* Moves */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3a3530]">
                Moves
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-5xl font-bold tabular-nums text-[#e8e2d8]">
                  {String(gameState.moves).padStart(2, '0')}
                </span>
                {currentLevelProgress && (
                  <span className="text-xs text-[#4a4540]">
                    Best: {currentLevelProgress.bestMoves}
                  </span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3a3530]">
                Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    gameState.status === 'completed' ? 'bg-emerald-400' : 'bg-[#3a3530]'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    gameState.status === 'completed' ? 'text-emerald-400' : 'text-[#5a5550]'
                  }`}
                >
                  {gameState.status === 'completed' ? 'Route restored' : 'Routing in progress'}
                </span>
              </div>
            </div>

            {/* Score */}
            {levelScore && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3a3530]">
                  Score
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#e8e2d8]">{levelScore.score}</span>
                  <span className="text-sm text-[#3a3530]">/ {maxLevelScore}</span>
                  <span className="ml-auto text-xs font-semibold text-amber-400">
                    {levelScore.rating} ★
                  </span>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#1e1c18]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (levelScore.score / maxLevelScore) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Completion banner */}
            {gameState.status === 'completed' && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-800/30 bg-emerald-950/20 p-4 text-sm leading-5 text-emerald-400">
                <span className="mt-px shrink-0 text-base leading-none">✓</span>
                <span>
                  {hasNextLevel
                    ? 'Nice work. You restored the route. Head to the next level.'
                    : 'Great job. You restored every route.'}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="shrink-0 space-y-2 border-t border-[#1e1c18] px-8 py-6">
            {gameState.status === 'completed' && hasNextLevel && (
              <button
                type="button"
                onClick={handleNextLevel}
                className="flex w-full items-center justify-between rounded-xl bg-emerald-900/50 px-5 py-3.5 font-semibold text-emerald-300 transition hover:bg-emerald-800/50"
              >
                Next Level
                <span aria-hidden>›</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleRestart}
              className="flex w-full items-center justify-between rounded-xl border border-[#252220] px-5 py-3.5 font-semibold text-[#6b6460] transition hover:border-[#403c36] hover:text-[#c8c0b4]"
            >
              Restart Level
              <span aria-hidden className="text-sm">↺</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
