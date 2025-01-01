function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
          Network Routing Puzzle
        </p>

        <h1 className="max-w-3xl text-6xl font-bold tracking-tight">
          PacketPath
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Restore broken network routes by rotating tiles, avoiding firewalls,
          and guiding packets from source to destination.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300">
            Start Game
          </button>

          <button className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
            View Tutorial
          </button>
        </div>
      </section>
    </main>
  )
}

export default App