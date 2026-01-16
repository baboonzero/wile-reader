# SpeedRead - Design System Specification

## Design Direction: Modern Gradient

A contemporary, visually engaging speed reading experience with subtle gradients, glassmorphism effects, and smooth animations while maintaining maximum focus on the reading experience.

---

## Color Palette

### Dark Theme (Primary)
```css
--bg-primary: #0A0E27        /* Deep navy, almost black */
--bg-secondary: #131729      /* Slightly lighter navy */
--bg-gradient-start: #1A1F3A /* Gradient top */
--bg-gradient-end: #0D1127   /* Gradient bottom */

--text-primary: #FFFFFF      /* Pure white for words */
--text-secondary: #94A3B8    /* Slate gray for UI text */
--text-muted: #64748B        /* Dimmer gray for hints */

--accent-primary: #8B5CF6    /* Purple - main accent */
--accent-secondary: #3B82F6  /* Blue - secondary accent */
--accent-gradient: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)

--orp-highlight: #FF3B30     /* Bright red for ORP character */
--success: #10B981           /* Green for progress */
--warning: #F59E0B           /* Amber for alerts */

--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
--glass-blur: blur(12px)
```

### Light Theme (Secondary)
```css
--bg-primary: #F8FAFC        /* Cool white */
--bg-secondary: #F1F5F9      /* Light gray */
--bg-gradient-start: #FFFFFF /* Gradient top */
--bg-gradient-end: #EFF6FF   /* Subtle blue tint */

--text-primary: #0F172A      /* Nearly black for words */
--text-secondary: #475569    /* Slate for UI text */
--text-muted: #94A3B8        /* Light gray for hints */

--accent-primary: #7C3AED    /* Darker purple for visibility */
--accent-secondary: #2563EB  /* Darker blue */
--accent-gradient: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)

--orp-highlight: #DC2626     /* Slightly darker red for light mode */
--success: #059669           /* Darker green */
--warning: #D97706           /* Darker amber */

--glass-bg: rgba(15, 23, 42, 0.03)
--glass-border: rgba(15, 23, 42, 0.08)
--glass-blur: blur(12px)
```

---

## Typography

### Fonts
```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-reading: 'SF Pro Display', 'Inter', sans-serif  /* For speed reading words */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace  /* For stats/numbers */
```

### Reading Display Sizes
```css
--text-reading-mobile: 48px      /* Mobile portrait */
--text-reading-mobile-lg: 56px   /* Mobile landscape */
--text-reading-tablet: 64px      /* Tablet */
--text-reading-desktop: 72px     /* Desktop */

--line-height-reading: 1.2
--letter-spacing-reading: -0.02em  /* Tight for modern look */
```

### UI Text Sizes
```css
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 24px
```

---

## Spacing & Layout

### Spacing Scale
```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

### Layout
```css
--max-width-reading: 100vw
--max-width-controls: 480px     /* Max width for control panel */
--reading-area-height: 60vh     /* Vertical center for word display */
```

---

## Components Design Specs

### Reading Display Area

**Container:**
- Full viewport width and height
- Background: Radial gradient from center
  - Dark: `radial-gradient(circle at center, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)`
- Flex center alignment (both axes)
- Minimum height: 100dvh (dynamic viewport height for mobile)

**Word Display:**
- Font: `var(--font-reading)`
- Size: Responsive based on viewport
- Color: `var(--text-primary)`
- Font weight: 600 (semi-bold) for base word
- ORP Character:
  - Color: `var(--orp-highlight)` (#FF3B30)
  - Font weight: 800 (extra bold)
  - Optional subtle text-shadow for glow: `0 0 20px rgba(255, 59, 48, 0.4)`
- Smooth fade-in animation: 120ms ease-out
- Letter spacing: -0.02em for modern, tight spacing

**Animation:**
```css
@keyframes fadeInWord {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.word-display {
  animation: fadeInWord 120ms ease-out;
}
```

### Controls Panel (Auto-Hide)

**Container (Bottom Sheet):**
- Position: Fixed bottom
- Background: Glassmorphism effect
  - `background: var(--glass-bg)`
  - `backdrop-filter: var(--glass-blur)`
  - `border-top: 1px solid var(--glass-border)`
- Border radius: 24px 24px 0 0
- Padding: 24px
- Box shadow: `0 -4px 24px rgba(0, 0, 0, 0.3)`
- Transform: translateY(0) when visible, translateY(100%) when hidden
- Transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)

**Auto-Hide Behavior:**
- Visible on tap anywhere on screen
- Auto-hide after 3 seconds of inactivity
- Fade-in indicator: Subtle upward chevron (↑) pulses gently at bottom when hidden

### Progress Bar

**Design:**
- Height: 4px
- Position: Fixed top of screen
- Background: `var(--glass-bg)`
- Filled portion: Gradient `var(--accent-gradient)`
- Border radius: 0 (full width) or 0 0 2px 2px (if not full width)
- Smooth width transition: 200ms ease-out
- Optional glow effect: `box-shadow: 0 0 12px var(--accent-primary)`

**Word Counter:**
- Position: Below progress bar or in controls
- Font: `var(--font-mono)`
- Size: `var(--text-sm)`
- Color: `var(--text-secondary)`
- Format: "234 / 520" or "45%"

### Speed Control Slider

**Design:**
- Width: 100% of controls container
- Track:
  - Height: 6px
  - Background: `var(--glass-bg)`
  - Border radius: 3px
- Filled track: Gradient `var(--accent-gradient)`
- Thumb:
  - Size: 24px circle
  - Background: White with gradient border
  - Box shadow: `0 2px 8px rgba(0, 0, 0, 0.2)`
  - Hover/active: Scale 1.1
- Labels:
  - Current WPM: Large (24px), bold, center
  - Min/max: Small (12px), on ends

### Buttons

**Primary (Play/Pause):**
- Size: 64px circle (mobile), 56px (desktop)
- Background: Gradient `var(--accent-gradient)`
- Icon: White, 32px
- Shadow: `0 4px 16px rgba(139, 92, 246, 0.4)`
- Hover: Scale 1.05, increase shadow
- Active: Scale 0.95

**Secondary (Skip, Settings):**
- Size: 48px circle
- Background: `var(--glass-bg)` with border `var(--glass-border)`
- Icon: `var(--text-secondary)`, 24px
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.1)`
- Hover: Background lightens slightly

### Input Selection Tabs

**Tab Bar:**
- Background: `var(--glass-bg)`
- Border radius: 12px
- Padding: 4px
- Display: Inline flex

**Tab Button:**
- Padding: 12px 24px
- Border radius: 8px
- Font: 14px, medium
- Color: `var(--text-secondary)`
- Transition: all 200ms

**Active Tab:**
- Background: Gradient `var(--accent-gradient)`
- Color: White
- Shadow: `0 2px 8px rgba(139, 92, 246, 0.3)`

### Text Input Area (Textarea)

**Design:**
- Background: `var(--glass-bg)`
- Border: 1px solid `var(--glass-border)`
- Border radius: 16px
- Padding: 20px
- Font: `var(--font-display)`, 16px
- Color: `var(--text-primary)`
- Min height: 200px
- Max height: 400px (scrollable)
- Placeholder: `var(--text-muted)`
- Focus:
  - Border color: `var(--accent-primary)`
  - Box shadow: `0 0 0 3px rgba(139, 92, 246, 0.1)`

---

## Interactions & Animations

### Touch Gestures
- **Tap anywhere**: Toggle controls visibility
- **Hold screen**: Activate brake (dim screen slightly, reduce speed)
- **Swipe left/right**: Skip words (visual feedback: subtle horizontal slide)
- **Pinch**: Adjust text size (future enhancement)

### Micro-animations
- **Word transition**: 120ms fade-in
- **Button press**: 100ms scale down to 0.95
- **Slider drag**: Haptic feedback (if available)
- **Control panel show/hide**: 300ms slide with ease-out
- **Progress bar**: Smooth width transition, 200ms

### Loading States
- **Text parsing**: Gradient shimmer animation
- **File upload**: Circular progress with gradient stroke

---

## Responsive Breakpoints

```css
/* Mobile Portrait */
@media (max-width: 480px) {
  --text-reading: 48px
  --controls-padding: 16px
}

/* Mobile Landscape */
@media (min-width: 481px) and (max-width: 768px) and (orientation: landscape) {
  --text-reading: 56px
  --reading-area-height: 50vh  /* More space for controls */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  --text-reading: 64px
  --max-width-controls: 600px
}

/* Desktop */
@media (min-width: 1025px) {
  --text-reading: 72px
  --max-width-controls: 640px
  /* Center controls horizontally, max width */
}
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- ORP red (#FF3B30) on dark background: Sufficient contrast
- Option to adjust ORP color for colorblind users

### Keyboard Navigation
- Space: Play/pause
- Arrow Left/Right: Skip words
- Arrow Up/Down: Adjust speed
- Esc: Show/hide controls
- Tab: Navigate through controls

### Screen Reader Support
- ARIA labels for all interactive elements
- Live region announces current word (optional, can be overwhelming)
- Progress updates announced at meaningful intervals

### Motion Sensitivity
- Option to disable all animations
- Respect `prefers-reduced-motion` media query

---

## Performance Considerations

### Smooth Rendering
- Use `requestAnimationFrame` for word updates
- CSS transforms (not position) for animations
- Will-change hints for frequently animated elements
- GPU acceleration for glassmorphism effects

### Bundle Size
- Lazy load file parsing libraries (PDF.js, Marked)
- Tree-shake unused Tailwind classes
- Optimize gradient usage (CSS not images)

---

## Design Inspiration Sources

Based on research from:
- Reedy's minimalist, function-first approach
- Modern gradient trends (Stripe, Linear app)
- iOS design language (glassmorphism, haptics)
- Medium's reading experience (typography, spacing)

---

## Next Steps

1. Implement design tokens in Tailwind config
2. Create reusable component library
3. Build design system in Storybook (future)
4. Test across devices (iPhone, Android, tablets)
5. Gather user feedback and iterate
