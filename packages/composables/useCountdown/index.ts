import { computed, onMounted, ref, unref } from 'vue'
import { MagicTimer } from '@maas/magic-timer'
import { DateTime } from 'luxon'
import { type MaybeRef } from '@vueuse/core'

// Type for [YYYY, MM, DD, HH, MM, SS]
export type DateTimeArray = [number, number, number, number?, number?, number?]

// Interface for the options
export interface CountdownOptions {
  endDateTime: MaybeRef<DateTimeArray>
  timezone?: MaybeRef<string>
  zeroIndexedMonths?: boolean
}

// Define the default options
const defaultOptions: CountdownOptions = {
  endDateTime: [1970, 1, 1, 0, 0, 0],
  zeroIndexedMonths: false,
}

export function useCountdown(options: CountdownOptions, callback?: () => void) {
  // Merge the options with the default options
  options = { ...defaultOptions, ...options } as CountdownOptions

  // Check if the endDateTime is valid
  if (unref(options.endDateTime).length < 3) {
    console.error(
      'useCountdownClock: The "endDateTime" option needs to be an array with the format [YYYY, MM, DD, HH?, MM?, SS?]',
    )
  }

  // Check if the timezone is valid
  const timezone = unref(options.timezone)
  if (timezone) {
    if (!DateTime.now().setZone(timezone).isValid) {
      console.error(
        `useCountdownClock: The "timezone" option "${timezone}" is not a valid timezone. Do you mean ${
          DateTime.local().zoneName
        }? For more information see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`,
      )
    }
  }

  // Create a new timer instance
  const timer = new MagicTimer()

  // Create the countdown values
  const years = ref(0)
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)

  // Parse the end dateTime array into an date and time object
  // if the hour, minute and second are not set, set them to 0
  // if the month is not zero indexed, add 1 to the month
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

  // Calculate the target end date and time
  const endDateTime = computed(() => {
    const { year, month, day, hour, minute, second } = parseDateTimeArray(
      unref(options.endDateTime),
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
      },
    )
  })

  // Update the countdown values
  const tick = () => {
    const now = DateTime.now().setZone(unref(options.timezone))
    const end = endDateTime.value

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

    if (end < now) {
      timer.stop()
      if (callback) callback()
      return
    }

    years.value = diff.years ?? 0
    days.value = diff.days ?? 0
    hours.value = diff.hours ?? 0
    minutes.value = diff.minutes ?? 0
    seconds.value = diff.seconds ?? 0
  }

  // Format numbers with leading zero
  const pad = (value: number): string => {
    return ('0' + value).slice(-2)
  }

  // Listen to the tick event
  const onTick = (callback: () => void) => timer.on('tick', callback)

  // Listen to the tick event
  timer.on('tick', tick)

  // Restart the timer
  const restart = () => {
    timer.start()
  }

  // Start the timer on mount
  onMounted(() => {
    tick()
    timer.start()
  })

  // Return the values and functions
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
