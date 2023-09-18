<template>
  <div>
    <p>File [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-controls />
      </magic-player>
    </div>

    <p>Hls [m3u8]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        src-type="hls"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      >
        <magic-player-controls />
      </magic-player>
    </div>

    <p>Popover [mux]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-controls ref="controls">
          <template #seekPopover>
            <magic-player-mux-popover
              playback-id="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
            />
          </template>
        </magic-player-controls>
      </magic-player>
    </div>
  </div>
</template>
