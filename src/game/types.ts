export type Direction = 'up' | 'right' | 'down' | 'left'

export type TileType =
  | 'source'
  | 'destination'
  | 'straight'
  | 'corner'
  | 'empty'
  | 'firewall'

export type Position = {
  row: number
  col: number
}

export type Tile = {
  id: string
  type: TileType
  rotation: number
  locked?: boolean
}

export type Level = {
  id: number
  name: string
  description: string
  rows: number
  cols: number
  tiles: Tile[][]
}

export type GameStatus = 'playing' | 'completed'

export type GameState = {
  level: Level
  moves: number
  status: GameStatus
}