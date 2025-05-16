import dayjs from "dayjs"
import { secToHourstamp } from "./timeConvert"
import { format } from "path"

export const sulRank = (num: number) => {
    if (num <= 9) {
        return '极高风险'
    } else if (num <= 12) {
        return '高风险'
    } else if (num <= 14) {
        return '中风险'
    } else if (num <= 18) {
        return '低风险'
    } else {
        return '正常'
    }
}

export function rateToHeart(value: any) {
    if (value <= 0) return 0
    // const x = value < 10 ? 10  : value < 35 ? 35value  

    let x;
    if (value < 10) {
        x = 10
    } else if (value <= 35) {
        x = value
    } else {
        x = 35
    }
    const y = Math.pow((x), 2) * (-0.0533) + 5.6 * (x) - 10.67
    return Math.floor(y)

}

export function rateArrToHeart(arr: any) {
    if (!Array.isArray(arr)) {
        return []
    }
    return arr.map((value: any) => rateToHeart(value))
}

export function oriRateToRate(arr: any) {
    // console.log(arr)
    if (!Array.isArray(arr)) {
        return []
    }
    return [...arr].map((a: any) => {
        if (a == -1 || a == 66) {
            return 20 + Math.floor(4 * Math.random())
        } else if (a > 0 && a < 10) {
            return 10
        } else {
            return a
        }
    })
}

type timetype = 'start' | 'end'
interface timePeriodInit {
    type: timetype,
    timeStamp: any
}

export const equipInfoFormatUtil = {
    /**
     * 
     * @param num 服务器存的性别
     * @returns 真实性别
     */
    sexFormat(num: number) {
        if (num == 1) {
            return '男'
        } else {
            return '女'
        }
    },
    /**
     * 
     * @param type 服务器存传感器类型
     * @returns 传感器名称
     */
    bedTypeFormat(type: string) {
        if (type == 'large') {
            return '智护'
        } else {
            return '安护'
        }
    },
    /**
     * 
     * @param props 服务器存时间段 时间数
     * @returns 真实显示时间
     */
    timePeriodInitFormat(props: timePeriodInit) {
        const { type, timeStamp } = props
        if (type == 'start') {
            const startStamp = typeof timeStamp == 'number' ? timeStamp : 0
            if (!startStamp) {
                return '00:00'
            }
            const startHourStr = secToHourstamp(startStamp / 1000)
            return startHourStr
        } else {
            const endStamp = typeof timeStamp == 'number' ? timeStamp : 24 * 60 * 60 * 1000 - 1000
            if (!endStamp || endStamp > 24 * 60 * 60 * 1000 - 1000) {
                return '23:59'
            }
            const endHourStr = secToHourstamp(endStamp / 1000)
            return endHourStr
        }
    },

    switchValueToboolean(value: number) {
        return value == 1 ? true : false
    }
}

export const minToHourText = (num: number) => {
    return `${num / 60}小时`
}

export const posNumToposText = (num: number) => {
    const data: any = {
        0: 'center',
        1: 'left',
        2: 'right'
    }
    return data[num]
}