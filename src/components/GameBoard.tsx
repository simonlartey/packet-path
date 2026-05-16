import type { GameState } from '../game/types'
import { Tile } from './Tile'

type GameBoardProps = {
  gameState: GameState
  onRotateTile: (row: number, col: number) => void
}

export function GameBoard({ gameState, onRotateTile }: GameBoardProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${gameState.level.cols}, minmax(0, 1fr))`,
        }}
      >
        {gameState.level.tiles.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile
              key={tile.id}
              tile={tile}
              onRotate={() => onRotateTile(rowIndex, colIndex)}
            />
          )),
        )}
      </div>
    </section>
  )
}