/**
 * Calculate the Optimal Recognition Point (ORP) for a word
 * Based on word length, returns the index of the character to highlight
 */
export function calculateORP(word: string): number {
  const length = word.length;

  if (length <= 3) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return Math.floor(length / 3);
}

/**
 * Detect punctuation type at the end of a word
 */
export function getPunctuationType(word: string): {
  hasTrailing: boolean;
  type: 'none' | 'comma' | 'period' | 'other';
  cleanWord: string;
} {
  const lastChar = word[word.length - 1];
  const punctuationRegex = /[.,!?;:—–-]/;

  if (!punctuationRegex.test(lastChar)) {
    return { hasTrailing: false, type: 'none', cleanWord: word };
  }

  const cleanWord = word.slice(0, -1);
  let type: 'none' | 'comma' | 'period' | 'other' = 'other';

  if (lastChar === ',') type = 'comma';
  else if (lastChar === '.' || lastChar === '!' || lastChar === '?') type = 'period';

  return { hasTrailing: true, type, cleanWord };
}

/**
 * Calculate the base delay for a word in milliseconds
 * Adjusts based on word complexity and punctuation
 */
export function calculateWordDelay(
  word: string,
  baseWPM: number,
  dynamicPacing: boolean
): number {
  const baseDelay = (60000 / baseWPM); // ms per word

  if (!dynamicPacing) {
    return baseDelay;
  }

  let multiplier = 1.0;
  const { hasTrailing, type, cleanWord } = getPunctuationType(word);

  // Adjust for word length (complexity)
  if (cleanWord.length >= 8) {
    multiplier += 0.3;
  }

  // Adjust for punctuation
  if (hasTrailing) {
    switch (type) {
      case 'period':
        multiplier += 1.0; // Double time for sentences
        break;
      case 'comma':
        multiplier += 0.5; // 50% more for pauses
        break;
      case 'other':
        multiplier += 0.2;
        break;
    }
  }

  // Adjust for numbers
  if (/\d/.test(cleanWord)) {
    multiplier += 0.4;
  }

  return Math.round(baseDelay * multiplier);
}
