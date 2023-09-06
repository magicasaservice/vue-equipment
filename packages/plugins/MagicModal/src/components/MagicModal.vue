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
        :id="toValue(id)"
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
          @before-leave="onBeforeLeave"
          @leave="onLeave"
          @after-leave="onAfterLeave"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @after-enter="onAfterEnter"
        >
          <div
            v-show="innerActive"
            class="magic-modal__content"
            @click.self="close"
          >
            <component
              v-if="component"
              v-bind="props"
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

<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  toValue,
  type Component,
  type MaybeRef,
} from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { defu } from 'defu'
import { defaultOptions } from './../utils/defaultOptions'
import { useModalApi } from './../composables/useModalApi'
import { useModalCallback } from '../composables/private/useModalCallback'

import type { Options } from './../types/index'

interface MagicModalProps {
  id: MaybeRef<string>
  component?: Component
  props?: Record<string, unknown>
  options?: Options
}

const props = withDefaults(defineProps<MagicModalProps>(), {
  options: () => defaultOptions,
})

const modal = ref<HTMLElement | undefined>(undefined)
const modalApi = useModalApi(props.id, { focusTarget: modal })
const mappedOptions = defu(props.options, defaultOptions)

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

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useModalCallback({
  id: props.id,
  mappedOptions,
  addScrollLockPadding,
  removeScrollLockPadding,
  lockScroll,
  unlockScroll,
  trapFocus,
  releaseFocus,
  wrapperActive,
})

// Handle state
async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
}

function onClose() {
  innerActive.value = false
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
:root {
  --magic-modal-z-index: 999;
  --magic-modal-backdrop-color: rgba(0, 0, 0, 0.5);
  --magic-modal-backdrop-filter: unset;
}

.magic-modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--magic-modal-z-index);
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
  background-color: var(--magic-modal-backdrop-color);
  backdrop-filter: var(--magic-modal-backdrop-filter);
  z-index: -1;
}

/* Content */
.magic-modal--content-enter-active,
.magic-modal--content-leave-active {
  transition: all 300ms ease-out;
}

.magic-modal--content-enter-from {
  opacity: 0;
  transform: translateY(2rem);
}

.magic-modal--content-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.magic-modal--content-leave-from {
  opacity: 1;
  transform: scale(1);
}

.magic-modal--content-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@media (prefers-reduced-motion) {
  .magic-modal--content-enter-active,
  .magic-modal--content-leave-active {
    transition: opacity 300ms ease-out;
  }

  .magic-modal--content-enter-from,
  .magic-modal--content-enter-to,
  .magic-modal--content-leave-from,
  .magic-modal--content-leave-to {
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
