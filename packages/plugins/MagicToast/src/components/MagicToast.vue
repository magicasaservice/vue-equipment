<template>
  <Teleport
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
import { defu } from 'defu'
import { toValue, ref, type MaybeRef } from 'vue'
import { onClickOutside, type MaybeElement } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useToastApi } from './../composables/useToastApi'
import { useToastCallbacks } from './../composables/useToastCallbacks'

import MagicToastComponent from './MagicToastComponent.vue'

import type { Options } from './../types/index'

interface MagicToastProps {
  id: MaybeRef<string>
  class: MaybeRef<string>
  options?: Options
}

const props = defineProps<MagicToastProps>()

const { toasts, count, oldest } = useToastApi(props.id)

const mappedOptions = defu(props.options, defaultOptions)
const isExpanded = ref(mappedOptions.layout?.expand === true)
const listRef = ref<MaybeElement>()

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  activeElements,
} = useToastCallbacks({ count, mappedOptions, oldest })

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
</script>

<style lang="css">
:root {
  --magic-toast-enter-x: 0;
  --magic-toast-enter-y: 0;
  --magic-toast-scale: 0.1;
  --magic-toast-transform-x: 0;
  --magic-toast-transform-y: 0;
  --magic-toast-transition: transform 300ms ease-out;
  --magic-toast-z-index: 999;
  --magic-toast-gap: 0.75rem;
  --magic-toast-padding: 1rem;

  --mt-multiplier: 1;
  --mt-transform-x: -50%;
  --mt-transform-y: -50%;
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
  & .magic-toast-component {
    left: 50%;
    top: 50%;
    transform: translateX(var(--mt-transform-x, -50%))
      translateY(var(--mt-transform-y, -50%));
  }
}

.magic-toast__inner * {
  pointer-events: all;
}

.magic-toast.-top-left,
.magic-toast.-top-center,
.magic-toast.-top-right {
  --magic-toast-transform-y: 10;
  --magic-toast-enter-y: -100%;
  --mt-multiplier: 1;
  & .magic-toast-component {
    top: var(--magic-toast-padding, 1rem);
    --mt-transform-y: 0;
  }
}

.magic-toast.-bottom-left,
.magic-toast.-bottom-center,
.magic-toast.-bottom-right {
  --magic-toast-transform-y: 10;
  --magic-toast-enter-y: 100%;
  --mt-multiplier: -1;
  & .magic-toast-component {
    top: unset;
    bottom: var(--magic-toast-padding, 1rem);
    --mt-transform-y: 0;
  }
}

.magic-toast.-top-left,
.magic-toast.-bottom-left {
  & .magic-toast-component {
    left: var(--magic-toast-padding, 1rem);
    --mt-transform-x: 0;
  }
}

.magic-toast.-top-right,
.magic-toast.-bottom-right {
  & .magic-toast-component {
    left: unset;
    right: var(--magic-toast-padding, 1rem);
    --mt-transform-x: 0;
  }
}

.magic-toast.-from-left {
  --magic-toast-enter-x: -100%;
  --magic-toast-enter-y: 0;
  --magic-toast-transform-y: 0;
  --magic-toast-transform-x: -30;
}

.magic-toast.-from-right {
  --magic-toast-enter-x: 100%;
  --magic-toast-enter-y: 0;
  --magic-toast-transform-y: 0;
  --magic-toast-transform-x: 30;
}

.magic-toast--list-enter-active * {
  transition: all 300ms ease-out;
}

.magic-toast--list-enter-from * {
  transform: translateY(var(--magic-toast-enter-y, 0))
    translateX(var(--magic-toast-enter-x, 0));
}

.magic-toast--list-leave-active {
  transition: all 300ms ease-out;
}

.magic-toast--list-leave-to {
  opacity: 0;
}
</style>
