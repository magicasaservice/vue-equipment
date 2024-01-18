<template>
  <transition :duration="5000">
    <teleport
      v-if="wrapperActive"
      :to="mappedOptions.teleport?.target"
      :disabled="mappedOptions.teleport?.disabled"
    >
      <component
        :is="mappedOptions.tag"
        ref="drawerRef"
        class="magic-drawer"
        :id="toValue(id)"
        :class="[
          toValue(props.class),
          `-${mappedOptions.position}`,
          { '-dragging': dragging },
        ]"
        aria-modal="true"
      >
        <transition
          v-if="mappedOptions.backdrop || !!$slots.backdrop"
          :name="backdropTransition"
        >
          <div
            v-show="innerActive"
            class="magic-drawer__backdrop"
            @click.self="closeIfAllowed"
          >
            <slot name="backdrop" />
          </div>
        </transition>

        <div class="magic-drawer__wrapper" ref="wrapperRef">
          <transition
            :name="contentTransition"
            @before-leave="onBeforeLeave"
            @leave="onLeave"
            @after-leave="onAfterLeave"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @after-enter="onAfterEnter"
          >
            <div v-show="innerActive" class="magic-drawer__content">
              <div
                ref="elRef"
                class="magic-drawer__drag"
                :style="style"
                @pointerdown="onPointerdown"
              >
                <component
                  v-if="component"
                  v-bind="props"
                  :is="component"
                  @close="closeIfAllowed"
                />
                <slot v-else />
              </div>
            </div>
          </transition>
        </div>
      </component>
    </teleport>
  </transition>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  nextTick,
  toValue,
  onBeforeMount,
  onBeforeUnmount,
  type Component,
  type MaybeRef,
} from 'vue'
import { createDefu } from 'defu'
import { onKeyStroke, unrefElement } from '@vueuse/core'
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

// Prevent deep merge of certain options
const customDefu = createDefu((obj, key, value) => {
  if (key === 'keys' || key === 'snapPoints') {
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
const drawerRef = ref<HTMLElement | undefined>(undefined)
const wrapperRef = ref<HTMLDivElement | undefined>(undefined)
const drawerApi = useDrawerApi(props.id, { focusTarget: drawerRef })

const mappedOptions: typeof defaultOptions = customDefu(
  props.options,
  defaultOptions
)

const overshoot = ref(0)
const { position, threshold, snapPoints, snapPoint, canClose } = mappedOptions

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
} = drawerApi

const { onPointerdown, dragging, style } = useDrawerDrag({
  id: props.id,
  elRef,
  wrapperRef,
  position,
  threshold,
  overshoot,
  snapPoints,
  snapPoint,
  canClose,
  close,
})

// Split isActive into two values to animate drawer smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)
const wasActive = ref(false)

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
  wasActive,
})

// Surpress animation on initial mount if the options call for it
// To achive this, the transition names are set to undefined
const surpressTransition = computed(() => {
  return (
    mappedOptions.beforeMount.open &&
    !mappedOptions.beforeMount.animate &&
    !wasActive.value
  )
})

const backdropTransition = computed(() => {
  return surpressTransition.value
    ? undefined
    : mappedOptions.transitions?.backdrop
})

const contentTransition = computed(() => {
  return surpressTransition.value
    ? undefined
    : mappedOptions.transitions?.content
})

// Private functions
function convertToPixels(value: string) {
  const regex = /^(\d*\.?\d+)\s*(rem|px)$/

  const match = value.match(regex)

  if (!match) {
    console.error(
      `--magic-drawer-drag-overshoot (${value}) needs to be specified in px or rem`
    )
    return 0
  }

  const numericValue = parseFloat(match[1])
  const unit = match[2]
  const bodyFontSize = window.getComputedStyle(document.body).fontSize
  const rootFontSize = parseFloat(bodyFontSize) || 16

  switch (unit) {
    case 'rem':
      return numericValue * rootFontSize
    case 'px':
      return numericValue
  }
}

async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
}

function onClose() {
  innerActive.value = false
}

// Public functions
function closeIfAllowed() {
  if (canClose) {
    close()
  }
}

function saveOvershoot() {
  const element = unrefElement(drawerRef)
  const overshootVar = getComputedStyle(element!).getPropertyValue(
    '--magic-drawer-drag-overshoot'
  )

  overshoot.value = convertToPixels(overshootVar) || 0
}

// Lifecycle hooks and listeners
if (mappedOptions.keys && canClose) {
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

// Save overshoot, as soon as drawer apepars in in DOM
watch(innerActive, () => {
  saveOvershoot()
})

onBeforeMount(async () => {
  // Force open
  if (mappedOptions.beforeMount.open) {
    open()
  }
})

// Reset state on unmount
onBeforeUnmount(() => {
  close()
})
</script>

<style>
:root {
  --magic-drawer-height: 75svh;
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
  --magic-drawer-drag-overshoot: 4rem;
  --magic-drawer-drag-overshoot-x: 0;
  --magic-drawer-drag-overshoot-y: 0;
}

.magic-drawer {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;
  justify-content: var(--magic-drawer-justify-content);
  align-items: var(--magic-drawer-align-items);
  z-index: var(--magic-drawer-z-index);
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-drawer.-bottom {
  --magic-drawer-drag-overshoot-y: var(--magic-drawer-drag-overshoot);
}

.magic-drawer.-top {
  --magic-drawer-enter-animation: slide-ttb-in 300ms ease;
  --magic-drawer-leave-animation: slide-ttb-out 300ms ease;
  --magic-drawer-align-items: flex-start;
  --magic-drawer-drag-overshoot-y: calc(
    var(--magic-drawer-drag-overshoot) * -1
  );
}

.magic-drawer.-right {
  --magic-drawer-enter-animation: slide-rtl-in 300ms ease;
  --magic-drawer-leave-animation: slide-rtl-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-end;
  --magic-drawer-drag-overshoot-x: var(--magic-drawer-drag-overshoot);
}

.magic-drawer.-left {
  --magic-drawer-enter-animation: slide-ltr-in 300ms ease;
  --magic-drawer-leave-animation: slide-ltr-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-start;
  --magic-drawer-drag-overshoot-x: calc(
    var(--magic-drawer-drag-overshoot) * -1
  );
}

.magic-drawer__wrapper {
  width: 100%;
  pointer-events: none;
  height: calc(var(--magic-drawer-height) + var(--magic-drawer-drag-overshoot));
  transform: translate(
    var(--magic-drawer-drag-overshoot-x),
    var(--magic-drawer-drag-overshoot-y)
  );
}

.magic-drawer__content {
  width: 100%;
  height: 100%;
  max-height: 100%;
  position: relative;
}

.magic-drawer__drag {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  pointer-events: auto;
  align-items: var(--magic-drawer-align-items);
  justify-content: var(--magic-drawer-justify-content);
  overflow-y: var(--magic-drawer-content-overflow-y);
  cursor: grab;
}

.magic-drawer.-dragging .magic-drawer__content {
  cursor: grabbing;
}

.magic-drawer__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
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
