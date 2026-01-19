import { useState } from 'react';

interface ControlsProps {
  isPlaying: boolean;
  showControls: boolean;
  wpm: number;
  onPlayPause: () => void;
  onWpmChange: (wpm: number) => void;
  onRestart: () => void;
  onExit: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const WPM_PRESETS = [
  { label: 'Relaxed', value: 150 },
  { label: 'Normal', value: 250 },
  { label: 'Fast', value: 400 },
  { label: 'Speed', value: 600 },
];

export function Controls({
  isPlaying,
  showControls,
  wpm,
  onPlayPause,
  onWpmChange,
  onRestart,
  onExit,
  onMouseEnter,
  onMouseLeave,
}: ControlsProps) {
  const [localWpm, setLocalWpm] = useState(wpm);

  const handleWpmChange = (newWpm: number) => {
    setLocalWpm(newWpm);
    onWpmChange(newWpm);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-smooth ${
        showControls ? 'translate-y-0' : 'translate-y-full'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Show controls indicator when hidden */}
      {!showControls && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="text-text-muted text-xs animate-pulse-gentle">
            ↑ Tap to show controls
          </div>
        </div>
      )}

      {/* Controls panel - more compact on mobile */}
      <div className="controls-compact glass rounded-t-3xl px-4 sm:px-6 py-4 sm:py-6 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {/* Speed control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">Reading Speed</span>
              <span className="text-2xl font-bold gradient-text font-mono">{localWpm} WPM</span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="100"
                max="900"
                step="10"
                value={localWpm}
                onChange={(e) => handleWpmChange(Number(e.target.value))}
                className="w-full h-2 bg-glass-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-glow-purple [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #3B82F6 ${((localWpm - 100) / 800) * 100}%, rgba(255,255,255,0.05) ${((localWpm - 100) / 800) * 100}%, rgba(255,255,255,0.05) 100%)`,
                }}
              />
            </div>

            {/* Presets */}
            <div className="flex gap-2">
              {WPM_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleWpmChange(preset.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    Math.abs(localWpm - preset.value) < 20
                      ? 'bg-gradient-accent text-white shadow-glow-purple'
                      : 'glass text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Playback controls */}
          <div className="space-y-4">
            {/* Top row - Exit button */}
            <div className="flex items-center justify-between">
              <button
                onClick={onExit}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 text-text-secondary hover:text-text-primary transition-all hover:scale-105 active:scale-95"
                aria-label="Exit to input"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Exit</span>
              </button>

              <button
                onClick={onRestart}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 text-text-secondary hover:text-text-primary transition-all hover:scale-105 active:scale-95"
                aria-label="Restart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">Restart</span>
              </button>
            </div>

            {/* Bottom row - Playback controls */}
            <div className="flex items-center justify-center">
              {/* Play/Pause */}
              <button
                onClick={onPlayPause}
                className="w-16 h-16 rounded-full bg-gradient-accent text-white flex items-center justify-center shadow-glow-purple transition-all hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Hint */}
          <p className="text-center text-xs text-text-muted">
            Tap screen to show/hide controls • Space to play/pause
          </p>
        </div>
      </div>
    </div>
  );
}
