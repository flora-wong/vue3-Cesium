export function throttle(fn, wait) {
  let timer = null
  let previous = 0
  return function (...args) {
    if (Date.now() - previous > wait) {
      clearTimeout(timer)
      timer = null
      previous = Date.now()
      fn.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
  }
}
