interface HeaderProps {
  onReset?: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <>
      {/* Skip navigation link for keyboard/screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <header
        className="border-b border-border bg-surface-light/60 backdrop-blur-md sticky top-0 z-50"
        role="banner"
      >
        <nav className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between" aria-label="Main navigation">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold"
              aria-hidden="true"
            >
              ✈
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                TripPulse
              </h1>
              <p className="text-xs text-text-muted -mt-0.5">Adaptive AI Travel Copilot</p>
            </div>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              aria-label="Start a new trip"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-surface-hover transition-colors cursor-pointer"
            >
              ✦ New Trip
            </button>
          )}
        </nav>
      </header>
    </>
  );
}
