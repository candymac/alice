# Alice

A daily word puzzle game built with Vue 3. Players solve multi-round puzzles by finding word groupings on a 3×3 grid, collecting "Alice" words that form a final phrase.

## Game Concept

Each puzzle consists of multiple rounds. In each round:
1. A 3×3 grid displays 9 words/tiles
2. Players select tiles in sequence to form valid groupings
3. Find all groupings to reveal the round's "Alice" word
4. Complete all rounds to see the final phrase from collected Alices
5. Three mistakes per round allowed before game over

### Puzzle Types

- **Sounds Like** - Combine words that sound like another word (PAN + CAKE = Pancake)
- **Phrase Builder** - Build common phrases or idioms
- **Compound Words** - Create compound words from parts
- **Categories** - Group words by category
- **Visual Match** - Match images (planned)
- **Mixed Media** - Combine text and images (planned)

## Tech Stack

- **Vue 3** - Frontend framework
- **Pinia** - State management
- **Vue Router** - SPA routing
- **GSAP** - Animations
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── game/           # Game components (GameBoard, Tile, etc.)
│   ├── layout/         # Header, Footer
│   ├── ui/             # Tooltip, modals
│   └── dev/            # DevPanel (debug mode only)
├── views/              # HomeView, AboutView
├── stores/             # Pinia game store
├── data/               # Puzzle data and type definitions
├── config/             # Settings and constants
├── composables/        # useLocalStorage
├── router/             # Vue Router config
└── assets/styles/      # Tailwind CSS
```

## Development

### Debug Panel

In development mode (`npm run dev`), a debug panel appears in the bottom-right corner:
- View current game state
- Jump to any round
- Reset the game
- Toggle animations
- Adjust animation speed

### Adding Puzzles

Edit `src/data/puzzles.json`:

```json
{
  "2025-01-20": {
    "rounds": [
      {
        "type": "sounds-like",
        "theme": "BREAKFAST",
        "grid": ["PAN", "CAKE", "EGG", "NOG", "POUR", "RIDGE", "SAND", "WICH", "BELL"],
        "groupings": [
          { "words": ["PAN", "CAKE"], "result": "Pancake" },
          { "words": ["EGG", "NOG"], "result": "Eggnog" },
          { "words": ["POUR", "RIDGE"], "result": "Porridge" },
          { "words": ["SAND", "WICH"], "result": "Sandwich" }
        ],
        "alice": "BELL",
        "groupsToFind": 4
      }
    ],
    "finalPhrase": "BELL RINGS"
  }
}
```

### Configuration

Settings in `src/config/settings.js`:

| Setting | Default | Description |
|---------|---------|-------------|
| `enableLocalStorage` | `true` | Persist game state |
| `errorsPerRound` | `3` | Mistakes allowed per round |
| `debugMode` | `DEV` | Show debug panel |
| `enableAnimations` | `true` | GSAP animations |
| `animationSpeed` | `1` | Animation speed multiplier |

## Status

This is a work-in-progress. Core gameplay is functional:

**Working:**
- Multi-round puzzle system
- Tile selection and grouping validation
- Error tracking and game over states
- Alice collection and final phrase reveal
- GSAP animations (shake, pulse, transitions)
- LocalStorage composable
- Debug panel

**In Progress:**
- Full localStorage restoration on reload
- Stats tracking UI
- Dark mode
- Sound effects
- Image/visual tile support
