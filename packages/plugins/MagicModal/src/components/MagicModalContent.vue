<template>
  <div
    class="magic-modal-content"
    :data-id="mappedId"
    v-bind="$attrs"
    aria-modal="true"
  >
    <transition
      :name="state.options.transition.content"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <component
        :is="state.options.tag"
        v-show="active.innerActive"
        class="magic-modal-content__inner"
        @pointerdown="onPointerdown"
        @touchstart="onTouchstart"
        @click.self="guardedClick"
      >
        <slot />
      </component>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { inject, toValue, onUnmounted } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useModalState } from '../composables/private/useModalState'
import { useModalCallback } from '../composables/private/useModalCallback'
import { useModalDOM } from '../composables/private/useModalDOM'
import { useMagicModal } from '../composables/useMagicModal'
import { MagicModalInstanceId, MagicModalActiveKey } from '../symbols'

import '@maas/vue-equipment/utils/css/keyframes/fade-in.css'
import '@maas/vue-equipment/utils/css/keyframes/fade-out.css'

defineOptions({
  inheritAttrs: false,
})

const instanceId = inject(MagicModalInstanceId, undefined)
const active = inject(MagicModalActiveKey, {
  wrapperActive: false,
  innerActive: false,
})

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicModal',
  source: 'MagicModalContent',
})

magicError.assert(instanceId, {
  message: 'MagicModalContent must be nested inside MagicModalProvider',
  errorCode: 'missing_instance_id',
})

const mappedId = toValue(instanceId ?? '')

const { initializeState } = useModalState(instanceId ?? '')
const state = initializeState()

const { trapFocus, releaseFocus, unlockScroll } = useModalDOM({
  focusTrap: state.options.focusTrap,
  focusTarget: undefined,
})

const { close } = useMagicModal(instanceId ?? '')

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useModalCallback({
  id: instanceId ?? '',
  options: state.options,
  trapFocus,
  releaseFocus,
  active,
})

let target: HTMLElement | undefined = undefined

function onPointerdown(e: PointerEvent) {
  target = e.target as HTMLElement
}

function onTouchstart(e: TouchEvent) {
  target = e.target as HTMLElement
}

function guardedClick(e: MouseEvent) {
  if (e.currentTarget === target) {
    close()
  }
}

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

  target = undefined
})
</script>

<style>
@keyframes mm-content-enter {
  0% {
    opacity: 0;
    transform: translate3d(0, 2rem, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes mm-content-leave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.02);
  }
}

.magic-modal-content {
  position: var(--magic-modal-position, fixed);
  inset: var(--magic-modal-inset, 0);
  width: var(--magic-modal-width, 100%);
  height: var(--magic-modal-height, 100%);
  display: var(--magic-modal-display, flex);
  justify-content: var(--magic-modal-justify-content, center);
  align-items: var(--magic-modal-align-items, center);
  z-index: var(--magic-modal-z-index, 999);
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
  pointer-events: none;
}

.magic-modal-content__inner {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  max-height: var(--magic-modal-content-max-height, 100%);
  width: var(--magic-modal-content-width, 100%);
  display: var(--magic-modal-content-display, flex);
  align-items: var(--magic-modal-content-align-items, center);
  justify-content: var(--magic-modal-content-justify-content, center);
  overflow-y: var(--magic-modal-content-overflow-y, auto);
  pointer-events: auto;
}

/* Reset default dialog styles */
dialog.magic-modal-content__inner {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: 0;
}

dialog.magic-modal-content__inner::backdrop {
  background-color: transparent;
}

/* Content transitions */
.magic-modal-content-enter-active {
  animation: mm-content-enter 175ms ease;
}

.magic-modal-content-leave-active {
  animation: mm-content-leave 175ms ease;
}

@media (prefers-reduced-motion) {
  .magic-modal-content-enter-active {
    animation: fade-in 175ms ease;
  }

  .magic-modal-content-leave-active {
    animation: fade-out 175ms ease;
  }
}
</style>
