import type { Level } from '../game/types'
import type { PlayerProgress } from '../storage/progressStorage'
import { CampaignPanel } from './CampaignPanel'

type ModeSelectorProps = {
  gameMode: 'campaign' | 'endless' | 'daily'
  levels: Level[]
  activeLevelId: number
  progress: PlayerProgress
  endlessDepth: number
  dailyDateKey: string
  onSelectLevel: (index: number) => void
  onStartDaily: () => void
  onStartEndless: () => void
  onBackToCampaign: () => void
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-[#252220] px-4 py-2.5 text-sm text-[#6b6460] transition hover:border-[#403c36] hover:text-[#c8c0b4]"
    >
      ← Back to Campaign
    </button>
  )
}

function ModeStatusCard({ label, primary, secondary }: { label: string; primary: string; secondary?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a3530]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[#e8e2d8]">{primary}</p>
      {secondary && <p className="mt-1 text-xs text-emerald-400">{secondary}</p>}
    </div>
  )
}

export function ModeSelector({
  gameMode,
  levels,
  activeLevelId,
  progress,
  endlessDepth,
  dailyDateKey,
  onSelectLevel,
  onStartDaily,
  onStartEndless,
  onBackToCampaign,
}: ModeSelectorProps) {
  if (gameMode === 'endless') {
    const bestDepth = progress.endlessHighestDepth
    return (
      <div className="mt-6 space-y-3">
        <ModeStatusCard
          label="Endless Mode"
          primary={`Route ${endlessDepth}`}
          secondary={bestDepth > 0 ? `Best: Route ${bestDepth}` : undefined}
        />
        <BackButton onClick={onBackToCampaign} />
      </div>
    )
  }

  if (gameMode === 'daily') {
    const todayRecord = progress.dailyCompletions[dailyDateKey]
    return (
      <div className="mt-6 space-y-3">
        <ModeStatusCard
          label="Daily Challenge"
          primary={dailyDateKey}
          secondary={
            todayRecord
              ? `Best: ${todayRecord.bestScore} pts · ${todayRecord.bestMoves} moves`
              : undefined
          }
        />
        <BackButton onClick={onBackToCampaign} />
      </div>
    )
  }

  return (
    <CampaignPanel
      levels={levels}
      activeLevelId={activeLevelId}
      progress={progress}
      onSelectLevel={onSelectLevel}
      onStartDaily={onStartDaily}
      onStartEndless={onStartEndless}
    />
  )
}
