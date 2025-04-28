import type { RequiredMagicPlayerOptions } from '../types'

const defaultOptions: RequiredMagicPlayerOptions = {
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
