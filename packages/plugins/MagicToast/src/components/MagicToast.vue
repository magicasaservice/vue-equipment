<template>
  <Teleport
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <div class="magic-toast" :id="toValue(id)" :class="toValue(props.class)">
      <ol class="magic-toast__inner">
        <transition-group
          :name="mappedOptions.transitions?.list"
          tag="ol"
          class="magic-toast__inner"
          @after-enter="onAfterEnter"
        >
          <li v-for="toast in toasts" :key="toast.id">
            <component
              :is="toast.component"
              v-bind="toast.props"
              @close="toast.remove"
            />
          </li>
        </transition-group>
      </ol>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { toValue, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { defaultOptions } from './../utils/defaultOptions'
import { useToastApi } from './../composables/useToastApi'

import type { Options } from './../types/index'

interface MagicToastProps {
  id: MaybeRef<string>
  class: MaybeRef<string>
  options: Options
}

const props = defineProps<MagicToastProps>()
const mappedOptions = defu(props.options, defaultOptions)

const { toasts, count, oldest } = useToastApi(props.id)

function onAfterEnter() {
  if (
    count.value &&
    mappedOptions.layout?.max &&
    count.value > mappedOptions.layout.max
  ) {
    oldest.value?.remove()
  }
}
</script>

<style lang="css">
:root {
  --magic-toast-z-index: 999;
  --magic-toast-gap: 1rem;
  --magic-toast-padding: 1rem;
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
  padding: var(--magic-toast-padding, 1rem);
  overflow: scroll;
  max-height: 100%;
}

.magic-toast__inner * {
  pointer-events: all;
  margin-bottom: var(--magic-toast-gap, 1rem);
}

.magic-toast.-top {
  justify-content: flex-start;
}

.magic-toast.-bottom {
  justify-content: flex-end;
}

.magic-toast.-left {
  align-items: flex-start;
}

.magic-toast.-right {
  align-items: flex-end;
}

.magic-toast--list-move,
.magic-toast--list-enter-active,
.magic-toast--list-leave-active {
  transition: all 300ms ease-out;
}

.magic-toast--list-enter-from {
  opacity: 0;
  margin-top: translateY(1rem);
}

.magic-toast--list-leave-to {
  opacity: 0;
  margin-top: translateY(1rem);
}

.magic-toast--list-leave-active:not(:only-child) {
  position: absolute;
  z-index: -1;
}
</style>
