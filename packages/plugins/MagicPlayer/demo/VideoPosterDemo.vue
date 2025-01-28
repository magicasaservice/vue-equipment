<template>
  <div class="w-full aspect-[16/9]">
    <magic-player
      id="video-poster-demo-player"
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
    >
      <magic-player-poster>
        <magic-player
          id="video-poster-demo-poster-player"
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
    </magic-player>
  </div>
</template>
