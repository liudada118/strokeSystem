import React, { Fragment, useState } from "react";
import MenuLayouts from "../../layouts/MenuLayouts";
import styles from './message.module.scss'
import UserInfoCard from "./UserInfoCard";
import Monitor from "./Monitor/Monitor";
import back from '@/assets/image/return.png'
import Nurse from './Nurse'
import Reporter from './Reporter'
import { Tabs, ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import useWindowSize from "../../hooks/useWindowSize";
import { NoEquipLoading } from "@/components/noEquipLoading/NoEquipLoading";
import Title from "@/components/title/Title";
import { useNavigate, useParams } from "react-router-dom";



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

    const [activeKey, setActiveKey] = useState(activeKeyArr[(type || 0)])


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

export default EquipDetail  