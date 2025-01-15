import { useEffect, useRef } from 'react'
import { GameBoard } from './GameBoard'
import { levels } from '../game/levels'
import type { GameState } from '../game/types'

type LandingPageProps = {
  onStart: () => void
}

// Level 1 solved path: source(1,0)@90 → straight(1,1)@90 → corner(1,2)@180
//   → corner(2,2)@0 → straight(2,3)@90 → dest(2,4)@270
function buildSolvedLevel1(): GameState {
  const level = structuredClone(levels[0])
  level.tiles[1][2].rotation = 180
  return { level, moves: 0, status: 'completed' }
}

const HERO_GAME_STATE = buildSolvedLevel1()
const BOARD_PX = 576
const HERO_SCALE = 0.62

export function LandingPage({ onStart }: LandingPageProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const boardContainerSize = `min(${Math.round(BOARD_PX * HERO_SCALE)}px, calc(100vw - 3rem))`

  useEffect(() => {
    boardRef.current?.setAttribute('inert', '')
  }, [])

  return (
    <div className="min-h-screen">
      <main className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div className="max-w-lg">
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-[#e8e2d8] md:text-6xl lg:text-[4rem]">
              Guide the packet.{' '}
              <span className="text-[#5a5550]">Solve the route.</span>
            </h1>

            <p className="mt-6 text-lg leading-7 text-[#5a5550]">
              Rotate cable tiles to connect source to destination.
              Avoid firewalls and complete each level in as few moves as possible.
            </p>

            <button
              type="button"
              onClick={onStart}
              className="mt-10 rounded-xl bg-[#e8e2d8] px-8 py-3.5 text-base font-semibold text-[#0e0d0b] transition hover:bg-white active:scale-[0.98]"
            >
              Play Now
            </button>
          </div>

          {/* Board preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-2xl border border-[#252220] bg-[#141210] shadow-xl shadow-black/50">
              <div className="flex items-center gap-2 border-b border-[#1e1c18] px-5 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#3a3530]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#3a3530]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#3a3530]" />
                <span className="ml-2 text-xs text-[#4a4540]">
                  Level 1 — First Connection
                </span>
              </div>

              <div
                className="overflow-hidden"
                style={{ width: boardContainerSize, height: boardContainerSize }}
              >
                <div
                  ref={boardRef}
                  aria-hidden="true"
                  className="pointer-events-none origin-top-left"
                  style={{
                    transform: `scale(${HERO_SCALE})`,
                    width: `${BOARD_PX}px`,
                    height: `${BOARD_PX}px`,
                  }}
                >
                  <GameBoard gameState={HERO_GAME_STATE} onRotateTile={() => {}} disablePacketAnimation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
