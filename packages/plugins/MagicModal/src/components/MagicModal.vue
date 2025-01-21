<template>
  <teleport
    v-if="wrapperActive"
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <div
      :id="toValue(id)"
      ref="modalRef"
      class="magic-modal"
      v-bind="$attrs"
      aria-modal="true"
      @click.self="close"
    >
      <transition
        v-if="mappedOptions.backdrop || !!$slots.backdrop"
        :name="mappedOptions.transition?.backdrop"
      >
        <div
          v-show="innerActive"
          class="magic-modal__backdrop"
          @click.self="close"
        >
          <slot name="backdrop" />
        </div>
      </transition>
      <transition
        :name="mappedOptions.transition?.content"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
      >
        <component
          :is="mappedOptions.tag"
          v-show="innerActive"
          class="magic-modal__content"
          @click.self="close"
        >
          <component
            v-bind="props"
            :is="component"
            v-if="component"
            @close="close"
          />
          <slot v-else />
        </component>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  nextTick,
  toValue,
  onBeforeUnmount,
  onUnmounted,
  type Component,
  type MaybeRef,
} from 'vue'
import { createDefu } from 'defu'
import { onKeyStroke } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useModalDOM } from '../composables/private/useModalDOM'
import { useModalCallback } from '../composables/private/useModalCallback'
import { useMagicModal } from '../composables/useMagicModal'

import type { MagicModalOptions } from './../types/index'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'

defineOptions({
  inheritAttrs: false,
})

// Prevent keyListener array from being merged with default
const customDefu = createDefu((obj, key, value) => {
  if (key === 'close') {
    obj[key] = value
    return true
  }
})

interface MagicModalProps {
  id: MaybeRef<string>
  component?: Component
  props?: Record<string, unknown>
  options?: MagicModalOptions
}

const props = withDefaults(defineProps<MagicModalProps>(), {
  options: () => defaultOptions,
})

const mappedOptions = customDefu(props.options, defaultOptions)
const modalRef = ref<HTMLElement | undefined>(undefined)
const {
  trapFocus,
  releaseFocus,
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
} = useModalDOM({
  focusTarget: modalRef,
  focusTrap: mappedOptions.focusTrap,
})

const { isActive, close } = useMagicModal(props.id)

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

if (mappedOptions.keyListener?.close) {
  for (const key of mappedOptions.keyListener.close) {
    onKeyStroke(key, (e) => {
      close()
      e.preventDefault()
    })
  }
}

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

onUnmounted(() => {
  if (mappedOptions.scrollLock) {
    unlockScroll()
    if (
      typeof mappedOptions.scrollLock === 'object' &&
      mappedOptions.scrollLock.padding
    ) {
      removeScrollLockPadding()
    }
  }

  if (mappedOptions.focusTrap) {
    releaseFocus()
  }
})
</script>

<style>
@keyframes magic-modal-content-enter {
  0% {
    opacity: 0;
    transform: translate3d(0, 2rem, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes magic-modal-content-leave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.02);
  }
}

.magic-modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--magic-modal-z-index, 999);
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
  align-items: var(--magic-modal-content-align-items, center);
  justify-content: var(--magic-modal-content-justify-content, center);
  overflow-y: var(--magic-modal-content-overflow-y, auto);
}

/* Reset default dialog styles */
dialog.magic-modal__content {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: 0;
}

dialog.magic-modal__content::backdrop {
  background-color: transparent;
}

.magic-modal__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: var(--magic-modal-backdrop-color, rgba(0, 0, 0, 0.5));
  backdrop-filter: var(--magic-modal-backdrop-filter, unset);
  z-index: -1;
}

/* Content */
.magic-modal--content-enter-active {
  animation: magic-modal-content-enter 300ms ease;
}

.magic-modal--content-leave-active {
  animation: magic-modal-content-leave 300ms ease;
}

@media (prefers-reduced-motion) {
  .magic-modal--content-enter-active {
    animation: fade-in 300ms ease;
  }

  .magic-modal--content-leave-active {
    animation: fade-out 300ms ease;
  }
}

/* Backdrop */
.magic-modal--backdrop-enter-active {
  animation: fade-in 300ms ease;
}

.magic-modal--backdrop-leave-active {
  animation: fade-out 300ms ease;
}
</style>
