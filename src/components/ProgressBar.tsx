interface ProgressBarProps {
  progress: number;
  currentIndex: number;
  totalWords: number;
}

export function ProgressBar({ progress, currentIndex, totalWords }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-1 bg-bg-secondary/50">
        <div
          className="h-full bg-gradient-accent shadow-glow-purple transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Word counter */}
      <div className="absolute top-2 right-4">
        <p className="text-xs font-mono text-text-muted">
          {currentIndex + 1} / {totalWords}
        </p>
      </div>
    </div>
  );
}
