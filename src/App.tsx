import { useState, useCallback, useEffect, useRef } from 'react';
import { WordDisplay } from './components/WordDisplay';
import { Controls } from './components/Controls';
import { ProgressBar } from './components/ProgressBar';
import { TextInput } from './components/TextInput';
import { ReadingComplete } from './components/ReadingComplete';
import { ResumePrompt } from './components/ResumePrompt';
import { parseText } from './utils/textParser';
import { useReader } from './hooks/useReader';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateContentHash, saveReadingSession, getReadingSession, clearReadingSession } from './utils/storage';
import { Word } from './types';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [wpm, setWpm] = useLocalStorage('speedread_wpm', 250);
  const [dynamicPacing] = useState(true);
  const [showInput, setShowInput] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  // Session management for resume feature
  const [contentHash, setContentHash] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const rawTextRef = useRef<string>('');

  const {
    currentWord,
    currentIndex,
    totalWords,
    progress,
    isPlaying,
    showControls,
    isBraking,
    togglePlayPause,
    skipForward,
    skipBackward,
    restart,
    toggleControls: showControlsHandler,
    handleControlsMouseEnter,
    handleControlsMouseLeave,
  } = useReader({
    words,
    wpm,
    dynamicPacing,
    startIndex,
    onComplete: () => {
      setIsComplete(true);
      // Clear saved session on completion
      if (contentHash) {
        clearReadingSession();
      }
    },
  });

  // State for resume prompt
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedPosition, setSavedPosition] = useState(0);

  const handleTextSubmit = useCallback((text: string, resumeFromSaved: boolean = false) => {
    const hash = generateContentHash(text);
    rawTextRef.current = text;
    setContentHash(hash);
    
    // Check for saved session
    const savedSession = getReadingSession(hash);
    
    if (savedSession && !resumeFromSaved && savedSession.position > 0) {
      // Show resume prompt
      setSavedPosition(savedSession.position);
      setShowResumePrompt(true);
      const parsedWords = parseText(text);
      setWords(parsedWords);
      return; // Don't start reading yet
    }
    
    const parsedWords = parseText(text);
    setWords(parsedWords);
    setStartIndex(resumeFromSaved && savedSession ? savedSession.position : 0);
    setShowInput(false);
    setShowResumePrompt(false);
    setIsComplete(false);
  }, []);

  const handleResumeReading = useCallback(() => {
    setStartIndex(savedPosition);
    setShowInput(false);
    setShowResumePrompt(false);
    setIsComplete(false);
  }, [savedPosition]);

  const handleStartFresh = useCallback(() => {
    setStartIndex(0);
    setShowInput(false);
    setShowResumePrompt(false);
    setIsComplete(false);
    // Clear old session
    if (contentHash) {
      clearReadingSession();
    }
  }, [contentHash]);

  const handleRestart = useCallback(() => {
    restart();
    setStartIndex(0);
  }, [restart]);

  const handleExit = useCallback(() => {
    // Save current position before exiting
    if (contentHash && currentIndex > 0 && currentIndex < totalWords) {
      saveReadingSession(contentHash, currentIndex, totalWords);
    }
    restart();
    setShowInput(true);
    setWords([]);
    setContentHash(null);
    setStartIndex(0);
  }, [restart, contentHash, currentIndex, totalWords]);

  // Touch gestures removed - using simple click handler instead for reliability
  // Future: Can add back swipe/hold gestures if needed with better touch detection

  // Keyboard shortcuts
  useEffect(() => {
    if (showInput) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setWpm((prev) => Math.min(prev + 10, 900));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setWpm((prev) => Math.max(prev - 10, 100));
          break;
        case 'Escape':
          e.preventDefault();
          showControlsHandler();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showInput, togglePlayPause, skipForward, skipBackward, showControlsHandler]);

  if (showInput && !showResumePrompt) {
    return <TextInput onTextSubmit={handleTextSubmit} />;
  }

  // Show resume prompt when returning to saved content
  if (showResumePrompt) {
    return (
      <ResumePrompt
        savedPosition={savedPosition}
        totalWords={totalWords}
        onResume={handleResumeReading}
        onStartFresh={handleStartFresh}
      />
    );
  }

  // Show completion screen when reading is finished
  if (isComplete) {
    const handleGoHome = () => {
      setIsComplete(false);
      setShowInput(true);
      setWords([]);
      restart();
    };
    return <ReadingComplete totalWords={totalWords} onGoHome={handleGoHome} />;
  }

  return (
    <div className="relative">
      {/* Progress bar */}
      {totalWords > 0 && (
        <ProgressBar
          progress={progress}
          currentIndex={currentIndex}
          totalWords={totalWords}
        />
      )}

      {/* Word display */}
      <WordDisplay
        word={currentWord}
        isBraking={isBraking}
        onTap={showControlsHandler}
      />

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        showControls={showControls}
        wpm={wpm}
        onPlayPause={togglePlayPause}
        onWpmChange={setWpm}
        onRestart={handleRestart}
        onExit={handleExit}
        onMouseEnter={handleControlsMouseEnter}
        onMouseLeave={handleControlsMouseLeave}
      />
    </div>
  );
}

export default App;
