# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Find the State is an interactive geography game where players identify all 50 US states on an accurate SVG map. It's a pure vanilla JavaScript application with no build process required.

## Development Commands

```bash
# Start local development server (required for SVG loading due to CORS)
npm run dev        # Uses Python http.server on port 8000
npm run serve      # Alternative using npx http-server

# Or manually with Python
python -m http.server 8000
```

Access the game at `http://localhost:8000/`

## Architecture

### Core Components

**index.html** - Main game page with floating state display, game controls, and modal overlays

**src/js/game.js** - Game state management and core logic:
- `gameState` object tracks current game status, score, attempts, timer
- Floating state feature with zoom compensation for mobile devices
- Event-driven architecture with state transitions (idle → active → complete)
- Performance optimizations: debounced touch events, cached DOM measurements

**src/js/usa-map.js** - SVG map loading and interaction:
- Loads `src/assets/us.svg` via fetch API
- Attaches click handlers to state paths
- Manages visual state (hover, selected, found)

**src/js/states-data.js** - Maps 2-letter state codes to full names

### Key Features Implementation

**Floating State Display**:
- Uses `requestAnimationFrame` for smooth positioning updates
- Zoom compensation using Visual Viewport API
- Touch event debouncing (50ms) to reduce mobile judder
- Width caching to avoid layout thrashing

**Difficulty Modes**:
- Easy (1 point): Found states remain highlighted
- Hard (2 points): No persistent highlighting

**Timer System**:
- Optional timer tracks completion time
- Updates every 100ms via setInterval
- Displays in MM:SS format

## Important Considerations

- **Local server required**: SVG files must be served via HTTP due to CORS restrictions
- **No build process**: Pure HTML/CSS/JavaScript for simplicity
- **Mobile optimization**: Visual Viewport API for accurate zoom detection, debounced touch handlers
- **Version tracking**: Update version in `index.html` footer when making changes

## Testing

Manual testing recommended:
1. Test floating state on mobile devices (pinch zoom, scroll)
2. Verify all 50 states are clickable and correctly identified
3. Check timer accuracy and score calculation
4. Test difficulty mode transitions