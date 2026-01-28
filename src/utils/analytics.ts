import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_DbvU0nPImgkMM613y7vUMWAMsaqDZ20PSbrICe4S6Or';
const POSTHOG_HOST = 'https://us.i.posthog.com';

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
  });
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}

// Specific tracking functions for the app
export const analytics = {
  // Track when user starts reading
  startReading: (wordCount: number, wpm: number) => {
    trackEvent('reading_started', { word_count: wordCount, wpm });
  },

  // Track when user completes reading
  completeReading: (wordCount: number, wpm: number) => {
    trackEvent('reading_completed', { word_count: wordCount, wpm });
  },

  // Track when user resumes a saved session
  resumeReading: (position: number, totalWords: number) => {
    trackEvent('reading_resumed', {
      position,
      total_words: totalWords,
      progress_percent: Math.round((position / totalWords) * 100),
    });
  },

  // Track when user starts fresh instead of resuming
  startFresh: () => {
    trackEvent('reading_start_fresh');
  },

  // Track WPM changes
  wpmChanged: (wpm: number) => {
    trackEvent('wpm_changed', { wpm });
  },

  // Track input method used
  inputMethodUsed: (method: 'text' | 'markdown' | 'pdf') => {
    trackEvent('input_method_used', { method });
  },

  // Track when user exits reading
  exitReading: (position: number, totalWords: number) => {
    trackEvent('reading_exited', {
      position,
      total_words: totalWords,
      progress_percent: Math.round((position / totalWords) * 100),
    });
  },
};
