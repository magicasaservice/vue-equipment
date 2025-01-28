<template>
  <div class="w-full aspect-[16/9]">
    <magic-player
      id="default-demo-player"
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
    >
      <magic-player-poster>
        <magic-player
          id="default-demo-player-poster"
          autoplay
          loop
          src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
        >
          <magic-player-poster>
            <img
              src="https://image.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/thumbnail.jpg"
              alt="Poster"
            />
          </magic-player-poster>
        </magic-player>
      </magic-player-poster>
      <magic-player-overlay />
      <magic-player-controls>
        <template #seek-popover>
          <magic-player-mux-popover
            playbackId="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
          />
        </template>
      </magic-player-controls>
    </magic-player>
  </div>
</template>
