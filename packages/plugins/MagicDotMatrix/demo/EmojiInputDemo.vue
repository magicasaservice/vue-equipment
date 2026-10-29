<template>
  <div class="flex w-full flex-col items-center gap-6 py-8">
    <magic-dot-matrix
      id="magic-dot-matrix-emoji-input-demo"
      class="w-40 rounded-xl p-4"
      :style="style"
      :sequence="sequence"
      :options="options"
    />
    <m-badge size="sm" mode="subtle">{{ motion }}</m-badge>
    <div class="flex w-full max-w-xs flex-col gap-3">
      <m-input :model-value="emoji" label="Emoji" @input="onInput" />
      <p class="type-surface-caption text-surface-muted text-center">
        Open the emoji picker with
        <span class="whitespace-nowrap">⌃ ⌘ Space</span> on macOS or
        <span class="whitespace-nowrap">Win + .</span> on Windows.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MBadge, MInput } from 'mirror-compat'
import { useMagicDotMatrixEmoji } from '@maas/vue-equipment/plugins/MagicDotMatrix'

const emoji = ref('🔥')

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const pictographic =
  /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u{20E3}/u

function onInput(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return
  }

  const emojis = [...segmenter.segment(event.target.value)]
    .map(({ segment }) => segment)
    .filter((segment) => pictographic.test(segment))

  emoji.value = emojis.find((entry) => entry !== emoji.value) ?? emojis[0] ?? ''
  event.target.value = emoji.value
}

const { sequence, options, style, motion } = useMagicDotMatrixEmoji(emoji)
</script>

<style>
[data-id='magic-dot-matrix-emoji-input-demo'] {
  --magic-dot-matrix-radius: 0.5;
  background: #000;
}
</style>
