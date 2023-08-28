import { computed, onMounted, ref } from 'vue'
import { MagicTimer } from '@maas/magic-timer'
import { DateTime } from 'luxon'

// type for DD-MM-YYYY
export type DateFormat = `${number}-${number}-${number}`

// type for HH:MM:SS
export type TimeFormat = `${number}:${number}:${number}`

// interface for the options
export interface CountdownOptions {
  endDate: DateFormat
  endTime?: TimeFormat
  timezone?: string
}

// default options
const defaultOptions: CountdownOptions = {
  endDate: '1970-01-01',
  endTime: '00:00:00',
}

export function useCountdown(options: CountdownOptions, callback?: () => void) {
  // endDate needs to have this format: YYYY-MM-DD
  if (!options.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    options.endDate = '1970-01-01'
    console.error(
      'useCountdownClock: The "endDate" option needs to be a string with the format YYYY-MM-DD',
    )
  }

  // endTime needs to have this format: HH:MM:SS
  if (options.endTime && !options.endTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
    console.error(
      'useCountdownClock: The "endTime" option needs to be a string with the format HH:MM:SS',
    )
  }

  // invalid timezone
  if (options.timezone && !DateTime.now().setZone(options.timezone).isValid) {
    console.error(
      `useCountdownClock: The "timezone" option "${
        options.timezone
      }" is not a valid timezone. Do you mean ${
        DateTime.local().zoneName
      }? For more information see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`,
    )
  }

  // Merge the options with the default options
  options = { ...defaultOptions, ...options } as CountdownOptions

  // Create a new timer instance
  const timer = new MagicTimer()

  // Create the countdown values
  const years = ref(0)
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)

  // Create reactive refs for endDate and endTime so we can update them later
  const endDate = ref(options.endDate)
  const endTime = ref(options.endTime)

  // Parse the date string into an date object
  const parseDate = (dateStr: DateFormat) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return { year, month, day }
  }

  // Parse the time string into an time object
  const parseTime = (timeStr: TimeFormat) => {
    const [hour, minute, second] = timeStr.split(':').map(Number)
    return { hour, minute, second }
  }

  // Calculate the target end date and time
  const endDateTime = computed(() => {
    const { year, month, day } = parseDate(endDate.value!)
    const { hour, minute, second } = parseTime(endTime.value!)

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
        zone: options.timezone,
      },
    )
  })

  // Update the countdown values
  const tick = () => {
    const now = DateTime.now().setZone(options.timezone)
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

  const onTick = (callback: () => void) => timer.on('tick', callback)

  // Listen to the tick event
  timer.on('tick', tick)

  const restart = () => {
    timer.start()
  }

  // Start the timer on mount
  onMounted(() => {
    tick()
    timer.start()
  })

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    endDate,
    endTime,
    pad,
    restart,
    onTick,
  }
}
