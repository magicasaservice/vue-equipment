import { computed, onMounted, ref, unref, watch, type MaybeRef } from 'vue'
import { MagicTimer } from '@maas/magic-timer'
import { DateTime } from 'luxon'

export type DateTimeArray = [number, number, number, number?, number?, number?]

export interface CountdownOptions {
  endDateTime: MaybeRef<DateTimeArray>
  timezone?: MaybeRef<string>
  zeroIndexedMonths?: boolean
}

const defaultOptions: CountdownOptions = {
  endDateTime: [1970, 1, 1, 0, 0, 0],
  zeroIndexedMonths: false,
}

export function useCountdown(options: CountdownOptions, callback?: () => void) {
  options = { ...defaultOptions, ...options }

  if (unref(options.endDateTime).length < 3) {
    console.error(
      'useCountdownClock: “endDateTime” needs to be an array [YYYY, MM, DD, HH?, MM?, SS?]'
    )
  }

  const timezone = unref(options.timezone)
  if (timezone) {
    if (!DateTime.now().setZone(timezone).isValid) {
      console.error(
        `useCountdownClock: “${timezone}” is not a valid timezone. Did you mean ${
          DateTime.local().zoneName
        }? For more information see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`
      )
    }
  }

  const timer = new MagicTimer()

  const years = ref(0)
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)

  // Parse the end dateTime array into an date and time object
  // If hour, minute or second are not set, set them to 0
  // Optionally add +1 if month is not zero indexed
  const parseDateTimeArray = (dateTimeArr: DateTimeArray) => {
    const [year, month, day, hour, minute, second] = dateTimeArr
    return {
      year,
      month: options.zeroIndexedMonths ? month + 1 : month,
      day,
      hour: hour ?? 0,
      minute: minute ?? 0,
      second: second ?? 0,
    }
  }

  const endDateTime = computed(() => {
    const { year, month, day, hour, minute, second } = parseDateTimeArray(
      unref(options.endDateTime)
    )

    return DateTime.fromObject(
      {
        year,
        month,
        day,
        hour,
        minute,
        second,
      },
      {
        zone: unref(options.timezone),
      }
    )
  })

  // Update the countdown values on each tick
  // If endDateTime is reached, stop the timer, reset the values and run the callback
  function tick() {
    const now = DateTime.now().setZone(unref(options.timezone))
    const end = endDateTime.value

    if (end <= now) {
      timer.stop()
      reset()

      if (callback) {
        callback()
      }

      return
    }

    const diff = end
      .diff(now, [
        'years',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
      ])
      .toObject()

    years.value = diff.years ?? 0
    days.value = diff.days ?? 0
    hours.value = diff.hours ?? 0
    minutes.value = diff.minutes ?? 0
    seconds.value = diff.seconds ?? 0
  }

  function pad(value: number): string {
    return ('0' + value).slice(-2)
  }

  function onTick(callback: () => void) {
    timer.on('tick', callback)
  }

  function reset() {
    years.value = 0
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }

  function restart() {
    timer.reset()
    timer.start()
  }

  timer.on('tick', tick)

  onMounted(() => {
    tick()
    timer.start()
  })

  // Watch for changes in the endDateTime
  // and restart the timer
  watch(endDateTime, () => {
    if (timer.state === 'running') {
      return
    }

    restart()
  })

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    endDateTime,
    pad,
    restart,
    onTick,
  }
}
