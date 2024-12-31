import React, { Fragment } from "react";
import MenuLayouts from "../../layouts/MenuLayouts";
import styles from './message.module.scss'
import UserInfoCard from "./UserInfoCard";
import Monitor from "./Monitor/Monitor";
import Nurse from './Nurse'
import Reporter from './Reporter'
import { Tabs, ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import useWindowSize from "../../hooks/useWindowSize";
import CommonNavBar from "../../components/CommonNavBar";
import { useSelector } from "react-redux";
import { statusSelect } from "@/redux/equip/equipSlice";
import { Loading } from "@/components/pageLoading";
import { NoEquipLoading } from "@/components/noEquipLoading/NoEquipLoading";
import Title from "@/components/title/Title";


const TabTheme = {
    components: {
        Tabs: {
            inkBarColor: '#0072EF',
            itemSelectedColor: '#3D3D3D',
            itemColor: '#929EAB'
        },
    },
}

const EquipDetail = () => {



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
                        <Tabs
                            className={[styles.mobileTabContent, styles.tabContent].join(' ')}
                            defaultActiveKey="monitor"
                            centered
                            items={tabList}
                        />
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
                            defaultActiveKey="monitor"
                            centered
                            items={tabList}
                        />
                    </div>
                </div>
            </ConfigProvider>
        </MenuLayouts>
    )
}

export default EquipDetail