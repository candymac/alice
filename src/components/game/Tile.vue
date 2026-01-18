<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    /** The content to display (text or image URL) */
    content: {
      type: String,
      required: true,
    },
    /** The tile index in the grid */
    index: {
      type: Number,
      required: true,
    },
    /** Whether this tile is currently selected */
    isSelected: {
      type: Boolean,
      default: false,
    },
    /** Selection order (1-based) if selected */
    selectionOrder: {
      type: Number,
      default: null,
    },
    /** Content type: 'text' | 'image' */
    contentType: {
      type: String,
      default: 'text',
    },
    /** If tile is part of a found group, which color (1-4) */
    foundColor: {
      type: Number,
      default: null,
    },
    /** Whether the tile is disabled */
    disabled: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['select'])

  const tileClasses = computed(() => {
    const classes = ['tile']

    if (props.isSelected) {
      classes.push('tile--selected')
    }

    if (props.foundColor) {
      classes.push('tile--found', `tile--found-${props.foundColor}`)
    }

    if (props.disabled) {
      classes.push('tile--disabled')
    }

    return classes
  })

  function handleClick() {
    if (props.disabled || props.foundColor) return
    emit('select', props.index)
  }
</script>

<template>
  <button
    :class="tileClasses"
    :disabled="disabled || !!foundColor"
    :aria-pressed="isSelected"
    :aria-label="`Tile ${index + 1}: ${content}`"
    @click="handleClick">
    <!-- Text content -->
    <span
      v-if="contentType === 'text'"
      class="tile__text">
      {{ content }}
    </span>

    <!-- Image content (future) -->
    <img
      v-else-if="contentType === 'image'"
      :src="content"
      :alt="`Tile ${index + 1}`"
      class="tile__image" />

    <!-- Selection order badge -->
    <span
      v-if="isSelected && selectionOrder"
      class="tile__order">
      {{ selectionOrder }}
    </span>
  </button>
</template>

<style scoped>
  .tile {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    background-color: var(--color-surface);
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: background-color 0.15s ease;
    user-select: none;
  }

  .tile:hover:not(:disabled):not(.tile--selected) {
    background-color: var(--color-highlight);
  }

  .tile--selected {
    background-color: var(--color-accent);
    color: white;
  }

  .tile--found {
    pointer-events: none;
    cursor: default;
    opacity: 0.85;
  }

  .tile--found-1 {
    background-color: var(--color-group-blue-bg);
    color: var(--color-group-blue);
  }

  .tile--found-2 {
    background-color: var(--color-group-green-bg);
    color: var(--color-group-green);
  }

  .tile--found-3 {
    background-color: var(--color-group-purple-bg);
    color: var(--color-group-purple);
  }

  .tile--found-4 {
    background-color: var(--color-group-orange-bg);
    color: var(--color-group-orange);
  }

  .tile--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tile__text {
    pointer-events: none;
  }

  .tile__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: calc(var(--radius-tile) - 2px);
    pointer-events: none;
  }

  .tile__order {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-accent);
  }
</style>
