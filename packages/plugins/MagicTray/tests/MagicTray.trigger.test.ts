import { describe, it, expect } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, nextTick, computed, reactive, ref } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import MagicTrayTrigger from '../src/components/MagicTrayTrigger.vue'
import { useMagicTray } from '../src/composables/useMagicTray'
import { useMagicEmitter } from '../../MagicEmitter'
import { mountWithApp } from '../../tests/utils'
import { TrayId, TestId } from './enums'

import type { MagicTrayOptions, MagicTraySide } from '../src/types/index'

const options: MagicTrayOptions = {
  snapPoints: { left: [0, '100px'] },
  initial: { snapPoints: { left: '100px' } },
  threshold: { distance: 32, lock: 5, momentum: Infinity },
}

type TriggerProps = {
  side?: MagicTraySide
  disabled?: boolean
}

function createTray(id: TrayId, triggerProps: TriggerProps = {}) {
  const { side = 'left', disabled = false } = triggerProps

  return defineComponent({
    components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
    setup() {
      const { state, activeSnapPoint } = useMagicTray(id)
      const draggedLeft = computed(() => state.dragged.left)
      const activeLeft = computed(() => activeSnapPoint.value.left)
      const dragging = computed(() => state.dragging)
      const clicks = ref(0)
      return {
        options,
        side,
        disabled,
        draggedLeft,
        activeLeft,
        dragging,
        clicks,
      }
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <span data-test-id="${TestId.DraggedLeft}">{{ draggedLeft }}</span>
        <span data-test-id="${TestId.ActiveLeft}">{{ activeLeft }}</span>
        <span data-test-id="${TestId.Dragging}">{{ dragging }}</span>
        <span data-test-id="${TestId.Clicks}">{{ clicks }}</span>
        <MagicTrayTrigger :side="side" :disabled="disabled" data-test-id="${TestId.Trigger}">
          <button data-test-id="${TestId.TriggerButton}" style="width: 120px; height: 40px;" @click="clicks++">Item</button>
          <input data-test-id="${TestId.TriggerInput}" />
        </MagicTrayTrigger>
        <MagicTrayContent>
          <div style="width: 200px; height: 200px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
  })
}

function pointer(type: string, clientX: number) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    isPrimary: true,
    clientX,
    clientY: 100,
  })
}

async function mount(component: ReturnType<typeof defineComponent>) {
  const result = mountWithApp(component)
  await nextTick()
  await new Promise((r) => setTimeout(r, 100))
  return result
}

function find(container: HTMLElement, id: TestId) {
  return container.querySelector<HTMLElement>(`[data-test-id="${id}"]`)!
}

async function drag(target: Element, from: number, to: number) {
  target.dispatchEvent(pointer('pointerdown', from))
  await nextTick()
  document.dispatchEvent(pointer('pointermove', to))
  await nextTick()
  document.dispatchEvent(pointer('pointerup', to))
  await nextTick()
}

describe('MagicTray - Trigger', () => {
  describe('rendering', () => {
    it('renders a trigger with its side and tray id', async () => {
      const { container } = await mount(createTray(TrayId.TriggerRender))
      const trigger = find(container, TestId.Trigger)

      expect(trigger.classList.contains('magic-tray-trigger')).toBe(true)
      expect(trigger.getAttribute('data-side')).toBe('left')
      expect(trigger.getAttribute('data-id')).toBe(
        `${TrayId.TriggerRender}-trigger`
      )
      expect(trigger.getAttribute('data-dragging')).toBe('false')
    })

    it('leaves scrolling across the drag axis to the browser', async () => {
      const { container } = await mount(createTray(TrayId.TriggerTouchAction))
      const trigger = find(container, TestId.Trigger)

      expect(getComputedStyle(trigger).touchAction).toBe('pan-y')
    })

    it('leaves scrolling across the drag axis to the browser on a top trigger', async () => {
      const { container } = await mount(
        createTray(TrayId.TriggerTouchActionX, { side: 'top' })
      )
      const trigger = find(container, TestId.Trigger)

      expect(getComputedStyle(trigger).touchAction).toBe('pan-x')
    })

    it('renders the slotted element itself with asChild', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerAsChild}" :options="{ snapPoints: { left: [0, '100px'] } }">
            <MagicTrayTrigger side="left" as-child>
              <aside data-test-id="${TestId.Trigger}">Panel</aside>
            </MagicTrayTrigger>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      const panel = find(container, TestId.Trigger)

      expect(panel.tagName).toBe('ASIDE')
      expect(panel.classList.contains('magic-tray-trigger')).toBe(true)
      expect(panel.getAttribute('data-side')).toBe('left')
    })
  })

  describe('interactions', () => {
    it('dragging a trigger moves its side', async () => {
      const { container } = await mount(createTray(TrayId.TriggerDrag))
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')

      await drag(find(container, TestId.Trigger), 150, 60)

      expect(find(container, TestId.ActiveLeft).textContent).toBe('0')
    })

    it('a tap on a trigger reaches the element inside', async () => {
      const { container } = await mount(createTray(TrayId.TriggerTap))
      const button = find(container, TestId.TriggerButton)

      button.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 150))
      await nextTick()
      button.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
      await nextTick()

      expect(find(container, TestId.Clicks).textContent).toBe('1')
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')
    })

    it('a tap emits the drag and snap events while the side stays put', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const { activeSnapPoint } = useMagicTray(TrayId.TriggerTapEvents)
          const activeLeft = computed(() => activeSnapPoint.value.left)
          const emitter = useMagicEmitter()
          const events = reactive<Array<string>>([])

          function record(name: string) {
            return (payload: { id: string }) => {
              if (payload.id === TrayId.TriggerTapEvents) {
                events.push(name)
              }
            }
          }

          emitter.on('beforeDrag', record('beforeDrag'))
          emitter.on('willSnapTo', record('willSnapTo'))
          emitter.on('drag', record('drag'))
          emitter.on('afterDrag', record('afterDrag'))
          emitter.on('beforeSnap', record('beforeSnap'))
          emitter.on('afterSnap', record('afterSnap'))

          return { options, activeLeft, events }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerTapEvents}" :options="options">
            <span data-test-id="${TestId.ActiveLeft}">{{ activeLeft }}</span>
            <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
            <MagicTrayTrigger side="left" data-test-id="${TestId.Trigger}">Panel</MagicTrayTrigger>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      const trigger = find(container, TestId.Trigger)

      trigger.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointerup', 150))
      await nextTick()

      expect(find(container, TestId.Events).textContent).toBe(
        'beforeDrag,willSnapTo,drag,beforeSnap,afterSnap,afterDrag'
      )
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')
    })

    it('a drag on a trigger swallows the click of the element inside', async () => {
      const { container } = await mount(createTray(TrayId.TriggerSuppress))
      const button = page.elementLocator(find(container, TestId.TriggerButton))

      await userEvent.dragAndDrop(button, button, {
        sourcePosition: { x: 100, y: 20 },
        targetPosition: { x: 10, y: 20 },
        force: true,
      })

      await expect
        .poll(() => find(container, TestId.ActiveLeft).textContent)
        .toBe('0')
      expect(find(container, TestId.Clicks).textContent).toBe('0')
    })

    it('a wobbly tap on a trigger keeps its click', async () => {
      const { container } = await mount(createTray(TrayId.TriggerWobble))
      const button = page.elementLocator(find(container, TestId.TriggerButton))

      await userEvent.dragAndDrop(button, button, {
        sourcePosition: { x: 10, y: 20 },
        targetPosition: { x: 7, y: 20 },
      })

      await expect
        .poll(() => find(container, TestId.Clicks).textContent)
        .toBe('1')
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')
    })

    it('a press on a text field inside a trigger never drags', async () => {
      const { container } = await mount(createTray(TrayId.TriggerEditable))
      const input = find(container, TestId.TriggerInput)
      const resting = find(container, TestId.DraggedLeft).textContent

      input.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 60))
      await nextTick()

      expect(find(container, TestId.Dragging).textContent).toBe('false')
      expect(find(container, TestId.DraggedLeft).textContent).toBe(resting)

      document.dispatchEvent(pointer('pointerup', 60))
    })

    it('locks text selection only once a trigger drag passes the lock threshold', async () => {
      const { container } = await mount(createTray(TrayId.TriggerSelection))
      const trigger = find(container, TestId.Trigger)
      const { style } = document.documentElement

      trigger.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 148))
      await nextTick()
      expect(style.userSelect).toBe('')

      document.dispatchEvent(pointer('pointermove', 110))
      await nextTick()
      expect(style.userSelect).toBe('none')

      document.dispatchEvent(pointer('pointerup', 110))
      await nextTick()
      expect(style.userSelect).toBe('')
    })

    it('reports its own drag through data-dragging', async () => {
      const { container } = await mount(createTray(TrayId.TriggerDragging))
      const trigger = find(container, TestId.Trigger)

      trigger.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      expect(trigger.getAttribute('data-dragging')).toBe('true')

      document.dispatchEvent(pointer('pointerup', 150))
      await nextTick()
      expect(trigger.getAttribute('data-dragging')).toBe('false')
    })

    it('a handle drag leaves the trigger at rest', async () => {
      const { container } = await mount(createTray(TrayId.TriggerHandleDrag))
      const trigger = find(container, TestId.Trigger)
      const handle = container.querySelector(
        '.magic-tray-handle[data-side="left"]'
      )!

      handle.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()

      expect(find(container, TestId.Dragging).textContent).toBe('true')
      expect(trigger.getAttribute('data-dragging')).toBe('false')

      document.dispatchEvent(pointer('pointerup', 150))
    })

    it('a trigger outside the provider drags the tray its id names', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const { activeSnapPoint } = useMagicTray(TrayId.TriggerOutside)
          const activeLeft = computed(() => activeSnapPoint.value.left)
          return { options, activeLeft }
        },
        template: `
          <div>
            <span data-test-id="${TestId.ActiveLeft}">{{ activeLeft }}</span>
            <MagicTrayTrigger id="${TrayId.TriggerOutside}" side="left" data-test-id="${TestId.Trigger}">
              Panel
            </MagicTrayTrigger>
            <MagicTrayProvider id="${TrayId.TriggerOutside}" :options="options">
              <MagicTrayContent>
                <div style="width: 200px; height: 200px;">Content</div>
              </MagicTrayContent>
            </MagicTrayProvider>
          </div>
        `,
      })

      const { container } = await mount(component)
      await drag(find(container, TestId.Trigger), 150, 60)

      expect(find(container, TestId.ActiveLeft).textContent).toBe('0')
    })

    it('a click after a drag released outside the trigger passes through', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const clicks = ref(0)
          return { options, clicks }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerOutsideRelease}" :options="options">
            <span data-test-id="${TestId.Clicks}">{{ clicks }}</span>
            <div data-test-id="${TestId.Outside}" style="width: 200px; height: 40px;"></div>
            <MagicTrayTrigger side="left" data-test-id="${TestId.Trigger}">
              <button data-test-id="${TestId.TriggerButton}" style="width: 120px; height: 40px;" @click="clicks++">Item</button>
            </MagicTrayTrigger>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      const button = find(container, TestId.TriggerButton)

      await userEvent.dragAndDrop(
        page.elementLocator(button),
        page.elementLocator(find(container, TestId.Outside))
      )
      expect(find(container, TestId.Clicks).textContent).toBe('0')

      button.focus()
      await userEvent.keyboard('{Enter}')

      await expect
        .poll(() => find(container, TestId.Clicks).textContent)
        .toBe('1')
    })

    it('a link inside a trigger drags the side instead of starting a native drag', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const { state, activeSnapPoint } = useMagicTray(
            TrayId.TriggerNativeDrag
          )
          const activeLeft = computed(() => activeSnapPoint.value.left)
          const dragging = computed(() => state.dragging)
          const nativeDrags = ref(0)
          document.addEventListener('dragstart', () => nativeDrags.value++)
          return { options, activeLeft, dragging, nativeDrags }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerNativeDrag}" :options="options">
            <div style="position: relative; width: 500px; height: 120px;">
              <div data-test-id="${TestId.TriggerDropZone}" style="position: absolute; left: 0; top: 0; width: 40px; height: 100px;"></div>
              <span data-test-id="${TestId.ActiveLeft}" style="position: absolute; left: 60px; top: 0;">{{ activeLeft }}</span>
              <span data-test-id="${TestId.Dragging}" style="position: absolute; left: 60px; top: 40px;">{{ dragging }}</span>
              <span data-test-id="${TestId.Events}" style="position: absolute; left: 60px; top: 80px;">{{ nativeDrags }}</span>
              <MagicTrayTrigger side="left" style="position: absolute; left: 200px; top: 0; width: 250px; height: 100px;">
                <a href="#" data-test-id="${TestId.TriggerLink}" style="display: block; width: 250px; height: 100px;">Link</a>
              </MagicTrayTrigger>
            </div>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')

      await userEvent.dragAndDrop(
        page.getByTestId(TestId.TriggerLink),
        page.getByTestId(TestId.TriggerDropZone)
      )

      await expect
        .poll(() => find(container, TestId.ActiveLeft).textContent, {
          timeout: 2000,
        })
        .toBe('0')
      expect(find(container, TestId.Dragging).textContent).toBe('false')
      expect(find(container, TestId.Events).textContent).toBe('0')
    })

    it('a press on a textarea or editable text never drags', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const { state } = useMagicTray(TrayId.TriggerEditableText)
          const dragging = computed(() => state.dragging)
          return { options, dragging }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerEditableText}" :options="options">
            <span data-test-id="${TestId.Dragging}">{{ dragging }}</span>
            <MagicTrayTrigger side="left" data-test-id="${TestId.Trigger}">
              <textarea data-test-id="${TestId.TriggerTextarea}"></textarea>
              <div contenteditable="true"><span data-test-id="${TestId.TriggerEditable}">Text</span></div>
            </MagicTrayTrigger>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)

      for (const id of [TestId.TriggerTextarea, TestId.TriggerEditable]) {
        find(container, id).dispatchEvent(pointer('pointerdown', 150))
        await nextTick()
        document.dispatchEvent(pointer('pointermove', 60))
        await nextTick()

        expect(find(container, TestId.Dragging).textContent).toBe('false')

        document.dispatchEvent(pointer('pointerup', 60))
        await nextTick()
      }
    })

    it('a scroll taking over the touch returns the side to rest', async () => {
      const { container } = await mount(
        createTray(TrayId.TriggerScrollTakeover)
      )
      const trigger = find(container, TestId.Trigger)
      const resting = find(container, TestId.DraggedLeft).textContent

      trigger.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 140))
      await nextTick()
      expect(find(container, TestId.DraggedLeft).textContent).not.toBe(resting)

      document.dispatchEvent(pointer('pointercancel', 140))
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      expect(find(container, TestId.Dragging).textContent).toBe('false')
      expect(find(container, TestId.DraggedLeft).textContent).toBe(resting)
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')
    })
  })

  describe('edge cases', () => {
    it('throws without a provider or an id', () => {
      const component = defineComponent({
        components: { MagicTrayTrigger },
        template: `<MagicTrayTrigger side="left" />`,
      })

      expect(() => mountWithApp(component)).toThrow(
        /MagicTrayTrigger must be nested inside MagicTrayProvider or an id must be provided/
      )
    })

    it('a disabled trigger never drags', async () => {
      const { container } = await mount(
        createTray(TrayId.TriggerDisabled, { disabled: true })
      )
      const trigger = find(container, TestId.Trigger)
      expect(trigger.getAttribute('data-disabled')).toBe('true')
      expect(getComputedStyle(trigger).touchAction).toBe('auto')

      await drag(trigger, 150, 60)

      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')
    })

    it('disabling the tray mid-drag returns the trigger’s side to rest', async () => {
      const trayOptions = ref<MagicTrayOptions>(options)

      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const { state, activeSnapPoint } = useMagicTray(
            TrayId.TriggerDisabledMidDrag
          )
          const activeLeft = computed(() => activeSnapPoint.value.left)
          const dragging = computed(() => state.dragging)
          return { trayOptions, activeLeft, dragging }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerDisabledMidDrag}" :options="trayOptions">
            <span data-test-id="${TestId.ActiveLeft}">{{ activeLeft }}</span>
            <span data-test-id="${TestId.Dragging}">{{ dragging }}</span>
            <MagicTrayTrigger side="left" data-test-id="${TestId.Trigger}">Panel</MagicTrayTrigger>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      const trigger = find(container, TestId.Trigger)

      trigger.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 60))
      await nextTick()
      expect(find(container, TestId.Dragging).textContent).toBe('true')

      trayOptions.value = { ...options, disabled: true }
      await nextTick()
      await nextTick()

      expect(find(container, TestId.Dragging).textContent).toBe('false')
      expect(trigger.getAttribute('data-dragging')).toBe('false')
      expect(find(container, TestId.ActiveLeft).textContent).toBe('100px')

      document.dispatchEvent(pointer('pointerup', 60))
    })

    it('a trigger on a side without snap points never drags', async () => {
      const { container } = await mount(
        createTray(TrayId.TriggerNoSnapPoints, { side: 'right' })
      )

      find(container, TestId.Trigger).dispatchEvent(pointer('pointerdown', 150))
      await nextTick()

      expect(find(container, TestId.Dragging).textContent).toBe('false')

      document.dispatchEvent(pointer('pointerup', 150))
    })

    it('a trigger never drags before the tray content is measured', async () => {
      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayTrigger },
        setup() {
          const { state } = useMagicTray(TrayId.TriggerUnmeasured)
          const dragging = computed(() => state.dragging)
          return { dragging }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerUnmeasured}" :options="{ snapPoints: { left: [0, '100px'] } }">
            <span data-test-id="${TestId.Dragging}">{{ dragging }}</span>
            <MagicTrayTrigger side="left" data-test-id="${TestId.Trigger}">Panel</MagicTrayTrigger>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      find(container, TestId.Trigger).dispatchEvent(pointer('pointerdown', 150))
      await nextTick()

      expect(find(container, TestId.Dragging).textContent).toBe('false')

      document.dispatchEvent(pointer('pointerup', 150))
    })

    it('a trigger unmounted mid-drag returns its side to rest', async () => {
      const show = ref(true)

      const component = defineComponent({
        components: { MagicTrayProvider, MagicTrayContent, MagicTrayTrigger },
        setup() {
          const { state } = useMagicTray(TrayId.TriggerUnmount)
          const dragging = computed(() => state.dragging)
          const draggedLeft = computed(() => state.dragged.left)
          const snappedLeft = computed(() => state.snapped.left)
          return { options, show, dragging, draggedLeft, snappedLeft }
        },
        template: `
          <MagicTrayProvider id="${TrayId.TriggerUnmount}" :options="options">
            <span data-test-id="${TestId.Dragging}">{{ dragging }}</span>
            <span data-test-id="${TestId.DraggedLeft}">{{ draggedLeft }}</span>
            <span data-test-id="${TestId.SnappedLeft}">{{ snappedLeft }}</span>
            <MagicTrayTrigger v-if="show" side="left" data-test-id="${TestId.Trigger}">Panel</MagicTrayTrigger>
            <MagicTrayContent>
              <div style="width: 200px; height: 200px;">Content</div>
            </MagicTrayContent>
          </MagicTrayProvider>
        `,
      })

      const { container } = await mount(component)
      const trigger = find(container, TestId.Trigger)

      trigger.dispatchEvent(pointer('pointerdown', 150))
      await nextTick()
      document.dispatchEvent(pointer('pointermove', 130))
      await nextTick()
      expect(find(container, TestId.Dragging).textContent).toBe('true')

      show.value = false
      await nextTick()
      await new Promise((r) => setTimeout(r, 400))

      expect(find(container, TestId.Dragging).textContent).toBe('false')
      expect(find(container, TestId.DraggedLeft).textContent).toBe(
        find(container, TestId.SnappedLeft).textContent
      )

      document.dispatchEvent(pointer('pointerup', 130))
    })
  })
})
