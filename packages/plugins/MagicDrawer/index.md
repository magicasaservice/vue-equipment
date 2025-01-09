# Magic Drawer

Magic Drawer is a highly flexible, touch enabled, unstyled drawer component. Useful for replacing a modal on touch devices, shopping carts, menus, and other secondary content.

<component-preview src='./demo/DefaultDemo.vue' />

## Props

<ProseTable :columns="[
    {
      label: 'Prop',
      items: [
        {
          label: 'id',
        },
        {
          label: 'options',
        },
        {
          label: 'component',
        }
      ]
    },
    {
      label: 'Type',
      items: [
        {
          label: 'MaybeRef<string>',
          code: true
        },
        {
          label: 'MagicDrawerOptions',
          code: true
        },
        {
          label: 'Component',
          code: true
        }
      ]
    },
    {
      label: 'Required',
      items: [
        {
          label: 'true',
        },
        {
          label: 'false',
        },
        {
          label: 'false',
        }
      ]
    },
    {
      label: 'Description',
      items: [
        {
          label: '',
          description: 'Can either be a string or a ref.',
        },
        {
          label: '',
          description: 'See Options table for details.',
        },
        {
          label: '',
          description: 'Optionally pass a Vue component instance. Renders in place of the drawer\'s slot.',
        }
      ]
    }
  ]"
/>

## Options

<ProseTable :columns="[
  {
    label: 'Option',
    items: [
      {
        label: 'position',
        description: 'Set the drawer\’s position relative to the viewport.'
      },
      {
        label: 'backdrop',
        description: 'Show or hide a backdrop element. Only visible when the drawer is open.'
      },
      {
        label: 'tag',
        description: 'Specify the drawer\’s HTML element.'
      },
      {
        label: 'focusTrap',
        description: 'Pass focus-trap options or disable focus-trapping completely.'
      },
      {
        label: 'scrollLock',
        description: 'Lock body scroll when the drawer is open. If padding is set to true, fixed elements will automatically keep their position on the scrolling axis.'
      },
      {
        label: 'snapPoints',
        description: 'Add snap points. Points can either be a decimal between 0 and 1 or an integer with px appended, like \'768px\'.'
      },
      {
        label: 'teleport',
        description: 'Specify the teleport target or disable teleporting the drawer completely.'
      },
      {
        label: 'transition',
        description: 'Set CSS transition classes for the drawer’s content and backdrop.'
      },
      {
        label: 'threshold',
        description: 'Configure interaction response thresholds for the drawer. Useful if the drawer interfers with other drag interactions.'
      },
      {
        label: 'animation',
        description: 'Configure the drawer’s snap animation behavior.'
      },
      {
        label: 'initial',
        description: 'Set the drawer’s initial state. If both open and transition are true, the drawer will animate on load.'
      },
      {
        label: 'keyListener',
        description: 'Set keyboard keys that close the drawer.'
      },
      {
        label: 'enableMousewheel',
        description: 'When set to true, the drawer will react to mousewheel input.'
      },
      {
        label: 'preventZoom',
        description: 'Prevent zoom when the drawer is open.'
      },
      {
        label: 'preventDragClose',
        description: 'Prevent the drawer from being closed by dragging.'
      },
      {
        label: 'disabled',
        description: 'Disable the drawer completely.'
      }
    ]
  },
  {
    label: 'Type',
    items: [
      {
        label: '\'top\' | \'right\' | \'bottom\' | \'left\''
      },
      {
        label: 'boolean'
      },
      {
        label: '\'dialog\' | \'div\''
      },
      {
        label: 'boolean | FocusTrapOptions',
        description: 'A complete list of options can be found [here](https://github.com/focus-trap/focus-trap)'
      },
      {
        label: 'boolean | object',
        description: 'boolean | { padding: boolean }',
        code: true
      },
      {
        label: 'DrawerSnapPoint[]',
        description: 'Array<number | `${string}px`>',
        code: true
      },
      {
        label: 'object',
        description: '{ target?: string, disabled?: boolean }',
        code: true
      },
      {
        label: 'object',
        description: '{ content?: string, backdrop?: string }',
        code: true
      },
      {
        label: 'object',
        description: '{ lock?: number, distance?: number, momentum?: number }',
        code: true
      },
      {
        label: 'object',
        description: '{ snap?: { duration?: number, easing?: (t: number) => number } }',
        code: true
      },
      {
        label: 'object',
        description: '{ open?: boolean, transition?: boolean, snapPoint?: DrawerSnapPoint }',
        code: true
      },
      {
        label: 'object',
        description: '{ close?: string[] | false }',
        code: true
      },
      {
        label: 'boolean'
      },
      {
        label: 'boolean'
      },
      {
        label: 'boolean'
      },
      {
        label: 'boolean'
      }
    ]
  },
  {
    label: 'Default',
    items: [
      {
        label: '\'bottom\''
      },
      {
        label: 'true'
      },
      {
        label: '\'dialog\''
      },
      {
        label: 'object',
        description: '{ initialFocus: false, setReturnFocus: false, allowOutsideClick: true }',
        code: true
      },
      {
        label: 'object',
        description: '{ padding: true }',
        code: true
      },
      {
        label: '[1]'
      },
      {
        label: 'object',
        description: '{ target: \'body\', disabled: false }',
        code: true
      },
      {
        label: 'object',
        description: '{ content: \'magic-drawer--content\', backdrop: \'magic-drawer--backdrop\' }',
        code: true
      },
      {
        label: 'object',
        description: '{ lock: 0, distance: 128, momentum: 1 }',
        code: true
      },
      {
        label: 'object',
        description: '{ snap: { duration: 300 } }',
        code: true
      },
      {
        label: 'object',
        description: '{ open: false }',
        code: true
      },
      {
        label: 'object',
        description: '{ close: [\'Escape\'] }',
        code: true
      },
      {
        label: 'false'
      },
      {
        label: 'true'
      },
      {
        label: 'false'
      },
      {
        label: 'false'
      }
    ]
  }
]"
/>
