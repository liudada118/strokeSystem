import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Empty } from 'antd'
import type { GetProp } from 'antd';
import TurnPlan from "./TurnPlan";
import TurnCardTable from './TurnCardTable';
import NurseRecord from './NurseRecord';
import useWindowSize from "../../hooks/useWindowSize";
import { useSelector, useDispatch } from 'react-redux'
import NursingOpen from '../equipDetail/nurseprocess/nursingOpen/nursingOpen'
import { nurseOpen, nurseIsOpenAdd } from '../../redux/Nurse/Nurse'
import { Instancercv } from '@/api/api'
import NursingStencil from './nurseprocess/nursingOpen/nursingStencil'
import img from '../../assets/images/nurseChuangjian.png'
import './nurse.scss'
import { PlusCircleOutlined } from "@ant-design/icons";
import { getNurseConfist } from "@/utils/getNursingConfig"

const ThemeTable = {
    components: {
        Table: {
            headerBg: '#F5F8FA',
            headerColor: '#6C7784',
            headerSplitColor: 'transparent'
        },
    },
}
const Nurse: React.FC = () => {
    const handleVisibilityChange = () => {
        const html = document.getElementsByTagName("html")[0];
        console.log("页面状态变化：", document.hidden);

        if (!document.hidden) {
            // 当页面重新显示在前台时
            html.style.fontSize = '13px';
            // window.location.reload(); // 刷新页面
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        handleVisibilityChange(); // 初始化时执行一次
        // 添加事件监听器
        window.addEventListener('resize', handleVisibilityChange);
        window.addEventListener('visibilitychange', handleVisibilityChange);
        // 组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleVisibilityChange);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // 添加111
    }, []);
    const { isMobile } = useWindowSize()
    const sensorName = window.location.href.split('/')[6] || ''
    // const [nursePersonTemplate, setNursePersonTemplate] = useState([])
    // const [isModifyNurse, setIsModifyNurse] = useState(false)
    const renderEmpty: GetProp<typeof ConfigProvider, 'renderEmpty'> = (componentName) => {

        if (componentName === 'Table') {
            return <Empty image={<span></span>} description="还没有护理记录哦 快去记录吧～" />;
        }
    };
    const openNurse = useSelector((state: any) => state.nurse.open)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const onOpen = () => {
        setIsOpen(true)
        dispatch(nurseIsOpenAdd(true))
    }
    // const getPersonTemplate = () => {
    //     Instancercv({
    //         method: "get",
    //         url: "/nursing/getNursingConfig",
    //         headers: {
    //             "content-type": "multipart/form-data",
    //             "token": localStorage.getItem("token")
    //         },
    //         params: {
    //             deviceId: sensorName
    //         }
    //     }).then((res: any) => {
    //         let nursingConfig = getNurseConfist(res)
    //         // if (res.data.templateEffectiveFlag == 1) {
    //         //     nursingConfig = JSON.parse(res.data.nursingConfig || '[]')
    //         // } else {
    //         //     nursingConfig = JSON.parse(res.data.oldTemplate || '[]')
    //         // }

    //         // setNursePersonTemplate(nursingConfig)
    //     })
    // }

    const modifyNurseTemplate = () => {
        // setIsModifyNurse(true)
        setIsOpen(true)
        dispatch(nurseIsOpenAdd(true))
    }

    useEffect(() => {
        console.log('2222222222222', openNurse)
    }, [openNurse])
    const isRestNuserpage = useSelector((state: any) => state.nurse.isRestNuserpage)
    useEffect(() => {
        // setIsModifyNurse(false);
        setIsOpen(false)
        dispatch(nurseOpen(false))
    }, [isRestNuserpage])
    // const saveNurseTemplate = () => {
    //     // setIsModifyNurse(false);
    //     setIsOpen(false)
    //     dispatch(nurseOpen(false))
    //     // getPersonTemplate()
    // }
    if (isMobile) return (
        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <TurnPlan isMobile />
            <TurnCardTable isMobile />
            <NurseRecord isMobile />
        </ConfigProvider>
    )
    // console.log(openNurse, 'openNurse........')
    return (
        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <div className="flex">
                <div className=' w-[70%]  mr-[10px]'>
                    <span className='inline-block text-lg text-[#32373E] font-semibold mb-[10px]'>翻身</span>
                    <TurnPlan />
                    <TurnCardTable />
                </div>
                <NurseRecord />
            </div>
        </ConfigProvider >
    )
}

export default Nurse