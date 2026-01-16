/**
 * Storage utilities for reading session persistence.
 */

const STORAGE_KEY_SESSION = 'speedread_session';

interface ReadingSession {
  contentHash: string;
  position: number;
  totalWords: number;
  savedAt: number;
}

/**
 * Generate a simple hash from text content for identification.
 * Uses first 100 chars + length + word count for uniqueness.
 */
export function generateContentHash(text: string): string {
  const trimmed = text.trim();
  const preview = trimmed.slice(0, 100);
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  
  // Simple hash combining content preview, length, and word count
  let hash = 0;
  const str = `${preview}|${trimmed.length}|${wordCount}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Save the current reading session.
 */
export function saveReadingSession(
  contentHash: string,
  position: number,
  totalWords: number
): void {
  const session: ReadingSession = {
    contentHash,
    position,
    totalWords,
    savedAt: Date.now(),
  };
  
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  } catch (error) {
    console.warn('Error saving reading session:', error);
  }
}

/**
 * Get saved reading session if it matches the given content hash.
 * Returns null if no session exists or content doesn't match.
 */
export function getReadingSession(contentHash: string): ReadingSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as ReadingSession;
    
    // Only return if content hash matches
    if (session.contentHash !== contentHash) return null;
    
    // Only return if session is less than 7 days old
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - session.savedAt > maxAge) {
      clearReadingSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.warn('Error reading session:', error);
    return null;
  }
}

/**
 * Clear the saved reading session.
 */
export function clearReadingSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch (error) {
    console.warn('Error clearing session:', error);
  }
}
