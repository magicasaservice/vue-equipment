<template>
  <div v-show="!loaded || !touched" class="magic-player-poster">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { usePlayerRuntime } from '../composables/private/usePlayerRuntime'
import { usePlayerVideoApi } from '../composables/private/usePlayerVideoApi'

export type MagicPlayerPosterProps = {
  id: string
}
const props = defineProps<MagicPlayerPosterProps>()

const { loaded } = usePlayerRuntime({
  id: props.id,
})

const { touched } = usePlayerVideoApi({
  id: props.id,
})
</script>

<style lang="css">
.magic-player-poster {
  position: absolute;
  inset: 0;
}
</style>
