import { Button, message, Modal } from "antd";
import { Popup } from 'antd-mobile'
import CommonTitle from '../../components/CommonTitle';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
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
import { turnbodyFlagSelect } from "@/redux/premission/premission";

import right from '@/assets/icon/right.png'
import back from '@/assets/icon/back.png'
import left from '@/assets/icon/left.png'
import unRight from '@/assets/icon/unRight.png'
import unBack from '@/assets/icon/unBack.png'
import unLeft from '@/assets/icon/unLeft.png'
import { convertToChinaNum } from "@/utils/math";
import { DataContext } from ".";
import { useGetWindowSize } from '@/hooks/hook'
import TurnReport from '@/pages/turnReport/TurnReport'
import './settingBlock.scss'
enum TurnPlanStatus {
    DONE = '已完成',
    TIME_OUT_DONE = '超时完成',
    LOADING = '报告生成中',
    UN_TIME_TO_BE_DOWN = '计划翻身',
    TO_BE_DONE = '待翻身',
    TIME_OUT = '已超时'
}
interface TurnPlanList {
    status: TurnPlanStatus;
    time: string
}

const sleepPose = [{
    value: '左侧卧',
    img: <img src={left} alt='' />,
    unimg: <img src={unLeft} alt='' />
}, {
    value: '仰卧',
    img: <img src={back} alt='' />,
    unimg: <img src={unBack} alt='' />
}, {
    value: '右侧卧',
    img: <img src={left} alt='' className='scale-x-[-1]' />,
    unimg: <img src={unLeft} alt='' className='scale-x-[-1]' />
}]

interface TurnPlanProps {
    isMobile?: boolean;
    // turnType: number
}

const TurnPlan: (props: TurnPlanProps) => React.JSX.Element = (props) => {

    const context = useContext(DataContext);

    const { turnAroundPlan, setTurnAroundPlan, getNurse, id } = context
    // const [turnAroundPlan, setTurnAroundPlan] = useState<TurnPlanList[]>([])


    const param = useParams()
    const sensorName = param.id
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))
    const { nursePeriod, nurseStart, nurseEnd } = equipInfo

    const turnType = useSelector(turnbodyFlagSelect)


    useEffect(() => {
        getNurse()
    }, [])

    /**
     * 请求护理计划
     */
    // const getNurse = () => {
    //     instance({
    //         method: "post",
    //         url: "/sleep/nurse/getMatrixListByName",
    //         params: {
    //             deviceName: sensorName,
    //             scheduleTimePeriod: nursePeriod,
    //             startTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + 0,
    //             endTimeMills: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
    //         },
    //     }).then((res) => {
    //         const nurseArr: any = []
    //         const flipbodyData = res.data.flipbodyData
    //         const nurseTotal = res.data.flipbodyCount
    //         const flipbodyLen = Object.keys(flipbodyData).length
    //         for (let i = 0; i < nurseTotal; i++) {
    //             nurseArr[i] = {}
    //             if (flipbodyLen && flipbodyData[i]) {
    //                 nurseArr[i].status = calNurseItemStatus(flipbodyData[i].status)
    //                 nurseArr[i].time = flipbodyData[i].timeMillis
    //                 nurseArr[i].logid = flipbodyData[i].logid
    //             } else {
    //                 if (flipbodyLen == i) {
    //                     nurseArr[i].status = calNurseItemStatus(0)
    //                 } else {
    //                     nurseArr[i].status = calNurseItemStatus(4)
    //                 }
    //             }

    //         }
    //         setTurnAroundPlan(nurseArr)



    //     }).catch((err) => {
    //         message.error('服务器错误')
    //     });;
    // }

    interface calNurseStatusParam {
        timeEnd: number
        timeStart: number
        nurseStatus: number
    }

    const calNurseItemStatus = (nurseStatus: number) => {
        switch (nurseStatus) {
            case 1:
                return TurnPlanStatus.DONE;
            case 2:
                return TurnPlanStatus.LOADING;
            case 3:
                return TurnPlanStatus.TIME_OUT_DONE;
            case 4:
                return TurnPlanStatus.UN_TIME_TO_BE_DOWN;
            default:
                return TurnPlanStatus.TO_BE_DONE;
        }
    }

    const { isMobile = false } = props;
    const navigate = useNavigate();
    const [recordModal, setRecordModal] = useState<boolean>(false)
    const [choosedSleep, setChoosedSleep] = useState<string>('')
    const current = dayjs().format('HH:mm').split(':')

    // 未激活的计划状态判断
    const inactivePlan = (status: string) => {
        return status == TurnPlanStatus.UN_TIME_TO_BE_DOWN
    }

    const isTimeOut = (status: string) => {
        return status == TurnPlanStatus.TO_BE_DONE
    }

    const renderImagIcon = (data: any) => {
        if (inactivePlan(data.status)) return plan_gray
        return [TurnPlanStatus.DONE, TurnPlanStatus.TO_BE_DONE].includes(data.status) ? plan_blue : plan_orange
    }

    const handleRecord = () => {
        setRecordModal(true)
        if (isMobile) {
            setRecordModal(true)

        }

    }

    const handleChooseSleep = (value: string) => {
        setChoosedSleep(value)
    }
    // const changeLoadButtonToDownButton
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [logid, setDataList] = useState('');
    const WindowSize = useGetWindowSize()
    const renderButton = (data: any) => {

        const inactive = inactivePlan(data.status);
        return [TurnPlanStatus.DONE, TurnPlanStatus.TIME_OUT_DONE].includes(data.status) ? (
            <div onClick={() => {
                setDataList(data.logid)
                setIsModalOpen(true)
            }} className="relative" >
                <Button variant="filled"
                    onClick={() => {
                        isMobile && navigate('/turnReport', { state: { logid: data.logid, id: id } })
                    }
                    }
                    className='w-[6rem] h-[2.4rem] text-sm bg-[#ECF0F4] border-none text-[#3E444C] font-medium'>查看报告</Button>
            </div >
        ) : data.status == TurnPlanStatus.LOADING ?
            <div className="relative" onClick={() => { message.info('报告正在生成中，请稍后查看') }}>
                <Button variant="solid"
                    className={`w-[6rem] h-[2.4rem] text-sm bg-[#ECF0F4] border-none text-[#3E444C] font-medium`}
                >查看报告</Button>
                <BorderProgress getNurse={getNurse} height={4} startPosition={(data.time)} timeTotal={150} />
            </div>
            :
            <Button color="primary" variant="solid"
                onClick={() => handleRecord()}
                className={`w-[6rem] h-[2.4rem] text-sm ${inactive ? '!bg-[#ECF0F4] !text-[#C2CDD6]' : ''} ${isTimeOut(data.status) ? 'bg-[#EC6E38]' : ''} border-none`}
            >去记录</Button>
    }


    return (
        <div className='bg-[#fff] w-full md:w-[94%] md:rounded-[10px] md:my-[10px] md:mx-auto border-b border-b-[#ECF0F4] md:border-0 pt-[25px] pl-[25px] md:pt-[1rem] md:pl-[1rem] pb-[10px]'>
            <NurseProcesst isModalOpenSend={recordModal} setIsModalOpenSend={setRecordModal} getNurse={getNurse} />
            <CommonTitle name='翻身计划' type={isMobile ? 'rect' : 'square'} />
            <div className='w-full'>
                {turnAroundPlan.map((item: any, index: any) => (
                    <div key={index} className={`flex items-center w-full ${inactivePlan(item.status) ? 'disabledPlan' : ''}`}>
                        <img src={renderImagIcon(item)}
                            alt="" className='w-xl h-xl mr-[10px]' />
                        <div
                            className={`flex items-center justify-between w-[93%] ${index !== (turnAroundPlan.length - 1) && 'border-b border-b-[#DCE3E9]'} p-[10px]`}>
                            <div className='flex flex-col planText'>
                                <span
                                    className='text-base font-medium'>{`第${convertToChinaNum(index + 1)}次`}</span>
                                <span
                                    className={`text-sm ${[TurnPlanStatus.TIME_OUT, TurnPlanStatus.TIME_OUT_DONE].includes(item.status) ? 'text-[#EC6E38]' : 'text-[#3E444C]'}`}
                                >{`${item.status} ${item.time ? dayjs(item.time).format('HH:mm') : ''}`}</span>
                            </div>
                            {renderButton(item)}
                        </div>
                    </div>
                ))}
            </div>
            {
                isModalOpen ? <Modal className="ModalStyle" closeIcon={false} width={"37rem"} height={'37rem'} style={{ background: "#F7F8FD" }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <TurnReport id={id} logid={logid} ></TurnReport>
                </Modal> : null
            }

        </div >
    )
}

export default TurnPlan


interface borderProgressParam {
    height: number
    startPosition: number
    timeTotal: number
    getNurse: Function
}

const BorderProgress = (props: borderProgressParam) => {
    const { height, startPosition, timeTotal, getNurse } = props
    console.log(new Date().getTime() - startPosition)
    console.log((startPosition + timeTotal * 1000 - new Date().getTime()) / (timeTotal * 1000) * 100)
    const newPosition = (startPosition + timeTotal * 1000 - new Date().getTime()) / (timeTotal * 1000) * 100
    const time = (newPosition) / 100 * timeTotal
    const progressRef = useRef<any>(null)

    useEffect(() => {
        let timeout: any
        let timeRenderButton: any
        if (time) {
            timeout = setTimeout(() => {
                if (progressRef.current) progressRef.current.style.transform = `translateX(${0}%)`
            }, 10);
            timeRenderButton = setTimeout(() => {
                // 为什么请求一下接口  而不直接修改button状态 因为button状态可能是完成或者超时完成
                getNurse()
            }, time * 1000);
        }
        return () => {
            clearTimeout(timeout)
            clearTimeout(timeRenderButton)
        }
    }, [time])

    return (
        <div className="buttonProgress absolute bottom-0 w-full h-full rounded-[6px] overflow-hidden">
            <div className={`absolute bottom-0 w-full h-[4px] bg-[#DCE3E9]`}></div>
            <div ref={progressRef} className={`absolute bottom-0 w-full h-[4px] bg-[#0072EF]`} style={{ transform: `translateX(${-newPosition}%)`, transition: `transform ${time}s ease-in-out` }}></div>
        </div>
    )
}
