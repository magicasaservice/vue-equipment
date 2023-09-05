<template>
  <Teleport
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <div class="magic-toast" :id="toValue(id)" :class="toValue(props.class)">
      <transition-group
        tag="ol"
        class="magic-toast__inner"
        :name="mappedOptions.transitions!.list"
        :on-enter="onEnter"
        :on-before-enter="onBeforeEnter"
        :on-after-enter="onAfterEnter"
      >
        <magic-toast-component
          v-for="(toast, index) in toasts"
          :key="toast.id"
          ref="itemRef"
          :index="index"
          :total="count || 0"
          :transition="mappedOptions.transitions!.item"
          @mouseenter="onMouseenter"
        >
          <component
            :is="toast.component"
            v-bind="toast.props"
            @close="toast.remove"
          />
        </magic-toast-component>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { toValue, ref, type MaybeRef } from 'vue'
import { defaultOptions } from './../utils/defaultOptions'
import { useToastApi } from './../composables/useToastApi'

import MagicToastComponent from './MagicToastComponent.vue'

import type { Options } from './../types/index'

interface MagicToastProps {
  id: MaybeRef<string>
  class: MaybeRef<string>
  options?: Options
}

const props = defineProps<MagicToastProps>()
const emit = defineEmits<{
  onEnter: [el: Element]
  onBeforeEnter: [el: Element]
  onAfterEnter: [el: Element]
}>()

const mappedOptions = defu(props.options, defaultOptions)
const itemRef = ref<HTMLElement[] | null>(null)

const { toasts, count, oldest } = useToastApi(props.id)

function onBeforeEnter(el: Element) {
  emit('onBeforeEnter', el)
}

function onEnter(el: Element) {
  emit('onEnter', el)
  if (
    count.value &&
    mappedOptions.layout?.max &&
    count.value > mappedOptions.layout.max
  ) {
    oldest.value?.remove()
  }
}

function onAfterEnter(el: Element) {
  emit('onAfterEnter', el)
}

function onMouseenter(event: Event) {
  console.log('onMouseenter', event)
}
</script>

<style lang="css">
:root {
  --magic-toast-enter-y: 100%;
  --magic-toast-scale: 0.15;
  --magic-toast-transformY: 10;
  --magic-toast-transition: transform 300ms ease-out;
  --magic-toast-z-index: 999;
  --magic-toast-gap: 1rem;
  --magic-toast-padding: 1rem;

  --mt-multiplier: 1;
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
    transform: translateX(-50%);
  }
}

.magic-toast__inner * {
  pointer-events: all;
}

.magic-toast.-top {
  --magic-toast-enter-y: -100%;
  --magic-toast-leave-y: -100%;
  --mt-multiplier: 1;
  & .magic-toast-component {
    top: var(--magic-toast-padding, 1rem);
  }
}

.magic-toast.-bottom {
  --magic-toast-enter-y: 100%;
  --magic-toast-leave-y: 100%;
  --mt-multiplier: -1;
  & .magic-toast-component {
    bottom: var(--magic-toast-padding, 1rem);
  }
}

.magic-toast.-left {
  & .magic-toast-component {
    left: var(--magic-toast-padding, 1rem);
    transform: none;
  }
}

.magic-toast.-right {
  & .magic-toast-component {
    left: unset;
    right: var(--magic-toast-padding, 1rem);
    transform: none;
  }
}

.magic-toast--list-enter-active * {
  transition: all 300ms ease-out;
}

.magic-toast--list-enter-from * {
  transform: translateY(var(--magic-toast-enter-y, 0));
}

.magic-toast--list-leave-active {
  transition: all 300ms ease-out;
}

.magic-toast--list-leave-to {
  opacity: 0;
}
</style>
