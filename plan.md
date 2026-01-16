# SpeedRead App - Implementation Plan

## Research Summary

**RSVP (Rapid Serial Visual Presentation)**: This technique displays one word at a time at a fixed focal point, eliminating eye movements (saccades) and reducing subvocalization.

**ORP (Optimal Recognition Point)**: The key innovation is highlighting a specific character in each word (typically slightly left of center for longer words) where the eye naturally focuses for fastest recognition. The ORP position varies by word length.

**Kindle Word Runner** features:
- Speed range: 100-900 WPM
- Dynamic pacing: automatically slows for complex words, punctuation, and paragraph breaks
- Brake control: tap/hold to pause
- Manual navigation: slide to rewind/forward

---

## 1. Technical Architecture

### Technology Stack

**Frontend Framework**: React with TypeScript (type safety for complex word processing logic)

**Styling**: Tailwind CSS (rapid mobile-first responsive design)

**Build Tool**: Vite (fast development, optimized builds)

**Text Processing**:
- `pdf.js` or `react-pdf` for PDF parsing
- `marked` or `remark` for markdown parsing

**State Management**: React Context API or Zustand (lightweight)

**Mobile Optimization**: PWA (Progressive Web App) with service workers

### Why This Stack

- Mobile-first responsive design out of the box
- Fast rendering critical for smooth word transitions
- No backend needed initially (pure client-side)
- Can add backend later for user preferences/bookmarks

---

## 2. Core Speed Reading Engine

### ORP (Optimal Recognition Point) Calculation

```
Word length → ORP position (0-indexed from left)
1-3 chars: position 0 (first character)
4-5 chars: position 1
6-9 chars: position 2
10-13 chars: position 3
14+ chars: position 4 (or length/3 rounded down)
```

### Word Display Logic

- Parse text into word array (preserve punctuation)
- Calculate interval: `60000ms / WPM` (e.g., 300 WPM = 200ms per word)
- Use `requestAnimationFrame` or precise `setTimeout` for smooth timing
- Render word with ORP character highlighted (different color/weight)

### Dynamic Pacing Rules

- Long words (8+ chars): +30-50% time
- Words with punctuation: +20-40% time depending on punctuation type
  - Period/question/exclamation: +100% (pause)
  - Comma/semicolon: +50%
  - Hyphen/dash: +20%
- Paragraph breaks: +200% (longer pause)
- Numbers: +40% time

---

## 3. Text Input Methods

### Three Input Sources

**A. Direct Text Input:**
- Large textarea component
- Character/word count display
- Paste from clipboard button
- Clear/reset button

**B. Markdown Upload:**
- File input accepting `.md` files
- Parse using `marked` or `remark`
- Strip markdown syntax, extract plain text
- Preserve paragraph breaks for pacing

**C. PDF Upload:**
- File input accepting `.pdf` files
- Use `pdf.js` to extract text
- Handle multi-page documents
- Text extraction challenges: columns, formatting, images
- Consider chunking large PDFs (show page range selector)

### Text Processing Pipeline

```
Raw Input → Clean/Normalize → Tokenize → Word Array → Speed Reader
```

---

## 4. Mobile-Optimized UI/UX Design

### Layout Structure

```
┌─────────────────────────┐
│   [App Title/Logo]      │
├─────────────────────────┤
│                         │
│   Input Selection       │
│   [Text|MD|PDF tabs]    │
│                         │
├─────────────────────────┤
│                         │
│   READING DISPLAY       │
│       (centered)        │
│                         │
│      w**o**rd           │  ← ORP highlighted in red
│                         │
├─────────────────────────┤
│  Progress: ████░░░ 45%  │
│  Word 234 of 520        │
├─────────────────────────┤
│                         │
│   Speed: 300 WPM        │
│   [- Slider +]          │
│                         │
├─────────────────────────┤
│  [⏮] [⏸/▶] [⏭]        │
│  Hold screen to brake   │
└─────────────────────────┘
```

### Key UI Features

- **Large central focus area** for word display (minimum 48px font size)
- **High contrast**: Dark background, white text, red ORP character
- **Touch gestures**:
  - Tap: play/pause
  - Hold: brake (slow down gradually)
  - Swipe left/right: skip backward/forward (10 words)
- **Progress indicators**: visual bar + word count
- **Minimal chrome**: hide controls during reading, show on tap

### Responsive Breakpoints

- Mobile portrait: 320px-768px
- Mobile landscape: adjust font size
- Tablet: larger display area, side controls

---

## 5. Speed Control System

### Manual Controls

- **WPM Range**: 100-900 WPM (like Kindle Word Runner)
- **Default**: 250-300 WPM (average reading speed)
- **Presets**:
  - Relaxed: 150 WPM
  - Normal: 250 WPM
  - Fast: 400 WPM
  - Speed Reader: 600+ WPM
- **Fine-tune**: Slider with +/- buttons for precise control
- **Persistence**: Save user preference to localStorage

### Automated Dynamic Pacing

Toggle on/off option with these rules:

**Word complexity scoring**:
- Base time = 60000ms / WPM
- Syllable count multiplier (estimate from word length)
- Uncommon letter patterns (multiple consonants)

**Punctuation delays**:
```
. ! ? → pause 2x base time
, ; : → pause 1.5x base time
— – → pause 1.2x base time
```

**Paragraph breaks**: 3x pause between paragraphs

**Numbers & special chars**: 1.5x time

### Brake Control

- Touch and hold anywhere → gradually reduce speed to 50% over 500ms
- Release → return to normal speed over 300ms
- Visual feedback: screen dims slightly during brake

---

## 6. Implementation Roadmap

### Phase 1: Core MVP

1. Set up React + TypeScript + Vite project with Tailwind
2. Create basic text input (textarea only)
3. Implement word tokenization and ORP calculation
4. Build basic RSVP display component with highlighted ORP
5. Add play/pause controls
6. Implement manual speed control (slider, 100-900 WPM)
7. Basic mobile-responsive layout

### Phase 2: Enhanced Controls

1. Add progress bar and word counter
2. Implement touch gestures (tap to pause, swipe navigation)
3. Add brake control (hold to slow)
4. Skip forward/backward buttons
5. Add speed presets
6. localStorage for preferences

### Phase 3: Advanced Input Methods

1. Markdown file upload and parsing
2. PDF file upload and text extraction
3. Input method tabs/switcher
4. File validation and error handling
5. Large document handling (chunking, page selection)

### Phase 4: Dynamic Pacing

1. Implement punctuation-based delays
2. Add word complexity scoring
3. Paragraph break detection and pausing
4. Toggle for dynamic pacing on/off
5. Fine-tune timing multipliers

### Phase 5: Polish & PWA

1. Add custom font options
2. Color theme customization (ORP highlight color, background)
3. Bookmark/resume functionality
4. PWA setup (manifest, service worker, offline support)
5. Install prompt for mobile home screen
6. Performance optimization
7. Accessibility improvements (screen reader support, keyboard navigation)

### Phase 6: Optional Enhancements

- Reading statistics (words read, time spent, average speed)
- Multiple text queue management
- Export reading history
- Social sharing features
- User accounts (cloud sync across devices)

---

## Key Technical Considerations

### Performance Optimization

- Use `requestAnimationFrame` for smooth rendering
- Debounce speed slider changes
- Lazy load PDF.js library only when needed
- Web Workers for heavy text processing (large PDFs)

### Accessibility

- ARIA labels for screen readers
- Keyboard shortcuts (Space: play/pause, Arrow keys: navigation, +/-: speed)
- Sufficient color contrast (WCAG AA minimum)
- Option to disable animations for motion sensitivity

### Data Privacy

- All processing happens client-side (no text sent to servers)
- localStorage for preferences only
- Clear data option

### Browser Compatibility

- Modern browsers (Chrome, Safari, Firefox, Edge)
- iOS Safari (majority mobile users)
- Handle viewport height issues on mobile (address bar)

---

## Research Sources

- [Reedy. Intelligent reader](https://reedy-reader.com/)
- [RapidRead: Speed Reader & Focus Mode - Chrome Web Store](https://chromewebstore.google.com/detail/rapidread-speed-reader-fo/jlhffbhpefgmkmoigcfhednfnapickgo?hl=en)
- [Rapid serial visual presentation in reading: The case of Spritz - ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0747563214007663)
- [GitHub - pasky/speedread](https://github.com/pasky/speedread)
- ['Word Runner' On Kindle - Bustle](https://www.bustle.com/p/word-runner-on-kindle-is-the-tool-you-need-to-use-if-youre-having-trouble-finishing-a-difficult-book-8729660)
- [How to Speed Read on Kindle - Iris Reading](https://irisreading.com/how-to-speed-read-on-kindle/)
- [Kindle Word Runner at 600 WPM - Medium](https://medium.com/the-story-hall/observations-on-reading-a-book-at-600-words-per-minute-with-kindles-word-runner-32c577ef4e9f)
- [Kindle Word Runner Review - The eBook Reader](https://blog.the-ebook-reader.com/2015/10/06/kindle-word-runner-review-and-video-demo/)
