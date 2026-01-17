# Claude Code Context

## Project Overview

Alice is a daily word puzzle game where players find word groupings on a 3×3 grid across multiple rounds. Each solved round reveals an "Alice" word; completing all rounds reveals a final phrase from collected Alices.

## Architecture

### State Management

The Pinia store at [game.js](src/stores/game.js) is the central game logic:

**Key State:**
- `currentPuzzle` - Loaded puzzle data
- `currentRound` - 1-indexed round number
- `grid` - 9 tile contents
- `selectedTiles` - Indices selected in order
- `foundGroups` - Solved groups with colors
- `alices` - Collected Alice words
- `errorsThisRound` / `errorsPerRound` - Error tracking
- `gameStatus` - 'playing' | 'round-complete' | 'game-won' | 'game-lost'

**Key Actions:**
- `loadPuzzle(puzzleData, date)` - Initialize game
- `selectTile(index)` - Add/remove from selection
- `submitGroup()` - Validate selection against groupings
- `nextRound()` - Advance after round complete

### Puzzle Data

Puzzles live in [puzzles.json](src/data/puzzles.json), keyed by date:

```json
{
  "YYYY-MM-DD": {
    "rounds": [{
      "type": "sounds-like",
      "theme": "BREAKFAST",
      "grid": ["9 words"],
      "groupings": [{ "words": ["W1", "W2"], "result": "Combined" }],
      "alice": "LEFTOVER",
      "groupsToFind": 4
    }],
    "finalPhrase": "COLLECTED ALICES"
  }
}
```

Puzzle types defined in [puzzleTypes.js](src/data/puzzleTypes.js).

### Components

**Game Components** in [src/components/game/](src/components/game/):
- `GameBoard.vue` - 3×3 grid container, coordinates animations
- `Tile.vue` - Individual tile with GSAP animations (shake, pulse)
- `FoundGroups.vue` - Shows solved groups with colors
- `AliceSlots.vue` - Progress display for collected Alices
- `ErrorIndicator.vue` - Remaining mistakes dots

**Layout** in [src/components/layout/](src/components/layout/):
- `Header.vue` - Title, round counter, help button
- `Footer.vue` - Minimal footer

### Configuration

[settings.js](src/config/settings.js) controls:
- `enableLocalStorage` - Persistence toggle
- `errorsPerRound` - Default 3
- `debugMode` - Auto-true in dev
- `enableAnimations` / `animationSpeed` - GSAP controls

Group colors also defined here (blue, green, purple, orange).

### LocalStorage

Composable at [useLocalStorage.js](src/composables/useLocalStorage.js):
- `saveCurrentGame()` / `loadCurrentGame()` - Game state persistence
- `getStats()` / `updateStats()` - Player statistics
- Respects `settings.enableLocalStorage`

## Styling

Tailwind CSS v4 with custom theme in [main.css](src/assets/styles/main.css):
- CSS custom properties for colors (--color-*)
- Group colors: blue, green, purple, orange with bg variants
- Responsive with mobile-first approach

## Development

- `npm run dev` starts dev server with debug panel
- Debug panel (bottom-right) shows state, allows round skipping
- Today's date loads puzzle; falls back to first available in dev

## Current TODOs

1. **localStorage restoration** - HomeView has scaffolded but incomplete restore logic (~line 50)
2. **Stats UI** - Composable exists, no display component
3. **Dark mode** - Setting exists, not implemented
4. **Sound** - Setting exists, not implemented
5. **Visual tiles** - Type defined, no image support yet

## Game Flow

1. Load puzzle by date → `loadPuzzle()`
2. Player clicks tiles → `selectTile()` adds to `selectedTiles`
3. Player submits → `submitGroup()` checks against `groupings`
   - Match: tiles removed, group added to `foundGroups`
   - No match: error incremented, shake animation
4. All groups found → round complete, Alice revealed
5. `nextRound()` loads next round
6. All rounds done → game won, `finalPhrase` shown
