<template>
  <p>File [mp4]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      autoplay
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      id="default-player"
    >
      <magic-player-overlay id="default-player" />
      <magic-player-controls id="default-player" />
    </magic-player>
  </div>

  <p>Hls [m3u8]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      src-type="hls"
      src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      id="hls-player"
    >
      <magic-player-overlay id="hls-player" />
      <magic-player-controls id="hls-player" />
    </magic-player>
  </div>

  <p>Popover [mux]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      id="popover-player"
    >
      <magic-player-overlay id="popover-player" />
      <magic-player-controls id="popover-player">
        <template #seekPopover>
          <magic-player-mux-popover
            id="popover-player"
            playbackId="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
          />
        </template>
      </magic-player-controls>
    </magic-player>
  </div>

  <p>Standalone controls</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      id="standalone-controls"
    />
    <div class="relative w-full pt-4 flex items-center">
      <magic-player-controls id="standalone-controls" class="-standalone" />
    </div>
  </div>

  <p>Standalone controls before video (currently broken)</p>
  <div class="relative w-full pt-4 flex items-center">
    <!-- <magic-player-controls
      id="standalone-controls-before"
      class="-standalone"
    /> -->
  </div>
  <div class="w-full aspect-[16/9]">
    <magic-player
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      id="standalone-controls-before"
    />
  </div>
</template>
