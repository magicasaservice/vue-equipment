<template>
  <div class="flex w-full flex-col items-center gap-8 py-8">
    <magic-dot-matrix
      id="magic-dot-matrix-play-pause-demo"
      class="w-24"
      :sequence="sequence"
      :options="{ interval: 80 }"
    />
    <div class="flex w-full max-w-xs gap-2">
      <m-button v-if="!isPlaying" block @click="play">Play</m-button>
      <m-button v-else block @click="pause">Pause</m-button>
      <m-button block mode="translucent" @click="restart">Restart</m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import {
  createComet,
  useMagicDotMatrix,
} from '@maas/vue-equipment/plugins/MagicDotMatrix'

const sequence = createComet({ cols: 7, rows: 7 })

const { play, pause, restart, isPlaying } = useMagicDotMatrix(
  'magic-dot-matrix-play-pause-demo'
)
</script>

<style>
[data-id='magic-dot-matrix-play-pause-demo'] {
  --magic-dot-matrix-radius: 0.5;
}
</style>
