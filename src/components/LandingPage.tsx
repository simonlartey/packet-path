import { useRef, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { GameBoard } from './GameBoard'
import { levels } from '../game/levels'
import type { GameState } from '../game/types'

type LandingPageProps = {
  onStart: () => void
}

function buildSolvedLevelPreview(): GameState {
  const level = structuredClone(levels[0])
  level.tiles[1][2].rotation = 180

  return {
    level,
    moves: 6,
    status: 'completed',
    startedAt: 0,
    completedAt: 90000,
  }
}

const HERO_GAME_STATE = buildSolvedLevelPreview()
const BOARD_SIZE = 576
const PREVIEW_SCALE = 0.38

function TerminalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  )
}

function RouteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h5a4 4 0 0 1 4 4v2a4 4 0 0 0 4 4h3" />
      <path d="M7 4 4 7l3 3" />
      <path d="m17 14 3 3-3 3" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  )
}

export function LandingPage({ onStart }: LandingPageProps) {
  const showcaseRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const rectRef = useRef<DOMRect | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const hoveringRef = useRef(false)
  const previewSize = Math.round(BOARD_SIZE * PREVIEW_SCALE)

  useEffect(() => {
    const el = showcaseRef.current
    if (!el) return
    const updateRect = () => { rectRef.current = el.getBoundingClientRect() }
    updateRect()
    window.addEventListener('resize', updateRect, { passive: true })
    return () => {
      window.removeEventListener('resize', updateRect)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function tick() {
    const el = showcaseRef.current
    if (!el) return

    const LERP = 0.1
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * LERP
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * LERP

    el.style.setProperty('--scene-rotate-x', `${currentRef.current.x.toFixed(3)}deg`)
    el.style.setProperty('--scene-rotate-y', `${currentRef.current.y.toFixed(3)}deg`)

    const settled =
      Math.abs(targetRef.current.x - currentRef.current.x) < 0.02 &&
      Math.abs(targetRef.current.y - currentRef.current.y) < 0.02

    if (hoveringRef.current || !settled) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }

  function handleTilt(event: MouseEvent<HTMLDivElement>) {
    const rect = rectRef.current
    if (!rect) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    targetRef.current.y = ((x / rect.width) - 0.5) * 22
    targetRef.current.x = -((y / rect.height) - 0.5) * 15

    if (!hoveringRef.current) {
      hoveringRef.current = true
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
  }

  function resetTilt() {
    hoveringRef.current = false
    targetRef.current.x = 0
    targetRef.current.y = 0
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02050a] text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[320px] cyber-wave" />

        {/* Glow pools */}
        <div className="absolute left-1/2 top-[-160px] h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-400/14 blur-[150px] cyber-glow-pulse" />
        <div className="absolute right-[-180px] top-[120px] h-[540px] w-[540px] rounded-full bg-fuchsia-500/12 blur-[150px]" />
        <div className="absolute bottom-[-260px] left-[-180px] h-[640px] w-[640px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute bottom-[-120px] right-[-140px] h-[480px] w-[480px] rounded-full bg-blue-500/8 blur-[140px]" />
        <div className="absolute bottom-[5%] left-[38%] h-[280px] w-[560px] rounded-full bg-cyan-500/6 blur-[120px]" />

        {/* Floating particles */}
        <span className="cyber-float absolute left-[9%] top-[28%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_#22d3ee]" />
        <span className="cyber-float absolute right-[11%] top-[23%] h-1.5 w-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_18px_#e879f9] [animation-delay:1.6s]" />
        <span className="cyber-float absolute bottom-[18%] left-[28%] h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_14px_#fbbf24] [animation-delay:3.1s]" />
        <span className="cyber-float absolute right-[7%] top-[58%] h-1 w-1 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7] [animation-delay:1.2s]" />
        <span className="cyber-float absolute right-[24%] bottom-[28%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_22px_#22d3ee] [animation-delay:3.8s]" />

        {/* Radar sweep */}
        <div className="radar-container absolute left-[3%] bottom-[22%]" aria-hidden="true">
          <div className="radar-ring" />
          <div className="radar-sweep" />
          <div className="radar-dot" style={{ top: '28%', left: '62%' }} />
          <div className="radar-dot" style={{ top: '58%', left: '36%' }} />
          <div className="radar-dot" style={{ top: '74%', left: '68%' }} />
        </div>

        {/* Corner data readouts */}
        <div className="absolute bottom-7 left-7 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
          <div>Latency <span className="text-cyan-600">4 ms</span></div>
          <div className="mt-0.5">Uptime <span className="text-emerald-600">99.9%</span></div>
        </div>
        <div className="absolute bottom-7 right-7 text-right font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
          <div>Nodes active <span className="text-cyan-600">247</span></div>
          <div className="mt-0.5">Pkt routed <span className="text-emerald-600">4,829</span></div>
        </div>
      </div>

      <div
        ref={showcaseRef}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        className="landing-perspective"
      >
        <div className="landing-tilt-shell">
          <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3 font-mono text-sm font-black uppercase tracking-[0.24em] text-white">
              <span className="text-cyan-300">
                <TerminalIcon />
              </span>
              Packet<span className="text-cyan-300">_</span>Path
            </div>

            <button
              type="button"
              onClick={onStart}
              className="rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)] transition hover:border-cyan-200 hover:bg-cyan-300/20 hover:shadow-[0_0_38px_rgba(34,211,238,0.32)]"
            >
              System Access
            </button>
          </header>

          <section className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-8">
            <div className="fade-in-up text-center">
              <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/7 px-4 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Live network
              </div>

              <h1 className="hero-title mx-auto max-w-5xl text-balance">PacketPath</h1>

              <p className="mx-auto mt-6 max-w-3xl font-mono text-xs font-black uppercase tracking-[0.32em] text-slate-400 md:text-sm">
                Route packets. Bypass firewalls. Restore the network.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onStart}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-8 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_42px_rgba(34,211,238,0.42)] transition hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 translate-y-full bg-white/30 transition-transform duration-300 group-hover:translate-y-0" />
                  <span className="relative">Launch Interface</span>
                </button>

                <a
                  href="#showcase"
                  className="rounded-xl border border-white/12 bg-white/[0.04] px-8 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-slate-300 backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-cyan-300/7 hover:text-cyan-100"
                >
                  View Briefing
                </a>
              </div>
            </div>

            <div
              id="showcase"
              className="fade-in-up relative isolate mt-16 scene-3d"
              style={{ animationDelay: '160ms' }}
            >
              {/* HUD corner brackets */}
              <div className="hud-corner hud-corner-tl" aria-hidden="true" />
              <div className="hud-corner hud-corner-tr" aria-hidden="true" />
              <div className="hud-corner hud-corner-bl" aria-hidden="true" />
              <div className="hud-corner hud-corner-br" aria-hidden="true" />

              <div className="relative scene-3d rounded-[2.25rem]">
                <div className="showcase-shell-bg" aria-hidden="true">
                  <div className="cockpit-shell cockpit-shell-left" />
                  <div className="cockpit-shell cockpit-shell-right" />
                  <div className="cockpit-center-window" />
                  <div className="cockpit-vignette" />
                </div>

                <div className="relative z-10 grid gap-7 lg:grid-cols-[0.6fr_1.05fr_1fr] scene-3d">
                  <div className="hidden items-center justify-center lg:flex scene-3d">
                    <div className="holo-cube-card">
                      <div className="holo-cube-face">
                        <RouteIcon />
                      </div>
                      <div className="holo-cube-beam" />
                    </div>
                  </div>

                  <div className="grid gap-5 scene-3d">
                    <div className="glass-panel glass-panel-wide scene-card-left">
                      <div className="glass-icon text-cyan-300">
                        <RouteIcon />
                      </div>
                      <div>
                        <p className="panel-kicker text-cyan-300">Node Control</p>
                        <h2 className="panel-title">Dynamic Route Control</h2>
                        <p className="panel-copy">Rotate nodes. Restore signal. Beat the firewall.</p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 scene-3d">
                      <div className="glass-panel scene-card-lower-left">
                        <div className="glass-icon text-rose-300">
                          <ShieldIcon />
                        </div>
                        <p className="panel-kicker text-rose-300">Threat</p>
                        <h3 className="panel-title">Firewall Avoidance</h3>
                      </div>

                      <div className="glass-panel scene-card-lower-right">
                        <div className="glass-icon text-amber-300">
                          <CalendarIcon />
                        </div>
                        <p className="panel-kicker text-amber-300">24H</p>
                        <h3 className="panel-title">Daily Challenge</h3>
                      </div>
                    </div>
                  </div>

                  <div className="preview-monitor scene-preview">
                    <div className="preview-monitor-glow" />

                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            Routing_Sim
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                          Online
                        </span>
                      </div>

                      <div className="flex justify-center py-2">
                        <div
                          className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-black/35 shadow-[inset_0_0_24px_rgba(34,211,238,0.08)]"
                          style={{ width: previewSize, height: previewSize }}
                        >
                          <div className="absolute inset-0 bg-cyan-300/6 blur-2xl" />

                          <div
                            className="relative"
                            style={{
                              width: `${BOARD_SIZE}px`,
                              height: `${BOARD_SIZE}px`,
                              transform: `scale(${PREVIEW_SCALE})`,
                              transformOrigin: 'top left',
                            }}
                          >
                            <GameBoard
                              gameState={HERO_GAME_STATE}
                              onRotateTile={() => {}}
                              disablePacketAnimation
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-7 overflow-hidden rounded-full border border-white/10 bg-white/[0.035] py-3 backdrop-blur-xl">
                  <div className="cyber-ticker flex w-max gap-10 font-mono text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                    <span>Campaign Active</span>
                    <span className="text-cyan-300">Daily Route Ready</span>
                    <span>Endless Mode Online</span>
                    <span className="text-rose-300">Firewalls Detected</span>
                    <span>Campaign Active</span>
                    <span className="text-cyan-300">Daily Route Ready</span>
                    <span>Endless Mode Online</span>
                    <span className="text-rose-300">Firewalls Detected</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
