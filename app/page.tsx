export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        coming soon
      </p>
      <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text)] sm:text-6xl">
        buzi<span className="text-[var(--color-accent)]">.</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-[var(--color-text-muted)]">
        Music, beats, and everything in between.
      </p>
    </div>
  )
}
