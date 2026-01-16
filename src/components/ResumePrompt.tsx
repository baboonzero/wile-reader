interface ResumePromptProps {
  savedPosition: number;
  totalWords: number;
  onResume: () => void;
  onStartFresh: () => void;
}

export function ResumePrompt({ savedPosition, totalWords, onResume, onStartFresh }: ResumePromptProps) {
  const percentComplete = Math.round((savedPosition / totalWords) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-radial from-bg-gradient-start to-bg-gradient-end flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        {/* Resume icon */}
        <div className="w-20 h-20 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-accent-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Welcome Back!
          </h2>
          <p className="text-text-secondary">
            You were {percentComplete}% through this text
          </p>
          <p className="text-text-muted text-sm">
            Word {savedPosition} of {totalWords}
          </p>
        </div>

        {/* Progress visualization */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-primary rounded-full transition-all"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full px-6 py-4 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Resume Reading
          </button>
          <button
            onClick={onStartFresh}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-text-primary font-medium rounded-xl transition-all"
          >
            Start from Beginning
          </button>
        </div>
      </div>
    </div>
  );
}
