import { Word } from '../types';

interface WordDisplayProps {
  word: Word | null;
  isBraking: boolean;
  onTap?: () => void;
}

export function WordDisplay({ word, isBraking, onTap }: WordDisplayProps) {
  if (!word) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-radial from-bg-gradient-start to-bg-gradient-end">
        <p className="text-text-muted text-xl">
          Enter text below to start reading
        </p>
      </div>
    );
  }

  const { text, orpIndex } = word;
  const before = text.slice(0, orpIndex);
  const orp = text[orpIndex];
  const after = text.slice(orpIndex + 1);

  const fontSize = 'clamp(48px, 12vw, 72px)';

  return (
    <div
      onClick={onTap}
      className={`relative min-h-screen bg-gradient-radial from-bg-gradient-start to-bg-gradient-end transition-all duration-300 cursor-pointer ${
        isBraking ? 'brightness-75' : ''
      }`}
    >
      {/* Fixed ORP anchor point at screen center - this is where the red character will ALWAYS be */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

        <div className="relative animate-fade-in-word">
          {/* Container for the word with absolute positioning */}
          <div
            className="font-reading font-semibold leading-tight tracking-tight whitespace-nowrap"
            style={{ fontSize }}
          >
            {/* Text before ORP - positioned to the LEFT, ending at the anchor */}
            <span
              className="absolute right-full text-text-primary"
              style={{ top: 0 }}
            >
              {before}
            </span>

            {/* ORP character - FIXED at the anchor point (left: 0) */}
            <span className="relative font-extrabold text-orp-highlight drop-shadow-[0_0_20px_rgba(255,59,48,0.4)] z-10">
              {orp}
            </span>

            {/* Text after ORP - positioned to the RIGHT, starting after the ORP */}
            <span
              className="absolute left-full text-text-primary"
              style={{ top: 0 }}
            >
              {after}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
