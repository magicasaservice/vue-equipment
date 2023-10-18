<template>
  <Teleport
    :key="teleportKey"
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <div class="magic-toast" :id="toValue(id)" :class="toValue(props.class)">
      <transition-group
        tag="ol"
        ref="listRef"
        class="magic-toast__inner"
        :name="mappedOptions.transitions!.list"
        :on-before-enter="onBeforeEnter"
        :on-enter="onEnter"
        :on-after-enter="onAfterEnter"
        :on-before-leave="onBeforeLeave"
        :on-leave="onLeave"
        :on-after-leave="onAfterLeave"
      >
        <magic-toast-component
          v-for="(toast, index) in toasts"
          :id="toast.id"
          :key="toast.id"
          :index="index"
          :total="count || 0"
          :siblings="activeElements"
          :class="{
            expanded: isExpanded,
          }"
          @mouseenter="onMouseenter"
          @mouseleave="onMouseleave"
        >
          <component
            :is="toast.component"
            v-bind="toast.props"
            @close="toast.remove"
            @click.self="onClick"
          />
        </magic-toast-component>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { uuid } from '@maas/vue-equipment/utils'
import { defu } from 'defu'
import { toValue, ref, watch, type MaybeRef } from 'vue'
import { onClickOutside, type MaybeElement } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useToastApi } from './../composables/useToastApi'
import { useToastCallback } from './../composables/private/useToastCallback'

import MagicToastComponent from './MagicToastComponent.vue'

import type { ToastOptions } from './../types/index'

interface MagicToastProps {
  id: MaybeRef<string>
  class: MaybeRef<string>
  options?: ToastOptions
}

const props = defineProps<MagicToastProps>()

const { toasts, count, oldest } = useToastApi(props.id)

const mappedOptions = defu(props.options, defaultOptions)
const isExpanded = ref(mappedOptions.layout?.expand === true)
const teleportKey = ref(uuid())
const listRef = ref<MaybeElement>()

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  activeElements,
} = useToastCallback({ id: props.id, mappedOptions, count, oldest })

function onMouseenter() {
  if (mappedOptions.layout?.expand === 'hover') {
    isExpanded.value = true
  }
}

function onMouseleave() {
  if (mappedOptions.layout?.expand === 'hover') {
    isExpanded.value = false
  }
}

function onClick() {
  if (mappedOptions.layout?.expand === 'click') {
    isExpanded.value = true
  }
}

function outsideClickCallback() {
  if (mappedOptions.layout?.expand === 'click') {
    isExpanded.value = false
  }
}

onClickOutside(listRef, outsideClickCallback)
watch(
  () => props.id,
  () => (teleportKey.value = uuid()),
)
</script>

<style lang="css">
@import '@maas/vue-equipment/utils/css/animations/fade-out.css';
@import '@maas/vue-equipment/utils/css/animations/slide-ltr-in.css';
@import '@maas/vue-equipment/utils/css/animations/slide-rtl-in.css';
@import '@maas/vue-equipment/utils/css/animations/slide-ttb-in.css';
@import '@maas/vue-equipment/utils/css/animations/slide-btt-in.css';

:root {
  --magic-toast-enter-animation: unset;
  --magic-toast-leave-animation: fade-out 300ms ease;
  --magic-toast-scale: 0.1;
  --magic-toast-transform-x: 0;
  --magic-toast-transform-y: 0;
  --magic-toast-transition: transform 300ms ease;
  --magic-toast-z-index: 999;
  --magic-toast-gap: 0.75rem;
  --magic-toast-padding-x: 1rem;
  --magic-toast-padding-y: 1rem;

  --mt-multiplier-x: 1;
  --mt-multiplier-y: 1;
  --mt-align-items: flex-start;
  --mt-justify-content: center;
}

.magic-toast {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: var(--magic-toast-z-index, 999);
  background: transparent;
  color: inherit;
  pointer-events: none;
}

.magic-toast__inner {
  position: relative;
  overflow: scroll;
  max-height: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: var(--mt-align-items);
  justify-content: var(--mt-justify-content);
}

.magic-toast__inner * {
  pointer-events: all;
}

.magic-toast.-top-left,
.magic-toast.-top-center,
.magic-toast.-top-right {
  --magic-toast-transform-y: 10;
  --magic-toast-enter-animation: slide-ttb-in 300ms ease;
  --mt-multiplier-y: 1;
  --mt-align-items: flex-start;
  & .magic-toast-component {
    padding-top: var(--magic-toast-padding-y, 1rem);
  }
}

.magic-toast.-bottom-left,
.magic-toast.-bottom-center,
.magic-toast.-bottom-right {
  --magic-toast-transform-y: 10;
  --magic-toast-enter-animation: slide-btt-in 300ms ease;
  --mt-multiplier-y: -1;
  --mt-align-items: flex-end;
  & .magic-toast-component {
    padding-bottom: var(--magic-toast-padding-y, 1rem);
  }
}

.magic-toast.-top-left,
.magic-toast.-bottom-left {
  --mt-justify-content: flex-start;
  & .magic-toast-component {
    padding-left: var(--magic-toast-padding-x, 1rem);
  }
}

.magic-toast.-top-right,
.magic-toast.-bottom-right {
  --mt-justify-content: flex-end;
  & .magic-toast-component {
    padding-right: var(--magic-toast-padding-x, 1rem);
  }
}

.magic-toast.-from-left {
  --magic-toast-enter-animation: slide-ltr-in 300ms ease;
  --magic-toast-transform-y: 0;
  --magic-toast-transform-x: 30;
  --mt-multiplier-x: 1;
}

.magic-toast.-from-right {
  --magic-toast-enter-animation: slide-rtl-in 300ms ease;
  --magic-toast-transform-y: 0;
  --magic-toast-transform-x: 30;
  --mt-multiplier-x: -1;
}

.magic-toast--list-enter-active {
  animation: var(--magic-toast-enter-animation);
}

.magic-toast--list-leave-active {
  animation: var(--magic-toast-leave-animation);
}
</style>
