<template>
  <div>
    <p>File [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="default-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-overlay id="default-player" />
        <magic-player-controls id="default-player" />
      </magic-player>
    </div>

    <p>Hls [m3u8]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="hls-player"
        src-type="hls"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      >
        <magic-player-overlay id="hls-player" />
        <magic-player-controls id="hls-player" />
      </magic-player>
    </div>

    <p>Popover [mux]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="popover-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-overlay id="popover-player" />
        <magic-player-controls id="popover-player">
          <template #seekPopover>
            <magic-player-mux-popover
              id="popover-player"
              playback-id="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
            />
          </template>
        </magic-player-controls>
      </magic-player>
    </div>

    <p>Standalone controls</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="standalone-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      />
      <div class="relative w-full flex items-center bg-black">
        <magic-player-controls id="standalone-player" class="-standalone" />
      </div>
    </div>
  </div>
</template>
