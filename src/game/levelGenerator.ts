import type { Level, Tile, TileType } from './types'
import { createSeededRandom } from './seededRandom'

type Dir = 'up' | 'down' | 'left' | 'right'
type Pos = { row: number; col: number }

const DELTA: Record<Dir, Pos> = {
  up:    { row: -1, col:  0 },
  down:  { row:  1, col:  0 },
  left:  { row:  0, col: -1 },
  right: { row:  0, col:  1 },
}

const ALL_DIRS: Dir[] = ['up', 'down', 'left', 'right']

function key(p: Pos): string {
  return `${p.row}-${p.col}`
}

function inBounds(p: Pos, rows: number, cols: number): boolean {
  return p.row >= 0 && p.row < rows && p.col >= 0 && p.col < cols
}

function dirTo(from: Pos, to: Pos): Dir {
  if (to.row < from.row) return 'up'
  if (to.row > from.row) return 'down'
  if (to.col < from.col) return 'left'
  return 'right'
}

function manhattan(a: Pos, b: Pos): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}

// Derived from getTileConnections: rotation 0=up 90=right 180=down 270=left
function portToRotation(dir: Dir): number {
  return { up: 0, right: 90, down: 180, left: 270 }[dir]
}

// Maps two required port directions to the correct tile type + rotation
function twoPortsToTile(a: Dir, b: Dir): { type: TileType; rotation: number } {
  const s = new Set([a, b])
  if (s.has('up')   && s.has('down'))  return { type: 'straight', rotation: 0   }
  if (s.has('left') && s.has('right')) return { type: 'straight', rotation: 90  }
  if (s.has('up')   && s.has('right')) return { type: 'corner',   rotation: 0   }
  if (s.has('right')&& s.has('down'))  return { type: 'corner',   rotation: 90  }
  if (s.has('down') && s.has('left'))  return { type: 'corner',   rotation: 180 }
  if (s.has('left') && s.has('up'))    return { type: 'corner',   rotation: 270 }
  return { type: 'straight', rotation: 0 }
}

// Minimum clicks (90° rotations) to go from one rotation to another
function minClicks(from: number, to: number): number {
  const diff = ((to - from) / 90 + 4) % 4
  return Math.min(diff, 4 - diff)
}

// Guaranteed L-shaped fallback path when random walk fails
function fallbackPath(src: Pos, dst: Pos): Pos[] {
  const path: Pos[] = [src]
  let cur = { ...src }
  while (cur.col < dst.col) { cur = { ...cur, col: cur.col + 1 }; path.push({ ...cur }) }
  const dr = dst.row > cur.row ? 1 : -1
  while (cur.row !== dst.row) { cur = { ...cur, row: cur.row + dr }; path.push({ ...cur }) }
  return path
}

function carvePath(src: Pos, dst: Pos, rows: number, cols: number, rand: () => number): Pos[] {
  for (let attempt = 0; attempt < 8; attempt++) {
    const path: Pos[] = [src]
    const visited = new Set<string>([key(src)])

    for (let step = 0; step < rows * cols * 3; step++) {
      const cur = path[path.length - 1]
      if (key(cur) === key(dst)) break

      const candidates: Pos[] = []
      for (const dir of ALL_DIRS) {
        const next = { row: cur.row + DELTA[dir].row, col: cur.col + DELTA[dir].col }
        if (!inBounds(next, rows, cols)) continue
        if (key(next) === key(dst) || !visited.has(key(next))) candidates.push(next)
      }

      if (candidates.length === 0) {
        if (path.length <= 1) break
        visited.delete(key(path.pop()!))
        continue
      }

      const toward = candidates.filter(c => manhattan(c, dst) < manhattan(cur, dst))
      const chosen = toward.length > 0 && rand() < 0.65
        ? toward[Math.floor(rand() * toward.length)]
        : candidates[Math.floor(rand() * candidates.length)]

      path.push(chosen)
      if (key(chosen) !== key(dst)) visited.add(key(chosen))
    }

    if (key(path[path.length - 1]) === key(dst) && path.length >= 3) return path
  }

  return fallbackPath(src, dst)
}

type Config = { rows: number; cols: number; decoys: number; firewalls: number; lockedHints: number }

function getConfig(depth: number): Config {
  const scale = Math.floor((depth - 1) / 5)

  if (depth <= 10) {
    return { rows: 4, cols: 4, decoys: 2 + scale, firewalls: 0, lockedHints: Math.max(0, 2 - scale) }
  }
  if (depth <= 25) {
    return { rows: 5, cols: 5, decoys: 4 + scale, firewalls: Math.min(scale - 1, 2), lockedHints: 0 }
  }
  return { rows: 6, cols: 6, decoys: 6 + scale, firewalls: 2 + Math.min(scale - 4, 3), lockedHints: 0 }
}

function getDifficulty(depth: number): 'Easy' | 'Medium' | 'Hard' {
  if (depth <= 10) return 'Easy'
  if (depth <= 25) return 'Medium'
  return 'Hard'
}

export function generateLevel(id: number, seed: number): Level {
  const rand = createSeededRandom(seed)
  const config = getConfig(id)
  const { rows, cols } = config

  // Source on left edge, destination on right edge
  const srcRow = Math.floor(rand() * rows)
  let dstRow = Math.floor(rand() * rows)
  while (dstRow === srcRow && rows > 1) dstRow = Math.floor(rand() * rows)

  const src: Pos = { row: srcRow, col: 0 }
  const dst: Pos = { row: dstRow, col: cols - 1 }

  const path = carvePath(src, dst, rows, cols, rand)
  const pathKeys = new Set(path.map(key))

  // Build empty grid
  const grid: Tile[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      id: `${r}-${c}`,
      type: 'empty' as TileType,
      rotation: 0,
      locked: false,
    }))
  )

  // Place source — port faces the direction of the first step
  const srcDir = dirTo(src, path[1])
  grid[src.row][src.col] = {
    id: `${src.row}-${src.col}`,
    type: 'source',
    rotation: portToRotation(srcDir),
    locked: true,
  }

  // Place destination — port faces back toward the second-to-last tile
  const dstDir = dirTo(dst, path[path.length - 2])
  grid[dst.row][dst.col] = {
    id: `${dst.row}-${dst.col}`,
    type: 'destination',
    rotation: portToRotation(dstDir),
    locked: true,
  }

  // Place internal path tiles and record their solved rotations
  const solvedRotations = new Map<string, number>()
  for (let i = 1; i < path.length - 1; i++) {
    const pos = path[i]
    const portA = dirTo(pos, path[i - 1])
    const portB = dirTo(pos, path[i + 1])
    const { type, rotation } = twoPortsToTile(portA, portB)
    grid[pos.row][pos.col] = { id: `${pos.row}-${pos.col}`, type, rotation, locked: false }
    solvedRotations.set(key(pos), rotation)
  }

  // Lock some internal tiles as hints for easier depths
  const internal = path.slice(1, -1)
  const lockCount = Math.min(config.lockedHints, internal.length)
  const locked = new Set<number>()
  while (locked.size < lockCount) locked.add(Math.floor(rand() * internal.length))
  locked.forEach(i => { grid[internal[i].row][internal[i].col].locked = true })

  // Collect and shuffle non-path cells
  const nonPath: Pos[] = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!pathKeys.has(`${r}-${c}`)) nonPath.push({ row: r, col: c })
  for (let i = nonPath.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[nonPath[i], nonPath[j]] = [nonPath[j], nonPath[i]]
  }

  // Place firewalls — never adjacent to source or destination
  const fireKeys = new Set<string>()
  let fw = 0
  for (const cell of nonPath) {
    if (fw >= config.firewalls) break
    const nearSrc = Math.abs(cell.row - src.row) + Math.abs(cell.col - src.col) <= 1
    const nearDst = Math.abs(cell.row - dst.row) + Math.abs(cell.col - dst.col) <= 1
    if (!nearSrc && !nearDst) {
      grid[cell.row][cell.col] = { id: `${cell.row}-${cell.col}`, type: 'firewall', rotation: 0, locked: true }
      fireKeys.add(key(cell))
      fw++
    }
  }

  // Fill ALL remaining empty cells with decoy cable tiles
  for (const cell of nonPath) {
    if (fireKeys.has(key(cell))) continue
    const type: TileType = rand() < 0.5 ? 'straight' : 'corner'
    const rotation = Math.floor(rand() * 4) * 90
    grid[cell.row][cell.col] = { id: `${cell.row}-${cell.col}`, type, rotation, locked: false }
  }

  // Scramble unlocked path tiles (always at least 1 step away from solved)
  let estimatedMoves = 0
  for (let i = 1; i < path.length - 1; i++) {
    const pos = path[i]
    const tile = grid[pos.row][pos.col]
    if (tile.locked) continue
    const solved = solvedRotations.get(key(pos)) ?? 0
    const steps = 1 + Math.floor(rand() * 3) // 1, 2, or 3 — never 0
    const scrambled = (solved + steps * 90) % 360
    grid[pos.row][pos.col] = { ...tile, rotation: scrambled }
    estimatedMoves += minClicks(scrambled, solved)
  }

  if (estimatedMoves === 0) estimatedMoves = 1

  return {
    id,
    name: `Route ${id}`,
    description: `Endless – ${getDifficulty(id)}`,
    difficulty: getDifficulty(id),
    estimatedMoves,
    category: 'Endless',
    rows,
    cols,
    tiles: grid,
    isGenerated: true,
    seed,
  }
}
