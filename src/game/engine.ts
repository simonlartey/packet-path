import { hasValidPath } from './pathfinding'
import type { GameState, Level } from './types'

export function createGameState(level: Level): GameState {
  return {
    level: structuredClone(level),
    moves: 0,
    status: 'playing',
  }
}

export function rotateTile(state: GameState, row: number, col: number): GameState {
  const nextState = structuredClone(state)
  const tile = nextState.level.tiles[row][col]

  if (tile.locked || tile.type === 'empty' || tile.type === 'firewall') {
    return state
  }

  tile.rotation = (tile.rotation + 90) % 360
  nextState.moves += 1

  if (hasValidPath(nextState.level)) {
    nextState.status = 'completed'
  }

  return nextState
}