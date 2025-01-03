import type { Tile as TileModel } from '../game/types'

type TileProps = {
  tile: TileModel
  onRotate: () => void
}

function getTileLabel(tile: TileModel): string {
  if (tile.type === 'source') return 'S'
  if (tile.type === 'destination') return 'D'
  if (tile.type === 'firewall') return '⛔'
  if (tile.type === 'straight') return '━'
  if (tile.type === 'corner') return '┗'
  return ''
}

function getTileClasses(tile: TileModel): string {
  const base =
    'flex h-20 w-20 items-center justify-center rounded-2xl border text-3xl font-bold transition'

  if (tile.type === 'source') {
    return `${base} border-emerald-400 bg-emerald-400/20 text-emerald-300 shadow-lg shadow-emerald-400/20`
  }

  if (tile.type === 'destination') {
    return `${base} border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-lg shadow-cyan-400/20`
  }

  if (tile.type === 'firewall') {
    return `${base} border-red-400/50 bg-red-500/10 text-red-300`
  }

  if (tile.type === 'empty') {
    return `${base} border-slate-800 bg-slate-900/40 text-slate-700`
  }

  return `${base} cursor-pointer border-slate-700 bg-slate-800 text-slate-100 hover:border-cyan-400 hover:bg-slate-700`
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
      <span
        className="transition-transform duration-200"
        style={{ transform: `rotate(${tile.rotation}deg)` }}
      >
        {getTileLabel(tile)}
      </span>
    </button>
  )
}