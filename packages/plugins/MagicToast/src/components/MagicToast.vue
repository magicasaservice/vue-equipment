<template>
  <Teleport
    :to="mappedOptions.teleport?.target"
    :disabled="mappedOptions.teleport?.disabled"
  >
    <div class="magic-toast" :id="toValue(id)" :class="toValue(props.class)">
      <div class="magic-toast__inner">
        <transition-group :name="mappedOptions.transitions?.list">
          <component
            v-for="toast in toasts"
            :key="toast.id"
            :is="toast.component"
            v-bind="toast.props"
            @close="toast.remove"
          />
        </transition-group>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { defu } from 'defu'
import { toValue } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useToastApi } from '../composables/useToastApi'

import type { MaybeRef } from '@vueuse/core'
import type { Options } from './../types/index'

interface MagicToastProps extends Options {
  id: MaybeRef<string>
  class: MaybeRef<string>
}

const props = defineProps<MagicToastProps>()

const mappedOptions = {
  layout: defu(props.layout, defaultOptions.layout),
  transitions: defu(props.transitions, defaultOptions.transitions),
  teleport: defu(props.teleport, defaultOptions.teleport),
}

console.log('mappedOptions:', mappedOptions)

const { toasts, count, oldest } = useToastApi(props.id)

// TODO: put this into the api
watch(count, (value) => {
  if (value && mappedOptions.layout?.max && value > mappedOptions.layout.max) {
    oldest.value?.remove()
  }
})
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
  display: flex;
  flex-direction: column;
  gap: var(--magic-toast-gap, 1rem);
  padding: var(--magic-toast-padding, 1rem);
  pointer-events: all;
  overflow: scroll;
  max-height: 100%;
}

.magic-toast__inner * {
  pointer-events: all;
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

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
