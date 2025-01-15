import { useEffect, useRef, useState } from 'react'
import type { GameState } from '../game/types'
import { getConnectedTileIds, getPathSequence } from '../game/pathfinding'
import { Tile } from './Tile'

type GameBoardProps = {
  gameState: GameState
  onRotateTile: (row: number, col: number) => void
  disablePacketAnimation?: boolean
  onPacketAnimationComplete?: () => void
}

export function GameBoard({ gameState, onRotateTile, disablePacketAnimation, onPacketAnimationComplete }: GameBoardProps) {
  const connectedTileIds = getConnectedTileIds(gameState.level)

  const [packetStep, setPacketStep] = useState<number | null>(null)
  const [destinationReached, setDestinationReached] = useState(false)
  const pathRef = useRef<string[]>([])
  const hasAnimatedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onPacketDoneRef = useRef(onPacketAnimationComplete)
  onPacketDoneRef.current = onPacketAnimationComplete

  useEffect(() => {
    if (gameState.status === 'playing') {
      hasAnimatedRef.current = false
      if (intervalRef.current) clearInterval(intervalRef.current)
      setPacketStep(null)
      setDestinationReached(false)
      return
    }

    if (disablePacketAnimation || gameState.status !== 'completed' || hasAnimatedRef.current) {
      return
    }

    hasAnimatedRef.current = true
    const path = getPathSequence(gameState.level)
    if (path.length === 0) {
      setDestinationReached(true)
      onPacketDoneRef.current?.()
      return
    }

    pathRef.current = path
    setPacketStep(0)

    let step = 1
    intervalRef.current = setInterval(() => {
      if (step >= path.length) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setPacketStep(null)
        setDestinationReached(true)
        onPacketDoneRef.current?.()
      } else {
        setPacketStep(step)
        step++
      }
    }, 260)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [gameState.status, gameState.level, disablePacketAnimation])

  return (
    <>
      <section aria-label="Game board" className="relative p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgb(160 120 50 / 0.08), transparent 65%)',
          }}
        />
        {destinationReached && (
          <div aria-hidden className="board-surge pointer-events-none absolute inset-0" />
        )}

        <div
          className="relative grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${gameState.level.cols}, minmax(0, 1fr))`,
          }}
        >
          {gameState.level.tiles.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <Tile
                key={tile.id}
                tile={tile}
                row={rowIndex}
                col={colIndex}
                isConnected={connectedTileIds.has(tile.id)}
                isPacket={packetStep !== null && pathRef.current[packetStep] === tile.id}
                isDestinationPulse={destinationReached && tile.type === 'destination'}
                onRotate={() => onRotateTile(rowIndex, colIndex)}
              />
            )),
          )}
        </div>
      </section>

    </>
  )
}
