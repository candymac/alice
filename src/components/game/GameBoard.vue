<script setup>
  import { storeToRefs } from 'pinia'
  import { useGameStore } from '@/stores/game'
  import Tile from './Tile.vue'

  const gameStore = useGameStore()
  const { grid, selectedTiles, solvedTiles, tileContentType } = storeToRefs(gameStore)

  /**
   * Check if a tile at given index is selected
   */
  function isSelected(index) {
    return selectedTiles.value.includes(index)
  }

  /**
   * Get the selection order (1-based) for a tile
   */
  function getSelectionOrder(index) {
    const order = selectedTiles.value.indexOf(index)
    return order !== -1 ? order + 1 : null
  }

  /**
   * Get the found color for a solved tile (or null if not solved)
   */
  function getFoundColor(index) {
    return solvedTiles.value[index] ?? null
  }

  /**
   * Handle tile selection
   */
  function handleTileSelect(index) {
    gameStore.selectTile(index)
  }
</script>

<template>
  <div
    class="game-board"
    role="grid"
    aria-label="Game board">
    <!-- Grid lines (graph paper effect) -->
    <div
      class="game-board__line game-board__line--v1"
      aria-hidden="true"></div>
    <div
      class="game-board__line game-board__line--v2"
      aria-hidden="true"></div>
    <div
      class="game-board__line game-board__line--h1"
      aria-hidden="true"></div>
    <div
      class="game-board__line game-board__line--h2"
      aria-hidden="true"></div>

    <Tile
      v-for="(content, index) in grid"
      :key="`${index}-${content}`"
      :content="content"
      :index="index"
      :is-selected="isSelected(index)"
      :selection-order="getSelectionOrder(index)"
      :content-type="tileContentType"
      :found-color="getFoundColor(index)"
      @select="handleTileSelect" />
  </div>
</template>

<style scoped>
  .game-board {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 2px dashed var(--color-border);
  }

  /* Vertical lines at 1/3 and 2/3 */
  .game-board__line--v1,
  .game-board__line--v2 {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: transparent;
    border-left: 2px dashed var(--color-border);
    pointer-events: none;
    z-index: 20;
  }

  .game-board__line--v1 {
    left: calc(100% / 3 - 1px);
  }

  .game-board__line--v2 {
    left: calc(200% / 3 - 1px);
  }

  /* Horizontal lines at 1/3 and 2/3 */
  .game-board__line--h1,
  .game-board__line--h2 {
    position: absolute;
    z-index: 20;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent;
    border-top: 2px dashed var(--color-border);
    pointer-events: none;
  }

  .game-board__line--h1 {
    top: calc(100% / 3 - 1px);
  }

  .game-board__line--h2 {
    top: calc(200% / 3 - 1px);
  }
</style>
