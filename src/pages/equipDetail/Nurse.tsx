import React, { useEffect, useState } from "react";
import { ConfigProvider, Empty} from 'antd'
import type { GetProp } from 'antd';
import TurnPlan from "./TurnPlan";
import TurnCardTable from './TurnCardTable';
import NurseRecord from './NurseRecord';
import useWindowSize from "../../hooks/useWindowSize";
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

    if(isMobile) return (

        <ConfigProvider theme={ThemeTable}  renderEmpty={renderEmpty}>
            <TurnPlan isMobile />
            <TurnCardTable isMobile />
            <NurseRecord isMobile />
        </ConfigProvider>
    )

    return (
        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <div className='flex w-full'>
                <div className='w-[70%] mr-[10px]'>
                    <span className='inline-block text-lg text-[#32373E] font-semibold mb-[10px]'>翻身</span>
                    <TurnPlan />
                    <TurnCardTable />
                </div>
                <NurseRecord />
            </div>
        </ConfigProvider>
    )
}

export default Nurse