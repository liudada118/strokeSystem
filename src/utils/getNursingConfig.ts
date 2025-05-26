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
    const nowTime = new Date().getTime();
    if (isSameDay(res.data.templateUpdatetime, nowTime)) {
      nursingConfig = JSON.parse(res.data.oldTemplate || "[]");
    } else {
      nursingConfig = JSON.parse(res.data.nursingConfig || "[]");
    }
  }

  return Array.isArray(nursingConfig) ? nursingConfig : [];
};

export const templateToData = (str: string, type?: string | undefined) => {
  
  const arr: any = [];
  const splitArr = str?.replace("{", "").replace("}", "").split(",");
  console.log(splitArr);
  splitArr?.forEach((splitItem, index) => {
    if (!splitItem.includes(":")&&!splitItem.includes("：")) {
      return;
    }
    let key :any= splitItem.split(":")[0]||splitItem.split("：")[0];

    let value:any = splitItem.split(":")[1]||splitItem.split("：")[1];
    value = value.replace(new RegExp('"', "g"), "");
    if (key.match(/-?\d+/)) {
      key = key.match(/-?\d+/)[0]
  }
    console.log(key, value, new Date().toLocaleDateString(), key);
    arr.push({
      title: value,
      time: type === 'isTemp' ? dayjs(new Date(Number(key))).format("HH:mm") : dayjs(
        new Date(new Date().toLocaleDateString()).getTime() + Number(key)
      ).format("HH:mm"),
      key: key,
      status: "todo",
    });
  });
  
  return arr;
};
