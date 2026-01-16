interface ReadingCompleteProps {
  totalWords: number;
  onGoHome: () => void;
}

export function ReadingComplete({
  totalWords,
  onGoHome,
}: ReadingCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-radial from-bg-gradient-start to-bg-gradient-end px-6">
      {/* Success icon */}
      <div className="mb-8 w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center animate-fade-in-word">
        <svg
          className="w-12 h-12 text-accent-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Completion message */}
      <h1 className="text-4xl md:text-5xl font-reading font-bold text-text-primary mb-4 text-center animate-fade-in-word">
        Reading Complete!
      </h1>

      {/* Stats */}
      <p className="text-text-muted text-lg mb-10 text-center">
        You finished reading{" "}
        <span className="text-accent-primary font-semibold">{totalWords}</span>{" "}
        words
      </p>

      {/* Go home button */}
      <button
        onClick={onGoHome}
        className="px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold text-lg rounded-2xl transition-all duration-200 shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/40 hover:scale-105 active:scale-95"
      >
        Read Something New
      </button>
    </div>
  );
}
