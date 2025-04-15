// import {  } from "a"
import { useState } from "react"
import { RenderListItem } from "../EditingUser"
import { FormType } from "@/components/CommonFormModal"
import { Picker, List } from "antd-mobile"
import { useDispatch, useSelector } from "react-redux"
import { changeEquipInfo, changePersonalEquipAlarmInfo, selectEquipBySensorname } from "@/redux/equip/equipSlice"
import { useLocation } from "react-router-dom"
import { equipInfoFormatUtil } from "@/utils/dataToFormat"
import { phoneSelect } from "@/redux/token/tokenSlice"

type modelUserInfo = {
    [key: string]: any
}
let objKeyToCloud: modelUserInfo = {
    switchA: "leaveBedAlarm",
    switchB: "leaveBedAlarm",
    switchC: "situpAlarm",
    switchD: "fallbedAlarm",
    timeIntervalB: "leaveBedPeriod",
    timeRangeB: {
        start: 'leaveBedStart',
        end: 'leaveBedEnd'
    },
    timeRangeC: {
        start: 'situpStart',
        end: 'situpEnd'
    },
    timeRangeD: {
        start: 'fallbedStart',
        end: 'fallbedEnd'
    },
}

/**
 * 
 * @returns 提醒修改
 */
export function RemindEdit() {

    const dispatch: any = useDispatch()

    const [pickerInfo, setPickerInfo] = useState<any>({
        visible: false,
        title: '',
        columns: [],
        key: '',
        value: ''
    })

    const location = useLocation()
    const sensorName = location.state.sensorName

    const phone = useSelector(phoneSelect)
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))

    // const [userInfo, setUserInfo] = useState({
    // nurseStart, nurseEnd, fallbedStart, fallbedEnd, leaveBedStart, leaveBedEnd, situpStart, situpEnd, type, deviceId, leavebedParam
    // ...equipInfo
    // })
    const { bedTypeFormat, timePeriodInitFormat, switchValueToboolean } = equipInfoFormatUtil
    const {
        fallbedStart, fallbedEnd, fallbedAlarm,
        leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
        situpStart, situpEnd, situpAlarm,
    } = equipInfo

    const [formValue, setFormValue] = useState({
        timeRangeB: `${timePeriodInitFormat({ timeStamp: leaveBedStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: leaveBedEnd, type: 'end' })} `,
        timeIntervalB: `${leaveBedPeriod}min`,
        timeRangeC: `${timePeriodInitFormat({ timeStamp: situpStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: situpEnd, type: 'end' })} `,
        timeRangeD: `${timePeriodInitFormat({ timeStamp: fallbedStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: fallbedEnd, type: 'end' })} `,
        switchB: switchValueToboolean(leaveBedAlarm),
        switchC: switchValueToboolean(situpAlarm),
        switchD: switchValueToboolean(fallbedAlarm),
    })

    const offBedArr = [
        {
            type: FormType.SWITCH,
            objKey: "switchB",
            label: '离床提醒'
        },
        {
            type: FormType.TIME_RANGE,
            objKey: "timeRangeB",
            label: '监测时间段',
            title: '设置监测时间段'
        },
        {
            type: FormType.TIME_INTERVAL,
            objKey: "timeIntervalB",
            label: '提醒时间',
            title: '设置提醒时间'
        },
    ]

    const sitArr = [
        {
            type: FormType.SWITCH,
            objKey: "switchC",
            label: '坐起提醒'
        },
        {
            type: FormType.TIME_RANGE,
            objKey: "timeRangeC",
            label: '监测时间段',
            title: '设置监测时间段'
        },
    ]

    const fallBedArr = [
        {
            type: FormType.SWITCH,
            objKey: "switchD",
            label: '坠床提醒'
        },
        {
            type: FormType.TIME_RANGE,
            objKey: "timeRangeD",
            label: '监测时间段',
            title: '设置监测时间段'
        },
    ]



    const submitCloud = (newValue: any) => {
        console.log(newValue)
        setFormValue(newValue)
        let obj = formatSetting(newValue)
        obj.userName = phone
        obj.deviceName = sensorName

        dispatch(changeEquipInfo(obj))
        dispatch(changePersonalEquipAlarmInfo(obj))
    }

    const formatSetting = (newValue: any) => {
        let obj = {}
        const keyArr = Object.keys(newValue)
        // let realObj: any = { ...userInfo }

        let realObj: any = {}
        keyArr.forEach((item: string) => {
            const realValue = newValue[item]
            if (typeof newValue[item] == 'string') {
                //    提醒时间段
                if (newValue[item].includes('-')) {
                    const start = (realValue.split('-')[0])
                    const end = (realValue.split('-')[1])
                    // const key = objKeyToCloud[item]
                    // console.log(start , end)
                    const startHour = start.split(':')[0]
                    const startMin = start.split(':')[1]
                    const endHour = end.split(':')[0]
                    const endMin = end.split(':')[1]
                    if (start) realObj[objKeyToCloud[item].start] = startHour * 60 * 60 * 1000 + startMin * 60 * 1000
                    if (end) realObj[(objKeyToCloud[item]).end] = endHour * 60 * 60 * 1000 + endMin * 60 * 1000
                }
                // 提醒间隔
                else {
                    realObj[objKeyToCloud[item]] = parseInt(realValue)
                }
            }
            // 提醒开关
            else {
                realObj[objKeyToCloud[item]] = realValue ? 1 : 0
            }
        })
        return realObj
    }


    return (
        <>
            <List className="w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden">
                {
                    offBedArr.map((offBedItem) => {
                        return (
                            <RenderListItem type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }
            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden'>

                {
                    sitArr.map((offBedItem) => {
                        return (
                            <RenderListItem type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }

            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden'>
                {
                    fallBedArr.map((offBedItem) => {
                        return (
                            <RenderListItem type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }


            </List>
            <Picker
                columns={pickerInfo.columns}
                visible={pickerInfo.visible}
                onClose={() => {
                    setPickerInfo({
                        visible: false,
                        title: '',
                        columns: [],
                        key: '',
                        value: ''
                    })
                }}
                title={pickerInfo.title}
                value={pickerInfo.value}
                onConfirm={v => {
                    const result = v.length > 1 ? `${v[0]}:${v[1]} - ${v[2]}:${v[3]}` : v[0]
                    console.log(v)
                    submitCloud({
                        ...formValue,
                        [pickerInfo.key]: result
                    })
                }}
            />
        </>

    )
}
