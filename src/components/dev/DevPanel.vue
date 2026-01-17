<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { settings } from '@/config/settings'

const gameStore = useGameStore()
const {
  currentRound,
  totalRounds,
  gameStatus,
  errorsThisRound,
  alices,
  grid,
  selectedTiles,
  foundGroups
} = storeToRefs(gameStore)

// Panel state
const isCollapsed = ref(false)

// Local settings overrides (reactive copy)
const localSettings = reactive({
  enableAnimations: settings.enableAnimations,
  animationSpeed: settings.animationSpeed,
  showAllGroupings: settings.showAllGroupings
})

// Computed for display
const stateSnapshot = computed(() => ({
  round: `${currentRound.value}/${totalRounds.value}`,
  status: gameStatus.value,
  errors: errorsThisRound.value,
  selected: selectedTiles.value.length,
  found: foundGroups.value.length,
  alices: alices.value.length,
  gridSize: grid.value.length
}))

function togglePanel() {
  isCollapsed.value = !isCollapsed.value
}

function handleSkipToRound(roundNum) {
  gameStore.skipToRound(roundNum)
}

function handleResetGame() {
  gameStore.resetGame()
}

function handleClearSelection() {
  gameStore.clearSelection()
}

// Sync local settings back to global (for dev testing)
function updateSetting(key, value) {
  localSettings[key] = value
  settings[key] = value
}
</script>

<template>
  <div
    class="dev-panel"
    :class="{ 'dev-panel--collapsed': isCollapsed }"
  >
    <button
      class="dev-panel__toggle"
      @click="togglePanel"
    >
      {{ isCollapsed ? 'DEV' : '×' }}
    </button>

    <div v-if="!isCollapsed" class="dev-panel__content">
      <h4 class="dev-panel__title">Dev Panel</h4>

      <!-- State Display -->
      <div class="dev-panel__section">
        <h5 class="dev-panel__section-title">State</h5>
        <ul class="dev-panel__list">
          <li v-for="(value, key) in stateSnapshot" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="dev-panel__section">
        <h5 class="dev-panel__section-title">Actions</h5>
        <div class="dev-panel__actions">
          <button
            v-for="round in totalRounds"
            :key="round"
            class="dev-panel__btn dev-panel__btn--small"
            :disabled="round === currentRound"
            @click="handleSkipToRound(round)"
          >
            R{{ round }}
          </button>
        </div>
        <div class="dev-panel__actions">
          <button class="dev-panel__btn" @click="handleResetGame">
            Reset
          </button>
          <button class="dev-panel__btn" @click="handleClearSelection">
            Clear Sel
          </button>
        </div>
      </div>

      <!-- Settings Toggles -->
      <div class="dev-panel__section">
        <h5 class="dev-panel__section-title">Settings</h5>
        <label class="dev-panel__toggle-row">
          <input
            type="checkbox"
            :checked="localSettings.enableAnimations"
            @change="updateSetting('enableAnimations', $event.target.checked)"
          />
          Animations
        </label>
        <label class="dev-panel__toggle-row">
          <input
            type="checkbox"
            :checked="localSettings.showAllGroupings"
            @change="updateSetting('showAllGroupings', $event.target.checked)"
          />
          Show Answers
        </label>
        <label class="dev-panel__toggle-row">
          Speed:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.5"
            :value="localSettings.animationSpeed"
            @input="updateSetting('animationSpeed', parseFloat($event.target.value))"
          />
          {{ localSettings.animationSpeed }}x
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dev-panel {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  background-color: #1a1a2e;
  color: #e0e0e0;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 11px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  max-width: 240px;
}

.dev-panel--collapsed {
  max-width: auto;
}

.dev-panel__toggle {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4361ee;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.dev-panel--collapsed .dev-panel__toggle {
  position: static;
  width: 48px;
  height: 32px;
}

.dev-panel__content {
  padding: 32px 12px 12px;
}

.dev-panel__title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #4361ee;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dev-panel__section {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
}

.dev-panel__section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.dev-panel__section-title {
  margin: 0 0 6px;
  font-size: 10px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dev-panel__list {
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1.6;
}

.dev-panel__list strong {
  color: #aaa;
}

.dev-panel__actions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.dev-panel__btn {
  padding: 4px 8px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dev-panel__btn:hover:not(:disabled) {
  background-color: #444;
  border-color: #4361ee;
}

.dev-panel__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dev-panel__btn--small {
  padding: 2px 6px;
  min-width: 28px;
}

.dev-panel__toggle-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  cursor: pointer;
}

.dev-panel__toggle-row input[type="checkbox"] {
  cursor: pointer;
}

.dev-panel__toggle-row input[type="range"] {
  width: 60px;
}
</style>
