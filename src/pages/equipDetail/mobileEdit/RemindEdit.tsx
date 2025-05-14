// import {  } from "a"
import { useEffect, useState } from "react"
import { RenderListItem } from "../EditingUser"
import { FormType } from "@/components/CommonFormModal"
import { Picker, List } from "antd-mobile"
import { useDispatch, useSelector } from "react-redux"
import { changeEquipInfo, changePersonalEquipAlarmInfo, selectEquipBySensorname } from "@/redux/equip/equipSlice"
import { useLocation } from "react-router-dom"
import { equipInfoFormatUtil } from "@/utils/dataToFormat"
import { phoneSelect } from "@/redux/token/tokenSlice"
import { Instancercv, instance } from "@/api/api";
import { message } from "antd"

type modelUserInfo = {
    [key: string]: any
}
let objKeyToCloud: modelUserInfo = {
    switchA: "leaveBedAlarm",
    switchB: "leaveBedAlarm",
    switchC: "situpAlarm",
    switchD: "fallbedAlarm",
    switchE: "sosAlarm",
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
    timeRangeE: {
        start: 'sosStart',
        end: 'sosEnd'
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
    const handleVisibilityChange = () => {
        const html = document.getElementsByTagName("html")[0];
        console.log("页面状态变化：", document.hidden);

        if (!document.hidden) {
            // 当页面重新显示在前台时
            html.style.fontSize = '16px';
            // window.location.reload(); // 刷新页面
        }
    };

    useEffect(() => {
        handleVisibilityChange(); // 初始化时执行一次
        // 添加事件监听器
        window.addEventListener('resize', handleVisibilityChange);
        window.addEventListener('visibilitychange', handleVisibilityChange);
        // 组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleVisibilityChange);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // 添加123
    }, []);
    const location = useLocation()
    const sensorName = location.state.sensorName
    const phone = useSelector(phoneSelect)
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))

    // const [userInfo, setUserInfo] = useState({
    // nurseStart, nurseEnd, fallbedStart, fallbedEnd, leaveBedStart, leaveBedEnd, situpStart, situpEnd, type, deviceId, leavebedParam
    // ...equipInfo
    // })

    const {
        fallbedStart, fallbedEnd, fallbedAlarm,
        leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
        situpStart, situpEnd, situpAlarm,
        sosAlarm, sosStart, sosEnd
    } = equipInfo || {}
    const { bedTypeFormat, timePeriodInitFormat, switchValueToboolean } = equipInfoFormatUtil

    let [formValue, setFormValue] = useState({
        timeRangeB: `${timePeriodInitFormat({ timeStamp: leaveBedStart || '', type: 'start' })} - ${timePeriodInitFormat({ timeStamp: leaveBedEnd, type: 'end' })} `,
        timeIntervalB: leaveBedPeriod === 0 ? '实时提醒' : `${leaveBedPeriod}分钟后提醒`,
        timeRangeC: `${timePeriodInitFormat({ timeStamp: situpStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: situpEnd, type: 'end' })} `,
        timeRangeD: `${timePeriodInitFormat({ timeStamp: fallbedStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: fallbedEnd, type: 'end' })} `,
        timeRangeE: `${timePeriodInitFormat({ timeStamp: sosStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: sosEnd, type: 'end' })} `,
        switchB: switchValueToboolean(leaveBedAlarm),
        switchC: switchValueToboolean(situpAlarm),
        switchD: switchValueToboolean(fallbedAlarm),
        switchE: switchValueToboolean(sosAlarm),
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
    const sosArr = [
        {
            type: FormType.SWITCH,
            objKey: "switchE",
            label: 'sos提醒'
        },
        {
            type: FormType.TIME_RANGE,
            objKey: "timeRangeE",
            label: '监测时间段',
            title: '设置监测时间段'
        },
    ]

    const getEquipInfo = () => {
        Instancercv({
            method: "get",
            url: "/device/selectSinglePatient",
            headers: {
                "content-type": "multipart/form-data",
                token: localStorage.getItem("token"),
            },
            params: {
                sensorName,
                phoneNum: localStorage.getItem("phone"),
            },
        }).then((res: any) => {
            const {
                fallbedStart, fallbedEnd, fallbedAlarm,
                leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
                situpStart, situpEnd, situpAlarm, sosAlarm, sosStart, sosEnd
            } = res.data.data
            setFormValue({
                timeRangeB: `${timePeriodInitFormat({ timeStamp: leaveBedStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: leaveBedEnd, type: 'end' })} `,
                timeIntervalB: leaveBedPeriod === 0 ? '实时提醒' : `${leaveBedPeriod}分钟后提醒`,
                timeRangeC: `${timePeriodInitFormat({ timeStamp: situpStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: situpEnd, type: 'end' })} `,
                timeRangeD: `${timePeriodInitFormat({ timeStamp: fallbedStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: fallbedEnd, type: 'end' })} `,
                timeRangeE: `${timePeriodInitFormat({ timeStamp: sosStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: sosEnd, type: 'end' })} `,
                switchB: switchValueToboolean(leaveBedAlarm),
                switchC: switchValueToboolean(situpAlarm),
                switchD: switchValueToboolean(fallbedAlarm),
                switchE: switchValueToboolean(sosAlarm),
            })
        });
    }

    useEffect(() => {
        getEquipInfo()
    }, [])

    const submitCloud = (newValue: any) => {

        setFormValue(newValue)
        let obj = formatSetting(newValue)
        obj.userName = phone
        obj.deviceName = sensorName

        // obj
        // 暂时不要删除，目前看这句代码没有实际意义
        try {
            // dispatch(changeEquipInfo(obj))
            dispatch(changePersonalEquipAlarmInfo(obj))
        } catch (error) {

        }
    }
    console.log(pickerInfo.columns, '..................pickerInfocolumns');

    const formatSetting = (formValue: any) => {
        let obj = {}
        const newValue = {
            ...formValue,
            timeIntervalB: formValue.timeIntervalB === '实时提醒' ? 0 : formValue.timeIntervalB,
        }
        const keyArr = Object.keys(newValue)

        // let realObj: any = { ...userInfo }
        let realObj: any = {}
        keyArr.forEach((item: string) => {


            const realValue = newValue[item]

            try {
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
                        if (end) realObj[objKeyToCloud[item].end] = endHour * 60 * 60 * 1000 + endMin * 60 * 1000
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
            } catch (error) {
                console.log(error, '...........111111111111...................44444444...............yyyyds');
            }
        })
        return realObj
    }
    return (
        <>
            <List className="w-[92%] mx-auto mt-[10px] rounded-[10px]">
                {
                    offBedArr.map((offBedItem) => {
                        if (!formValue.switchB && offBedItem.type !== FormType.SWITCH) {
                            return ''
                        }
                        return (
                            <RenderListItem listType="offBed" type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }
            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px]'>
                {
                    sitArr.map((offBedItem) => {
                        if (!formValue.switchC && offBedItem.type !== FormType.SWITCH) {
                            return ''
                        }
                        return (
                            <RenderListItem type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }

            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px]'>
                {
                    fallBedArr.map((offBedItem) => {
                        if (!formValue.switchD && offBedItem.type !== FormType.SWITCH) {
                            return ''
                        }
                        return (
                            <RenderListItem type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }
            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px]'>
                {
                    sosArr.map((offBedItem) => {
                        if (!formValue.switchD && offBedItem.type !== FormType.SWITCH) {
                            return ''
                        }
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
                    console.log(v, '.....................zxczxc');

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
