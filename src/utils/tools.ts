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

export const  getDescendantProp = (obj: object | any[], desc: string): any => {
  const arr = desc.split(/\[|\]?\./g).filter(Boolean);
  let res = obj;
  for (let i = 0; i < arr.length; i ++) {
    if (!res) return
    res = (res as any)[arr[i]];
  }
  return res;
}
