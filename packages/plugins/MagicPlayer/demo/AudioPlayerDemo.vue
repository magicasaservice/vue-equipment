<template>
  <div class="w-full">
    <magic-player-provider
      id="audio-demo-player"
      :options="{ mode: 'audio', src: '/demo/magic-player/loveless.mp3' }"
      class="bg-surface-elevation-high rounded-surface-sm p-2 flex flex-col gap-2"
    >
      <span
        class="w-full block p-4 bg-surface-elevation-base rounded-surface-sm-inset"
      >
        Loveless
      </span>
      <magic-player-audio-controls class="px-4" />
      <magic-player-audio />
    </magic-player-provider>
  </div>
</template>
