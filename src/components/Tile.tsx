import type { Direction, Tile as TileModel } from '../game/types'
import { getTileConnections } from '../game/pathfinding'

type TileProps = {
  tile: TileModel
  row: number
  col: number
  isConnected: boolean
  isPacket: boolean
  isDestinationPulse?: boolean
  onRotate: () => void
}

const connectionClasses: Record<Direction, string> = {
  up: 'left-1/2 top-0 h-1/2 w-2 -translate-x-1/2 rounded-b-full',
  right: 'right-0 top-1/2 h-2 w-1/2 -translate-y-1/2 rounded-l-full',
  down: 'bottom-0 left-1/2 h-1/2 w-2 -translate-x-1/2 rounded-t-full',
  left: 'left-0 top-1/2 h-2 w-1/2 -translate-y-1/2 rounded-r-full',
}

// Gradient direction is perpendicular to cable direction (cross-section illumination)
const connectedArmStyle: Record<Direction, React.CSSProperties> = {
  up: {
    background: 'linear-gradient(to right, transparent 5%, white 50%, transparent 95%)',
    boxShadow: '0 0 4px 1px rgba(180,210,255,0.65), 0 0 10px 3px rgba(160,200,255,0.25)',
  },
  down: {
    background: 'linear-gradient(to right, transparent 5%, white 50%, transparent 95%)',
    boxShadow: '0 0 4px 1px rgba(180,210,255,0.65), 0 0 10px 3px rgba(160,200,255,0.25)',
  },
  left: {
    background: 'linear-gradient(to bottom, transparent 5%, white 50%, transparent 95%)',
    boxShadow: '0 0 4px 1px rgba(180,210,255,0.65), 0 0 10px 3px rgba(160,200,255,0.25)',
  },
  right: {
    background: 'linear-gradient(to bottom, transparent 5%, white 50%, transparent 95%)',
    boxShadow: '0 0 4px 1px rgba(180,210,255,0.65), 0 0 10px 3px rgba(160,200,255,0.25)',
  },
}

function getTileClasses(tile: TileModel, isConnected: boolean): string {
  const base =
    'relative flex h-24 w-24 items-center justify-center rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-2 focus:ring-offset-[#0a0908]'

  if (tile.type === 'source') return `${base} border-amber-500/25 bg-[#180f04]`
  if (tile.type === 'destination') return `${base} border-sky-400/20 bg-[#060d14]`
  if (tile.type === 'firewall') return `${base} cursor-default border-rose-500/35 bg-[#150606]`
  if (tile.type === 'empty') return `${base} cursor-default border-transparent bg-transparent`

  if (isConnected) {
    const interactive = tile.locked ? 'cursor-default' : 'cursor-pointer hover:bg-white/[0.09]'
    return `${base} border-white/[0.14] bg-white/[0.05] ${interactive}`
  }

  if (tile.locked) return `${base} cursor-default border-white/[0.03] bg-white/[0.015]`
  return `${base} cursor-pointer border-white/[0.03] bg-white/[0.015] hover:border-white/[0.09] hover:bg-white/[0.04]`
}

function getTileDescription(tile: TileModel, row: number, col: number): string {
  const position = `row ${row + 1}, column ${col + 1}`
  const rotation = `${tile.rotation} degrees`

  if (tile.type === 'empty') return `Empty tile at ${position}. This tile cannot be rotated.`
  if (tile.type === 'firewall') return `Firewall tile at ${position}. This tile blocks the route.`
  if (tile.locked) return `${tile.type} tile at ${position}, rotated ${rotation}. Locked.`
  return `${tile.type} tile at ${position}, rotated ${rotation}. Press Enter or Space to rotate.`
}

// Full cable path for straight/corner tiles — junction node + arms
function CablePath({ tile, isConnected }: { tile: TileModel; isConnected: boolean }) {
  const connections = getTileConnections(tile)

  if (!isConnected) {
    return (
      <>
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.14]" />
        {connections.map((dir) => (
          <div key={dir} className={`absolute bg-white/[0.1] ${connectionClasses[dir]}`} />
        ))}
      </>
    )
  }

  return (
    <>
      {/* Glowing junction node */}
      <div
        className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          boxShadow:
            '0 0 5px 2px rgba(180,210,255,0.9), 0 0 14px 5px rgba(160,200,255,0.4)',
        }}
      />
      {/* Illuminated arms — gradient cross-section + glow */}
      {connections.map((dir) => (
        <div
          key={dir}
          className={`absolute ${connectionClasses[dir]}`}
          style={connectedArmStyle[dir]}
        />
      ))}
    </>
  )
}

// Arms only — for source/destination, which have their own center visual
function CableArms({ tile, isConnected }: { tile: TileModel; isConnected: boolean }) {
  const connections = getTileConnections(tile)

  return (
    <>
      {connections.map((dir) => {
        if (!isConnected) {
          const inactiveStyle =
            tile.type === 'source' ? 'bg-amber-400/50' : 'bg-sky-400/50'
          return <div key={dir} className={`absolute ${inactiveStyle} ${connectionClasses[dir]}`} />
        }
        return (
          <div
            key={dir}
            className={`absolute ${connectionClasses[dir]}`}
            style={connectedArmStyle[dir]}
          />
        )
      })}
    </>
  )
}

export function Tile({ tile, row, col, isConnected, isPacket, isDestinationPulse, onRotate }: TileProps) {
  const canRotate = !tile.locked && tile.type !== 'empty' && tile.type !== 'firewall'

  const glowStyle: React.CSSProperties | undefined =
    tile.type === 'source'
      ? {
          boxShadow:
            '0 0 0 2px rgba(251,191,36,0.18), 0 0 0 7px rgba(251,191,36,0.07), 0 0 0 16px rgba(251,191,36,0.03)',
        }
      : tile.type === 'destination'
        ? {
            boxShadow: '0 0 0 2px rgba(56,189,248,0.15), 0 0 0 8px rgba(56,189,248,0.05)',
          }
        : isConnected
          ? {
              boxShadow:
                '0 0 10px rgba(200,220,255,0.1), 0 0 24px rgba(180,200,255,0.05)',
            }
          : undefined

  return (
    <button
      type="button"
      disabled={!canRotate}
      onClick={onRotate}
      className={getTileClasses(tile, isConnected)}
      style={glowStyle}
      aria-label={getTileDescription(tile, row, col)}
    >
      {/* ── Source ───────────────────────────────────────────────── */}
      {tile.type === 'source' && (
        <>
          {/* Pulsing ambient glow */}
          <div
            aria-hidden
            className="animate-source-pulse absolute inset-0 rounded-2xl"
            style={{
              background:
                'radial-gradient(circle at center, rgba(251,191,36,0.28) 0%, transparent 62%)',
            }}
          />
          {/* Concentric rings + amber core */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 96 96"
            fill="none"
          >
            <circle cx="48" cy="48" r="38" stroke="rgba(251,191,36,0.05)" strokeWidth="1" />
            <circle cx="48" cy="48" r="28" stroke="rgba(251,191,36,0.11)" strokeWidth="1" />
            <circle cx="48" cy="48" r="17" stroke="rgba(251,191,36,0.24)" strokeWidth="1.5" />
            <circle cx="48" cy="48" r="10" fill="rgba(251,191,36,0.18)" />
            <circle cx="48" cy="48" r="5" fill="rgba(255,215,80,0.95)" />
          </svg>
          {/* Cable arm(s) */}
          <CableArms tile={tile} isConnected={isConnected} />
          {/* Label at bottom */}
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-400/55">
            Start
          </span>
        </>
      )}

      {/* ── Destination ──────────────────────────────────────────── */}
      {tile.type === 'destination' && (
        <>
          {/* Stable ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                'radial-gradient(circle at center, rgba(56,189,248,0.2) 0%, transparent 62%)',
            }}
          />
          {/* Concentric rings + blue core */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 96 96"
            fill="none"
          >
            <circle cx="48" cy="48" r="38" stroke="rgba(56,189,248,0.05)" strokeWidth="1" />
            <circle cx="48" cy="48" r="27" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />
            <circle cx="48" cy="48" r="17" stroke="rgba(56,189,248,0.26)" strokeWidth="1.5" />
            <circle cx="48" cy="48" r="10" fill="rgba(56,189,248,0.16)" />
            <circle cx="48" cy="48" r="5" fill="rgba(130,215,255,0.92)" />
          </svg>
          {/* Cable arm(s) */}
          <CableArms tile={tile} isConnected={isConnected} />
          {/* Expanding ring on packet arrival */}
          {isDestinationPulse && (
            <div
              aria-hidden
              className="destination-arrived-ring pointer-events-none absolute inset-0 rounded-2xl border-2 border-sky-300/70"
            />
          )}
          {/* Label at bottom */}
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sky-400/55">
            End
          </span>
        </>
      )}

      {/* ── Firewall ─────────────────────────────────────────────── */}
      {tile.type === 'firewall' && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                'radial-gradient(circle at center, rgba(239,68,68,0.16) 0%, transparent 70%)',
            }}
          />
          <div aria-hidden className="absolute inset-3 rounded-xl border border-rose-500/20" />
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="relative text-rose-400/65"
          >
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}

      {/* ── Cable (straight / corner) ─────────────────────────────── */}
      {(tile.type === 'straight' || tile.type === 'corner') && (
        <CablePath tile={tile} isConnected={isConnected} />
      )}

      {/* ── Traveling packet ─────────────────────────────────────── */}
      {isPacket && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="packet-pulse h-5 w-5 rounded-full bg-white" />
        </div>
      )}
    </button>
  )
}
