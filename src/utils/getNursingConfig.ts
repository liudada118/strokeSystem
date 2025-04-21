import dayjs from "dayjs";
const isSameDay = (timestamp1: number, timestamp2: number) => {
  const date1 = dayjs(timestamp1);
  const date2 = dayjs(timestamp2);
  return date1.isSame(date2, "day");
};
/**
 * 获取护理内容取值逻辑
 * 1.判断templateEffectiveFlag==1
 * 如果为1  护理的就用nursingConfig
 * 2.如果不为1  用现在的时间与 templateUpdatetime比较
 * 如果与templateUpdateTime在同一天 就用oldTemplate  否则 就用nursingConfig
 * @param res 
 * @returns 
 */
export const getNurseConfist = (res: any) => {
  let nursingConfig = [];
  if (res.data.templateEffectiveFlag == 1) {
    nursingConfig = JSON.parse(res.data.nursingConfig || "[]");
  } else {
    const nowTime = new Date().getTime()
    if (isSameDay(res.data.templateUpdatetime, nowTime)) {
        nursingConfig = JSON.parse(res.data.oldTemplate || "[]");
    } else {
        nursingConfig = JSON.parse(res.data.nursingConfig || "[]");
    }
  }
  return Array.isArray(nursingConfig) ? nursingConfig : []
};
