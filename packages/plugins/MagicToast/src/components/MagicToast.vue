<template>
  <transition :duration="5000">
    <teleport
      v-if="active"
      :to="mappedOptions.teleport?.target"
      :disabled="mappedOptions.teleport?.disabled"
    >
      <div class="magic-toast" :id="toValue(id)" :class="toValue(props.class)">
        <span v-for="toast in instance?.toasts">{{ toast }}</span>
      </div>
    </teleport>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toValue } from '@vueuse/core'
import { defaultOptions } from './../utils/defaultOptions'
import { useToastApi } from '../composables/useToastApi'

import type { MaybeRef } from '@vueuse/core'
import type { DefaultOptions } from './../types/index'

interface MagicToastProps {
  id: MaybeRef<string>
  class: MaybeRef<string>
  options?: DefaultOptions
}

const props = withDefaults(defineProps<MagicToastProps>(), {
  options: () => defaultOptions,
})

const mappedOptions = {
  ...defaultOptions,
  ...props.options,
  teleport: { ...defaultOptions.teleport, ...props.options.teleport },
  transitions: { ...defaultOptions.transitions, ...props.options.transitions },
}

const active = ref(true)

const { instance } = useToastApi(props.id)
</script>

<style lang="css">
:root {
  --magic-toast-z-index: 999;
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
  z-index: var(--magic-toast-z-index);
  background: transparent;
  color: inherit;
  pointer-events: none;
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
</style>
