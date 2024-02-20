<template>
  <teleport
    v-if="wrapperActive"
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <component
      :is="mappedOptions.tag"
      ref="commandRef"
      class="magic-command"
      :id="toValue(id)"
      :class="toValue(props.class)"
      @click.self="close"
      aria-command="true"
    >
      <transition
        v-if="mappedOptions.backdrop || !!$slots.backdrop"
        :name="mappedOptions.transitions?.backdrop"
      >
        <div
          v-show="innerActive"
          class="magic-command__backdrop"
          @click.self="close"
        >
          <slot name="backdrop" />
        </div>
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
          class="magic-command__content"
          @click.self="close"
        >
          <slot />
        </div>
      </transition>
    </component>
  </teleport>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  toValue,
  onBeforeUnmount,
  provide,
  type MaybeRef,
} from 'vue'
import { createDefu } from 'defu'
import { onKeyStroke, useMagicKeys } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useCommandApi } from './../composables/useCommandApi'
import { useCommandItem } from './../composables/private/useCommandItem'
import { useCommandCallback } from '../composables/private/useCommandCallback'
import { CommandInstanceId } from './../symbols'

import type { CommandOptions } from './../types/index'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'

// Prevent keys arrays from being merged with default
const customDefu = createDefu((obj, key, value) => {
  if (key === 'open' || key === 'close') {
    obj[key] = value
    return true
  }
})

interface MagicCommandProps {
  id: MaybeRef<string>
  class?: MaybeRef<string>
  props?: Record<string, unknown>
  options?: CommandOptions
}

const props = withDefaults(defineProps<MagicCommandProps>(), {
  options: () => defaultOptions,
})

const keys = useMagicKeys()
const commandRef = ref<HTMLElement | undefined>(undefined)
const commandApi = useCommandApi(props.id, { focusTarget: commandRef })
const mappedOptions = customDefu(props.options, defaultOptions)

const {
  isActive,
  open,
  close,
  trapFocus,
  releaseFocus,
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
} = commandApi

// Split isActive into two values to animate command smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useCommandCallback({
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

const { nextItem, prevItem } = useCommandItem(props.id)

// Handle state
async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
}

function onClose() {
  innerActive.value = false
}

if (mappedOptions.keys?.open) {
  for (const key of mappedOptions.keys.open) {
    const mappedKey = keys[key]
    watch(mappedKey, (keypress) => {
      if (keypress) {
        open()
      }
    })
  }
}

if (mappedOptions.keys?.close) {
  for (const key of mappedOptions.keys.close) {
    const mappedKey = keys[key]
    watch(mappedKey, (keypress) => {
      if (keypress) {
        close()
      }
    })
  }
}

// Select items with arrow keys
onKeyStroke(['ArrowRight', 'ArrowDown'], (e) => {
  e.preventDefault()
  nextItem()
})

onKeyStroke(['ArrowLeft', 'ArrowUp'], (e) => {
  e.preventDefault()
  prevItem()
})

watch(isActive, async (value) => {
  if (value) {
    await onOpen()
  } else {
    onClose()
  }
})

// Reset state on unmount
onBeforeUnmount(() => {
  close()
})

provide(CommandInstanceId, props.id)
</script>

<style>
:root {
  --magic-command-z-index: 999;
  --magic-command-backdrop-color: rgba(0, 0, 0, 0.5);
  --magic-command-backdrop-filter: unset;
  --magic-command-content-align-items: center;
  --magic-command-content-justify-content: center;
  --magic-command-content-overflow-y: auto;
}

@keyframes magic-command-content-enter {
  0% {
    opacity: 0;
    transform: translateY(2rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes magic-command-content-leave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.02);
  }
}

.magic-command {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--magic-command-z-index);
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-command__content {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  max-height: 100%;
  width: 100%;
  display: flex;
  align-items: var(--magic-command-content-align-items);
  justify-content: var(--magic-command-content-justify-content);
  overflow-y: var(--magic-command-content-overflow-y);
}

.magic-command__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: var(--magic-command-backdrop-color);
  backdrop-filter: var(--magic-command-backdrop-filter);
  z-index: -1;
}

/* Content */
.magic-command--content-enter-active {
  animation: magic-command-content-enter 300ms ease;
}

.magic-command--content-leave-active {
  animation: magic-command-content-leave 300ms ease;
}

@media (prefers-reduced-motion) {
  .magic-command--content-enter-active {
    animation: fade-in 300ms ease;
  }

  .magic-command--content-leave-active {
    animation: fade-out 300ms ease;
  }
}

/* Backdrop */
.magic-command--backdrop-enter-active {
  animation: fade-in 300ms ease;
}

.magic-command--backdrop-leave-active {
  animation: fade-out 300ms ease;
}
</style>
