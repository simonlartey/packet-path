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

export type LevelDifficulty = 'Easy' | 'Medium' | 'Hard'

export type Level = {
  id: number
  name: string
  description: string
  difficulty: LevelDifficulty
  estimatedMoves: number
  category: string
  rows: number
  cols: number
  tiles: Tile[][]
  isGenerated?: boolean
  seed?: number
}

export type GameStatus = 'playing' | 'completed'

export type GameState = {
  level: Level
  moves: number
  status: GameStatus
  startedAt: number
  completedAt: number | null
}