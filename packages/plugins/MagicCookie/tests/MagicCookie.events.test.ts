import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import MagicCookieProvider from '../src/components/MagicCookieProvider.vue'
import MagicCookieItem from '../src/components/MagicCookieItem.vue'
import { useMagicCookie } from '../src/composables/useMagicCookie'
import { mountWithApp } from '../../tests/utils'

const ClientOnly = defineComponent({
  name: 'ClientOnly',
  template: '<slot />',
})

function createEventWrapper(cookieId: string) {
  return defineComponent({
    components: {
      MagicCookieProvider,
      MagicCookieItem,
      ClientOnly,
    },
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

      return {
        ...api,
        events,
        lastPayload,
      }
    },
    template: `
      <div>
        <button data-test-id="accept-all" @click="acceptAll">Accept All</button>
        <button data-test-id="reject-all" @click="rejectAll">Reject All</button>
        <button data-test-id="select-analytics" @click="selectItem('evt-analytics')">Select</button>
        <button data-test-id="accept-selected" @click="acceptSelected">Accept Selected</button>
        <span data-test-id="events">{{ events.join(',') }}</span>
        <span data-test-id="payload">{{ JSON.stringify(lastPayload) }}</span>
        <MagicCookieProvider id="${cookieId}">
          <MagicCookieItem id="evt-analytics" :optional="true">
            <template #default="{ item }">
              <span>{{ item.active }}</span>
            </template>
          </MagicCookieItem>
          <MagicCookieItem id="evt-necessary" :optional="false">
            <template #default="{ item }">
              <span>{{ item.active }}</span>
            </template>
          </MagicCookieItem>
        </MagicCookieProvider>
      </div>
    `,
  })
}

function getTestText(id: string): string {
  return (
    document.querySelector(`[data-test-id="${id}"]`)?.textContent || ''
  )
}

describe('MagicCookie - Events', () => {
  describe('acceptAll event', () => {
    it('fires onAccept callback when acceptAll() is called', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('event-accept')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="accept-all"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText('events')).toContain('acceptAll')
      } finally {
        unmount()
      }
    })

    it('acceptAll payload contains all cookies as true', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('event-accept-payload')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="accept-all"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        const payload = JSON.parse(getTestText('payload'))
        expect(payload['evt-analytics']).toBe(true)
        expect(payload['evt-necessary']).toBe(true)
      } finally {
        unmount()
      }
    })
  })

  describe('rejectAll event', () => {
    it('fires onReject callback when rejectAll() is called', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('event-reject')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="reject-all"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        expect(getTestText('events')).toContain('rejectAll')
      } finally {
        unmount()
      }
    })

    it('rejectAll payload has optional cookies as false', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('event-reject-payload')
      )

      try {
        const btn = container.querySelector(
          '[data-test-id="reject-all"]'
        ) as HTMLElement
        btn.click()
        await nextTick()
        await nextTick()

        const payload = JSON.parse(getTestText('payload'))
        expect(payload['evt-analytics']).toBe(false)
        // Required cookies stay true in consent map
        expect(payload['evt-necessary']).toBe(true)
      } finally {
        unmount()
      }
    })
  })

  describe('acceptSelected event', () => {
    it('fires onAcceptSelected callback', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('event-selected')
      )

      try {
        // Select one item
        const selectBtn = container.querySelector(
          '[data-test-id="select-analytics"]'
        ) as HTMLElement
        selectBtn.click()
        await nextTick()

        const acceptBtn = container.querySelector(
          '[data-test-id="accept-selected"]'
        ) as HTMLElement
        acceptBtn.click()
        await nextTick()

        expect(getTestText('events')).toContain('acceptSelected')
      } finally {
        unmount()
      }
    })

    it('acceptSelected payload reflects current selection', async () => {
      const { container, unmount } = mountWithApp(
        createEventWrapper('event-selected-payload')
      )

      try {
        // Select analytics
        const selectBtn = container.querySelector(
          '[data-test-id="select-analytics"]'
        ) as HTMLElement
        selectBtn.click()
        await nextTick()

        const acceptBtn = container.querySelector(
          '[data-test-id="accept-selected"]'
        ) as HTMLElement
        acceptBtn.click()
        await nextTick()

        const payload = JSON.parse(getTestText('payload'))
        expect(payload['evt-analytics']).toBe(true)
        expect(payload['evt-necessary']).toBe(true)
      } finally {
        unmount()
      }
    })
  })
})
