<template>
  <teleport
    v-if="wrapperActive"
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <div
      ref="drawerRef"
      class="magic-drawer"
      :data-id="toValue(id)"
      :data-dragging="dragging"
      :data-wheeling="wheeling"
      :data-disabled="disabled"
      :data-position="mappedOptions.position"
      v-bind="$attrs"
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

      <div ref="wrapperRef" class="magic-drawer__wrapper">
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
              <slot />
              <div v-if="hasDragged" class="magic-drawer__overlay" />
            </component>
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  computed,
  nextTick,
  toValue,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  toRefs,
  type MaybeRef,
} from 'vue'
import { createDefu } from 'defu'
import { onKeyStroke, unrefElement } from '@vueuse/core'
import { useMetaViewport } from '@maas/vue-equipment/composables'
import { defaultOptions } from './../utils/defaultOptions'
import { useDrawerDOM } from '../composables/private/useDrawerDOM'
import { useDrawerCallback } from '../composables/private/useDrawerCallback'
import { useDrawerProgress } from '../composables/private/useDrawerProgress'
import { useDrawerDrag } from '../composables/private/useDrawerDrag'
import { useDrawerWheel } from '../composables/private/useDrawerWheel'
import { useDrawerState } from '../composables/private/useDrawerState'
import { useMagicDrawer } from '../composables/useMagicDrawer'

import type { MagicDrawerOptions } from '../types/index'

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

defineOptions({
  inheritAttrs: false,
})

// Prevent deep merge of certain options
// In this case, don’t merge the `close` and `points` options
const customDefu = createDefu((obj, key, value) => {
  if (key === 'close' || key === 'snapPoints') {
    obj[key] = value
    return true
  }
})

interface MagicDrawerProps {
  id: MaybeRef<string>
  options?: MagicDrawerOptions
}

const { options = {}, id } = defineProps<MagicDrawerProps>()

const mappedOptions = customDefu(options, defaultOptions)

const elRef = ref<HTMLElement | undefined>(undefined)
const drawerRef = ref<HTMLDivElement | undefined>(undefined)
const wrapperRef = ref<HTMLDivElement | undefined>(undefined)

const {
  trapFocus,
  releaseFocus,
  lockScroll,
  unlockScroll,
  addScrollLockPadding,
  removeScrollLockPadding,
} = useDrawerDOM({
  focusTarget: drawerRef,
  focusTrap: mappedOptions.focusTrap,
})

const { isActive, open, close } = useMagicDrawer(id)

const overshoot = ref(0)
const {
  position,
  snapPoints,
  threshold,
  animation,
  preventDragClose,
  initial,
} = mappedOptions

// Make sure this is reactive
const disabled = computed(() => {
  if (options.disabled === undefined) {
    return defaultOptions.disabled
  } else {
    return options.disabled
  }
})

const { onPointerdown, onClick, style, hasDragged } = useDrawerDrag({
  id,
  elRef,
  wrapperRef,
  position,
  snapPoints,
  threshold,
  overshoot,
  animation,
  initial,
  preventDragClose,
  disabled,
})

const { initializeWheelListener, destroyWheelListener } = useDrawerWheel({
  id,
  elRef,
  position,
  disabled,
})

const { initializeState, deleteState } = useDrawerState(id)
const state = initializeState()

const { dragging, wheeling } = toRefs(state)

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
  id,
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

useDrawerProgress({ id, elRef, drawerRef, position, overshoot })

const { resetMetaViewport } = useMetaViewport()

// Prevent animation on initial mount if the options call for it
// To achieve this, the transition names are set to undefined
const preventTransition = computed(() => {
  return (
    mappedOptions.initial.open &&
    !mappedOptions.initial.transition &&
    !wasActive.value
  )
})

const backdropTransition = computed(() => {
  return preventTransition.value
    ? undefined
    : mappedOptions.transition?.backdrop
})

const contentTransition = computed(() => {
  return preventTransition.value ? undefined : mappedOptions.transition?.content
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
  if (mappedOptions.enableMousewheel) {
    initializeWheelListener()
  }
}

function onClose() {
  innerActive.value = false
  if (mappedOptions.enableMousewheel) {
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
  if (!disabled.value) {
    close()
  }
}

function saveOvershoot() {
  const element = unrefElement(drawerRef)

  if (!element) {
    return
  }

  const overshootVar = getComputedStyle(element, null).getPropertyValue(
    '--magic-drawer-drag-overshoot'
  )
  overshoot.value = convertToPixels(overshootVar) || 0
}

// Lifecycle hooks and listeners
if (mappedOptions.keyListener.close) {
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

// Save overshoot, as soon as drawer apepars in the DOM
watch(innerActive, () => {
  saveOvershoot()
})

onBeforeMount(async () => {
  // Force open
  if (mappedOptions.initial.open) {
    open()
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

  if (!mappedOptions.preventZoom) {
    resetMetaViewport()
  }

  deleteState()
})
</script>

<style>
:root {
  --magic-drawer-height: 75svh;
  --magic-drawer-max-height: none;
  --magic-drawer-width: 100%;
  --magic-drawer-max-width: none;
  --magic-drawer-justify-content: center;
  --magic-drawer-align-items: flex-end;
  --magic-drawer-enter-animation: slide-btt-in 300ms ease;
  --magic-drawer-leave-animation: slide-btt-out 300ms ease;
  --magic-drawer-drag-overshoot: 4rem;
}

.magic-drawer {
  --magic-drawer-padding: 0px;
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
  z-index: var(--magic-drawer-z-index, 999);
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-drawer[data-position='bottom'] {
  --magic-drawer-drag-overshoot-y: var(--magic-drawer-drag-overshoot);
  --magic-drawer-padding: 0 0 var(--magic-drawer-drag-overshoot-y) 0;

  & > .magic-drawer__wrapper {
    height: calc(
      var(--magic-drawer-height, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer[data-position='top'] {
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

.magic-drawer[data-position='right'] {
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

.magic-drawer[data-position='left'] {
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
  max-height: calc(
    var(--magic-drawer-max-height) + var(--magic-drawer-drag-overshoot-y)
  );
  width: var(--magic-drawer-width);
  max-width: calc(
    var(--magic-drawer-max-width) + var(--magic-drawer-drag-overshoot-x)
  );
  transform: translate(
    var(--magic-drawer-drag-overshoot-x),
    var(--magic-drawer-drag-overshoot-y)
  );
  pointer-events: none;
  display: flex;
  min-height: 0;
}

.magic-drawer__content {
  width: 100%;
  max-height: 100%;
  height: var(--magic-drawer-content-height, 100%);
  position: relative;
}

.magic-drawer__drag {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  touch-action: none;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  pointer-events: auto;
  align-items: var(--magic-drawer-align-items);
  justify-content: var(--magic-drawer-justify-content);
  overflow-x: var(--magic-drawer-content-overflow-x, hidden);
  overflow-y: var(--magic-drawer-content-overflow-y, hidden);
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

.magic-drawer[data-dragging='true'] .magic-drawer__drag {
  cursor: grabbing;
  user-select: none;
}

.magic-drawer[data-wheeling='true'] .magic-drawer__drag {
  cursor: auto;
}

.magic-drawer[data-disabled='true'] .magic-drawer__drag {
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
  background-color: var(--magic-drawer-backdrop-color, rgba(0, 0, 0, 0.5));
  backdrop-filter: var(--magic-drawer-backdrop-filter, unset);
  z-index: -1;
}

.magic-drawer[data-disabled='true'] .magic-drawer__backdrop {
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
