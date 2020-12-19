
const debounce = (
  func: Function,
  wait = 1000,
  immediate = false,
): Function => {
  let timer: number

  return function (this: Function) {
    const context = this
    const args = arguments

    const later = function () {
      timer = 0
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timer

    clearTimeout(timer)
    timer = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

export default debounce
