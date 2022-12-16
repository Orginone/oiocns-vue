export const debounce = (fun: any, delay?: number) => {
  let timer: any = ''
  return (args: any) => {
    let _args = args;
    clearTimeout(timer);
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

/**
 * @description: 聊天间隔时间
 * @param {moment} chatDate
 * @return {*}
 */
const showChatTime = (chatDate: moment.MomentInput) => {
  const cdate = moment(chatDate);
  const date = moment(cdate.format('yyyy-MM-DD'));
  const days = moment().diff(date, 'day');
  switch (days) {
    case 0:
      return cdate.format('H:mm');
    case 1:
      return '昨天 ' + cdate.format('H:mm');
    case 2:
      return '前天 ' + cdate.format('H:mm');
  }
  const year = moment().diff(cdate, 'year');
  if (year == 0) {
    return cdate.format('M月D日 H:mm');
  }
  return cdate.format('yy年 M月D日 H:mm');
};

/**
 * @description: 时间处理
 * @param {string} timeStr
 * @return {*}
 */
const handleFormatDate = (timeStr: string) => {
  const nowTime = new Date().getTime();
  const showTime = new Date(timeStr).getTime();
  // 超过一天 展示 月/日
  if (nowTime - showTime > 3600 * 24 * 1000) {
    return formatDate(timeStr, 'M月d日');
  }
  // 不超过一天 展示 时/分
  return formatDate(timeStr, 'H:mm');
};

const getUuid = () => {
  let s = [];
  let hexDigits: any = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  let uuid = s.join('');
  return uuid;
};

const findAimObj = (isParent = false, id: string, topParentData?: any[]) => {
  let aimObjet: any = undefined;
  function findItem(_id: string, parent: any) {
    const data = parent.children;
    if (aimObjet) {
      return aimObjet;
    }
    const AimObj = data.find((v: any) => {
      return v.id == _id;
    });
    if (AimObj) {
      aimObjet = isParent ? parent : AimObj;
      return;
    } else {
      data.forEach((child: any) => {
        return findItem(_id, child);
      });
    }
  }
  findItem(id, { children: topParentData });
  return aimObjet;
};
export {
  // debounce,
  findAimObj,
  getUuid,
  handleFormatDate,
  renderNum,
  resetParams,
  showChatTime,
  showMessage,
  validIsSocialCreditCode,
};
