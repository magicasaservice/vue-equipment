<template>
  <div class="aspect-[16/9] w-full">
    <magic-player-provider
      id="magic-player-default-demo"
      :options="{
        src: 'https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4',
      }"
    >
      <magic-player-video />
      <magic-player-poster>
        <magic-player-provider
          id="magic-player-default-demo-poster"
          :options="{
            src: 'https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4',
            autoplay: true,
            loop: true,
          }"
        >
          <magic-player-video />
          <magic-player-poster>
            <img
              src="https://image.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/thumbnail.jpg"
              alt="Poster"
            />
          </magic-player-poster>
        </magic-player-provider>
      </magic-player-poster>
      <magic-player-overlay />
      <magic-player-video-controls>
        <template #popover>
          <magic-player-mux-popover />
        </template>
      </magic-player-video-controls>
    </magic-player-provider>
  </div>
</template>

<style>
@import '@maas/vue-equipment/plugins/MagicPlayer/css/magic-player-video-controls.css';
</style>
