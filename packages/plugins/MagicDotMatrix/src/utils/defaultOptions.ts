import type {
  MagicDotMatrixEmojiOptions,
  MagicDotMatrixOptions,
} from '../types/index'

const defaultOptions: Required<MagicDotMatrixOptions> = {
  cols: 7,
  rows: 7,
  interval: 100,
  loop: true,
  autoplay: true,
}

const defaultEmojiOptions: Required<MagicDotMatrixEmojiOptions> = {
  cols: 10,
  rows: 10,
  colors: 6,
  threshold: 0.38,
}

export { defaultOptions, defaultEmojiOptions }
