<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { settings } from '@/config/settings'

const props = defineProps({
  /** The content to display (text or image URL) */
  content: {
    type: String,
    required: true
  },
  /** The tile index in the grid */
  index: {
    type: Number,
    required: true
  },
  /** Whether this tile is currently selected */
  isSelected: {
    type: Boolean,
    default: false
  },
  /** Selection order (1-based) if selected */
  selectionOrder: {
    type: Number,
    default: null
  },
  /** Content type: 'text' | 'image' */
  contentType: {
    type: String,
    default: 'text'
  },
  /** If tile is part of a found group, which color (1-4) */
  foundColor: {
    type: Number,
    default: null
  },
  /** Whether the tile is disabled */
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const tileRef = ref(null)

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

  // GSAP animation on click (proves GSAP works)
  if (settings.enableAnimations && tileRef.value) {
    const duration = 0.15 / settings.animationSpeed

    gsap.to(tileRef.value, {
      scale: 1.1,
      duration: duration,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
  }
}

// Subtle hover animation with GSAP
function handleMouseEnter() {
  if (props.disabled || props.foundColor || !settings.enableAnimations) return

  if (tileRef.value) {
    gsap.to(tileRef.value, {
      scale: 1.02,
      duration: 0.1 / settings.animationSpeed,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave() {
  if (props.disabled || props.foundColor || !settings.enableAnimations) return

  if (tileRef.value) {
    gsap.to(tileRef.value, {
      scale: 1,
      duration: 0.1 / settings.animationSpeed,
      ease: 'power2.out'
    })
  }
}

/**
 * Public method: trigger shake animation (for wrong guess)
 */
function shake() {
  if (!settings.enableAnimations || !tileRef.value) return

  const duration = 0.4 / settings.animationSpeed

  gsap.to(tileRef.value, {
    x: [-4, 4, -4, 4, 0],
    duration: duration,
    ease: 'power2.inOut'
  })
}

/**
 * Public method: trigger pulse animation (for correct guess)
 */
function pulse() {
  if (!settings.enableAnimations || !tileRef.value) return

  const duration = 0.3 / settings.animationSpeed

  gsap.to(tileRef.value, {
    scale: [1, 1.1, 1],
    duration: duration,
    ease: 'power2.inOut'
  })
}

// Expose methods for parent components
defineExpose({ shake, pulse })
</script>

<template>
  <button
    ref="tileRef"
    :class="tileClasses"
    :disabled="disabled || !!foundColor"
    :aria-pressed="isSelected"
    :aria-label="`Tile ${index + 1}: ${content}`"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Text content -->
    <span v-if="contentType === 'text'" class="tile__text">
      {{ content }}
    </span>

    <!-- Image content (future) -->
    <img
      v-else-if="contentType === 'image'"
      :src="content"
      :alt="`Tile ${index + 1}`"
      class="tile__image"
    />

    <!-- Selection order badge -->
    <span
      v-if="isSelected && selectionOrder"
      class="tile__order"
    >
      {{ selectionOrder }}
    </span>
  </button>
</template>

<style scoped>
.tile {
  position: relative;
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

.tile--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
