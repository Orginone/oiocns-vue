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

export const validIsSocialCreditCode = (code: string) => {
  var numUpChar = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  var reg = new RegExp('^[A-Z0-9]+$');
  if (!reg.test(code) || code.length != 18) {
    return false;
  }
  var wis = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  var sum = 0;
  for (var i = 0; i < 17; i++) {
    sum += numUpChar.indexOf(code[i]) * wis[i];
  }
  var ret = 0;
  if (sum % 31 != 0) {
    ret = 31 - (sum % 31);
  }
  return numUpChar.indexOf(code[17]) == ret;
};
