
// import { equip } from "../Home";

import newSit from '@/assets/image/newSit.png'
import newWide from '@/assets/image/newWide.png'
import newSleep from '@/assets/image/newSleep.png'
import newOutbed from '@/assets/image/newOutbed.png'
import newUnline from '@/assets/image/newUnline.png'
// import { equip } from "./Home";
import { numToMin, secToHourstamp } from '@/utils/timeConvert'
import { equip } from '.'

interface onbedStateProps {
  item: equip
}

/**
 * 
 * @param item 设备信息
 * @returns 设备在某个状态下  显示时间的title
 */
export function onBedStateText(item: equip) {

  // 小床垫 只有 在床时间和离床时间两种状态
  // if (item.type != 'large') {
  if (item.onBed) {
    return '在床时间'
  } else if (!item.onBed) {
    return '离床时间'
  }
  // }
  // 大床垫 只有护理相关跟 离床时间 四种状态
  // else {
  //   if (!item.onBed) {
  //     return '离床时间'
  //   } else if (Number(item.pressureInjury) < item.nursePeriod || item.sensorName == 'KgvDXUvdEs9M9AEQDcVc' || item.pressureInjury == 'unknow') {
  //     return '下次护理'
  //   } else if (item.nursePeriod - Number(item.pressureInjury) < 10 && item.nursePeriod - Number(item.pressureInjury) > 0) {
  //     return '待护理'
  //   } else {
  //     return '已超时'
  //   }
  // }
}

/**
 * 
 * @param item 设备信息
 * @returns 设备触发了某个状态下的时间显示
 */
export function onBedStateTime(item: equip) {
  // 小床
  // if (item.type != 'large') {
  // 离床的显示
  if (item.onBed == 0) {
    if (item.outbedTime) {
      return secToHourstamp(item.outbedTime)
    } else {
      return '-'
    }
  }
  // 在床的显示
  else {
    if (item.onbedTime) {
      return secToHourstamp(item.onbedTime)
    } else {
      return '-'
    }
  }
  // }

  // else {
  //   // 离床的显示
  //   if (!item.onBed) {
  //     if (item.outbedTime) {
  //       return secToHourstamp(item.outbedTime)
  //     } else {
  //       return '-'
  //     }
  //   }
  //   // 在床的显示
  //   else {
  //     if (item.nursePeriod - Number(item.pressureInjury) < 0) {
  //       return numToMin(Number(item.pressureInjury) - item.nursePeriod)
  //     } else {
  //       return numToMin(item.nursePeriod - Number(item.pressureInjury))
  //     }
  //   }
  // }
}


/**
 * 
 * @param item 设备信息
 * @returns 设备护理是否超时的不同类名  不同显示
 */
export function nurseInfoClass(item: equip) {
  if ([0, 100].includes(item.onBed)) {
    return ''
  } else if (item.nursePeriod - Number(item.pressureInjury) <= 0) {
    return 'nurseTimeout'
  } else if (item.nursePeriod - Number(item.pressureInjury) < 10) {
    return 'nurseFastTimeout'
  } else {
    return 'nurseNormal'
  }
}


const OFFLINE_STATE = 'offLine'
const OFFBED_STATE = 'offBed'
const WIDE_STATE = 'wide'
const SIT_STATE = 'sit'
const SLEEP_STATE = 'sleep'

export const stateToObj = {
  [OFFLINE_STATE]: {
    text: '离线',
    img: newUnline,
    class: 'unlineState'
  },
  [OFFBED_STATE]: {
    text: '离床',
    img: newOutbed,
    class: 'outBedState'
  },
  [WIDE_STATE]: {
    text: '在床',
    //清醒暂时改成在床版本稳定了在改回来
    // text: '清醒',
    img: newWide,
    class: 'wideState'
  },
  [SIT_STATE]: {
    text: '坐起',
    img: newSit,
    class: 'sitState'
  },
  [SLEEP_STATE]: {
    text: '在床',
    //入睡暂时改成在床版本稳定了在改回来
    // text: '入睡',
    img: newSleep,
    class: 'sleepState'
  }
}

export function OnBedState(props: onbedStateProps) {
  const { item } = props
  return <>{
    <div className="onbedStateItem">
      <div className="onbedStateText">{stateToObj[onBedState(item)].text} </div>
      <img src={stateToObj[onBedState(item)].img} alt="" />
    </div>
  } </>
}


/**
 * 
 * @param item 设备信息
 * @returns 设备状态
 */
export function onBedState(item: equip) {
  // console.log(item.onBed)
  if (item.onBed === 100 || typeof item.onBed != 'number') {
    return OFFLINE_STATE
  } else if (item.onBed === 0) {
    return OFFBED_STATE
  } else if (item.onBed && item.onBed != 4 && item.strokeValue == '1') {
    return WIDE_STATE
  } else if (item.onBed == 4) {
    return SIT_STATE
  } else if (item.onBed && item.onBed != 4 && item.strokeValue == '0') {
    return SLEEP_STATE
  } else {
    return OFFLINE_STATE
  }
}
