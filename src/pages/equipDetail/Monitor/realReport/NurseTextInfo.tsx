import { OUTBEDTYPE } from '@/redux/equip/equipUtil'
import { numToMin } from '@/utils/timeConvert'
import React from 'react'
import Card from './Card'

export default function NurseTextInfo(props: any) {
    const { onBed, nursePeriod } = props.equipInfo
    const { timer } = props


    const nurseTextInfo = ({ onBed, timer, nursePeriod }: any) => {
        if (OUTBEDTYPE.value.includes(Number(onBed)) || Number(timer) < nursePeriod) {
            return '距离下次护理:'
        } else {
            return '已超时'
        }
    }

    const NurseTextColor = ({ nursePeriod, timer }: any) => {
        if (nursePeriod - (timer) <= 0) {
            return 'red'
        }
        else if (nursePeriod - (timer) < 15) {
            return '#fa8c35'
        } else {
            return '#F7F8FD'
        }
    }

    const nurseValue = ({ nursePeriod, timer }: any) => {
        // 未超时
        if (nursePeriod - Number(timer) < 0) {
            return numToMin(Number(timer) - nursePeriod)
        }
        // 已超时
        else {
            return numToMin(nursePeriod - Number(timer))
        }
    }

    return (
        <Card unheight>
            <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{nurseTextInfo({ onBed, timer, nursePeriod })}</div>
                <div className="text-lg font-semibold" style={{ backgroundColor: NurseTextColor({ nursePeriod, timer }) }}>
                    <span>{nurseValue({ nursePeriod, timer })}</span>
                </div>
            </div>
        </Card>
    )
}
