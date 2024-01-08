<template>
  <transition :duration="5000">
    <teleport
      v-if="wrapperActive"
      :to="mappedOptions.teleport?.target"
      :disabled="mappedOptions.teleport?.disabled"
    >
      <component
        :is="mappedOptions.tag"
        ref="drawer"
        class="magic-drawer"
        :id="toValue(id)"
        :class="[toValue(props.class), `-${mappedOptions.position}`]"
        @click.self="close"
        aria-modal="true"
      >
        <transition
          v-if="mappedOptions.backdrop || !!$slots.backdrop"
          :name="mappedOptions.transitions?.backdrop"
        >
          <div
            v-show="innerActive"
            class="magic-drawer__backdrop"
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
            ref="elRef"
            v-show="innerActive"
            class="magic-drawer__content"
            @pointerdown="onPointerdown"
            :style="style"
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
      </component>
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
import { createDefu } from 'defu'
import { onKeyStroke } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useDrawerApi } from './../composables/useDrawerApi'
import { useDrawerCallback } from '../composables/private/useDrawerCallback'
import { useDrawerDrag } from '../composables/private/useDrawerDrag'

import type { DrawerOptions } from './../types/index'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-ltr-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-rtl-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-ttb-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-btt-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-ltr-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-rtl-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-ttb-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-btt-out.css'

// Prevent keys array from being merged with default
const customDefu = createDefu((obj, key, value) => {
  if (key === 'keys') {
    obj[key] = value
    return true
  }
})

interface MagicDrawerProps {
  id: MaybeRef<string>
  class?: MaybeRef<string>
  component?: Component
  props?: Record<string, unknown>
  options?: DrawerOptions
}

const props = withDefaults(defineProps<MagicDrawerProps>(), {
  options: () => defaultOptions,
})

const elRef = ref<HTMLDivElement | undefined>(undefined)
const drawer = ref<HTMLElement | undefined>(undefined)
const drawerApi = useDrawerApi(props.id, { focusTarget: drawer })
const mappedOptions = customDefu(props.options, defaultOptions)

const {
  isActive,
  close,
  trapFocus,
  releaseFocus,
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
} = drawerApi

const { onPointerdown, style } = useDrawerDrag({
  position: mappedOptions.position,
  threshold: 200,
  elRef,
  close,
})

// Split isActive into two values to animate drawer smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useDrawerCallback({
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

if (mappedOptions.keys) {
  for (const key of mappedOptions.keys) {
    onKeyStroke(key, (e) => {
      e.preventDefault()
      close()
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
</script>

<style>
:root {
  --magic-drawer-z-index: 999;
  --magic-drawer-justify-content: center;
  --magic-drawer-align-items: flex-end;
  --magic-drawer-backdrop-color: rgba(0, 0, 0, 0.5);
  --magic-drawer-backdrop-filter: unset;
  --magic-drawer-content-overflow-y: auto;
  --magic-drawer-handle-wrapper-height: 2rem;
  --magic-drawer-handle-width: 3rem;
  --magic-drawer-handle-height: 0.375rem;
  --magic-drawer-handle-color: rgb(212 212 216 / 1);
  --magic-drawer-handle-border-radius: 0.25rem;
  --magic-drawer-enter-animation: slide-btt-in 300ms ease;
  --magic-drawer-leave-animation: slide-btt-out 300ms ease;
}

.magic-drawer {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: var(--magic-drawer-justify-content);
  align-items: var(--magic-drawer-align-items);
  z-index: var(--magic-drawer-z-index);
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-drawer.-top {
  --magic-drawer-enter-animation: slide-ttb-in 300ms ease;
  --magic-drawer-leave-animation: slide-ttb-out 300ms ease;
  --magic-drawer-align-items: flex-start;
}

.magic-drawer.-right {
  --magic-drawer-enter-animation: slide-rtl-in 300ms ease;
  --magic-drawer-leave-animation: slide-rtl-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-end;
}

.magic-drawer.-left {
  --magic-drawer-enter-animation: slide-ltr-in 300ms ease;
  --magic-drawer-leave-animation: slide-ltr-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-start;
}

.magic-drawer .magic-drawer__content {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  max-height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: var(--magic-drawer-align-items);
  justify-content: var(--magic-drawer-justify-content);
  overflow-y: var(--magic-drawer-content-overflow-y);
}

.magic-drawer__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: var(--magic-drawer-backdrop-color);
  backdrop-filter: var(--magic-drawer-backdrop-filter);
  z-index: -1;
}

/* Content */
.magic-drawer--content-enter-active {
  animation: var(--magic-drawer-enter-animation);
}

.magic-drawer--content-leave-active {
  animation: var(--magic-drawer-leave-animation);
}

/* Backdrop */
.magic-drawer--backdrop-enter-active {
  animation: fade-in 300ms ease;
}

.magic-drawer--backdrop-leave-active {
  animation: fade-out 300ms ease;
}
</style>
