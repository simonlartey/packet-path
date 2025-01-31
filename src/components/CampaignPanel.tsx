import type { Level } from '../game/types'
import type { PlayerProgress } from '../storage/progressStorage'
import { LevelSelector } from './LevelSelector'

type CampaignPanelProps = {
  levels: Level[]
  activeLevelId: number
  progress: PlayerProgress
  onSelectLevel: (index: number) => void
  onStartDaily: () => void
  onStartEndless: () => void
}

export function CampaignPanel({
  levels,
  activeLevelId,
  progress,
  onSelectLevel,
  onStartDaily,
  onStartEndless,
}: CampaignPanelProps) {
  return (
    <div className="mt-6 space-y-3">
      <LevelSelector
        levels={levels}
        activeLevelId={activeLevelId}
        progress={progress}
        onSelectLevel={onSelectLevel}
      />
      <button
        type="button"
        onClick={onStartDaily}
        className="w-full rounded-xl border border-[#252220] px-4 py-3 text-sm font-semibold text-[#6b6460] transition hover:border-sky-500/30 hover:text-sky-400"
      >
        Daily Challenge →
      </button>
      <button
        type="button"
        onClick={onStartEndless}
        className="w-full rounded-xl border border-[#252220] px-4 py-3 text-sm font-semibold text-[#6b6460] transition hover:border-amber-500/30 hover:text-amber-400"
      >
        Endless Mode →
      </button>
    </div>
  )
}
