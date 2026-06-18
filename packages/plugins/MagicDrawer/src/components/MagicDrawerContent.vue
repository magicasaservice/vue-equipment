<template>
  <div
    ref="drawer"
    class="magic-drawer-content"
    :data-id="mappedId"
    :data-dragging="dragging"
    :data-dragged="hasDragged"
    :data-wheeling="wheeling"
    :data-disabled="disabled"
    :data-position="state.options.position"
    v-bind="$attrs"
    aria-modal="true"
  >
    <div ref="wrapper" class="magic-drawer-content__wrapper">
      <transition
        :name="contentTransition"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div v-show="active.innerActive" class="magic-drawer-content__inner">
          <component
            :is="state.options.tag"
            ref="el"
            class="magic-drawer-content__drag"
            :style="style"
            @pointerdown="guardedPointerdown"
            @touchstart="guardedTouchstart"
            @click="guardedClick"
          >
            <slot />
            <div v-if="hasDragged" class="magic-drawer-content__overlay" />
          </component>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useTemplateRef,
  shallowRef,
  watch,
  computed,
  toValue,
  inject,
  onBeforeUnmount,
  onUnmounted,
  toRefs,
} from 'vue'
import { unrefElement } from '@vueuse/core'
import { convertToPixels } from '@maas/vue-equipment/utils'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useMetaViewport } from '@maas/vue-equipment/composables/useMetaViewport'
import { useDrawerDOM } from '../composables/private/useDrawerDOM'
import { useDrawerCallback } from '../composables/private/useDrawerCallback'
import { useDrawerProgress } from '../composables/private/useDrawerProgress'
import { useDrawerDrag } from '../composables/private/useDrawerDrag'
import { useDrawerWheel } from '../composables/private/useDrawerWheel'
import { useDrawerState } from '../composables/private/useDrawerState'
import { MagicDrawerInstanceId, MagicDrawerActiveKey } from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/fade-out.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-ltr-in.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-rtl-in.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-ttb-in.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-btt-in.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-ltr-out.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-rtl-out.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-ttb-out.css'
import '@maas/vue-equipment/utils/css/keyframes/slide-btt-out.css'

defineOptions({
  inheritAttrs: false,
})

const instanceId = inject(MagicDrawerInstanceId, undefined)
const active = inject(MagicDrawerActiveKey, {
  wrapperActive: false,
  innerActive: false,
})

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicDrawer',
  source: 'MagicDrawerContent',
})

const { logWarning } = magicError

magicError.assert(instanceId, {
  message: 'MagicDrawerContent must be nested inside MagicDrawerProvider',
  errorCode: 'missing_instance_id',
})

const mappedId = toValue(instanceId ?? '')

const { initializeState } = useDrawerState(instanceId ?? '')
const state = initializeState()
const { dragging, wheeling } = toRefs(state)

const elRef = useTemplateRef<HTMLElement>('el')
const drawerRef = useTemplateRef<HTMLDivElement>('drawer')
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapper')

const { trapFocus, releaseFocus, unlockScroll } = useDrawerDOM({
  focusTarget: drawerRef,
  focusTrap: state.options.focusTrap,
})

const wasActive = shallowRef(false)

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useDrawerCallback({
  id: instanceId ?? '',
  options: state.options,
  trapFocus,
  releaseFocus,
  active,
  wasActive,
})

const disabled = computed(() => state.options.disabled)

const overshoot = shallowRef(0)

const { onPointerdown, onTouchstart, onClick, style, hasDragged } =
  useDrawerDrag({
    id: instanceId ?? '',
    elRef,
    wrapperRef,
    position: state.options.position,
    snapPoints: state.options.snapPoints,
    snap: state.options.snap,
    threshold: state.options.threshold,
    overshoot,
    animation: state.options.animation,
    initial: state.options.initial,
    preventDragClose: state.options.preventDragClose,
    disabled,
  })

const { initializeWheelListener, destroyWheelListener } = useDrawerWheel({
  id: instanceId ?? '',
  elRef,
  position: state.options.position,
  disabled,
})

useDrawerProgress({
  id: instanceId ?? '',
  elRef,
  drawerRef,
  position: state.options.position,
  overshoot,
})

const { resetMetaViewport } = useMetaViewport()

const preventTransition = computed(
  () =>
    state.options.initial.open &&
    !state.options.initial.transition &&
    !wasActive.value
)

const contentTransition = computed(() =>
  preventTransition.value ? undefined : state.options.transition?.content
)

watch(
  () => active.innerActive,
  (value) => {
    saveOvershoot()
    if (state.options.enableMousewheel) {
      if (value) {
        initializeWheelListener()
      } else {
        destroyWheelListener()
      }
    }
  }
)

function saveOvershoot() {
  const element = unrefElement(drawerRef)
  if (!element) {
    return
  }

  const overshootVar = getComputedStyle(element, null).getPropertyValue(
    '--magic-drawer-drag-overshoot'
  )
  const pixels = convertToPixels(overshootVar)

  if (pixels === undefined) {
    logWarning(
      `--magic-drawer-drag-overshoot (${overshootVar}) needs to be specified in px or rem`
    )
  }

  overshoot.value = pixels ?? 0
}

function guardedPointerdown(event: PointerEvent) {
  if (!disabled.value) {
    onPointerdown(event)
  }
}

function guardedTouchstart(event: TouchEvent) {
  if (!disabled.value) {
    onTouchstart(event)
  }
}

function guardedClick(event: PointerEvent) {
  if (!disabled.value) {
    onClick(event)
  }
}

onBeforeUnmount(() => {
  if (state.options.enableMousewheel) {
    destroyWheelListener()
  }
})

onUnmounted(() => {
  if (state.options.scrollLock) {
    unlockScroll(
      typeof state.options.scrollLock === 'object' &&
        state.options.scrollLock.padding
    )
  }

  if (state.options.focusTrap) {
    releaseFocus()
  }

  if (!state.options.preventZoom) {
    resetMetaViewport()
  }
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

.magic-drawer-content {
  --magic-drawer-padding: 0px;
  --magic-drawer-drag-overshoot-x: 0px;
  --magic-drawer-drag-overshoot-y: 0px;
  position: var(--magic-drawer-position, fixed);
  inset: var(--magic-drawer-inset, 0);
  display: var(--magic-drawer-display, flex);
  justify-content: var(--magic-drawer-justify-content);
  align-items: var(--magic-drawer-align-items);
  z-index: var(--magic-drawer-z-index, 999);
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}

.magic-drawer-content[data-position='bottom'] {
  --magic-drawer-drag-overshoot-y: var(--magic-drawer-drag-overshoot);
  --magic-drawer-padding: 0 0 var(--magic-drawer-drag-overshoot-y) 0;

  & > .magic-drawer-content__wrapper {
    height: calc(
      var(--magic-drawer-height, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer-content[data-position='top'] {
  --magic-drawer-enter-animation: slide-ttb-in 300ms ease;
  --magic-drawer-leave-animation: slide-ttb-out 300ms ease;
  --magic-drawer-align-items: flex-start;
  --magic-drawer-drag-overshoot-y: calc(
    var(--magic-drawer-drag-overshoot) * -1
  );
  --magic-drawer-padding: var(--magic-drawer-drag-overshoot-y) 0 0 0;

  & > .magic-drawer-content__wrapper {
    height: calc(
      var(--magic-drawer-height, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer-content[data-position='right'] {
  --magic-drawer-enter-animation: slide-rtl-in 300ms ease;
  --magic-drawer-leave-animation: slide-rtl-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-end;
  --magic-drawer-drag-overshoot-x: var(--magic-drawer-drag-overshoot);
  --magic-drawer-padding: 0 var(--magic-drawer-drag-overshoot-x) 0 0;

  & > .magic-drawer-content__wrapper {
    width: calc(
      var(--magic-drawer-width, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer-content[data-position='left'] {
  --magic-drawer-enter-animation: slide-ltr-in 300ms ease;
  --magic-drawer-leave-animation: slide-ltr-out 300ms ease;
  --magic-drawer-align-items: center;
  --magic-drawer-justify-content: flex-start;
  --magic-drawer-drag-overshoot-x: calc(
    var(--magic-drawer-drag-overshoot) * -1
  );
  --magic-drawer-padding: 0 0 0 var(--magic-drawer-drag-overshoot-x);

  & > .magic-drawer-content__wrapper {
    width: calc(
      var(--magic-drawer-width, 0px) + var(--magic-drawer-drag-overshoot, 0px)
    );
  }
}

.magic-drawer-content__wrapper {
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

.magic-drawer-content__inner {
  width: var(--magic-drawer-content-width, 100%);
  max-height: var(--magic-drawer-content-max-height, 100%);
  height: var(--magic-drawer-content-height, 100%);
  position: relative;
}

.magic-drawer-content__drag {
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
  cursor: var(--magic-drawer-cursor, grab);
}

dialog.magic-drawer-content__drag {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: 0;
}

dialog.magic-drawer-content__drag::backdrop {
  background-color: transparent;
}

.magic-drawer-content[data-dragging='true'] .magic-drawer-content__drag {
  cursor: var(--magic-drawer-cursor-dragging, grabbing);
  user-select: none;
}

.magic-drawer-content[data-wheeling='true'] .magic-drawer-content__drag {
  cursor: auto;
}

.magic-drawer-content[data-disabled='true'] .magic-drawer-content__drag {
  cursor: auto;
}

.magic-drawer-content__drag > * {
  padding: var(--magic-drawer-padding);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.magic-drawer-content__overlay {
  position: absolute;
  inset: 0;
  z-index: 9999;
}

.magic-drawer-content-enter-active {
  animation: var(--magic-drawer-enter-animation);
}

.magic-drawer-content-leave-active {
  animation: var(--magic-drawer-leave-animation);
}
</style>
