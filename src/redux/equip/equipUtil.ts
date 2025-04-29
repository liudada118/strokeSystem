// import { equip } from "./Home"
// 修改过的文件
import { equip } from "@/pages/home";

// import { equip } from "@/pages/home/Home"

// 所有告警类型
const SITUP_ALARM = "sitBed";
const DROPBED_ALARM = "dropBed";
const ONBED_ALARM = "onBed";
const SOS_ALARM = "sos";
const NURSE_ALARM = "nurse";

// 所有告警提醒文字
const SITUP_ALARM_TEXT = "已坐床边";
const DROPBED_ALARM_TEXT = "坠床风险";
const ONBED_ALARM_TEXT = "离床提醒";
const SOS_ALARM_TEXT = "SOS呼救";
const NURSE_ALARM_TEXT = "翻身设置";

// 告警开关数组名
const SITUP_ALARM_SWITCH = "situpArr";
const DROPBED_ALARM_SWITCH = "fallbedArr";
const ONBED_ALARM_SWITCH = "leaveBedArr";
const SOS_ALARM_SWITCH = "sosArr";
const NURSE_ALARM_SWITCH = "nurseArr";

const ALARMVALUE = {
  onBed: {
    value: 0,
    alarmArrName: "leaveBedArr",
  },
  dropBed: {
    value: 3,
    alarmArrName: "fallbedArr",
  },
  situp: {
    value: 4,
    alarmArrName: "situpArr",
  },
  sos: {
    value: 5,
    alarmArrName: "sosArr",
  },
  nurse: {
    value: 6,
    alarmArrName: "nurseArr",
  },
};

export const OUTBEDTYPE = {
  value: [0, 100],
  offBed: {
    value: 0,
  },
  offLine: {
    value: 100,
  },
};
/**
 * type : 告警类型
 *
 */
interface alarmType {
  type: string;
  text: string;
  switchName: string;
  cloudAlarmName: string;
  cloudSwitchName: string;
}

// 所有告警类型
export type alarmtype = "sitBed" | "dropBed" | "onBed" | "sos" | "nurse";
export type alarmSwitchType =
  | "situpArr"
  | "fallbedArr"
  | "leaveBedArr"
  | "sosArr"
  | "nurseArr";

type totalAlarmType = {
  [key in alarmtype]: alarmType;
};

interface onBedType {
  item: equip;
  getFlag: boolean;
  alarm: any;
}

interface alarmJudge extends onBedType {
  onBedValue: number;
  alarmArrName: any;
  type: string;
}

interface alarmBase {
  item: equip;
  type: string;
}

/**
 * 判断服务器缓存是否需要报警提醒
 * 开关没打开不报警
 * 不在提醒时间范围内  不报警
 * 未满足几分钟后提醒  不报警（只有离床）
 * @param param0
 * @returns
 */

/**
 *
 * @param param0 start 开始时间戳， end 结束时间戳
 * @returns 是否在这个开始结束时间戳内
 */
export function stampInScope({ start, end }: any) {
  const stamp = new Date().getTime();
  const startTime = new Date(new Date().toLocaleDateString()).getTime() + start;
  const endTime = new Date(new Date().toLocaleDateString()).getTime() + end;
  if (stamp >= startTime && stamp <= endTime) {
    return true;
  } else {
    return false;
  }
}

/**
 *
 * @param number 时间戳
 * @returns 当前时间戳减去number得到的分钟时间
 */
export function alarmStampToTime(number: number) {
  const time = new Date().getTime() - number;
  if (time / 1000 / 60 > 99) {
    return 99;
  } else if (time / 1000 / 60 < 10) {
    return "0" + Math.floor(time / 1000 / 60);
  } else {
    return Math.floor(time / 1000 / 60);
  }
}

export function alarmJudgeBase({ item, type }: alarmBase) {
  if (type == "leave") {
    if (!(item.outbedTime && item.outbedTime > item.leaveBedPeriod * 60)) {
      return false;
    }
    // ! 当前时间在设备设置的开始结束时间范围内
    if (!stampInScope({ start: item.leaveBedStart, end: item.leaveBedEnd })) {
      return false;
    }
  } else if (type == "situp") {
    if (!stampInScope({ start: item.situpStart, end: item.situpEnd })) {
      return false;
    }
  } else if (type == "fallbed") {
    if (!stampInScope({ start: item.fallbedStart, end: item.fallbedEnd })) {
      return false;
    }
  }

  else if (type == "sos") {
    return true;
  }
  else if (type == "nurse") {
    if (typeof (+item.pressureInjury) === 'number' && item.pressureInjury > (new Date() as any).getTime()) {
      return false;
    }
  }
  return true;
}

/**
 * 判断实时状态是否需要报警提醒
 * @param param0 item 设备信息 ,getFlag 服务器报警请求成功flag, alarm 报警开关数组,onBedValue 该报警对应的item.onbed值是什么类型,alarmArrName报警数组
 * @returns 是否条件全都满足
 */

function alarmJudgeFn({
  item,
  getFlag,
  alarm,
  onBedValue,
  alarmArrName,
  type,
}: alarmJudge) {
  // !  如果服务器请求到报警缓存
  if (item.onBed == 100 || item.onBed === undefined) {
    return false;
  }

  // 服务器已成功返回
  if (!getFlag) {
    return false;
  }

  if (type == 'sos') {
    if (!(item.sos == 1)) {
      return false;
    }
  } else {

    // ! 如果设备状态值为该状态的onbedValue值
    if (!(item.onBed == onBedValue)) {
      return false;
    }
    // ! 报警开关数组包含该设备名
    if (
      !(
        alarm &&
        alarm[alarmArrName] &&
        alarm[alarmArrName].includes(item.sensorName)
      )
    ) {
      return false;
    }
  }

  // if()
  const flag = alarmJudgeBase({ item, type });

  if (flag) {
    return true;
  } else {
    return false;
  }

  // ! 报警开关数组包含该设备名
  if (
    !(
      alarm &&
      alarm[alarmArrName] &&
      alarm[alarmArrName].includes(item.sensorName)
    )
  ) {
    return false;
  }
  // ! 当前时间在设备设置的开始结束时间范围内
  if (!stampInScope({ start: item.leaveBedStart, end: item.leaveBedEnd })) {
    return false;
  }

  return true;
}

export const alarmJudge = {
  /**
   *
   * @param param0 item 设备信息 ,getFlag 服务器报警请求成功flag, alarm 报警数组
   * @returns 是否是一次成功的报警
   */
  onBedJudge: function ({ item, getFlag, alarm }: onBedType) {
    // 设备的离床时间不存在(实时)   或者设备的离床时间不大于 设备设置的离床后多久的提醒时间 return false
    // if (!(item.outbedTime && item.outbedTime > item.leaveBedPeriod * 60)) {
    //     return false
    // }
    const flag = alarmJudgeFn({
      item,
      getFlag,
      alarm,
      onBedValue: ALARMVALUE.onBed.value,
      alarmArrName: ALARMVALUE.onBed.alarmArrName,
      type: "leave",
    });

    if (flag) {
      return true;
    } else {
      return false;
    }

    return false;
  },

  /**
   *
   * @param param0 item 设备信息 ,getFlag 服务器报警请求成功flag, alarm 报警数组
   * @returns 是否是一次成功的报警
   */
  dropBedJudge: function ({ item, getFlag, alarm }: onBedType) {
    const flag = alarmJudgeFn({
      item,
      getFlag,
      alarm,
      onBedValue: ALARMVALUE.dropBed.value,
      alarmArrName: ALARMVALUE.dropBed.alarmArrName,
      type: "fallbed",
    });

    if (flag) {
      return true;
    } else {
      return false;
    }
  },

  /**
   *
   * @param param0 item 设备信息 ,getFlag 服务器报警请求成功flag, alarm 报警数组
   * @returns 是否是一次成功的报警
   */
  situpJudge: function ({ item, getFlag, alarm }: onBedType) {
    const flag = alarmJudgeFn({
      item,
      getFlag,
      alarm,
      onBedValue: ALARMVALUE.situp.value,
      alarmArrName: ALARMVALUE.situp.alarmArrName,
      type: "situp",
    });

    if (flag) {
      return true;
    } else {
      return false;
    }
  },
  sosJudge: function ({ item, getFlag, alarm }: onBedType) {
    const flag = alarmJudgeFn({
      item,
      getFlag,
      alarm,
      onBedValue: ALARMVALUE.sos.value,
      alarmArrName: ALARMVALUE.sos.alarmArrName,
      type: "sos",
    });

    if (flag) {
      return true;
    } else {
      return false;
    }
  },
  nurseJudge: function ({ item, getFlag, alarm }: onBedType) {
    const flag = alarmJudgeFn({
      item,
      getFlag,
      alarm,
      onBedValue: ALARMVALUE.nurse.value,
      alarmArrName: ALARMVALUE.nurse.alarmArrName,
      type: "nurse",
    });

    if (flag) {
      return true;
    } else {
      return false;
    }
  },
};

// 所有告警信息
export const ALARMTYPE: totalAlarmType = {
  sitBed: {
    type: SITUP_ALARM, // 告警类型
    text: SITUP_ALARM_TEXT, //告警提示文案
    switchName: SITUP_ALARM_SWITCH, // 自定义告警开关数组名
    cloudAlarmName: "situp", // 云端返回告警类型
    cloudSwitchName: "situpAlarm", //云端告警开关标识
  },
  dropBed: {
    type: DROPBED_ALARM,
    text: DROPBED_ALARM_TEXT,
    switchName: DROPBED_ALARM_SWITCH,
    cloudAlarmName: "fallbed",
    cloudSwitchName: "fallbedAlarm",
  },
  onBed: {
    type: ONBED_ALARM,
    text: ONBED_ALARM_TEXT,
    switchName: ONBED_ALARM_SWITCH,
    cloudAlarmName: "leavebed",
    cloudSwitchName: "leaveBedAlarm",
  },
  sos: {
    type: SOS_ALARM,
    text: SOS_ALARM_TEXT,
    switchName: SOS_ALARM_SWITCH,
    cloudAlarmName: "sos",
    cloudSwitchName: "sosAlarm",
  },
  nurse: {
    type: NURSE_ALARM,
    text: NURSE_ALARM_TEXT,
    switchName: NURSE_ALARM_SWITCH,
    cloudAlarmName: "nurse",
    cloudSwitchName: "injuryAlarm",
  },
};

export const obj = {};

interface neatEquipsProps {
  equipArr: Array<equip>;
}
interface neatReturn {
  newEquip: any;
  equip: any;
  riskArr: any;
  alarmSwitchTypeObj: any;
  cloudCatchAlarmArr: any;
}

/**
 *
 * @param param0 传入设备列表
 * @returns 返回手机端渲染列表  pc端渲染列表 初始化risk数组，alarmSwitchTypeObj数组
 */
export function neatEquips({ equipArr }: neatEquipsProps): neatReturn {
  /**
   * 所有报警不能触发的设备
   * */
  const riskArr: any = {};

  /**
   * 每个报警类型 对应 报警开关的数组名
   * */
  const alarmSwitchTypeObj: any = {};
  const cloudCatchAlarmArr: any = {};
  Object.keys(ALARMTYPE).forEach((alarmtype) => {
    riskArr[ALARMTYPE[alarmtype as alarmtype].type] = [];
    alarmSwitchTypeObj[ALARMTYPE[alarmtype as alarmtype].type] =
      ALARMTYPE[alarmtype as alarmtype].switchName;
    cloudCatchAlarmArr[ALARMTYPE[alarmtype as alarmtype].switchName] = [];
  });

  const total = equipArr.length;
  const equip = equipArr
    .map((a: any) => {
      if (a.status == "unknow") {
        a.onBed = 100;
      }

      // else if (a.status == 'online') {
      //     a.onBed = 1
      // }

      // 将所有非离线设备的报警都置为不可触发的状态
      Object.keys(ALARMTYPE).forEach((alarmType) => {
        if (a.onBed != 100) {
          if (!riskArr[alarmType].includes(a.sensorName)) {
            riskArr[alarmType].push(a.sensorName);
          }
        }
      });

      if (a.type != "large") {
        a.pressureInjury = "unknow";
      } else {
        if (a.sensorName == "KgvDXUvdEs9M9AEQDcVc") {
          a.pressureInjury = 33;
        }
      }
      return a;
    })
    .reverse();
  const newEquip = initEquipPc(equip);

  return {
    newEquip,
    equip,
    riskArr,
    alarmSwitchTypeObj,
    cloudCatchAlarmArr,
  };
}
/**
 *
 * @param equips 传入设备列表
 * @returns 返回电脑端 渲染列表数据
 */
export function initEquipPc(res: any) {
  const equips = JSON.parse(JSON.stringify(res));
  const total = equips.length;
  const newEquip: any = [];
 
  const pages = Math.ceil(total / 17); 
  for (let i = 0; i < pages; i++) {
    newEquip[i] = [];

    if (i === 0) {
      newEquip[i].push({ type: 'add' });
    }
  
    const startIdx = i * 17;
    const endIdx = Math.min(startIdx + 17, total);
    
  
    for (let j = startIdx; j < endIdx; j++) {
      newEquip[i].push(equips[j]);
    }
  }
  return newEquip;
}

type AlarmMap = {
  [key in string]: string;
};

/**
 * @param param0 arr : 程序运行中的报警列表，cloudAlarmArr 云端储存的告警列表
 * 用于将缓存中的告警转化为程序真实所需要的
 */
export const findAlarmToCatch = ({ equips, cloudAlarmArr }: any) => {
  const arr: any = [];
  const alarmMap: AlarmMap = {
    fallbed: ALARMTYPE.dropBed.type,
    leavebed: ALARMTYPE.onBed.type,
    situp: ALARMTYPE.sitBed.type,
    sos: ALARMTYPE.sos.type,
  };

  // const alarmMap = cloudToProgramObj

  cloudAlarmArr.forEach((alarm: any) => {

    // 找到最近报警的时间戳，类型，并记录下来
    const equipInfo = [...equips].filter((equip: equip) => {
      return equip.sensorName == alarm.deviceId;
    })[0];

    // if (!stampInScope({ start: equipInfo.leaveBedStart, end: equipInfo.leaveBedEnd })) {
    //   return false
    // }

    // 如果告警不在该告警设置的范围内  则取消该告警
    // const leaveTimeFlag = stampInScope({ start: equipInfo.leaveBedStart, end: equipInfo.leaveBedEnd })
    // const situpTimeFlag = stampInScope({ start: equipInfo.situpStart, end: equipInfo.situpEnd })
    // const fallbedTimeFlag = stampInScope({ start: equipInfo.fallbedStart, end: equipInfo.fallbedEnd })

    // equipInfo.outbedTime = alarm.leavebed
    // equipInfo.situpTime = alarm.situp
    // equipInfo.fallbedTime = alarm.fallbed

    const obj = {
      ...equipInfo,
      outbedTime: Number(alarm.leavebed),
      situpTime: Number(alarm.situp),
      fallbedTime: Number(alarm.fallbed),
    };
    // console.log(obj)
    // 如果告警不在该告警设置的范围内 或者在告警设置的延时时间范围内 则取消该告警
    const leaveTimeFlag = alarmJudgeBase({ item: obj, type: "leave" });
    const situpTimeFlag = alarmJudgeBase({ item: obj, type: "situp" });
    const fallbedTimeFlag = alarmJudgeBase({ item: obj, type: "fallbed" });
    const sosTimeFlag = alarmJudgeBase({ item: obj, type: "sos" });
    const nurseTimeFlag = alarmJudgeBase({ item: obj, type: "nurse" });

    let fallbed = alarm.fallbed || 0;
    let leavebed = alarm.leavebed || 0;
    let situp = alarm.situp || 0;
    let sos = alarm.sos || 0;
    let nurse = alarm.nurse || 0;

    // deviceId: "E7kb2PlwD2d1ExyIcfpX";
    // fallbed: "1742089513730";
    // leavebed: "1742089806243";
    // patient: "小白";
    // roomNum: "666";
    // situp: "1742110238891";

    if (!leaveTimeFlag) {
      leavebed = 0;
    }

    if (!situpTimeFlag) {
      situp = 0;
    }

    if (!fallbedTimeFlag) {
      fallbed = 0;
    }

    if (!sosTimeFlag) {
      sos = 0;
    }
    if (!nurseTimeFlag) {
      nurse = 0;
    }

    const timeArr: Array<number> = [
      Number(fallbed),
      Number(leavebed),
      Number(situp),
      Number(sos),
    ];
    const keyArr = Object.keys(alarmMap);
    const maxTime = Math.max(...timeArr);
    const index = timeArr.indexOf(maxTime);
    const newKey = keyArr[index];
    const newType = alarmMap[newKey];

    arr.push({
      sensorName: alarm.deviceId,
      name: alarm.patient,
      roomNum: alarm.roomNum,
      type: newType,
      time: maxTime,
    });
  });

  return arr;
};

interface findAlarmSwitchProps {
  equip: Array<equip>;
  cloudCatchAlarmArr: any;
}

// interface findAlarmSwitchReturn{
//     alarm : equip
// }

/**
 *
 * @param param0 传入设备信息
 * @returns 将所有类型所有告警开关返回
 */

export const findAlarmSwitch = ({
  equip,
  cloudCatchAlarmArr,
}: findAlarmSwitchProps) => {
  // const cloudCatchAlarmArr: any = {}
  let res = { ...cloudCatchAlarmArr };
  equip.forEach((a: any, index: any) => {
    Object.keys(ALARMTYPE).forEach((alarm: any) => {
      if (a[ALARMTYPE[alarm as alarmtype].cloudSwitchName]) {
        res[ALARMTYPE[alarm as alarmtype].switchName].push(a.sensorName);
      }
    });
  });
  // res.sosArr.push("B2QB26FXWWwQPjRXozP2");
  return res;
};

interface returnRealAlarmProps {
  cache: any;
  switchArr: any;
  alarmSwitchTypeObj: any;
  riskArr: any;
}
/**
 *
 * @param obj cache缓存的报警对象 switchArr该账号的报警开关对象
 * 如果开关打开并且缓存里面存在报警  如果一个设备有重复的报警，去重只显示一个
 *
 */

export const returnRealAlarm = (obj: returnRealAlarmProps) => {
  // const catchArr = obj.cache
  // const switchArr = obj.switchArr
  // const alarmSwitchTypeObj = obj.alarmSwitchTypeObj
  const { cache: catchArr, switchArr, alarmSwitchTypeObj, riskArr } = obj;
  let newSosArr: any = [],
    newSosSensornameArr: any = [];
  catchArr.forEach((a: any, index: any) => {
    if (
      switchArr[alarmSwitchTypeObj[a.type]].includes(a.sensorName) &&
      !newSosSensornameArr.includes(a.sensorName)
    ) {
      newSosArr.push(a);
      newSosSensornameArr.push(a.sensorName);
      Object.keys(ALARMTYPE).forEach((alarmType) => {
        if (!riskArr[alarmType].includes(a.sensorName)) {
          riskArr[alarmType] = riskArr[alarmType].filter(
            (sensorName: any) => sensorName != a.sensorName
          );
        }
      });
    }
  });
  // setSosArr(newSosArr)
  // sosArrOver = newSosArr

  return newSosArr;
};

interface changeEquipParam {
  equips: Array<any>;
  changeInfo: any;
}
export const changeOnerEquipInfo = ({
  equips,
  changeInfo,
}: changeEquipParam) => {
  const res = [...equips];
  const onersEquip: any = res.find(
    (equip) =>
      equip.sensorName == (changeInfo.deviceId || changeInfo.deviceName)
  );
  const keys = Object.keys(changeInfo);
  const unModifyInfo = ["deviceId", "phone", "deviceName", "userName"];

  for (let i = 0; i < keys.length; i++) {
    if (unModifyInfo.includes(keys[i])) {
      continue;
    }
    onersEquip[keys[i]] = changeInfo[keys[i]];
  }

  const equipPc = initEquipPc(res);
  return { res, equipPc };
};
