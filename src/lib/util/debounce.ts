
const debounce = (
  func: Function,
  wait = 1000,
  immediate = false,
): Function => {
  let timer: number

  return function (this: any, ...args: any[]): void {
    const later = (): void => {
      timer = 0
      if (!immediate) func.apply(this, args)
    }

    const callNow = immediate && !timer

    clearTimeout(timer)
    timer = setTimeout(later, wait)

    if (callNow) func.apply(this, args)
  }
}

export default debounce
