import type { Direction, Tile as TileModel } from '../game/types'
import { getTileConnections } from '../game/pathfinding'

type TileProps = {
  tile: TileModel
  onRotate: () => void
}

const connectionClasses: Record<Direction, string> = {
  up: 'left-1/2 top-0 h-1/2 w-2 -translate-x-1/2 rounded-b-full',
  right: 'right-0 top-1/2 h-2 w-1/2 -translate-y-1/2 rounded-l-full',
  down: 'bottom-0 left-1/2 h-1/2 w-2 -translate-x-1/2 rounded-t-full',
  left: 'left-0 top-1/2 h-2 w-1/2 -translate-y-1/2 rounded-r-full',
}

function getTileClasses(tile: TileModel): string {
  const base =
    'relative flex h-24 w-24 items-center justify-center rounded-2xl border transition'

  if (tile.type === 'source') {
    return `${base} border-emerald-400 bg-emerald-400/15 shadow-lg shadow-emerald-400/20`
  }

  if (tile.type === 'destination') {
    return `${base} border-cyan-400 bg-cyan-400/15 shadow-lg shadow-cyan-400/20`
  }

  if (tile.type === 'firewall') {
    return `${base} border-red-400/50 bg-red-500/10`
  }

  if (tile.type === 'empty') {
    return `${base} border-slate-800 bg-slate-950/40`
  }

  return `${base} cursor-pointer border-slate-700 bg-slate-800 hover:border-cyan-400 hover:bg-slate-700`
}

function CablePath({ tile }: { tile: TileModel }) {
  const connections = getTileConnections(tile)

  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/30" />

      {connections.map((direction) => (
        <div
          key={direction}
          className={`absolute bg-cyan-300 shadow-lg shadow-cyan-300/30 ${connectionClasses[direction]}`}
        />
      ))}
    </>
  )
}

export function Tile({ tile, onRotate }: TileProps) {
  const canRotate = !tile.locked && tile.type !== 'empty' && tile.type !== 'firewall'

  return (
    <button
      type="button"
      disabled={!canRotate}
      onClick={onRotate}
      className={getTileClasses(tile)}
      aria-label={`${tile.type} tile`}
    >
      {(tile.type === 'straight' || tile.type === 'corner') && <CablePath tile={tile} />}

      {tile.type === 'source' && (
        <>
          <CablePath tile={tile} />
          <span className="absolute rounded-full bg-emerald-950 px-2 py-1 text-xs font-bold uppercase tracking-wide text-emerald-200">
            Start
          </span>
        </>
      )}

      {tile.type === 'destination' && (
        <>
          <CablePath tile={tile} />
          <span className="absolute rounded-full bg-cyan-950 px-2 py-1 text-xs font-bold uppercase tracking-wide text-cyan-200">
            End
          </span>
        </>
      )}

      {tile.type === 'firewall' && (
        <div className="text-center">
          <div className="text-2xl">⛔</div>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-200">
            Blocked
          </p>
        </div>
      )}
    </button>
  )
}