import type { Direction, Level, Position, Tile } from './types'

const oppositeDirection: Record<Direction, Direction> = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
}

const directionDelta: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
}

export function getTileConnections(tile: Tile): Direction[] {
  const rotation = ((tile.rotation % 360) + 360) % 360

  if (tile.type === 'source') {
    if (rotation === 0) return ['up']
    if (rotation === 90) return ['right']
    if (rotation === 180) return ['down']
    return ['left']
  }

  if (tile.type === 'destination') {
    if (rotation === 0) return ['up']
    if (rotation === 90) return ['right']
    if (rotation === 180) return ['down']
    return ['left']
  }

  if (tile.type === 'straight') {
    return rotation === 0 || rotation === 180 ? ['up', 'down'] : ['left', 'right']
  }

  if (tile.type === 'corner') {
    if (rotation === 0) return ['up', 'right']
    if (rotation === 90) return ['right', 'down']
    if (rotation === 180) return ['down', 'left']
    return ['left', 'up']
  }

  return []
}

function findTile(level: Level, type: Tile['type']): Position | null {
  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      if (level.tiles[row][col].type === type) {
        return { row, col }
      }
    }
  }

  return null
}

function isInsideBoard(level: Level, position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < level.rows &&
    position.col >= 0 &&
    position.col < level.cols
  )
}

export function hasValidPath(level: Level): boolean {
  const source = findTile(level, 'source')
  const destination = findTile(level, 'destination')

  if (!source || !destination) return false

  const visited = new Set<string>()
  const queue: Position[] = [source]

  while (queue.length > 0) {
    const current = queue.shift()

    if (!current) continue

    const key = `${current.row}-${current.col}`

    if (visited.has(key)) continue
    visited.add(key)

    if (current.row === destination.row && current.col === destination.col) {
      return true
    }

    const currentTile = level.tiles[current.row][current.col]
    const connections = getTileConnections(currentTile)

    for (const direction of connections) {
      const delta = directionDelta[direction]
      const next = {
        row: current.row + delta.row,
        col: current.col + delta.col,
      }

      if (!isInsideBoard(level, next)) continue

      const nextTile = level.tiles[next.row][next.col]

      if (nextTile.type === 'empty' || nextTile.type === 'firewall') continue

      const nextConnections = getTileConnections(nextTile)
      const canConnectBack = nextConnections.includes(oppositeDirection[direction])

      if (canConnectBack) {
        queue.push(next)
      }
    }
  }

  return false
}