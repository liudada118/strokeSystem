/**
 * 
 * @param num 一个单位为秒的时间
 * @returns 分:秒
 */
export function numToMin(num: number): string {
  if (typeof num != 'number' || isNaN(num)) {
    return `-`
  }
  let min = Math.floor(num / 60);
  let sec = Math.floor(num % 60);
  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

/**
 * 
 * @param num 一个单位为秒的时间
 * @returns 时:分
 */
export function secToHourstamp(num: any): string {
  // let min = Math.floor(num / 60);
  if (!num) {
    return '-'
  }

  let hour = Math.floor(num / 3600);
  let min = Math.floor((num % 3600) / 60)
  let sec = (num % 60)
  return `${hour}:${min < 10 ? '0' + min : min}`
}

/**
 * 
 * @param num 一个单位为秒的时间
 * @returns 返回保留一位小数的小时数
 */
export function numToHour(num: number): string {
  // let min = Math.floor(num / 60);
  // let hour = Math.floor(num / 3600);
  // console.log(first)
  let hour = (num / 3600).toFixed(1)
  // let min = Math.floor((num % 3600) / 60)
  return hour
  // return `${hour}:${min < 10 ? '0' + min : min}`
}


/**
 * 
 * @param num 输入一个时间戳
 * @returns 时:分
 */
export function stampToTime(num: number) {
  if (!num) {
    return "";
  }
  var hour = new Date((num)).getHours();
  var min = new Date((num)).getMinutes();
  const hourRes = hour < 10 ? '0' + hour : hour
  const minRes = min < 10 ? '0' + min : min
  return hourRes + ":" + minRes;
}

/**
 * 
 * @param nums 一个毫秒的时间单位
 * @returns 返回 [分 , 时]
 */
export function numToTime(nums: number): any[] {
  if (nums === 0) {
    return [0];
  }
  var num = Math.floor(nums / 1000);
  var hour = Math.floor(num / 3600);
  var min = Math.floor((num - hour * 3600) / 60);

  if (hour == 0 && min == 0) {
    return [0];
  } else if (hour == 0) {
    return [min];
  } else {
    return [min, hour];
  }
}

/**
 * 
 * @param dateStr 给一个时间戳
 * @returns 返回本月开始结束时间戳
 */
export function getMonthStartEndTimestamps(dateStr: any) {
  // 将时间戳转换为日期对象
  const timestamp = new Date(dateStr).getTime()
  const date = new Date(timestamp);

  // 找到该月份的第一天
  const startOfMonth = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1).getTime() - 8 * 24 * 60 * 60 * 1000;
  // startOfMonth.setUTCHours(0, 0, 0, 0); // 设置为当天的00:00:00

  // 找到该月份的最后一天
  const endOfMonth = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).getTime() + 8 * 24 * 60 * 60 * 1000;
  // endOfMonth.setUTCHours(23, 59, 59, 999); // 设置为当天的23:59:59
  // console.log(startOfMonth.toLocaleDateString() ,endOfMonth )
  // 将第一天和最后一天的日期对象转换回时间戳
  // const startOfMonthTimestamp = new Date(startOfMonth.toLocaleDateString() ).getTime();
  // const endOfMonthTimestamp = new Date(endOfMonth.toLocaleDateString()).getTime();
  const startOfMonthTimestamp = startOfMonth
  const endOfMonthTimestamp = endOfMonth
  return {
    startOfMonthTimestamp,
    endOfMonthTimestamp
  };
}

/**
 * 
 * @param arr 
 * @returns 
 */
export function timeArrToTimer(arr: Array<number>) {

  if (!Array.isArray(arr)) {
    return [0, 0]
  } else {
    if (arr.length < 2) {
      return [0, 0]
    }
  }
  const res = [...arr]
  return res.map((a) => {
    if (!JSON.stringify(a).includes('.')) {
      const numArr = JSON.stringify(a).split('.')
      let str1 = numArr[0].length < 2 ? '0' + numArr[0] : numArr[0]
      return str1 + ':' + '00'
    }
    const numArr = JSON.stringify(a).split('.')
    let str1 = numArr[0].length < 2 ? '0' + numArr[0] : numArr[0]
    let str2 = numArr[1].length < 2 ? numArr[1] + '0' : numArr[1]
    return str1 + ':' + str2
  })
}

/**
 * 
 * @param arr 
 * @returns 
 */
export function timeArrToIntegerTimer(arr: any) {

  if (!Array.isArray(arr)) {
    return [0, 0]
  } else {
    if (arr.length < 2) {
      return [0, 0]
    }
  }
  let res = [...arr]
  res = res.map((a, index) => {
    return Math.floor(a)
  })
  res = Array.from(new Set(res))
  res = res.filter((a, index) => {
    return index % 2 == 0
  })

  return timeArrToTimer(res)
}