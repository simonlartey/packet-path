export function TutorialPanel() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
        How to Play
      </p>

      <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-slate-100">1. Start at the source</p>
          <p className="mt-1">
            The packet begins at the green <span className="font-semibold text-emerald-300">START</span> tile.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-slate-100">2. Rotate the cables</p>
          <p className="mt-1">
            Click cable tiles to rotate them until the glowing route connects.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="font-semibold text-slate-100">3. Reach the destination</p>
          <p className="mt-1">
            Complete the route to the cyan <span className="font-semibold text-cyan-300">END</span> tile while avoiding blocked nodes.
          </p>
        </div>
      </div>
    </section>
  )
}