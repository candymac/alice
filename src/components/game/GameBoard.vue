<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import Tile from './Tile.vue'

const gameStore = useGameStore()
const { grid, selectedTiles, tileContentType } = storeToRefs(gameStore)

// Refs to tile components for animations
const tileRefs = ref([])

const setTileRef = (el, index) => {
  if (el) {
    tileRefs.value[index] = el
  }
}

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
 * Handle tile selection
 */
function handleTileSelect(index) {
  gameStore.selectTile(index)
}

/**
 * Public: shake all selected tiles (for wrong guess)
 */
function shakeSelected() {
  selectedTiles.value.forEach(index => {
    const tile = tileRefs.value[index]
    if (tile?.shake) {
      tile.shake()
    }
  })
}

/**
 * Public: pulse tiles (for correct guess)
 */
function pulseTiles(indices) {
  indices.forEach(index => {
    const tile = tileRefs.value[index]
    if (tile?.pulse) {
      tile.pulse()
    }
  })
}

defineExpose({ shakeSelected, pulseTiles })
</script>

<template>
  <div class="game-board" role="grid" aria-label="Game board">
    <Tile
      v-for="(content, index) in grid"
      :key="`${index}-${content}`"
      :ref="(el) => setTileRef(el, index)"
      :content="content"
      :index="index"
      :is-selected="isSelected(index)"
      :selection-order="getSelectionOrder(index)"
      :content-type="tileContentType"
      @select="handleTileSelect"
    />
  </div>
</template>

<style scoped>
/* Board styles are in main.css */
</style>
