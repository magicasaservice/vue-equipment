<template>
  <teleport
    :to="state.options.teleport?.target"
    :disabled="state.options.teleport?.disabled"
  >
    <div
      :data-id="toValue(id)"
      :data-position="state.options.position"
      :data-expanded="state.expanded"
      class="magic-toast-provider"
      v-bind="$attrs"
    >
      <transition-group
        ref="list"
        tag="ol"
        class="magic-toast-provider__list"
        :name="state.options.transition"
        :on-before-enter="onBeforeEnter"
        :on-enter="onEnter"
        :on-after-enter="onAfterEnter"
        :on-before-leave="onBeforeLeave"
        :on-leave="onLeave"
        :on-after-leave="onAfterLeave"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
      >
        <magic-toast-view
          v-for="(view, index) in state.views"
          :id="view.id"
          :key="view.id"
          :index="index"
        >
          <component
            :is="view.component"
            v-bind="view.props"
            @remove="deleteView(view.id)"
          />
        </magic-toast-view>
      </transition-group>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {
  toValue,
  useTemplateRef,
  provide,
  watch,
  onBeforeUnmount,
  type MaybeRef,
} from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useToastState } from '../composables/private/useToastState'
import { useToastView } from '../composables/private/useToastView'
import { useToastCallback } from '../composables/private/useToastCallback'

import MagicToastView from './MagicToastView.vue'
import { MagicToastInstanceId } from '../../symbols'

import type { MagicToastOptions } from '../types/index'

import '@maas/vue-equipment/utils/css/animations/fade-out.css'
import '@maas/vue-equipment/utils/css/animations/squash-y.css'
import '@maas/vue-equipment/utils/css/animations/slide-ltr-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-ltr-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-rtl-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-rtl-out.css'
import { useToastListener } from '../composables/private/useToastListener'

interface MagicToastProps {
  id: MaybeRef<string>
  options?: MagicToastOptions
}

const { id, options } = defineProps<MagicToastProps>()

defineOptions({
  inheritAttrs: false,
})

const { deleteView } = useToastView(id)
const { deleteState, initializeState } = useToastState(id)
const state = initializeState(options)

const listRef = useTemplateRef('list')

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useToastCallback(id)

const { onMouseenter, onMouseleave, outsideClickCallback } =
  useToastListener(id)

// Lifecycle
onClickOutside(listRef, outsideClickCallback)

watch(
  () => options,
  (value) => {
    initializeState(value)
  },
  {
    deep: true,
  }
)

onBeforeUnmount(() => {
  deleteState()
})

provide(MagicToastInstanceId, id)
</script>

<style>
@keyframes mt-slide-ttb-out {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, calc(-100% - var(--magic-toast-padding-y)), 0);
  }
}

@keyframes mt-slide-ttb-in {
  0% {
    transform: translate3d(0, calc(-100% - var(--magic-toast-padding-y)), 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes mt-slide-btt-out {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, calc(100% + var(--magic-toast-padding-y)), 0);
  }
}

@keyframes mt-slide-btt-in {
  0% {
    transform: translate3d(0, calc(100% + var(--magic-toast-padding-y)), 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

:root {
  --magic-toast-padding-y: 1rem;
  --magic-toast-padding-x: 1rem;
  --magic-toast-gap: 0.75rem;
  --magic-toast-animation-duration: 175ms;
  --magic-toast-scale-factor: 0.05;
  --magic-toast-overlap-y: 1rem;

  --mt-multiplier-y: 0px;
  --mt-align-items: center;
  --mt-justify-content: flex-end;
  --mt-flex-direction: column;
  --mt-enter-animation: unset;
  --mt-leave-animation: unset;
}

.magic-toast-provider {
  position: var(--magic-toast-position, fixed);
  inset: var(--magic-toast-inset, 0);
  width: var(--magic-toast-width, 100%);
  height: var(--magic-toast-height, 100%);
  z-index: var(--magic-toast-z-index, 999);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.magic-toast-provider__list {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  padding: var(--magic-toast-padding-y) var(--magic-toast-padding-x);
  flex-direction: var(--mt-flex-direction);
  align-items: var(--mt-align-items);
  justify-content: var(--mt-justify-content);
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.magic-toast-provider__list * {
  pointer-events: all;
}

.magic-toast-provider[data-position='top-left'],
.magic-toast-provider[data-position='top'],
.magic-toast-provider[data-position='top-right'] {
  --mt-enter-animation: mt-slide-ttb-in var(--magic-toast-animation-duration)
    var(--ease-in-out);
  --mt-leave-animation: mt-slide-ttb-out var(--magic-toast-animation-duration)
    var(--ease-in-out);
  --mt-multiplier-y: 1;
  --mt-justify-content: flex-end;
  --mt-flex-direction: column-reverse;
}

.magic-toast-provider[data-position='bottom-left'],
.magic-toast-provider[data-position='bottom'],
.magic-toast-provider[data-position='bottom-right'] {
  --mt-enter-animation: mt-slide-btt-in var(--magic-toast-animation-duration)
    var(--ease-in-out);
  --mt-leave-animation: mt-slide-btt-out var(--magic-toast-animation-duration)
    var(--ease-in-out);
  --mt-multiplier-y: -1;
  --mt-justify-content: flex-end;
}

.magic-toast-provider[data-position='top-left'],
.magic-toast-provider[data-position='bottom-left'] {
  --mt-align-items: flex-start;
}

.magic-toast-provider[data-position='top-right'],
.magic-toast-provider[data-position='bottom-right'] {
  --mt-align-items: flex-end;
}

.magic-toast-provider[data-position='left'] {
  --mt-justify-content: center;
  --mt-align-items: flex-start;
  --mt-enter-animation: slide-ltr-in var(--magic-toast-animation-duration)
    var(--ease-in-out);
  --mt-leave-animation: slide-ltr-out var(--magic-toast-animation-duration)
    var(--ease-in-out);
}

.magic-toast-provider[data-position='right'] {
  --mt-justify-content: center;
  --mt-align-items: flex-end;
  --mt-enter-animation: slide-rtl-in var(--magic-toast-animation-duration)
    var(--ease-in-out);
  --mt-leave-animation: slide-rtl-out var(--magic-toast-animation-duration)
    var(--ease-in-out);
}

.magic-toast-enter-active {
  animation: var(--mt-enter-animation, unset);
  position: absolute;

  &[data-position='bottom-left'],
  &[data-position='bottom'],
  &[data-position='bottom-right'] {
    bottom: calc(var(--mt-height) * var(--mt-index) * 1px);
  }

  &[data-position='top-left'],
  &[data-position='top'],
  &[data-position='top-right'] {
    top: calc(var(--mt-height) * var(--mt-index) * 1px);
  }
}

.magic-toast-leave-active {
  animation: fade-out var(--magic-toast-animation-duration) var(--ease-in-out);
  position: absolute;
}

.magic-toast-leave-active:last-child {
  animation: var(--mt-leave-animation, unset);
  position: absolute;
}

.magic-toast-move {
  transition: all var(--magic-toast-animation-duration) var(--ease-in-out);
}
</style>
