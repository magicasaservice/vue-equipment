import MagicCarouselProvider from './src/components/MagicCarouselProvider.vue'
import MagicCarouselSlide from './src/components/MagicCarouselSlide.vue'
import MagicCarouselTrigger from './src/components/MagicCarouselTrigger.vue'
import MagicCarouselTrack from './src/components/MagicCarouselTrack.vue'
import { useMagicCarousel } from './src/composables/useMagicCarousel'
import { MagicCarouselInstanceId } from './src/symbols/index'

import type { App, Plugin } from 'vue'

import type {
  MagicCarouselOptions,
  CarouselTriggerAction,
  CarouselEvents,
} from './src/types/index'

const MagicCarouselPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicCarouselProvider', MagicCarouselProvider)
    app.component('MagicCarouselSlide', MagicCarouselSlide)
    app.component('MagicCarouselTrigger', MagicCarouselTrigger)
    app.component('MagicCarouselTrack', MagicCarouselTrack)
  },
}

export { MagicCarouselPlugin, useMagicCarousel, MagicCarouselInstanceId }

export type { MagicCarouselOptions, CarouselTriggerAction, CarouselEvents }
