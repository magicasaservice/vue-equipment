type AccordionMode = 'single' | 'multiple'

export interface MagicAccordionOptions {
  mode?: AccordionMode
  transition?: string
  disabled?: boolean
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

export type AccordionEvents = {
  beforeEnter: {
    id: string
    viewId: string
  }
  enter: {
    id: string
    viewId: string
  }
  afterEnter: {
    id: string
    viewId: string
  }
  beforeLeave: {
    id: string
    viewId: string
  }
  leave: {
    id: string
    viewId: string
  }
  afterLeave: {
    id: string
    viewId: string
  }
}
