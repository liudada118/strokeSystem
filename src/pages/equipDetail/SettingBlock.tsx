import React, { useContext, useEffect, useState } from "react";
import CommonFormModal, { FormType } from "../../components/CommonFormModal";
import { Button, message, Modal, Popconfirm, Switch } from "antd";
import type { PopconfirmProps } from 'antd';
import styles from "./message.module.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeEquipAllInfo, changePersonalEquipAlarmInfo, selectEquipBySensorname, statusSelect } from "@/redux/equip/equipSlice";
import { equipInfoFormatUtil, minToHourText } from "@/utils/dataToFormat";
import { phoneSelect, tokenSelect } from "@/redux/token/tokenSlice";
import { isManage, roleIdSelect } from "@/redux/premission/premission";
import CommonTitle from "@/components/CommonTitle";
import rigthLogo from '@/assets/image/rigthLogo.png'
import { DisplayEditNurseContent, PreViewConfig } from "./mobileEdit/NurseEdit";
import NurseSetting from "../setting/nurseSetting/NurseSetting";
import './settingBlock.scss'
import { Instancercv, netUrl } from "@/api/api";
import axios from "axios";
import { DataContext } from ".";
import { unbindHheDevice } from '../../api/index'

interface SettingBlockProps {
    onModify: (value: boolean) => void
    userInfo: any
    userInfoChange: boolean
    setUserChange: Function
    submitCloud: any;
    nurseformValue: any
    setNurseFormValue: any
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
    const location = useLocation()
    const sensorName = param.id
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))
    const phone = useSelector(phoneSelect)
    const token = useSelector(tokenSelect)
    const dispatch: any = useDispatch()
    const navigate = useNavigate()
    // const status = useSelector(statusSelect)
    const context = useContext(DataContext)
    const { nurseformValue, submitCloud, setNurseFormValue } = context
    const { onModify, } = props
    // TODO:合并成一个state对象
    const [editing, setEditing] = useState<boolean>(false);

    const [timeAModalOpen, setTimeAModalOpen] = useState<boolean>(false)
    const [intervalAModalOpen, setIntervalAModalOpen] = useState<boolean>(false)
    const [intervalBModalOpen, setIntervalBModalOpen] = useState<boolean>(false)
    const [timeBModalOpen, setTimeBModalOpen] = useState<boolean>(false)
    const [timeCModalOpen, setTimeCModalOpen] = useState<boolean>(false)
    const [timeDModalOpen, setTimeDModalOpen] = useState<boolean>(false)

    const [leaveParamModalOpen, setLeaveParamModalOpen] = useState<boolean>(false)

    const [fals, setFalse] = useState(false)
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

    // console.log(nursePeriod, '................................................................nursePeriod');


    /**
    * 请求护理配置
    */
    useEffect(() => {
        Instancercv({
            method: "get",
            url: "/nursing/getNursingConfig",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                deviceId: sensorName
            }
        }).then((res) => {
            console.log(res.data, 'resssssssss')
            const flipbodyConfig = JSON.parse(res.data.flipbodyConfig)
            console.log(flipbodyConfig)
            const { flipbodyCount, flipbodyTime } = flipbodyConfig
            if (flipbodyCount) {
                setNurseFormValue({
                    timeRangeA: `${flipbodyCount}次`,
                    timeIntervalA: `${flipbodyTime / 60}小时`,
                    switchA: true,
                })
            } else {
                setNurseFormValue({
                    timeRangeA: `${0}次`,
                    timeIntervalA: `${flipbodyTime / 60}小时`,
                    switchA: false,
                })
            }
        })
    }, [])
    // const [switchA, setSwitchA] = useState<boolean>(valueToAlarmFlag(injuryAlarm))
    // const [switchB, setSwitchB] = useState<boolean>(valueToAlarmFlag(leaveBedAlarm))
    // const [switchC, setSwitchC] = useState<boolean>(valueToAlarmFlag(situpAlarm))
    // const [switchD, setSwitchD] = useState<boolean>(valueToAlarmFlag(fallbedAlarm))
    const { bedTypeFormat, timePeriodInitFormat } = equipInfoFormatUtil

    type modelUserInfo = {
        [key: string]: string
    }

    // useEffect(() => {
    //     console.log(nursePeriod, 55555555)
    //     submitCloud(nursePeriod)
    // }, [nursePeriod])

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

        if (realKey == 'timeRangeA') {
            setNurseFormValue({
                ...nurseformValue, timeIntervalA: realValue,
            })
        } else if (realKey == 'timeIntervalA') {
            setNurseFormValue({
                ...nurseformValue, timeRangeA: realValue,
            })
        }

        else if (typeof realValue == 'string') {
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

    const secondArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const timeArr = [1, 2, 3]
    const secodnRateColumns = secondArr.map(item => ({
        id: `${item}次`,
        label: `${item}次`,
        value: `${item}次`
    }))
    const timeRateColumns = timeArr.map(item => ({
        id: `${item}小时`,
        label: `${item}小时`,
        value: `${item}小时`
    }))

    const settings = [{
        label: '翻身设置',
        id: 'turn_over_switch',
        // value: nursePeriod == 0 ? false : true,
        value: valueToAlarmFlag(injuryAlarm),

        handleSwitch: (value: boolean) => {
            setUserInfo({ ...userInfo, injuryAlarm: alarmFlagToValue(!!value) })
            setAlarmParamChange(true)
            // setSwitchA(!switchA)
            // setUserInfo({ ...userInfo, injuryAlarm: alarmFlagToValue(!valueToAlarmFlag(injuryAlarm)) })
            // if (nursePeriod == 0) {
            //     console.log(userInfo, '00000000000')
            //     setUserInfo({ ...userInfo, nursePeriod: 120 })
            // } else {
            //     setUserInfo({ ...userInfo, nursePeriod: 0 })
            // }

            // console.log(value, nurseformValue, '√......')
            // setNurseFormValue({
            //     ...nurseformValue,
            //     switchA: value,
            // })
            setNurseChange(true)
            // changeAlarmValueToCloud({ injuryAlarm: alarmFlagToValue(!switchA) })
        },
        params: [{
            label: '翻身间隔',
            id: 'timeRangeA',
            value: nurseformValue.timeIntervalA,
            onChange: () => {
                setTimeAModalOpen(true)
            },
            modal: <CommonFormModal
                title='翻身设置'
                open={timeAModalOpen}
                close={() => setTimeAModalOpen(false)}
                formList={[{
                    label: '设置翻身间隔',
                    key: 'timeRangeA',
                    value: nurseformValue.timeIntervalA,
                    type: FormType.SELECT,
                    children: timeRateColumns
                }]}
                onFinish={(values) => {
                    changeValueToUserInfo(values)
                    setNurseChange(true)
                }}
            />
        }, {
            label: '翻身次数',
            id: 'timeIntervalA',
            onChange: () => {
                setIntervalAModalOpen(true)
            },
            value: nurseformValue.timeRangeA,
            modal: <CommonFormModal
                title='翻身设置'
                open={intervalAModalOpen}
                close={() => setIntervalAModalOpen(false)}
                formList={[{
                    label: '设置翻身次数',
                    key: 'timeIntervalA',
                    value: nurseformValue.timeRangeA,
                    type: FormType.SELECT,
                    children: secodnRateColumns
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
        value: deviceId,

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

        // if (userNurseChange) {
        //     obj.nurseParam = {
        //         nurseStart, nurseEnd, nursePeriod, injuryAlarm,
        //         deviceId: sensorName
        //     }
        // }

        if (userAlarmParamChange) {
            obj.alarmParam = {
                fallbedStart, fallbedEnd, fallbedAlarm,
                leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
                situpStart, situpEnd, situpAlarm, injuryAlarm,
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

        if (props.userInfoChange || userAlarmParamChange || userLeaveBedParamChange) {
            console.log('dispatch')
            dispatch(changeEquipAllInfo(obj))
        }

        if (userNurseChange) {
            console.log(nurseformValue, '34444444')
            submitCloud({
                ...nurseformValue,
                switchA: !!injuryAlarm
            })
        }

        setNurseChange(false)
        setAlarmParamChange(false)
        setLeaveBedParamChange(false)
        props.setUserChange(false)

        setEditing(false)
        onModify(false)
    }

    // const submitCloud = (newValue: any) => {
    //     setFormValue(newValue)
    //     console.log(newValue)
    //     const obj = {
    //         flipbodyCount : parseInt(newValue.timeRangeA),
    //         flipbodyTime : parseInt(newValue.timeIntervalA)
    //     }

    //     // 开关关闭后  设置次数为0
    //     if(!newValue.switchA){
    //         obj.flipbodyCount = 0
    //     }
    //     axios({
    //         method: "post",
    //         url: netUrl + "/nursing/updateFlipConfig",
    //         headers: {
    //             "content-type": "application/json",
    //             "token": token
    //         },
    //         data: {
    //             deviceId: sensorName,
    //             config: JSON.stringify(obj),
    //         },
    //     }).then((res) => {
    //         // message.success('修改成功')
    //     }).catch((err) => {
    //         message.error('修改失败')
    //     })

    // }

    const roleId = useSelector(roleIdSelect)
    const isManageFlag = isManage(roleId)
    const renderFooterBtn = () => {

        return isManageFlag ? editing ?
            <Button type="primary" className='w-full rounded-[2px]'
                onClick={handleSettingCompleted}>保存设置</Button> : (
                <span className='cursor-pointer text-sm text-[#0072EF] ml-[20px]'
                    onClick={handleClickSettingBtn}>设置</span>) : ''
    }

    const [isSettingClick, setIsSettingClick] = useState(false)
    const handleAlarmSettingClick = () => {
        console.log('handleAlarmSettingClick')
        const flag = !isSettingClick
        setIsSettingClick(flag)
        if (flag) {
            console.log('999999999')
            handleClickSettingBtn()
        } else {
            console.log('888888888')
            handleSettingCompleted()
        }

    }


    //设备解绑
    const confirm: PopconfirmProps['onConfirm'] = async (e) => {

        // let res = await unbindHheDevice(location.state.deviceId)
        // console.log(res, '................................................................res');
        axios({
            method: "post",
            url: netUrl + "/device/cancelBindManual",

            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
            data: {
                phone: phone,
                deviceId: location.state.deviceId,
            }
        }).then((e) => {

            message.success('解绑成功')
            // navigator.
            navigate('/', {
                replace: true, state: {
                    unbundle: true
                }
            })
        })

    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('取消成功');
    };
    return (
        <div className='overflow-scroll h-[calc(100%-13rem)]'>
            <div className="flex justify-between">
                <CommonTitle name={'提醒设置'} type="square" />
                <div className="text-base text-sm leading-7 text-[#0072EF]" onClick={handleAlarmSettingClick}>{isSettingClick ? '保存' : '设置'}</div>
            </div>
            {settings.map((item) => (
                <div className='bg-[#fff] mb-[10px] py-[0.5rem] px-[0.8rem]'
                    key={item.label}>
                    <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold'>{item.label}</span>
                        {editing && <Switch size="small" checked={item.value} onClick={(value) => item.handleSwitch(value)} />}
                    </div>
                    {item.value && item.params.map((_item, index) => (

                        <div className={`flex items-center w-full ${index === 0 ? 'mt-[10px]' : ''} h-[2.6rem]`} key={_item.label}>
                            <div className='text-sm text-[#32373E] w-[5rem]'>{_item.label}</div>
                            <div
                                className={`flex justify-between items-center h-full text-base ${index !== (item.params.length - 1) && 'border-b border-b-[#DCE3E9]'} p-[5px] w-[calc(100%-5rem)]`}>
                                <span className='text-[#6C7784]'>{_item.label.includes('翻身') ? _item.value : _item.label.includes('提醒时间') ? `${_item.value}min` : _item.value}</span>
                                {editing && <span className='text-sm text-[#0072EF] cursor-pointer'
                                    onClick={() => _item.onChange()}>修改</span>}
                            </div>
                            {_item.modal}
                        </div>
                    ))}
                </div>
            ))}


            {/* {renderFooterBtn()} */}
            <CommonTitle name={'健康配置'} type="square" />
            {/* <div className='bg-[#fff] mb-[10px] p-[10px] px-[0.8rem] flex justify-between items-center'>
                <div>护理配置</div>
                <div><img className="w-[6.5px]" src={rigthLogo} alt="" /></div>
            </div> */}
            <SettingMoDal />


            <div className='bg-[#fff] mb-[10px] p-[10px] px-[0.8rem] flex justify-between items-center'>
                <div>推送日报配置</div>
                <div><img className="w-[6.5px]" src={rigthLogo} alt="" /></div>
            </div>

            <CommonTitle name={'设备类型'} type="square" />
            <div className='bg-[#fff] mb-[10px] pt-[10px] px-[0.8rem]'>
                <span className='text-base inline-block font-semibold mb-[10px]'>设备类型</span>
                <div>
                    {machineType.map(item => (

                        < div className={[styles.rowItem, 'text-sm', item.label == '设备校准' ? 'justify-between flex ' : '',].join(' ')} key={item.label} >
                            <div>
                                <span className='mr-[2rem]'>{item.label}</span>
                                <span>{item.value}</span>
                                {item.label === 'MAC地址' ?
                                    <Popconfirm
                                        title="你确定要解除绑定吗？"
                                        description="解除绑定后，此信息再也没有了。"
                                        onConfirm={confirm}
                                        onCancel={cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <span className="text-[#0072EF] ml-[1rem] " style={{ cursor: "pointer" }} >解绑设备</span>
                                    </Popconfirm>


                                    : ""
                                }
                            </div>
                            {
                                item.params && item.params.map((_item, index) => (
                                    <>
                                        {editing && <span className='text-sm text-[#0072EF] cursor-pointer pr-[5px]'
                                            onClick={() => _item.onChange()}>修改</span>}
                                        {_item.modal}
                                    </>
                                ))
                            }

                        </div>

                    ))}
                </div>
            </div>

        </div >
    )
}

const SettingMoDal = () => {
    const [nurseConfig, setNurseConfig] = useState([])
    const [open, setOpen] = useState(false)
    const onFinish = (config: any) => {
        setNurseConfig(config)
    }
    const handleFinish = () => {

    }
    const close = () => {
        setOpen(false)
    }
    return (
        <>
            <Modal
                title={"护理配置"}
                centered
                open={open}
                footer={() => null}
                onOk={() => close()}
                onCancel={() => close()}
                className="personNurseSetting"
            >
                {/* <div className="flex">
                    <div className="">
                        <DisplayEditNurseContent nurseConfig={nurseConfig} onFinish={onFinish} />
                    </div>
                    <div className="">
                        <PreViewConfig display={false} nurseConfig={nurseConfig} setNurseConfig={setNurseConfig} />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button color="primary" variant="outlined" className='mr-[10px]' onClick={() => close()}>取消</Button>
                    <Button type="primary" htmlType="submit" className='w-[6rem]' onClick={() => handleFinish()}>保存</Button>
                </div> */}


                <NurseSetting type="user" />
            </Modal>
            <div onClick={() => { setOpen(true) }} className='bg-[#fff] mb-[10px] p-[10px] px-[0.8rem] flex justify-between items-center'>
                <div>护理配置</div>
                <div><img className="w-[6.5px]" src={rigthLogo} alt="" /></div>
            </div>
        </>

    )
}

export default SettingBlock;