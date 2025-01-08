# Magic Drawer

Magic Drawer is a highly flexible, touch enabled, unstyled drawer component. Useful for replacing a modal on touch devices, shopping carts, menus, and other secondary content.

<component-preview src="./demo/DefaultDemo.vue" />

## Props

| Prop      | Type                 | Required | Description                                                                                             |
| --------- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| id        | `MaybeRef<string>`   | true     | Can either be a string or a [ref](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref). |
| options   | `MagicDrawerOptions` | false    | The drawer’s options. See Options table for details.                                                    |
| component | `Component`          | false    | Pass a Vue component instance. Overrides the drawer’s slot.                                             |

## Options

| Option                                                                                                                                                           | Type                                                                    | Default                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| position<br/>Set the drawer's position relative to the viewport.                                                                                                 | `'top' \| 'right' \| 'bottom' \| 'left'`                                | `'bottom'`                                                                 |
| backdrop<br/>Show or hide a backdrop element. Only visible when the drawer is open.                                                                              | `boolean`                                                               | `true`                                                                     |
| tag<br/>Specify the drawer's HTML element.                                                                                                                       | `'dialog' \| 'div'`                                                     | `'dialog'`                                                                 |
| focusTrap<br/>Pass focus-trap options or disable focus-trapping completely.                                                                                      | `boolean \| FocusTrapOptions`                                           | `{ initialFocus: false, setReturnFocus: false, allowOutsideClick: true }`  |
| scrollLock<br/>Lock body scroll when the drawer is open. If padding is set to true, fixed elements will automatically keep their position on the scrolling axis. | `boolean \| { padding: boolean }`                                       | `{ padding: true }`                                                        |
| snapPoints<br/>Add snap points. Points can either be a decimal between 0 and 1 or an integer with px appended, like `768px`.                                     | `DrawerSnapPoint[]`                                                     | `[1]`                                                                      |
| teleport<br/>Specify the teleport target or disable teleporting the drawer completely.                                                                           | `{ target?: string, disabled?: boolean }`                               | `{ target: 'body', disabled: false }`                                      |
| transition<br/>Set CSS transition classes for the drawer's content and backdrop.                                                                                 | `{ content?: string, backdrop?: string }`                               | `{ content: 'magic-drawer--content', backdrop: 'magic-drawer--backdrop' }` |
| threshold<br/>Configure interaction response thresholds for the drawer. Useful if the drawer interfers with other drag interactions.                             | `{ lock?: number, distance?: number, momentum?: number }`               | `{ lock: 0, distance: 128, momentum: 1 }`                                  |
| animation<br/>Configure the drawer's snap animation behavior.                                                                                                    | `{ snap?: { duration?: number, easing?: (t: number) => number } }`      | `{ snap: { duration: 300 } }`                                              |
| initial<br/>Set the drawer's initial state. If both open and transition are true, the drawer will animate on load.                                               | `{ open?: boolean, transition?: boolean, snapPoint?: DrawerSnapPoint }` | `{ open: false }`                                                          |
| keyListener<br/>Set keyboard keys that close the drawer.                                                                                                         | `{ close?: string[] \| false }`                                         | `{ close: ['Escape'] }`                                                    |
| enableMousewheel<br/>When set to true, the drawer will react to mousewheel input.                                                                                | `boolean`                                                               | `false`                                                                    |
| preventZoom<br/>Prevent zoom when the drawer is open.                                                                                                            | `boolean`                                                               | `true`                                                                     |
| preventDragClose<br/>Prevent closing the drawer via drag.                                                                                                        | `boolean`                                                               | `false`                                                                    |
| disabled<br/>Disable the drawer completely.                                                                                                                      | `boolean`                                                               | `false`                                                                    |
