
const debounce = (func, wait = 1000, immediate = false) => {
  let timer

  return function () {
    const context = this
    const args = arguments

    const later = function () {
      timer = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timer

    clearTimeout(timer)
    timer = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

export default debounce
