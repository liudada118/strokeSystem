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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { instance, Instancercv, netUrl } from "@/api/api";
import { useDispatch, useSelector } from "react-redux";
import { tokenSelect } from "@/redux/token/tokenSlice";
import { resetNuserpage } from '../../redux/Nurse/Nurse'
import axios from "axios";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { getNurseConfist } from "@/utils/getNursingConfig"
import NursingStencil from '@/pages/equipDetail/nurseprocess/nursingOpen/nursingStencil'
import { NavBar } from "antd-mobile";
import { log } from "console";

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
    const state: any = useLocation()
    const status = state?.person?.status || 'default'
    const navigate = useNavigate()
    const token = useSelector(tokenSelect)
    const [activeKey, setActiveKey] = useState(activeKeyArr[(type || 0)])
    const [turnAroundPlan, setTurnAroundPlan] = useState([])
    const yyyds = useSelector((state: any) => state.nurse.open)
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
    // const handleVisibilityChange = () => {
    //     const html = document.getElementsByTagName("html")[0];
    //     console.log("页面状态变化：", document.hidden);

    //     if (!document.hidden) {
    //         // 当页面重新显示在前台时
    //         html.style.fontSize = '13px';
    //         // window.location.reload(); // 刷新页面
    //     }
    // };

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    //     handleVisibilityChange(); // 初始化时执行一次
    //     // 添加事件监听器
    //     window.addEventListener('resize', handleVisibilityChange);
    //     window.addEventListener('visibilitychange', handleVisibilityChange);
    //     // 组件卸载时移除监听器
    //     return () => {
    //         window.removeEventListener('resize', handleVisibilityChange);
    //         window.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };
    //     // 添加111
    // }, []);
    const { isMobile } = useWindowSize()
    const dispale = useDispatch()
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
    const handleTabChange = (key: string) => {
        setActiveKey(key);
        navigate(`/report/${activeKeyArr.indexOf(key)}/${id}`);
        if (key !== 'nurse') {
            dispale(resetNuserpage())
        }
    };
    const handleTabChange1 = (key: string) => {
        setActiveKey(key);
        navigate(`/report/${activeKeyArr.indexOf(key)}/${id}`);
        if (key !== 'nurse') {
            dispale(resetNuserpage())
        }
    };
    const isGotoNursePage = useSelector((state: any) => state.nurse.isGotoNursePage)
    useEffect(() => {
        if (!isGotoNursePage) return
        handleTabChange1('nurse')
        handleTabChange('nurse')
    }, [isGotoNursePage])
    const nurseOpen = useSelector((state: any) => state.nurse.open)


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isMobile) {
        return (
            <MenuLayouts isMobile={isMobile}>
                <ConfigProvider
                    locale={zh_CN}
                    theme={TabTheme}
                    key={activeKey}
                >
                    {/* <CommonNavBar title='801' onBack={() => { }} /> */}
                    <Title />

                    <NoEquipLoading>
                        <UserInfoCard status={status} outer isMobile />
                        {
                            nurseOpen ? <div className='w-[calc(76%-130px)] pt-[1rem] h-[40rem]'>
                                <NursingStencil></NursingStencil>
                            </div>
                                : ''
                            //  <div className='w-[calc(76%-30px)] pt-[1rem] h-full'>
                            //     <Tabs
                            //         className={styles.tabContent}
                            //         defaultActiveKey={activeKey}
                            //         activeKey={activeKey}
                            //         centered
                            //         items={tabList}
                            //         onChange={(e: any) => handleTabChange1(e)}
                            //     />
                            // </div>
                        }
                        <div className="relative">
                            <Tabs
                                className={[styles.mobileTabContent, styles.tabContent].join(' ')}

                                activeKey={activeKey}
                                centered
                                items={tabList}
                                onChange={(e: any) => handleTabChange1(e)}
                            />

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
                    <div className='w-[24%] pt-[1rem] mr-[15px]'>
                        <UserInfoCard status={status} />
                    </div>
                    {
                        nurseOpen ? <div className='w-full h-[92%]  pr-[6.4rem]  pt-[1rem] h-full'>
                            <NursingStencil></NursingStencil>
                        </div>
                            : <div className='w-[calc(76%-20px)] pt-[1rem] h-full'>
                                <Tabs
                                    className={styles.tabContent}
                                    defaultActiveKey={activeKey}
                                    activeKey={activeKey}
                                    centered
                                    items={tabList}
                                    onChange={(e: any) => handleTabChange1(e)}
                                />
                            </div>
                    }
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


            const flipbodyConfig = JSON.parse(res.data.flipbodyConfig)

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
    // const { state: { deviceId } } = useLocation()
    const [turnAroundPlan, setTurnAroundPlan] = useState<TurnPlanList[]>([])
    const submitCloud = (newValue: any) => {
        setNurseFormValue(newValue)

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
            // message.error('')
        });
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
            let nursingConfig = getNurseConfist(res)

            // if (res.data.templateEffectiveFlag == 1) {
            //     nursingConfig = JSON.parse(res.data.nursingConfig || '[]')
            // } else {
            //     nursingConfig = JSON.parse(res.data.oldTemplate || '[]')
            // }
            setNursePersonTemplate(nursingConfig)
        })
    }
    useEffect(() => {
        getPersonTemplate()
    }, [id])
    return (
        <DataContext.Provider value={{
            nurseformValue, setNurseFormValue,
            submitCloud,
            turnAroundPlan, setTurnAroundPlan,
            getNurse,
            nursePersonTemplate, setNursePersonTemplate, getPersonTemplate, id
        }}>
            <EquipDetail />
        </DataContext.Provider>
    );
}

export default Provide