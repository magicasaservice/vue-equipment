<template>
  <div class="w-full">
    <magic-player-provider
      id="magic-player-audio-demo"
      :options="{ mode: 'audio', src: '/demo/magic-player/loveless.mp3' }"
      class="bg-surface-elevation-high rounded-surface-sm flex flex-col gap-2 p-2"
    >
      <span
        class="bg-surface-elevation-base rounded-surface-sm-inset type-surface-callout-md block w-full p-4"
      >
        Loveless
      </span>
      <magic-player-audio-controls class="px-4" />
      <magic-player-audio />
    </magic-player-provider>
  </div>
</template>

<style>
@import '@maas/vue-equipment/plugins/MagicPlayer/css/magic-player-audio-controls.css';
</style>
