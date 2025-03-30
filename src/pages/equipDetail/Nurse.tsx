import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Empty } from 'antd'
import type { GetProp } from 'antd';
import TurnPlan from "./TurnPlan";
import TurnCardTable from './TurnCardTable';
import NurseRecord from './NurseRecord';
import useWindowSize from "../../hooks/useWindowSize";
import { useSelector, useDispatch } from 'react-redux'
import NursingOpen from '../equipDetail/nurseprocess/nursingOpen/nursingOpen'
import { nurseOpen } from '../../redux/Nurse/Nurse'
import './nurse.scss'

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
    const { isMobile } = useWindowSize()
    const renderEmpty: GetProp<typeof ConfigProvider, 'renderEmpty'> = (componentName) => {

        if (componentName === 'Table') {
            return <Empty image={<span></span>} description="还没有护理记录哦 快去记录吧～" />;
        }
    };

    // const [turnType , setTurnType] = useState(0)

    // useEffect(() => {
    //     getTurnType()
    // } , [])

    // const getTurnType = () => {
    //     setTurnType(1)
    // }
    const openNurse = useSelector((state: any) => state.nurse.open)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const onOpen = () => {
        setIsOpen(true)
        // dispatch(nurseOpen(false))
    }
    if (isMobile) return (

        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <TurnPlan isMobile />
            <TurnCardTable isMobile />
            <NurseRecord isMobile />
        </ConfigProvider>
    )
    console.log(openNurse, openNurse.nurseOpen, '......openNurse');

    return (
        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <div className={`flex w-full  `}  >

                {
                    openNurse ?
                        // <NursingOpen />
                        <>
                            {isOpen ? <NursingOpen /> : <div className={`w-full h-[${openNurse.nurseOpen === true ? '43.8rem' : ''}]  bg-[${openNurse ? '#fff' : ''}]    flex items-center justify-center`}>
                                <div className=" w-[13rem] h-[4rem] " style={{ textAlign: "center" }}>
                                    <p className="mb-[1rem] text-[1rem] text-[#A4B0BC]">当前无护理项</p>
                                    <Button onClick={() => onOpen()} type="primary" className="h-[2.7rem] w-[13rem]">创建护理项</Button>
                                </div>
                            </div>}
                        </>


                        : <>
                            <div className='w-[70%] mr-[10px]'>
                                <span className='inline-block text-lg text-[#32373E] font-semibold mb-[10px]'>翻身</span>
                                <TurnPlan />
                                <TurnCardTable />
                            </div>
                            <NurseRecord />
                        </>
                }
            </div>
        </ConfigProvider >
    )
}

export default Nurse