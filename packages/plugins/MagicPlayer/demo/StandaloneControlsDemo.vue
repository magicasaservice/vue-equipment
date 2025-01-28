<template>
  <div class="w-full aspect-[16/9]">
    <magic-player
      id="standalone-controls-demo"
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
    >
      <magic-player-overlay />
    </magic-player>
    <div class="relative w-full pt-4 flex items-center">
      <magic-player-controls
        id="standalone-controls-demo"
        class="bg-black"
        standalone
      >
        <template #timeline-before>
          <magic-player-display-time type="current" />
        </template>
        <template #timeline-after>
          <magic-player-display-time type="duration" />
        </template>
      </magic-player-controls>
    </div>
  </div>
</template>
