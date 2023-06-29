<template>
  <transition :duration="5000">
    <teleport
      v-if="wrapperActive"
      :to="mappedOptions.teleport?.target"
      :disabled="mappedOptions.teleport?.disabled"
    >
      <dialog
        ref="modal"
        class="magic-modal"
        @click.self="close"
        aria-modal="true"
      >
        <transition
          v-if="mappedOptions.backdrop"
          :name="mappedOptions.transitions?.backdrop"
        >
          <div
            v-show="innerActive"
            class="magic-modal__backdrop"
            @click.self="close"
          />
        </transition>
        <transition
          :name="mappedOptions.transitions?.content"
          @after-leave="onAfterLeave"
          @after-enter="onAfterEnter"
        >
          <div
            v-show="innerActive"
            class="magic-modal__content"
            @click.self="close"
          >
            <component
              v-if="component"
              v-bind="componentProps"
              :is="component"
              @close="close"
            />
            <slot v-else />
          </div>
        </transition>
      </dialog>
    </teleport>
  </transition>
</template>

<script lang="ts">
export const defaultOptions: MagicModalProps['options'] = {
  backdrop: true,
  focusTrap: true,
  scrollLock: true,
  teleport: {
    target: 'body',
    disabled: false,
  },
  transitions: {
    content: 'magic-modal--content',
    backdrop: 'magic-modal--backdrop',
  },
}
</script>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useModalApi } from './../composables/useModalApi'
import { onKeyStroke } from '@vueuse/core'
import type { MaybeRef } from '@vueuse/core'
import type { VueElement } from 'vue'

export interface MagicModalProps {
  id: MaybeRef<string>
  component?: VueElement
  componentProps?: Record<string, unknown>
  options?: {
    backdrop?: boolean
    focusTrap?: boolean
    scrollLock?: boolean
    teleport?: {
      target: string
      disabled?: boolean
    }
    transitions?: {
      content?: string
      backdrop?: string
    }
  }
}

const props = withDefaults(defineProps<MagicModalProps>(), {
  options: () => ({ ...defaultOptions }),
})

const modal = ref<HTMLElement | undefined>(undefined)
const modalApi = useModalApi(props.id, { focusTarget: modal })

const mappedOptions = {
  ...defaultOptions,
  ...props.options,
  teleport: { ...defaultOptions.teleport, ...props.options.teleport },
  transitions: { ...defaultOptions.transitions, ...props.options.transitions },
}

const {
  isActive,
  close,
  trapFocus,
  releaseFocus,
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
} = modalApi

// Split isActive into two values to animate modal smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

// Handle state
async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
}

function onClose() {
  innerActive.value = false
}

// Transition Callbacks
async function onAfterEnter() {
  if (mappedOptions.scrollLock) {
    lockScroll()
    addScrollLockPadding()
  }

  if (mappedOptions.focusTrap) {
    await nextTick()
    trapFocus()
  }
}

function onAfterLeave() {
  if (mappedOptions.scrollLock) {
    unlockScroll()
    removeScrollLockPadding()
  }

  if (mappedOptions.focusTrap) {
    releaseFocus()
  }

  wrapperActive.value = false
}

onKeyStroke('Escape', (e) => {
  e.preventDefault()
  close()
})

watch(isActive, async (value) => {
  if (value) {
    await onOpen()
  } else {
    onClose()
  }
})
</script>

<style lang="postcss">
* {
  transition-duration: 0s;
  animation-duration: 0s;
}

.magic-modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-modal__content {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  max-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.magic-modal__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

/* Content */
.magic-modal--content-enter-active,
.magic-modal--content-leave-active {
  transition: all 300ms ease-out;
  @media (prefers-reduced-motion) {
    transition: opacity 300ms ease-out;
  }
}

.magic-modal--content-enter-from {
  opacity: 0;
  transform: translateY(2rem);
  @media (prefers-reduced-motion) {
    transform: none;
  }
}

.magic-modal--content-enter-to {
  opacity: 1;
  transform: translateY(0);
  @media (prefers-reduced-motion) {
    transform: none;
  }
}

.magic-modal--content-leave-from {
  opacity: 1;
  transform: scale(1);
  @media (prefers-reduced-motion) {
    transform: none;
  }
}

.magic-modal--content-leave-to {
  opacity: 0;
  transform: scale(1.02);
  @media (prefers-reduced-motion) {
    transform: none;
  }
}

/* Backdrop */
.magic-modal--backdrop-enter-active,
.magic-modal--backdrop-leave-active {
  transition: opacity 300ms ease-out;
}

.magic-modal--backdrop-enter-from {
  opacity: 0;
}

.magic-modal--backdrop-enter-to {
  opacity: 1;
}

.magic-modal--backdrop-leave-from {
  opacity: 1;
}

.magic-modal--backdrop-leave-to {
  opacity: 0;
}
</style>
