<template>
  <teleport
    :key="teleportId"
    :to="state.options.teleport?.target"
    :disabled="state.options.teleport?.disabled"
  >
    <div
      :id="toValue(id)"
      :data-position="state.options.position"
      :data-expanded="state.expanded"
      class="magic-toast-provider"
      v-bind="$attrs"
    >
      <transition-group
        ref="listRef"
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
  ref,
  provide,
  useId,
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
import '@maas/vue-equipment/utils/css/animations/slide-ltr-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-ltr-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-rtl-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-rtl-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-ttb-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-ttb-out.css'
import '@maas/vue-equipment/utils/css/animations/slide-btt-in.css'
import '@maas/vue-equipment/utils/css/animations/slide-btt-out.css'
import { useToastListener } from '../composables/private/useToastListener'

interface MagicToastProps {
  id: MaybeRef<string>
  options?: MagicToastOptions
}

const { id, options } = defineProps<MagicToastProps>()

defineOptions({
  inheritAttrs: false,
})

const teleportId = ref(useId())

const { deleteView } = useToastView(id)
const { deleteState, initializeState } = useToastState(id)
const state = initializeState(options)

const listRef = ref<HTMLElement | undefined>(undefined)

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

// Update teleport id when position changes
watch(
  () => state.options.position,
  () => {
    teleportId.value = useId()
  }
)

onBeforeUnmount(() => {
  deleteState()
})

provide(MagicToastInstanceId, id)
</script>

<style>
:root {
  --magic-toast-padding-y: 0.75rem;
  --magic-toast-transform-factor: 0.75;

  --mt-multiplier-x: 1;
  --mt-multiplier-y: 1;
  --mt-align-items: center;
  --mt-justify-content: flex-end;
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
  flex-direction: column;
  padding-bottom: var(--magic-toast-padding-y);
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
.magic-toast-provider[data-position='top-center'],
.magic-toast-provider[data-position='top-right'] {
  --mt-enter-animation: slide-ttb-in 300ms ease;
  --mt-leave-animation: slide-ttb-out 300ms ease;
  --mt-multiplier-y: 1;
  --mt-multiplier-x: 0;
  --mt-justify-content: flex-start;
}

.magic-toast-provider[data-position='bottom-left'],
.magic-toast-provider[data-position='bottom-center'],
.magic-toast-provider[data-position='bottom-right'] {
  --mt-enter-animation: slide-btt-in 300ms ease;
  --mt-leave-animation: slide-btt-out 300ms ease;
  --mt-multiplier-y: 1;
  --mt-multiplier-x: 0;
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

.magic-toast-provider[data-position='center-left'] {
  --mt-justify-content: center;
  --mt-align-items: flex-start;
  --mt-enter-animation: slide-ltr-in 300ms ease;
  --mt-leave-animation: slide-ltr-out 300ms ease;
  --mt-multiplier-x: 1;
  --mt-multiplier-y: 0;
}

.magic-toast-provider[data-position='center-right'] {
  --mt-justify-content: center;
  --mt-align-items: flex-end;
  --mt-enter-animation: slide-rtl-in 300ms ease;
  --mt-leave-animation: slide-rtl-out 300ms ease;
  --mt-multiplier-x: -1;
  --mt-multiplier-y: 0;
}

.magic-toast-enter-active {
  animation: var(--mt-enter-animation, unset);
}

.magic-toast-leave-active:not(:last-child, :first-child) {
  animation: fade-out 300ms ease;
  position: absolute;
}

.magic-toast-leave-active:first-child {
  animation: fade-out 300ms ease;
}

.magic-toast-leave-active:last-child {
  position: absolute;
  animation: var(--mt-leave-animation, unset);
}

.magic-toast-move {
  transition: all 300ms ease;
}
</style>
