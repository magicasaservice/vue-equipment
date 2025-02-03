<template>
  <teleport
    :key="teleportId"
    :to="state.options.teleport?.target"
    :disabled="state.options.teleport?.disabled"
  >
    <div
      :id="toValue(id)"
      :data-position="state.options.position"
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
import { useToastListener } from '../composables/private/useToastListener'
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

const { outsideClickCallback } = useToastListener(id)
const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
} = useToastCallback(id)

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
  --magic-toast-padding-x: 1rem;
  --magic-toast-padding-y: 1rem;

  --mt-transform-x: 0;
  --mt-transform-y: 0;
  --mt-multiplier-x: 1;
  --mt-multiplier-y: 1;
  --mt-align-items: flex-start;
  --mt-justify-content: center;
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
  --mt-transform-y: 10;
  --mt-enter-animation: slide-ttb-in 300ms ease;
  --mt-leave-animation: slide-ttb-out 300ms ease;
  --mt-multiplier-y: 1;
  --mt-align-items: flex-start;
  & .magic-toast-view {
    padding-top: var(--magic-toast-padding-y);
  }
}

.magic-toast-provider[data-position='bottom-left'],
.magic-toast-provider[data-position='bottom-center'],
.magic-toast-provider[data-position='bottom-right'] {
  --mt-transform-y: 10;
  --mt-enter-animation: slide-btt-in 300ms ease;
  --mt-leave-animation: slide-btt-out 300ms ease;
  --mt-multiplier-y: -1;
  --mt-align-items: flex-end;
  & .magic-toast-view {
    padding-bottom: var(--magic-toast-padding-y);
  }
}

.magic-toast-provider[data-position='top-left'],
.magic-toast-provider[data-position='bottom-left'] {
  --mt-justify-content: flex-start;
  & .magic-toast-view {
    padding-left: var(--magic-toast-padding-x);
  }
}

.magic-toast-provider[data-position='top-right'],
.magic-toast-provider[data-position='bottom-right'] {
  --mt-justify-content: flex-end;
  & .magic-toast-view {
    padding-right: var(--magic-toast-padding-x);
  }
}

.magic-toast-provider[data-position='from-left'] {
  --mt-transform-y: 0;
  --mt-transform-x: 30;
  --mt-enter-animation: slide-ltr-in 300ms ease;
  --mt-leave-animation: slide-ltr-out 300ms ease;
  --mt-multiplier-x: 1;
}

.magic-toast-provider[data-position='from-right'] {
  --mt-transform-y: 0;
  --mt-transform-x: 30;
  --mt-enter-animation: slide-rtl-in 300ms ease;
  --mt-leave-animation: slide-rtl-out 300ms ease;
  --mt-multiplier-x: -1;
}

.magic-toast-enter-active {
  animation: var(--mt-enter-animation, unset);
}

.magic-toast-leave-active:not(:last-child) {
  animation: fade-out 150ms ease;
}

.magic-toast-leave-active:last-child {
  animation: var(--mt-leave-animation, unset);
}
</style>
