import { Word } from '../types';
import { calculateORP, getPunctuationType } from './orp';

/**
 * Parse raw text into an array of Word objects with ORP calculations
 */
export function parseText(text: string): Word[] {
  if (!text || !text.trim()) {
    return [];
  }

  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);
  const words: Word[] = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const isLastParagraph = paragraphIndex === paragraphs.length - 1;

    // Split paragraph into words
    const rawWords = paragraph.trim().split(/\s+/);

    rawWords.forEach((rawWord, wordIndex) => {
      if (!rawWord) return;

      const { hasTrailing, type, cleanWord } = getPunctuationType(rawWord);
      const orpIndex = calculateORP(cleanWord);
      const isLastInParagraph = wordIndex === rawWords.length - 1 && !isLastParagraph;

      words.push({
        text: rawWord,
        orpIndex,
        hasTrailingPunctuation: hasTrailing,
        punctuationType: type,
        isLastInParagraph,
      });
    });
  });

  return words;
}

/**
 * Get word count from text
 */
export function getWordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(wordCount: number, wpm: number): number {
  return Math.ceil(wordCount / wpm);
}
