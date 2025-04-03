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
    const sensorName = window.location.href.split('/')[6] || ''
    const [nursePersonTemplate, setNursePersonTemplate] = useState([])
    const [isModifyNurse, setIsModifyNurse] = useState(false)
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
    const getPersonTemplate = () => {
        Instancercv({
            method: "get",
            url: "/nursing/getNursingConfig",
            headers: {
                "content-type": "multipart/form-data",
                "token": localStorage.getItem("token")
            },
            params: {
                deviceId: sensorName
            }
        }).then((res: any) => {
            const nursingConfig = JSON.parse(res.data.nursingConfig)

            setNursePersonTemplate(nursingConfig)
        })
    }

    const modifyNurseTemplate = () => {
        setIsModifyNurse(true)
        setIsOpen(true)
        dispatch(nurseIsOpenAdd(true))
    }

    useEffect(() => {
        getPersonTemplate()
    }, [sensorName])
    const saveNurseTemplate = () => {
        setIsModifyNurse(false);
        setIsOpen(false)
        dispatch(nurseOpen(false))
        getPersonTemplate()
    }
    if (isMobile) return (
        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <TurnPlan isMobile />
            <TurnCardTable isMobile />
            <NurseRecord isMobile />
        </ConfigProvider>
    )
    console.log(openNurse, 'openNurse........')
    return (
        <ConfigProvider theme={ThemeTable} renderEmpty={renderEmpty}>
            <div className={`flex w-full h-full`}>
                {/* {openNurse} */}
                {
                    openNurse ?
                        !isModifyNurse && (nursePersonTemplate || []).length > 0 ? <div className="w-full h-full flex justify-between bg-[#fff]" > <div className="h-full w-full">
                            <NursingStencil nursePersonTemplate={nursePersonTemplate} statue={1} />
                            {/* <NurseTable type={'project'} sensorName={sensorName} getNurseTemplate={getNurseTemplate} templateId={templateId} data={nurseTemplate || []} /> */}
                            <Button onClick={modifyNurseTemplate}
                                className="h-[2rem] w-[10rem]" type='primary' style={{ position: 'absolute', bottom: '2rem', right: '2rem', }}>
                                修改当前模版
                            </Button >
                        </div></div>
                            :
                            !isOpen ?
                                < div className={`w-full h-full  bg-[${openNurse ? '#fff' : ''}]    flex items-center justify-center`}>
                                    <div className=" w-[13rem] h-[4rem] " style={{ textAlign: "center" }}>
                                        <p className="mb-[1rem] text-[1rem] text-[#A4B0BC]">当前无护理项</p>
                                        <Button onClick={() => onOpen()} type="primary" className="h-[2.7rem] w-[13rem]">创建护理项</Button>
                                    </div>
                                </div> : <NursingOpen saveNurseTemplate={saveNurseTemplate} setIsOpen={setIsOpen} setIsModifyNurse={setIsModifyNurse} nursePersonTemplate={nursePersonTemplate || []} />
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