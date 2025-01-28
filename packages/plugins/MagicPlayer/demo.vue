<template>
  <div class="w-full flex flex-col gap-6">
    <p>Video Poster [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="video-poster-demo-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-poster id="video-poster-demo-player">
          <magic-player
            id="video-poster"
            autoplay
            loop
            src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
          >
            <magic-player-poster id="video-poster-demo-player">
              <img
                src="https://image.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/thumbnail.jpg"
                alt="Poster"
              />
            </magic-player-poster>
          </magic-player>
        </magic-player-poster>
        <magic-player-overlay id="video-poster-demo-player" />
      </magic-player>
    </div>

    <p>Autoplay [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="autoplay-demo-player"
        autoplay
        loop
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
      </magic-player>
    </div>

    <p>Autoplay [hls]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="autoplay-player-hls"
        loop
        src-type="hls"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks.m3u8"
      >
        <magic-player-overlay id="autoplay-player-hls" />
        <magic-player-controls id="autoplay-player-hls" />
      </magic-player>
    </div>

    <p>File [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="default-demo-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-overlay id="default-demo-player" />
        <magic-player-controls id="default-demo-player" />
      </magic-player>
    </div>

    <p>Popover [mux]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="popover-demo-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-overlay id="popover-demo-player" />
        <magic-player-controls id="popover-demo-player">
          <template #seekPopover>
            <magic-player-mux-popover
              id="popover-demo-player"
              playbackId="c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks"
            />
          </template>
        </magic-player-controls>
      </magic-player>
    </div>

    <p>Image Poster [mp4]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="poster-demo-player"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-poster id="poster-demo-player">
          <img
            src="https://image.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/thumbnail.jpg"
            alt="Poster"
          />
        </magic-player-poster>
        <magic-player-overlay id="poster-demo-player" />
      </magic-player>
    </div>

    <p>Standalone controls [after]</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="standalone-controls"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      >
        <magic-player-overlay id="standalone-controls" />
      </magic-player>
      <div class="relative w-full pt-4 flex items-center">
        <magic-player-controls
          id="standalone-controls"
          class="bg-black"
          :standalone="true"
        >
          <template #timelineBefore>
            <magic-player-display-time
              id="standalone-controls"
              type="current"
            />
          </template>
          <template #timelineAfter>
            <magic-player-display-time
              id="standalone-controls"
              type="duration"
            />
          </template>
        </magic-player-controls>
      </div>
    </div>

    <p>Standalone controls [before]</p>
    <div class="relative w-full pb-4 flex items-center">
      <magic-player-controls
        id="standalone-controls-before"
        class="bg-black"
        :standalone="true"
      />
    </div>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="standalone-controls-before"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      />
    </div>

    <p>Api</p>
    <div class="w-full aspect-[16/9]">
      <magic-player
        id="player-api"
        src="https://stream.mux.com/c2sidhKoTaKUTgqqACU8AsRRq02uUbEFLrgGQXDjlJks/high.mp4"
      />
    </div>
    <m-button @click="togglePlay">Toggle Play</m-button>

    <p>Audio Player</p>
    <div class="w-full">
      <magic-audio-player
        id="audio-demo-player"
        src="/demo/magic-player/loveless.mp3"
      />
    </div>

    <p>Audio Player [slot]</p>
    <div class="w-full">
      <magic-audio-player
        id="audio-player-slot"
        src="/demo/magic-player/loveless.mp3"
      >
        <span>Loveless</span>
      </magic-audio-player>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicPlayer } from '@maas/vue-equipment/plugins'

const playerApi = useMagicPlayer('player-api')

function togglePlay() {
  if (playerApi.mediaApi.playing.value) {
    playerApi.videoApi.pause()
  } else {
    playerApi.videoApi.play()
  }
}
</script>
