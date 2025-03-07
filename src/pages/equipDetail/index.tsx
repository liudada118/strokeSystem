import React, { createContext, Fragment, useEffect, useState } from "react";
import MenuLayouts from "../../layouts/MenuLayouts";
import styles from './message.module.scss'
import UserInfoCard from "./UserInfoCard";
import Monitor from "./Monitor/Monitor";
import back from '@/assets/image/return.png'
import Nurse from './Nurse'
import Reporter from './Reporter'
import { Tabs, ConfigProvider, message } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import useWindowSize from "../../hooks/useWindowSize";
import { NoEquipLoading } from "@/components/noEquipLoading/NoEquipLoading";
import Title from "@/components/title/Title";
import { useNavigate, useParams } from "react-router-dom";
import { instance, Instancercv, netUrl } from "@/api/api";
import { useSelector } from "react-redux";
import { tokenSelect } from "@/redux/token/tokenSlice";
import axios from "axios";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";



const TabTheme = {
    components: {
        Tabs: {
            inkBarColor: '#0072EF',
            itemSelectedColor: '#3D3D3D',
            itemColor: '#929EAB'
        },
    },
}

export const DataContext = createContext<any>({ turnAroundPlan: [] })

const EquipDetail = () => {



    // const typeToActiveKey:any = {
    //     '0': 'monitor',
    //     '1': 'nurse',
    //     '2': 'reporter'
    // }

    // const activeKeyTotype = {
    //     monitor : 0,
    //     nurse : 1,
    //     reporter : 2
    // }
    const activeKeyArr: any = ['monitor', 'nurse', 'reporter']

    const param = useParams()
    const { type, id } = param
    const navigate = useNavigate()
    const token = useSelector(tokenSelect)
    const [activeKey, setActiveKey] = useState(activeKeyArr[(type || 0)])
    // const [nurseformValue, setNurseFormValue] = useState({
    //     timeRangeA: '6次',
    //     timeIntervalA: '1小时',
    //     switchA: true,
    // })
    /**
    * 请求护理配置
    */
    // useEffect(() => {
    //     Instancercv({
    //         method: "get",
    //         url: "/nursing/getNursingConfig",
    //         headers: {
    //             "content-type": "multipart/form-data",
    //             "token": token
    //         },
    //         params: {
    //             deviceId: id
    //         }
    //     }).then((res) => {
    //         console.log(res.data, 'resssssssss')
    //         const flipbodyConfig = JSON.parse(res.data.flipbodyConfig)
    //         console.log(flipbodyConfig)
    //         const { flipbodyCount, flipbodyTime } = flipbodyConfig
    //         if (flipbodyCount) {
    //             setNurseFormValue({
    //                 timeRangeA: `${flipbodyCount}次`,
    //                 timeIntervalA: `${flipbodyTime}小时`,
    //                 switchA: true,
    //             })
    //         } else {
    //             setNurseFormValue({
    //                 timeRangeA: `${0}次`,
    //                 timeIntervalA: `${flipbodyTime}小时`,
    //                 switchA: false,
    //             })
    //         }
    //     })
    // }, [])

    // const submitCloud = (newValue: any) => {
    //     setNurseFormValue(newValue)
    //     console.log(newValue)
    //     const obj = {
    //         flipbodyCount: parseInt(newValue.timeRangeA),
    //         flipbodyTime: parseInt(newValue.timeIntervalA)
    //     }

    //     // 开关关闭后  设置次数为0
    //     if (!newValue.switchA) {
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
    //             deviceId: id,
    //             config: JSON.stringify(obj),
    //         },
    //     }).then((res) => {
    //         // message.success('修改成功')
    //     }).catch((err) => {
    //         message.error('修改失败')
    //     })

    // }
    const { isMobile } = useWindowSize()


    const tabList = [{
        label: '监测',
        key: 'monitor',
        children: <Monitor />
    }, {
        label: '护理',
        key: 'nurse',
        children: <Nurse />
    }, {
        label: '报告',
        key: 'reporter',
        children: <Reporter />
    }]


    if (isMobile) {
        return (
            <MenuLayouts isMobile={isMobile}>
                <ConfigProvider
                    locale={zh_CN}
                    theme={TabTheme}
                >
                    {/* <CommonNavBar title='801' onBack={() => { }} /> */}
                    <Title />
                    <NoEquipLoading> <UserInfoCard outer isMobile />
                        <div className="relative">
                            <Tabs
                                className={[styles.mobileTabContent, styles.tabContent].join(' ')}
                                defaultActiveKey={activeKey}
                                centered
                                items={tabList}
                                onChange={(e) => {
                                    console.log(e, 'native')
                                    navigate(`/report/${activeKeyArr.indexOf(e)}/${id}`)
                                }}
                            />
                            {/* <img src={back} alt="" /> */}
                        </div>
                        {/* <TabsMobile>
                            {
                                tabList.map((item) => {
                                    return (
                                        <TabsMobile.Tab title='蔬菜' key={item.key}>
                                            {
                                                item.children
                                            }
                                        </TabsMobile.Tab>
                                    )
                                })
                            }
                        </TabsMobile> */}
                    </NoEquipLoading>
                </ConfigProvider>
            </MenuLayouts>
        )
    }



    return (
        <MenuLayouts isMobile={isMobile}>

            <ConfigProvider
                locale={zh_CN}
                theme={TabTheme}
            >
                <div className='flex ml-[15px] h-[calc(100vh-62px)] overflow-hidden'>
                    <div className='w-[24%] mr-[15px]'>
                        <UserInfoCard />
                    </div>
                    <div className='w-[calc(76%-30px)] h-full'>
                        <Tabs
                            className={styles.tabContent}
                            defaultActiveKey={activeKey}
                            centered
                            items={tabList}
                            onChange={(e) => {
                                console.log(e, 'native')
                                navigate(`/report/${activeKeyArr.indexOf(e)}/${id}`)
                            }}
                        />
                    </div>
                </div>
            </ConfigProvider>
        </MenuLayouts>
    )
}

// export default EquipDetail

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
function Provide() {
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
    const param = useParams()
    const { type, id } = param
    const navigate = useNavigate()
    const token = useSelector(tokenSelect)
    const [nurseformValue, setNurseFormValue] = useState({
        timeRangeA: '6次',
        timeIntervalA: '1小时',
        switchA: true,
    });

    useEffect(() => {
        getNurseConfig()
    }, [])
    const getNurseConfig = () => {
        Instancercv({
            method: "get",
            url: "/nursing/getNursingConfig",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                deviceId: id
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
    }

    const [turnAroundPlan, setTurnAroundPlan] = useState<TurnPlanList[]>([])
    const submitCloud = (newValue: any) => {
        setNurseFormValue(newValue)
        console.log(newValue)
        const obj = {
            flipbodyCount: parseInt(newValue.timeRangeA),
            flipbodyTime: parseInt(newValue.timeIntervalA) * 60
        }

        // 开关关闭后  设置次数为0
        if (!newValue.switchA) {
            obj.flipbodyCount = 0
        }
        axios({
            method: "post",
            url: netUrl + "/nursing/updateFlipConfig",
            headers: {
                "content-type": "application/json",
                "token": token
            },
            data: {
                deviceId: id,
                config: JSON.stringify(obj),
            },
        }).then((res) => {
            // message.success('修改成功')
            getNurse()
        }).catch((err) => {
            message.error('修改失败')
        })

    }

    /**
   * 请求护理计划
   */
    // const equipInfo = useSelector(state => selectEquipBySensorname(state, id))
    // const { nursePeriod, nurseStart, nurseEnd } = equipInfo
    const getNurse = () => {
        instance({
            method: "post",
            url: "/sleep/nurse/getMatrixListByName",
            params: {
                deviceName: id,
                scheduleTimePeriod: 2 * 60 * 60 * 1000,
                startTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + 0,
                endTimeMills: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
            },
        }).then((res) => {
            const nurseArr: any = []
            const flipbodyData = res.data.flipbodyData
            const nurseTotal = res.data.flipbodyCount
            const flipbodyLen = Object.keys(flipbodyData).length
            for (let i = 0; i < nurseTotal; i++) {
                nurseArr[i] = {}
                if (flipbodyLen && flipbodyData[i]) {
                    nurseArr[i].status = calNurseItemStatus(flipbodyData[i].status)
                    nurseArr[i].time = flipbodyData[i].timeMillis
                    nurseArr[i].logid = flipbodyData[i].logid
                } else {
                    if (flipbodyLen == i) {
                        nurseArr[i].status = calNurseItemStatus(0)
                    } else {
                        nurseArr[i].status = calNurseItemStatus(4)
                    }
                }

            }
            setTurnAroundPlan(nurseArr)



        }).catch((err) => {
            message.error('服务器错误')
        });;
    }


    const [nursePersonTemplate, setNursePersonTemplate] = useState<any>([])
    const getPersonTemplate = () => {
        Instancercv({
            method: "get",
            url: "/nursing/getNursingConfig",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                deviceId: id
            }
        }).then((res) => {
            const nursingConfig = JSON.parse(res.data.nursingConfig)
            setNursePersonTemplate(nursingConfig)
        })
    }

    return (
        <DataContext.Provider value={{
            nurseformValue, setNurseFormValue,
            submitCloud,
            turnAroundPlan, setTurnAroundPlan,
            getNurse,
            nursePersonTemplate , setNursePersonTemplate,getPersonTemplate
        }}>
            <EquipDetail />
        </DataContext.Provider>
    );
}

export default Provide