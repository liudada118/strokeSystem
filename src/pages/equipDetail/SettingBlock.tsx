import React, { useState } from "react";
import CommonFormModal, { FormType } from "../../components/CommonFormModal";
import { Button, Switch } from "antd";
import styles from "./message.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeEquipAllInfo, changePersonalEquipAlarmInfo, selectEquipBySensorname, statusSelect } from "@/redux/equip/equipSlice";
import { equipInfoFormatUtil, minToHourText } from "@/utils/dataToFormat";
import { phoneSelect } from "@/redux/token/tokenSlice";
import { isManage, roleIdSelect } from "@/redux/premission/premission";

interface SettingBlockProps {
    onModify: (value: boolean) => void
    userInfo: any
    userInfoChange: boolean
    setUserChange: Function
}

const SettingBlock: (props: SettingBlockProps) => React.JSX.Element = (props) => {

    const alarmFlagToValue = (flag: boolean) => {
        if (flag) {
            return 1
        } else {
            return 0
        }
    }

    const valueToAlarmFlag: (value: number) => boolean = (value) => {
        if (value == 1) {
            return true
        } else {
            return false
        }
    }

    const param = useParams()
    const sensorName = param.id
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))
    const phone = useSelector(phoneSelect)
    const dispatch: any = useDispatch()
    const navigate = useNavigate()
    // const status = useSelector(statusSelect)

    const { onModify } = props
    // TODO:合并成一个state对象
    const [editing, setEditing] = useState<boolean>(false);

    const [timeAModalOpen, setTimeAModalOpen] = useState<boolean>(false)
    const [intervalAModalOpen, setIntervalAModalOpen] = useState<boolean>(false)
    const [intervalBModalOpen, setIntervalBModalOpen] = useState<boolean>(false)
    const [timeBModalOpen, setTimeBModalOpen] = useState<boolean>(false)
    const [timeCModalOpen, setTimeCModalOpen] = useState<boolean>(false)
    const [timeDModalOpen, setTimeDModalOpen] = useState<boolean>(false)

    const [leaveParamModalOpen, setLeaveParamModalOpen] = useState<boolean>(false)


    const [userInfo, setUserInfo] = useState({
        // nurseStart, nurseEnd, fallbedStart, fallbedEnd, leaveBedStart, leaveBedEnd, situpStart, situpEnd, type, deviceId, leavebedParam
        ...equipInfo
    })
    const {
        nurseStart, nurseEnd, nursePeriod, injuryAlarm,
        fallbedStart, fallbedEnd, fallbedAlarm,
        leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
        situpStart, situpEnd, situpAlarm,
        type, deviceId,
        leavebedParam,

    } = userInfo
    // const [switchA, setSwitchA] = useState<boolean>(valueToAlarmFlag(injuryAlarm))
    // const [switchB, setSwitchB] = useState<boolean>(valueToAlarmFlag(leaveBedAlarm))
    // const [switchC, setSwitchC] = useState<boolean>(valueToAlarmFlag(situpAlarm))
    // const [switchD, setSwitchD] = useState<boolean>(valueToAlarmFlag(fallbedAlarm))
    const { bedTypeFormat, timePeriodInitFormat } = equipInfoFormatUtil

    type modelUserInfo = {
        [key: string]: string
    }



    const [userLeaveBedParamChange, setLeaveBedParamChange] = useState<boolean>(false)
    const [userNurseChange, setNurseChange] = useState<boolean>(false)
    const [userAlarmParamChange, setAlarmParamChange] = useState<boolean>(false)

    const changeAlarmValueToCloud = (config: any) => {
        if (sensorName) {
            dispatch(changePersonalEquipAlarmInfo({ deviceName: sensorName, ...config }))
        } else {
            navigate('/')
        }

    }



    const changeValueToUserInfo = (values: modelUserInfo) => {
        const realValue: string = Object.values(values)[0]
        const realKey: string = Object.keys(values)[0]

        if (typeof realValue == 'string') {
            const start = Number(realValue.split('-')[0])
            const end = Number(realValue.split('-')[1])
            const obj: any = {
                'timeRangeA': {
                    start: 'nurseStart',
                    end: 'nurseEnd'
                }, 'timeRangeB': {
                    start: 'leaveBedStart',
                    end: 'leaveBedEnd'
                },
                'timeRangeC': {
                    start: 'situpStart',
                    end: 'situpEnd'
                },
                'timeRangeD': {
                    start: 'fallbedStart',
                    end: 'fallbedEnd'
                }

            }

            const realObj: any = { ...userInfo }
            if (start) realObj[obj[realKey].start] = start
            if (end) realObj[obj[realKey].end] = end
            setUserInfo({ ...realObj })
        } else {
            const obj: any = {
                timeIntervalA: 'nursePeriod',
                timeIntervalB: 'leaveBedPeriod'
            }

            const realObj: any = { ...userInfo }
            realObj[obj[realKey]] = realValue

            console.log(obj[realKey], realValue)
            setUserInfo({ ...realObj })
        }


    }
    const settings = [{
        label: '翻身设置',
        id: 'turn_over_switch',
        value: nursePeriod == 0 ? false : true,
        handleSwitch: () => {
            // setSwitchA(!switchA)
            // setUserInfo({ ...userInfo, injuryAlarm: alarmFlagToValue(!valueToAlarmFlag(injuryAlarm)) })
            if (nursePeriod == 0) {
                setUserInfo({ ...userInfo, nursePeriod: 120 })
            } else {
                setUserInfo({ ...userInfo, nursePeriod: 0 })
            }
            setNurseChange(true)
            // changeAlarmValueToCloud({ injuryAlarm: alarmFlagToValue(!switchA) })
        },
        params: [{
            label: '设置时间段',
            id: 'timeRangeA',
            value: `${timePeriodInitFormat({ timeStamp: nurseStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: nurseEnd, type: 'end' })}`,
            onChange: () => {
                setTimeAModalOpen(true)
            },
            modal: <CommonFormModal
                title='翻身设置'
                open={timeAModalOpen}
                close={() => setTimeAModalOpen(false)}
                formList={[{
                    label: '设置时间段',
                    key: 'timeRangeA',
                    value: `${timePeriodInitFormat({ timeStamp: nurseStart, type: 'start' })} - ${timePeriodInitFormat({ timeStamp: nurseEnd, type: 'end' })}`,
                    type: FormType.TIME_RANGE,
                }]}
                onFinish={(values) => {
                    changeValueToUserInfo(values)
                    setNurseChange(true)
                }}
            />
        }, {
            label: '翻身间隔',
            id: 'timeIntervalA',
            onChange: () => {
                setIntervalAModalOpen(true)
            },
            value: nursePeriod,
            modal: <CommonFormModal
                title='翻身设置'
                open={intervalAModalOpen}
                close={() => setIntervalAModalOpen(false)}
                formList={[{
                    label: '设置翻身间隔',
                    key: 'timeIntervalA',
                    value: nursePeriod,
                    type: FormType.RADIO,
                    children: [{
                        id: '30',
                        value: 30,
                        label: '0.5小时'
                    }, {
                        id: '60',
                        value: 60,
                        label: '1小时'
                    }, {
                        id: '90',
                        value: 90,
                        label: '1.5小时'
                    }, {
                        id: '120',
                        value: 120,
                        label: '2小时'
                    }]
                }]}
                onFinish={(values) => {
                    // setTimeIntervalA(values.timeIntervalA)
                    changeValueToUserInfo(values)
                    setNurseChange(true)
                }}
            />
        }]
    }, {
        label: '离床提醒设置',
        id: 'turn_over_switch',
        value: valueToAlarmFlag(leaveBedAlarm),
        handleSwitch: () => {
            // setSwitchB(!switchB)
            setUserInfo({ ...userInfo, leaveBedAlarm: alarmFlagToValue(!valueToAlarmFlag(leaveBedAlarm)) })
            setAlarmParamChange(true)
        },
        params: [{
            label: '监测时间段',
            id: 'timeRangeB',
            value: `${timePeriodInitFormat({ timeStamp: leaveBedStart, type: 'start' })}-${timePeriodInitFormat({ timeStamp: leaveBedEnd, type: 'end' })}`,
            onChange: () => {
                setTimeBModalOpen(true)
            },
            modal: <CommonFormModal
                title='离床提醒设置'
                open={timeBModalOpen}
                close={() => setTimeBModalOpen(false)}
                formList={[{
                    label: '监测时间段',
                    key: 'timeRangeB',
                    value: `${timePeriodInitFormat({ timeStamp: leaveBedStart, type: 'start' })}-${timePeriodInitFormat({ timeStamp: leaveBedEnd, type: 'end' })}`,
                    type: FormType.TIME_RANGE,
                }]}
                onFinish={(values) => {
                    // setTimeRangeB(values.timeRangeB)
                    changeValueToUserInfo(values)
                    setAlarmParamChange(true)
                }}
            />
        }, {
            label: '提醒时间',
            id: 'timeIntervalB',
            value: leaveBedPeriod,
            onChange: () => {
                setIntervalBModalOpen(true)
                setAlarmParamChange(true)
            },
            modal: <CommonFormModal
                title='离床提醒设置'
                open={intervalBModalOpen}
                close={() => setIntervalBModalOpen(false)}
                formList={[{
                    label: '设置提醒时间',
                    key: 'timeIntervalB',
                    value: leaveBedPeriod,
                    type: FormType.RADIO,
                    children: [{
                        id: '3min',
                        value: 3,
                        label: '3min'
                    }, {
                        id: '5min',
                        value: 5,
                        label: '5min'
                    }, {
                        id: '10min',
                        value: 10,
                        label: '10min'
                    }, {
                        id: '实时提醒',
                        value: 0,
                        label: '实时提醒'
                    }]
                }]}
                onFinish={(values) => {
                    // setTimeIntervalB(values.timeIntervalB)
                    changeValueToUserInfo(values)
                    setAlarmParamChange(true)
                }}
            />
        }]
    }, {
        label: '坐起提醒设置',
        id: 'turn_over_switch',
        value: valueToAlarmFlag(situpAlarm),
        handleSwitch: () => {
            // setSwitchC(!switchC)
            setUserInfo({ ...userInfo, situpAlarm: alarmFlagToValue(!valueToAlarmFlag(situpAlarm)) })
            setAlarmParamChange(true)
        },
        params: [{
            label: '监测时间段',
            id: 'timeRangeC',
            value: `${timePeriodInitFormat({ timeStamp: situpStart, type: 'start' })}-${timePeriodInitFormat({ timeStamp: situpEnd, type: 'end' })}`,
            onChange: () => {
                setTimeCModalOpen(true)
            },
            modal: <CommonFormModal
                title='坐起提醒设置'
                open={timeCModalOpen}
                close={() => setTimeCModalOpen(false)}
                formList={[{
                    label: '监测时间段',
                    key: 'timeRangeC',
                    value: `${timePeriodInitFormat({ timeStamp: situpStart, type: 'start' })}-${timePeriodInitFormat({ timeStamp: situpEnd, type: 'end' })}`,
                    type: FormType.TIME_RANGE,
                }]}
                onFinish={(values) => {
                    // setTimeRangeC(values.timeRangeC)
                    changeValueToUserInfo(values)
                    setAlarmParamChange(true)
                }}
            />
        }]
    }, {
        label: '坠床提醒设置',
        id: 'turn_over_switch',
        value: valueToAlarmFlag(fallbedAlarm),
        handleSwitch: () => {
            // setSwitchD(!switchD)
            setUserInfo({ ...userInfo, fallbedAlarm: alarmFlagToValue(!valueToAlarmFlag(fallbedAlarm)) })
            setAlarmParamChange(true)
        },
        params: [{
            label: '监测时间段',
            id: 'timeRangeD',
            value: `${timePeriodInitFormat({ timeStamp: fallbedStart, type: 'start' })}-${timePeriodInitFormat({ timeStamp: fallbedEnd, type: 'end' })}`,
            onChange: () => {
                setTimeDModalOpen(true)
            },
            modal: <CommonFormModal
                title='坠床提醒设置'
                open={timeDModalOpen}
                close={() => setTimeDModalOpen(false)}
                formList={[{
                    label: '监测时间段',
                    key: 'timeRangeD',
                    value: `${timePeriodInitFormat({ timeStamp: fallbedStart, type: 'start' })}-${timePeriodInitFormat({ timeStamp: fallbedEnd, type: 'end' })}`,
                    type: FormType.TIME_RANGE,
                }]}
                onFinish={(values) => {
                    // setTimeRangeD(values.timeRangeD)
                    changeValueToUserInfo(values)
                    setAlarmParamChange(true)
                }}
            />
        }]
    }]
    const machineType = [{
        label: '床垫类型',
        value: bedTypeFormat(type)
    }, {
        label: 'MAC地址',
        value: deviceId
    }, {
        label: '设备校准',
        value: leavebedParam,
        params: [
            {
                label: '设备校准',
                value: leavebedParam,
                id: 'leavebedParam',
                onChange: () => {
                    setLeaveParamModalOpen(true)
                },
                modal: <CommonFormModal
                    title='设备校准'
                    open={leaveParamModalOpen}
                    close={() => setLeaveParamModalOpen(false)}
                    formList={[{
                        label: '设备校准',
                        key: 'leavebedParam',
                        value: leavebedParam,
                        type: FormType.INPUT,
                    }]}
                    onFinish={(values) => {
                        // setTimeRangeD(values.timeRangeD)
                        // changeValueToUserInfo(values)
                        setUserInfo({ ...userInfo, ...values })
                        setLeaveBedParamChange(true)
                    }}
                />
            }
        ]
    }]

    const handleClickSettingBtn = () => {
        setEditing(true)
        onModify(true)
    }

    const handleSettingCompleted = () => {

        // nurseParam?: NurseParam
        // leaveParam?: leaveParam
        // alarmParam?: alarmParam
        // userParam?: userParam
        let obj: any = {
            // deviceId: sensorName
        }
        if (props.userInfoChange) {
            obj.userParam = {
                ...props.userInfo,
                phone: phone,
                deviceId: sensorName
            }
            // obj.phone = phone
        }

        if (userNurseChange) {
            obj.nurseParam = {
                nurseStart, nurseEnd, nursePeriod, injuryAlarm,
                deviceId: sensorName
            }
        }

        if (userAlarmParamChange) {
            obj.alarmParam = {
                fallbedStart, fallbedEnd, fallbedAlarm,
                leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
                situpStart, situpEnd, situpAlarm,
                userName: phone,
                deviceName: sensorName
            }
        }

        if (userLeaveBedParamChange) {
            obj.leaveParam = {
                leaveBedParam: leavebedParam,
                deviceId: sensorName
            }
        }

        if (props.userInfoChange || userNurseChange || userAlarmParamChange || userLeaveBedParamChange) {
            console.log('dispatch')
            dispatch(changeEquipAllInfo(obj))
        }

        setNurseChange(false)
        setAlarmParamChange(false)
        setLeaveBedParamChange(false)
        props.setUserChange(false)

        setEditing(false)
        onModify(false)
    }
    const roleId = useSelector(roleIdSelect) 
    const isManageFlag = isManage(roleId)
    const renderFooterBtn = () => {
       
        return isManageFlag ? editing ?
            <Button type="primary" className='w-full rounded-[2px]'
                onClick={handleSettingCompleted}>保存设置</Button> : (
                <span className='cursor-pointer text-sm text-[#0072EF] ml-[20px]'
                    onClick={handleClickSettingBtn}>设置</span>) : ''
    }

    return (
        <div className='overflow-scroll h-[calc(100%-13rem)]'>
            {settings.map((item) => (
                <div className='bg-[#fff] mb-[10px] py-[0.5rem] px-[0.8rem]'
                    key={item.label}>
                    <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold'>{item.label}</span>
                        {editing && <Switch size="small" checked={item.value} onClick={() => item.handleSwitch()} />}
                    </div>
                    {item.value && item.params.map((_item, index) => (

                        <div className={`flex items-center w-full ${index === 0 ? 'mt-[10px]' : ''} h-[2.6rem]`} key={_item.label}>
                            <div className='text-sm text-[#32373E] w-[5rem]'>{_item.label}</div>
                            <div
                                className={`flex justify-between items-center h-full text-base ${index !== (item.params.length - 1) && 'border-b border-b-[#DCE3E9]'} p-[5px] w-[calc(100%-5rem)]`}>
                                <span className='text-[#6C7784]'>{_item.label.includes('翻身') ? minToHourText(_item.value) : _item.label.includes('提醒时间') ? `${_item.value}min` : _item.value}</span>
                                {editing && <span className='text-sm text-[#0072EF] cursor-pointer'
                                    onClick={() => _item.onChange()}>修改</span>}
                            </div>
                            {_item.modal}
                        </div>
                    ))}
                </div>
            ))}

            <div className='bg-[#fff] mb-[10px] pt-[10px] px-[0.8rem]'>
                <span className='text-base inline-block font-semibold mb-[10px]'>设备类型</span>
                <div>
                    {machineType.map(item => (
                        <div className={[styles.rowItem, 'text-sm', item.label == '设备校准' ? 'justify-between flex ' : '',].join(' ')} key={item.label}>
                            <div>
                                <span className='mr-[2rem]'>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                            {item.params && item.params.map((_item, index) => (
                                <>
                                    {editing && <span className='text-sm text-[#0072EF] cursor-pointer pr-[5px]'
                                        onClick={() => _item.onChange()}>修改</span>}
                                    {_item.modal}
                                </>
                            ))}

                        </div>
                    ))}
                </div>
            </div>
            {renderFooterBtn()}
        </div>
    )
}

export default SettingBlock;