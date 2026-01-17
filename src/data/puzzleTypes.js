/**
 * Puzzle Type Definitions
 *
 * Each puzzle type defines:
 * - id: unique identifier (matches 'type' field in puzzle data)
 * - name: display name
 * - description: longer explanation of the puzzle type
 * - instructions: what to show the player
 * - tileContentType: 'text' | 'image' | 'mixed'
 * - example: optional example for the tooltip
 */
export const puzzleTypes = {
  'sounds-like': {
    id: 'sounds-like',
    name: 'Sounds Like',
    description: 'Combine tiles that sound like a word when spoken together',
    instructions: 'Select tiles in order that sound like a word when combined (e.g., PAN + CAKE = Pancake)',
    tileContentType: 'text',
    example: {
      tiles: ['PAN', 'CAKE'],
      result: 'Pancake'
    }
  },

  'phrases': {
    id: 'phrases',
    name: 'Phrase Builder',
    description: 'Combine tiles to form common phrases or expressions',
    instructions: 'Select tiles that form a common phrase or saying',
    tileContentType: 'text',
    example: {
      tiles: ['BREAK', 'THE', 'ICE'],
      result: 'Break the ice'
    }
  },

  'compound-words': {
    id: 'compound-words',
    name: 'Compound Words',
    description: 'Combine tiles to form compound words',
    instructions: 'Select tiles that combine into a compound word',
    tileContentType: 'text',
    example: {
      tiles: ['SUN', 'FLOWER'],
      result: 'Sunflower'
    }
  },

  'categories': {
    id: 'categories',
    name: 'Categories',
    description: 'Group items that belong to the same category',
    instructions: 'Select items that share a common category',
    tileContentType: 'text',
    example: {
      tiles: ['APPLE', 'BANANA', 'ORANGE'],
      result: 'Fruits'
    }
  },

  'visual': {
    id: 'visual',
    name: 'Visual Match',
    description: 'Match images that belong together',
    instructions: 'Select images that form a group or sequence',
    tileContentType: 'image',
    example: null
  },

  'mixed': {
    id: 'mixed',
    name: 'Mixed Media',
    description: 'Combine text and images',
    instructions: 'Match text with corresponding images',
    tileContentType: 'mixed',
    example: null
  }
}

/**
 * Get puzzle type configuration by ID
 * @param {string} typeId - The puzzle type ID
 * @returns {Object|null} - The puzzle type config or null
 */
export function getPuzzleType(typeId) {
  return puzzleTypes[typeId] ?? null
}

/**
 * Get instructions for a puzzle type
 * @param {string} typeId - The puzzle type ID
 * @returns {string} - Instructions text
 */
export function getInstructions(typeId) {
  return puzzleTypes[typeId]?.instructions ?? 'Select tiles to form groups'
}
