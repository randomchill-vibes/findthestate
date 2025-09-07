# Find the State 🗺️

An interactive geography game where players identify all 50 US states on an accurate map.

## Features

- **Accurate USA Map**: High-quality SVG map with proper state boundaries
- **Customizable Difficulty**: 
  - Easy mode (1 point per state) - found states stay highlighted
  - Hard mode (2 points per state) - found states return to normal
- **Optional Timer**: Track your completion time for speed challenges
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Smooth animations without distracting movements

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd find-the-state
   ```

2. **Start a local server** (required for SVG loading):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npm run serve
   
   # Using VS Code Live Server extension
   # Right-click on public/index.html > "Open with Live Server"
   ```

3. **Open your browser** to `http://localhost:8000/public/`

## File Structure

```
find-the-state/
├── public/
│   └── index.html          # Main game page
├── src/
│   ├── css/
│   │   └── styles.css      # Game styling
│   ├── js/
│   │   ├── game.js         # Game logic and state management
│   │   ├── states-data.js  # US states data
│   │   └── usa-map.js      # SVG map loading and interaction
│   └── assets/
│       └── us.svg          # USA map with state boundaries
├── package.json            # Project configuration
└── README.md              # This file
```

## Game Rules

1. **Start**: Click "Start Game" to begin
2. **Settings**: 
   - Toggle timer ON/OFF
   - Toggle "Highlight Found" for difficulty
3. **Gameplay**: Click on the state shown at the top of the screen
4. **Scoring**: 
   - Easy mode: 1 point per correct first attempt (max 50)
   - Hard mode: 2 points per correct first attempt (max 100)
5. **Multiple attempts**: You can keep trying until you find the right state

## Technical Details

- **No build process**: Pure HTML, CSS, and JavaScript
- **Local server required**: Due to CORS restrictions when loading SVG files
- **Responsive**: CSS Grid and Flexbox layouts adapt to screen size
- **Performance optimized**: Efficient event handling and animations

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Credits

- USA map data from [SimpleMaps](https://simplemaps.com) (MIT License)
- Built with vanilla JavaScript for maximum compatibility
- Created with [Claude Code](https://claude.ai/code)

## License

MIT License - Feel free to use and modify for educational purposes.
