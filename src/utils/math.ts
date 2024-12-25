export function findMax(arr: any) {
  let max = 0;
  arr.forEach((item: any) => {
    max = max > item ? max : item;
  });
  return max;
}

export function calAver(arr: any, num: any) {
  if (!Array.isArray(arr)) {
    return 0
  }
  const res = arr.filter((a) => a > 0)
  if (res.length) {
    return (res.reduce((a, b) => a + b, 0) / res.length).toFixed(num)
  }
  return 0
}

