const TIME_REGEX = /^[0-9][0-9]:[0-5][0-9]$/

export const validateTimeFormat = (str: string | number) => {
  if (!str || typeof str === 'number') {
    //Empty field is valid, as we're not testing it's required.
    return true
  }
  return str.match(TIME_REGEX) === null ? 'Enter a time in format MM:SS' : true
}

export const convertStringMMSSToSeconds = (ts: string) => {
  const parted = (ts ?? '').split(':')

  const min = Number(parted?.[0] ?? 0)
  const sec = Number(parted?.[1] ?? 0)
  if (isNaN(min) || isNaN(sec)) {
    throw new Error('Please enter in 00:00')
  }
  return min * 60 + sec
}
const enforceTwoDigits = (value: number): string => {
  let stringValue = `${value}`
  if (value < 10) {
    stringValue = `0${stringValue}`
  }
  return stringValue
}
export const convertSecondsToString = (time: number | typeof NaN, defaultToEmpty = false) => {
  const secondString = enforceTwoDigits(time % 60)
  const hourString = enforceTwoDigits(Math.floor(time / 60))
  if (isNaN(time) && defaultToEmpty) {
    return ''
  }
  return `${hourString}:${secondString}`
}
