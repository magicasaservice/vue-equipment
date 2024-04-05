<template>
  <transition :duration="5000">
    <teleport
      v-if="wrapperActive"
      :to="mappedOptions.teleport?.target"
      :disabled="mappedOptions.teleport?.disabled"
    >
      <div
        ref="drawerRef"
        class="magic-drawer"
        :id="toValue(id)"
        :class="[
          toValue(props.class),
          `-${mappedOptions.position}`,
          {
            '-dragging': dragging,
            '-wheeling': wheeling,
            '-disabled': disabled,
          },
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
            @click.self="guardedClose"
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
              <component
                :is="mappedOptions.tag"
                ref="elRef"
                class="magic-drawer__drag"
                :style="style"
                @pointerdown="guardedPointerdown"
                @click="guardedClick"
              >
                <component
                  v-if="component"
                  v-bind="props"
                  :is="component"
                  @close="guardedClose"
                />
                <slot v-else />
                <div v-if="hasDragged" class="magic-drawer__overlay" />
              </component>
            </div>
          </transition>
        </div>
      </div>
    </teleport>
  </transition>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
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
import { useDrawerProgress } from '../composables/private/useDrawerProgress'
import { useDrawerDrag } from '../composables/private/useDrawerDrag'
import { useDrawerWheel } from '../composables/private/useDrawerWheel'
import { useDrawerState } from '../composables/private/useDrawerState'

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
  if (key === 'keys' || key === 'points') {
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

const mappedOptions: typeof defaultOptions = customDefu(
  props.options,
  defaultOptions
)

const elRef = ref<HTMLElement | undefined>(undefined)
const drawerRef = ref<HTMLDivElement | undefined>(undefined)
const wrapperRef = ref<HTMLDivElement | undefined>(undefined)

const drawerApi = useDrawerApi(props.id, {
  focusTarget: drawerRef,
  focusTrap: mappedOptions.focusTrap,
})

const overshoot = ref(0)
const { position, threshold, snap, canClose } = mappedOptions

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

const { onPointerdown, onClick, style, hasDragged } = useDrawerDrag({
  id: props.id,
  isActive,
  elRef,
  wrapperRef,
  position,
  threshold,
  overshoot,
  snap,
  canClose,
  close,
})

const { initializeWheelListener, destroyWheelListener } = useDrawerWheel({
  id: props.id,
  elRef,
  drawerRef,
  position,
})

const { findState } = useDrawerState(props.id)
const { dragging, wheeling } = findState()

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

useDrawerProgress({ id: props.id, elRef, drawerRef, position, overshoot })

// Prevent animation on initial mount if the options call for it
// To achieve this, the transition names are set to undefined
const preventTransition = computed(() => {
  return (
    mappedOptions.beforeMount.open &&
    !mappedOptions.beforeMount.animate &&
    !wasActive.value
  )
})

const backdropTransition = computed(() => {
  return preventTransition.value
    ? undefined
    : mappedOptions.transitions?.backdrop
})

const contentTransition = computed(() => {
  return preventTransition.value
    ? undefined
    : mappedOptions.transitions?.content
})

// Make sure this is reactive
const disabled = computed(() => {
  if (props.options.disabled === undefined) {
    return defaultOptions.disabled
  } else {
    return props.options.disabled
  }
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
  await nextTick()
  if (mappedOptions.mousewheel) {
    initializeWheelListener()
  }
}

function onClose() {
  innerActive.value = false
  if (mappedOptions.mousewheel) {
    destroyWheelListener()
  }
}

// Public functions
function guardedPointerdown(event: PointerEvent) {
  if (!disabled.value) {
    onPointerdown(event)
  }
}

function guardedClick(event: PointerEvent) {
  if (!disabled.value) {
    onClick(event)
  }
}

function guardedClose() {
  if (canClose && !disabled.value) {
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

// Save overshoot, as soon as drawer apepars in the DOM
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
  --magic-drawer-width: 100%;
  --magic-drawer-z-index: 999;
  --magic-drawer-justify-content: center;
  --magic-drawer-align-items: flex-end;
  --magic-drawer-backdrop-color: rgba(0, 0, 0, 0.5);
  --magic-drawer-backdrop-filter: unset;
  --magic-drawer-content-overflow-x: hidden;
  --magic-drawer-content-overflow-y: hidden;
  --magic-drawer-enter-animation: slide-btt-in 300ms ease;
  --magic-drawer-leave-animation: slide-btt-out 300ms ease;
  --magic-drawer-drag-overshoot: 4rem;
  --magic-drawer-padding: 0px;
}

.magic-drawer {
  --magic-drawer-drag-overshoot-x: 0px;
  --magic-drawer-drag-overshoot-y: 0px;
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
  --magic-drawer-padding: 0 0 var(--magic-drawer-drag-overshoot-y) 0;

  & > .magic-drawer__wrapper {
    height: calc(
      var(--magic-drawer-height, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer.-top {
  --magic-drawer-enter-animation: slide-ttb-in 300ms ease;
  --magic-drawer-leave-animation: slide-ttb-out 300ms ease;
  --magic-drawer-align-items: flex-start;
  --magic-drawer-drag-overshoot-y: calc(
    var(--magic-drawer-drag-overshoot) * -1
  );
  --magic-drawer-padding: var(--magic-drawer-drag-overshoot-y) 0 0 0;

  & > .magic-drawer__wrapper {
    height: calc(
      var(--magic-drawer-height, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer.-right {
  --magic-drawer-enter-animation: slide-rtl-in 300ms ease;
  --magic-drawer-leave-animation: slide-rtl-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-end;
  --magic-drawer-drag-overshoot-x: var(--magic-drawer-drag-overshoot);
  --magic-drawer-padding: 0 var(--magic-drawer-drag-overshoot-x) 0 0;

  & > .magic-drawer__wrapper {
    width: calc(
      var(--magic-drawer-width, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer.-left {
  --magic-drawer-enter-animation: slide-ltr-in 300ms ease;
  --magic-drawer-leave-animation: slide-ltr-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-start;
  --magic-drawer-drag-overshoot-x: calc(
    var(--magic-drawer-drag-overshoot) * -1
  );
  --magic-drawer-padding: 0 0 0 var(--magic-drawer-drag-overshoot-x);

  & > .magic-drawer__wrapper {
    width: calc(
      var(--magic-drawer-width, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer__wrapper {
  height: var(--magic-drawer-height);
  width: var(--magic-drawer-width);
  transform: translate(
    var(--magic-drawer-drag-overshoot-x),
    var(--magic-drawer-drag-overshoot-y)
  );
  pointer-events: none;
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
  overflow-x: var(--magic-drawer-content-overflow-x);
  overflow-y: var(--magic-drawer-content-overflow-y);
  cursor: grab;
}

/* Reset default dialog styles */
dialog.magic-drawer__drag {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: 0;
}

dialog.magic-drawer__drag::backdrop {
  background-color: transparent;
}

.magic-drawer.-dragging .magic-drawer__drag {
  cursor: grabbing;
  user-select: none;
}

.magic-drawer.-wheeling .magic-drawer__drag {
  cursor: auto;
}

.magic-drawer.-disabled .magic-drawer__drag {
  cursor: auto;
}

.magic-drawer__drag > * {
  padding: var(--magic-drawer-padding);
}

.magic-drawer__overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
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

.magic-drawer.-disabled .magic-drawer__backdrop {
  pointer-events: none;
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
