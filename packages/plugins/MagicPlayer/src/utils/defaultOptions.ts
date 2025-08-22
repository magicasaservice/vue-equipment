import type { RequiredMagicPlayerOptions } from '../types'

const defaultOptions: RequiredMagicPlayerOptions = {
  mode: 'video',
  src: '',
  srcType: 'native',
  preload: 'metadata',
  autoplay: false,
  loop: false,
  debug: false,
  transition: {
    videoControls: 'magic-player-video-controls',
    overlay: 'magic-player-overlay',
    icons: 'magic-player-icons',
  },
  threshold: {
    idle: 3000,
  },
}

export { defaultOptions }
