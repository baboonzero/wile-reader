export interface Word {
  text: string;
  orpIndex: number;
  hasTrailingPunctuation: boolean;
  punctuationType: 'none' | 'comma' | 'period' | 'other';
  isLastInParagraph: boolean;
}

export interface ReaderState {
  words: Word[];
  currentIndex: number;
  isPlaying: boolean;
  wpm: number;
  showControls: boolean;
  isBraking: boolean;
}

export type InputMethod = 'text' | 'markdown' | 'pdf';

export interface ReaderSettings {
  wpm: number;
  dynamicPacing: boolean;
  fontSize: 'mobile' | 'mobile-lg' | 'tablet' | 'desktop';
  theme: 'dark' | 'light';
}
