import { OUTBEDTYPE } from "@/redux/equip/equipUtil"
import { fakeData, fakeSensorNameArr } from "./fakeData"

/**
 * 
 * @param injury 服务器接口传来的压疮数据
 * @returns 压疮点
 */
export const initCircleArr = (injury: any) => {
    let arr: any = []
    Object.keys(injury).forEach((key, index) => {
        arr.push({ x: Number(key.split(',')[1]) * 2 - 1, y: Number(key.split(',')[0]) * 2 - 1, time: injury[key], radius: 4 })
    })
    return arr
}

/**
 * 
 * @param pressureInjurePoints 实时mqtt传来的压疮点数据
 * @returns 压疮点
 */
export const initRealCircleArr = (pressureInjurePoints: any) => {
    const circleArr = pressureInjurePoints
    if (Array.isArray(circleArr)) {
        circleArr.map((circle, index) => {
            circle.y = Number(circle.point.split(',')[0]) * 2 - 1
            circle.x = Number(circle.point.split(',')[1]) * 2 - 1
            circle.radius = (Number(circle.radius) + 1) * 4
        })
    }
    return circleArr
}

export function cloudSleepToPageSleep(posture: number) {
    switch (Number(posture)) {
        case 0:
            return 0;
        case 1:
            return 1
        default:
            return 2
    }
}

export interface minDataParam {
    jsonObj: any
    sensorName: string
    leavebedParam ?: number
}

export interface cloudDataParam {
    res: any
    sensorName: string
    equipInfo: any
}

interface minDataReturn {
    circleArr: any
    resSleep: number
    timer: number
    wsPointData: Array<number>
}

/**
 * 
 * @param param0 jsonObj : 实时分钟数据 sensorName 设备sensorName
 * @returns circleArr: 压疮分钟数据, resSleep 睡姿, timer 护理倒计时, wsPointData 热力图
 */
export const returnMinData: (param: minDataParam) => minDataReturn = ({ jsonObj, sensorName }) => {
    let wsPointData = [...jsonObj.matrixList]
    if (fakeSensorNameArr.includes(sensorName)) {
        const { circleArr, resSleep, timer } = fakeData.bed
        return { circleArr, resSleep, timer, wsPointData }
    } else {
        const circleArr = initRealCircleArr(jsonObj.pressureInjurePoints)
        const resSleep = cloudSleepToPageSleep(jsonObj.posture)
        const timer = jsonObj.timer
        return { circleArr, resSleep, timer, wsPointData }
    }
}

interface realtimeReturn {
    heart: number
    rate: number
    stroke: number
    onBedTime: number
    bodyMove: Array<number>
    onbedState : number
}

/**
 * 
 * @param param0 jsonObj : 实时数据 sensorName 设备sensorName
 * @returns heart :心率   rate : 呼吸 , stroke : 卒中 ,onBedTime : 在床时间 ,  bodyMove : 体动数组
 */
export const returnRealtimeData: (param: minDataParam) => realtimeReturn = ({ jsonObj, sensorName,leavebedParam }) => {

    const { realtimeStrokeRisk, heartRateRandom, realtimeBreathRate, onOutOffBedTimeMillis, realtimeBodyMoveArr, realtimeOnbedState ,realtimeLeaveBedParam  } = jsonObj

    const res = {
        heart: heartRateRandom,
        rate: realtimeBreathRate,
        stroke: realtimeStrokeRisk,
        onBedTime: (new Date().getTime() - onOutOffBedTimeMillis) / 1000,
        bodyMove: realtimeBodyMoveArr,
        onbedState: leavebedParam ? ( realtimeLeaveBedParam < leavebedParam ? 0 : 1):   realtimeOnbedState
    }

    // 如果是假数据设备
    if (fakeSensorNameArr.includes(sensorName)) {
        const rate = Math.round(12 + 4 * Math.random())
        const heart = Math.round(rate * 5 + 4 * Math.random())
        res.heart = heart
        res.rate = rate
    }

    // 如果不在床
    if (!jsonObj.realtimeOnbedState) {
        res.heart = 0
        res.rate = 0
        res.stroke = 0
        res.onBedTime = 0
    }
    return res
}

/**
 * 
 * @param param0 jsonObj : 服务器数据 sensorName 设备sensorName  equipInfo设备信息
 * @returns 
 */
export const returnCloudHeatmapData: (param: cloudDataParam) => minDataReturn = ({ res, sensorName, equipInfo }) => {
    const { data: wsPointData, injuryPressureMap: injury, posture } = res
    if (sensorName == 'KgvDXUvdEs9M9AEQDcVc') {
        const { circleArr, resSleep, timer } = fakeData.bed
        return { circleArr, resSleep, timer, wsPointData }
    } else {
        const circleArr = initCircleArr(injury)
        const resSleep = cloudSleepToPageSleep(posture)
        const timer = equipInfo.pressureInjury
        return { circleArr, resSleep, timer, wsPointData }
    }
}


