<template>
  <p>File [mp4]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      provider="file"
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
    >
      <magic-player-controls />
    </magic-player>
  </div>

  <p>Hls [m3u8]</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      provider="hls"
      src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    >
      <magic-player-controls />
    </magic-player>
  </div>

  <p>Mux Timeline Preview</p>
  <div class="w-full aspect-[16/9]">
    <magic-player
      provider="file"
      src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
    >
      <magic-player-controls>
        <template #seekPopover="{ seekedTime, touched }">
          <magic-player-mux-timeline-preview
            v-if="touched"
            playbackId="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
            :time="seekedTime"
            class="mb-[1rem] w-[10rem] rounded-[4px] overflow-hidden"
          />
        </template>
      </magic-player-controls>
    </magic-player>
  </div>
</template>
