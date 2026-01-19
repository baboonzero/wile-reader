import { useState, useEffect, useCallback, useRef } from 'react';
import { Word, ReaderState } from '../types';
import { calculateWordDelay } from '../utils/orp';

interface UseReaderOptions {
  words: Word[];
  wpm: number;
  dynamicPacing: boolean;
  startIndex?: number;
  onComplete?: () => void;
}

export function useReader({ words, wpm, dynamicPacing, startIndex = 0, onComplete }: UseReaderOptions) {
  const [state, setState] = useState<ReaderState>({
    words,
    currentIndex: startIndex,
    isPlaying: false,
    wpm,
    showControls: true,
    isBraking: false,
  });

  const timerRef = useRef<number | null>(null);
  const brakeSpeedRef = useRef<number>(wpm);

  // Update words when they change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      words,
      currentIndex: startIndex,
      isPlaying: false,
    }));
  }, [words, startIndex]);

  // Update WPM
  useEffect(() => {
    setState(prev => ({ ...prev, wpm }));
    brakeSpeedRef.current = wpm;
  }, [wpm]);

  // Core reading loop
  useEffect(() => {
    if (!state.isPlaying || state.currentIndex >= words.length) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (state.currentIndex >= words.length && onComplete) {
        onComplete();
      }

      return;
    }

    const currentWord = words[state.currentIndex];
    const effectiveWPM = state.isBraking ? brakeSpeedRef.current * 0.5 : brakeSpeedRef.current;
    const delay = calculateWordDelay(currentWord.text, effectiveWPM, dynamicPacing);

    // Add extra delay for paragraph breaks
    const paragraphDelay = currentWord.isLastInParagraph ? delay * 2 : 0;
    const totalDelay = delay + paragraphDelay;

    timerRef.current = window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
    }, totalDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.isPlaying, state.currentIndex, state.isBraking, words, dynamicPacing, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
    // Auto-hide controls after 2 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, showControls: false }));
    }, 2000);
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, showControls: true }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const skipForward = useCallback((count: number = 10) => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + count, words.length - 1),
    }));
  }, [words.length]);

  const skipBackward = useCallback((count: number = 10) => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - count, 0),
    }));
  }, []);

  const restart = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: 0,
      isPlaying: false,
      showControls: true,
    }));
  }, []);

  const setBraking = useCallback((braking: boolean) => {
    setState(prev => ({ ...prev, isBraking: braking }));
  }, []);

  // Simple toggle: tap to show/hide controls
  const toggleControlsVisibility = useCallback(() => {
    setState(prev => ({ ...prev, showControls: !prev.showControls }));
  }, []);

  const currentWord = words[state.currentIndex] || null;
  const progress = words.length > 0 ? (state.currentIndex / words.length) * 100 : 0;

  return {
    currentWord,
    currentIndex: state.currentIndex,
    totalWords: words.length,
    progress,
    isPlaying: state.isPlaying,
    showControls: state.showControls,
    isBraking: state.isBraking,
    play,
    pause,
    togglePlayPause,
    skipForward,
    skipBackward,
    restart,
    setBraking,
    toggleControlsVisibility,
  };
}
