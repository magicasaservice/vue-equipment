import type { App, Plugin } from 'vue'

import MagicAccordionContent from './src/components/MagicAccordionContent.vue'
import MagicAccordionProvider from './src/components/MagicAccordionProvider.vue'
import MagicAccordionTrigger from './src/components/MagicAccordionTrigger.vue'
import MagicAccordionView from './src/components/MagicAccordionView.vue'

import { useMagicAccordion } from './src/composables/useMagicAccordion'

import {
  MagicAccordionInstanceId,
  MagicAccordionViewId,
  MagicAccordionViewActive,
} from './src/symbols/index'

import type { MagicAccordionOptions } from './src/types/index'

const MagicAccordionPlugin: Plugin = {
  install: (app: App) => {
    app.component('MagicAccordionContent', MagicAccordionContent)
    app.component('MagicAccordionProvider', MagicAccordionProvider)
    app.component('MagicAccordionTrigger', MagicAccordionTrigger)
    app.component('MagicAccordionView', MagicAccordionView)
  },
}

export {
  MagicAccordionPlugin,
  useMagicAccordion,
  MagicAccordionInstanceId,
  MagicAccordionViewId,
  MagicAccordionViewActive,
}

export type { MagicAccordionOptions }
