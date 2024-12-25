import { Button, message } from "antd";
import { Popup } from 'antd-mobile'
import CommonTitle from '../../components/CommonTitle';
import React, { useEffect, useState } from "react";
import plan_gray from "../../assets/images/plan_gray.png";
import plan_blue from "../../assets/images/plan_blue.png";
import plan_orange from "../../assets/images/plan_orange.png";
import left_sleep from "../../assets/images/left_sleep.svg";
import top_sleep from "../../assets/images/top_sleep.svg";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "@/api/api";
import { useSelector } from "react-redux";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import NurseProcesst from "./nurseprocess/NurseProcesst";

enum TurnPlanStatus {
    DONE = '已完成',
    TIME_OUT_DONE = '超时完成',
    TO_BE_DONE = '待翻身',
    TIME_OUT = '已超时'
}
interface TurnPlanList {
    status: TurnPlanStatus;
    timeStart: string;
    timeEnd: string;
}

const turnAroundPlan: TurnPlanList[] = [{
    status: TurnPlanStatus.DONE,
    timeStart: '08:00',
    timeEnd: '10:00'
}, {
    status: TurnPlanStatus.TIME_OUT_DONE,
    timeStart: '10:00',
    timeEnd: '12:00'
}, {
    status: TurnPlanStatus.TIME_OUT,
    timeStart: '12:00',
    timeEnd: '14:00'
}, {
    status: TurnPlanStatus.TO_BE_DONE,
    timeStart: '14:00',
    timeEnd: '16:00'
}, {
    status: TurnPlanStatus.TO_BE_DONE,
    timeStart: '14:00',
    timeEnd: '16:00'
}];
const sleepPose = [{
    value: '左侧卧',
    img: <img src={left_sleep} alt='' />
}, {
    value: '仰卧',
    img: <img src={top_sleep} alt='' />
}, {
    value: '右侧卧',
    img: <img src={left_sleep} alt='' className='scale-x-[-1]' />
}]

interface TurnPlanProps {
    isMobile?: boolean;
    turnType: number
}

const TurnPlan: (props: TurnPlanProps) => React.JSX.Element = (props) => {

    const [turnAroundPlan, setTurnAroundPlan] = useState<TurnPlanList[]>([])

    const param = useParams()
    const sensorName = param.id
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))
    const { nursePeriod, nurseStart, nurseEnd } = equipInfo


    useEffect(() => {
        getNurse()
    }, [])

    /**
     * 请求护理计划
     */
    const getNurse = () => {
        instance({
            method: "post",
            url: "/sleep/nurse/getMatrixListByName",
            params: {
                deviceName: sensorName,
                scheduleTimePeriod: nursePeriod,
                startTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + nurseStart,
                endTimeMills: new Date(new Date().toLocaleDateString()).getTime() + nurseEnd
            },
        }).then((res) => {
            const nursingSchedule = res.data.nursingSchedule
            const keysArr = Object.keys(nursingSchedule)
            const valuesArr = Object.values(nursingSchedule)
            const nurseArr: any = []
            for (let i = 0; i < keysArr.length; i++) {
                if (i == keysArr.length - 1) {
                    const timeStart = new Date(keysArr[i]).getTime()
                    const timeEnd = new Date(new Date().toLocaleDateString()).getTime() + nurseEnd
                    nurseArr[i] = {}
                    nurseArr[i].timeStart = dayjs(timeStart).format('HH:mm')
                    nurseArr[i].timeEnd = dayjs(timeEnd).format('HH:mm')
                    nurseArr[i].status = calNurseItemStatus({ timeEnd, timeStart, nurseStatus: Number(valuesArr[i]) })
                } else {
                    const timeStart = new Date(keysArr[i]).getTime()
                    const timeEnd = new Date(keysArr[i + 1]).getTime()
                    nurseArr[i] = {}
                    nurseArr[i].timeStart = dayjs(timeStart).format('HH:mm')
                    nurseArr[i].timeEnd = dayjs(timeEnd).format('HH:mm')
                    nurseArr[i].status = calNurseItemStatus({ timeEnd, timeStart, nurseStatus: Number(valuesArr[i]) })
                }
            }
            setTurnAroundPlan(nurseArr)
        }).catch((err) => {
            message.error('服务器错误')
        });;
    }

    interface calNurseStatusParam {
        timeEnd: number
        timeStart: number
        nurseStatus: number
    }

    const calNurseItemStatus = ({ timeEnd, timeStart, nurseStatus }: calNurseStatusParam) => {
        if (new Date().getTime() < timeStart) {
            return TurnPlanStatus.TO_BE_DONE
        } else if (new Date().getTime() > timeEnd) {
            if (nurseStatus == 1) {
                return TurnPlanStatus.DONE
            } else {
                return TurnPlanStatus.TIME_OUT
            }
        } else {
            return TurnPlanStatus.TO_BE_DONE
        }
    }

    const { isMobile = false, turnType } = props;
    const navigate = useNavigate();
    const [recordModal, setRecordModal] = useState<boolean>(false)
    const [choosedSleep, setChoosedSleep] = useState<string>('')
    const current = dayjs().format('HH:mm').split(':')

    // 未激活的计划状态判断
    const inactivePlan = (starTime: string) => {
        const min = starTime.split(':')

        if (parseInt(min[0]) > parseInt(current[0])) {
            return true
        } else return parseInt(min[0]) === parseInt(current[0]) && parseInt(min[1]) > parseInt(current[1]);

    }

    const isTimeOut = (endTIme: string) => {
        const max = endTIme.split(':')
        if (parseInt(max[0]) < parseInt(current[0])) {
            return true
        } else return parseInt(max[0]) === parseInt(current[0]) && parseInt(max[1]) < parseInt(current[1]);
    }

    const renderImagIcon = (data: any) => {
        if (inactivePlan(data.timeStart)) return plan_gray
        return [TurnPlanStatus.DONE, TurnPlanStatus.TO_BE_DONE].includes(data.status) ? plan_blue : plan_orange
    }

    const handleRecord = () => {
        if (isMobile) {
            setRecordModal(true)

        }

    }

    const handleChooseSleep = (value: string) => {
        setChoosedSleep(value)
    }

    const renderButton = (data: any) => {
        const inactive = inactivePlan(data.timeStart);
        return [TurnPlanStatus.DONE, TurnPlanStatus.TIME_OUT_DONE].includes(data.status) ? (
            <Button variant="filled"
                onClick={() => isMobile && navigate('/report')}
                className='w-[6rem] h-[2.4rem] text-sm bg-[#ECF0F4] border-none text-[#3E444C] font-medium'>查看报告</Button>
        ) :
            <Button color="primary" variant="solid"
                onClick={() => handleRecord()}
                className={`w-[6rem] h-[2.4rem] text-sm ${inactive ? '!bg-[#ECF0F4] !text-[#C2CDD6]' : ''} ${isTimeOut(data.timeEnd) ? 'bg-[#EC6E38]' : ''} border-none`}
                disabled={inactive}>去记录</Button>
    }
    return (
        <div className='bg-[#fff] w-full md:w-[94%] md:rounded-[10px] md:my-[10px] md:mx-auto border-b border-b-[#ECF0F4] md:border-0 pt-[25px] pl-[25px] md:pt-[1rem] md:pl-[1rem] pb-[10px]'>
            {turnType == 1 ? <NurseProcesst isModalOpenSend={recordModal} setIsModalOpenSend={setRecordModal} />
                :
                <Popup
                    visible={recordModal}
                    onMaskClick={() => {
                        setRecordModal(false)
                    }}
                    bodyStyle={{
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        minHeight: '40vh',
                    }}
                >
                    <div className='flex justify-between items-center pt-[10px] px-[20px]'>
                        <span className='text-base text-[#3D3D3D]' onClick={() => {
                            setRecordModal(false)
                            setChoosedSleep('')
                        }}>取消</span>
                        <span className='text-lg font-medium'>选择睡姿</span>
                        <span className='text-base text-[#0072EF]' onClick={() => {
                            setRecordModal(false)
                            setChoosedSleep('')
                        }}>提交</span>
                    </div>
                    <div className='flex justify-center items-center mt-[40px] pt-[10px]'>
                        {sleepPose.map(item => (
                            <div key={item.value} className='flex flex-col items-center ml-[20px]'>
                                <div className={`${choosedSleep === item.value ? 'bg-gradient-to-b from-[#009FFF] to-[#006CFD] shadow-md shadow-[#1D79EA]' : 'bg-[#F6F7FD]'} mb-[10px] rounded-[6px]`} onClick={() => handleChooseSleep(item.value)}>
                                    {item.img}
                                </div>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </Popup>}

            <CommonTitle name='翻身计划' type={isMobile ? 'rect' : 'square'} />
            <div className='w-full'>
                {turnAroundPlan.map((item, index) => (
                    <div key={index} className={`flex items-center w-full ${inactivePlan(item.timeStart) ? 'disabledPlan' : ''}`}>
                        <img src={renderImagIcon(item)}
                            alt="" className='w-xl h-xl mr-[10px]' />
                        <div
                            className={`flex items-center justify-between w-[93%] ${index !== (turnAroundPlan.length - 1) && 'border-b border-b-[#DCE3E9]'} p-[10px]`}>
                            <div className='flex flex-col planText'>
                                <span
                                    className='text-base font-medium'>{`${item.timeStart} - ${item.timeEnd}`}</span>
                                <span
                                    className={`text-sm ${[TurnPlanStatus.TIME_OUT, TurnPlanStatus.TIME_OUT_DONE].includes(item.status) ? 'text-[#EC6E38]' : 'text-[#3E444C]'}`}
                                >{item.status}</span>
                            </div>
                            {renderButton(item)}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default TurnPlan