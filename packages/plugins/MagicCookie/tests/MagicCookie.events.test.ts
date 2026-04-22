import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import MagicCookieProvider from '../src/components/MagicCookieProvider.vue'
import MagicCookieItem from '../src/components/MagicCookieItem.vue'
import { useMagicCookie } from '../src/composables/useMagicCookie'
import { mountWithApp } from '../../tests/utils'
import { CookieId, ItemId, TestId } from './enums'

// ─── Stubs ────────────────────────────────────────────────────────────────────

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  template: '<slot />',
})

// ─── Factory ──────────────────────────────────────────────────────────────────

function createEventWrapper(cookieId: CookieId) {
  return defineComponent({
    components: { MagicCookieProvider, MagicCookieItem, ClientOnly },
    setup() {
      const api = useMagicCookie(cookieId)
      const events = reactive<string[]>([])
      const lastPayload = ref<unknown>(null)

      api.onAccept((args: unknown) => {
        events.push('acceptAll')
        lastPayload.value = args
      })

      api.onReject((args: unknown) => {
        events.push('rejectAll')
        lastPayload.value = args
      })

      api.onAcceptSelected((args: unknown) => {
        events.push('acceptSelected')
        lastPayload.value = args
      })

      return { ...api, events, lastPayload }
    },
    template: `
      <div>
        <button data-test-id="${TestId.AcceptAll}" @click="acceptAll">Accept All</button>
        <button data-test-id="${TestId.RejectAll}" @click="rejectAll">Reject All</button>
        <button data-test-id="${TestId.SelectAnalytics}" @click="selectItem('${ItemId.EvtAnalytics}')">Select</button>
        <button data-test-id="${TestId.AcceptSelected}" @click="acceptSelected">Accept Selected</button>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <span data-test-id="${TestId.Payload}">{{ JSON.stringify(lastPayload) }}</span>
        <MagicCookieProvider id="${cookieId}">
          <MagicCookieItem id="${ItemId.EvtAnalytics}" :optional="true">
            <template #default="{ item }"><span>{{ item.active }}</span></template>
          </MagicCookieItem>
          <MagicCookieItem id="${ItemId.EvtNecessary}" :optional="false">
            <template #default="{ item }"><span>{{ item.active }}</span></template>
          </MagicCookieItem>
        </MagicCookieProvider>
      </div>
    `,
  })
}

function getTestText(id: TestId): string {
  return document.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicCookie - Events', () => {
  describe('acceptAll event', () => {
    it('fires onAccept callback when acceptAll() is called', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(CookieId.Accept)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.AcceptAll}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(TestId.Events)).toContain('acceptAll')
      } finally {
        unmount()
      }
    })

    it('acceptAll payload contains all cookies as true', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(CookieId.AcceptPayload)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.AcceptAll}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        const payload = JSON.parse(getTestText(TestId.Payload))
        expect(payload[ItemId.EvtAnalytics]).toBe(true)
        expect(payload[ItemId.EvtNecessary]).toBe(true)
      } finally {
        unmount()
      }
    })
  })

  describe('rejectAll event', () => {
    it('fires onReject callback when rejectAll() is called', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(CookieId.Reject)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.RejectAll}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText(TestId.Events)).toContain('rejectAll')
      } finally {
        unmount()
      }
    })

    it('rejectAll payload has optional cookies as false, required as true', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(CookieId.RejectPayload)
      )

      try {
        const btn = container.querySelector(
          `[data-test-id="${TestId.RejectAll}"]`
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        const payload = JSON.parse(getTestText(TestId.Payload))
        expect(payload[ItemId.EvtAnalytics]).toBe(false)
        expect(payload[ItemId.EvtNecessary]).toBe(true)
      } finally {
        unmount()
      }
    })
  })

  describe('acceptSelected event', () => {
    it('fires onAcceptSelected callback', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(CookieId.Selected)
      )

      try {
        const selectBtn = container.querySelector(
          `[data-test-id="${TestId.SelectAnalytics}"]`
        ) as HTMLElement
        selectBtn.click()
        await nextTick()

        const acceptBtn = container.querySelector(
          `[data-test-id="${TestId.AcceptSelected}"]`
        ) as HTMLElement
        acceptBtn.click()
        await nextTick()

        expect(getTestText(TestId.Events)).toContain('acceptSelected')
      } finally {
        unmount()
      }
    })

    it('acceptSelected payload reflects current selection', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper(CookieId.SelectedPayload)
      )

      try {
        const selectBtn = container.querySelector(
          `[data-test-id="${TestId.SelectAnalytics}"]`
        ) as HTMLElement
        selectBtn.click()
        await nextTick()

        const acceptBtn = container.querySelector(
          `[data-test-id="${TestId.AcceptSelected}"]`
        ) as HTMLElement
        acceptBtn.click()
        await nextTick()

        const payload = JSON.parse(getTestText(TestId.Payload))
        expect(payload[ItemId.EvtAnalytics]).toBe(true)
        expect(payload[ItemId.EvtNecessary]).toBe(true)
      } finally {
        unmount()
      }
    })
  })
})
