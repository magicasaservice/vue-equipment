type AccordionMode = 'single' | 'multiple'

export interface MagicAccordionOptions {
  mode?: AccordionMode
  transition?: string
}

export interface AccordionView {
  id: string
  active: boolean
}

export interface AccordionState {
  id: string
  views: AccordionView[]
  options: MagicAccordionOptions
}

export type Interaction = 'click' | 'mouseenter'
