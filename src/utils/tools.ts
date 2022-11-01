export const debounce = (fun: any, delay?: number) => {
  let timer: any = ''
  return (args: any) => {
    let _args = args
    clearTimeout(timer)
    timer = setTimeout(function () {
      fun.call(this, _args)
    }, delay ?? 300)
  }
}
