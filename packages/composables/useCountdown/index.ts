import { computed, onMounted, ref, unref, watch, type MaybeRef } from 'vue'
import { MagicTimer } from '@maas/magic-timer'
import { DateTime } from 'luxon'

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
      'useCountdownClock: The "endDateTime" option needs to be an array with the format [YYYY, MM, DD, HH?, MM?, SS?]'
    )
  }

  // Check if the timezone is valid
  const timezone = unref(options.timezone)
  if (timezone) {
    if (!DateTime.now().setZone(timezone).isValid) {
      console.error(
        `useCountdownClock: The "timezone" option "${timezone}" is not a valid timezone. Do you mean ${
          DateTime.local().zoneName
        }? For more information see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`
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
  // if the month is not zero indexed, add 1 to the month (defined in the options)
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

  // Get the computed endDateTime value from the options
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
  // if the timer reached the endDateTime stop the timer, reset the values and call the callback
  function tick() {
    const now = DateTime.now().setZone(unref(options.timezone))
    const end = endDateTime.value

    if (end <= now) {
      timer.stop()
      reset()
      if (callback) callback()
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

  // Function to pad the values with a leading zero
  function pad(value: number): string {
    return ('0' + value).slice(-2)
  }

  // Listen to the tick event
  function onTick(callback: () => void) {
    timer.on('tick', callback)
  }

  // Listen to the tick event
  timer.on('tick', tick)

  // Reset the countdown values
  function reset() {
    years.value = 0
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }

  // Restart the timer
  function restart() {
    timer.reset()
    timer.start()
  }

  // Start the timer on mount
  onMounted(() => {
    tick()
    timer.start()
  })

  // Watch for changes in the endDateTime
  // and restart the timer
  watch(endDateTime, () => {
    // check timer is running to prevent restart on initial load
    if (timer.state === 'running') return
    restart()
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
