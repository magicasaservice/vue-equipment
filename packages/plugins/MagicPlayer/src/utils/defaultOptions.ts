import type { MagicPlayerOptions } from '../types'

const defaultOptions: MagicPlayerOptions = {
  mode: 'video',
  src: '',
  srcType: 'native',
  preload: 'metadata',
  autoplay: false,
  loop: false,
  transition: {
    videoControls: 'magic-player-video-controls',
  },
}

export { defaultOptions }
