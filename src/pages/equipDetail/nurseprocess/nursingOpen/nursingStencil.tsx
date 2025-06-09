import React, { useEffect, useState } from 'react'
import shijian1 from '../../../../assets/images/shijian.png'
import { Instancercv } from "@/api/api";
import { Button, Modal } from 'antd';
import { nurseIsOpenAdd } from '../../../../redux/Nurse/Nurse'
import { useDispatch } from 'react-redux'
import { useGetWindowSize } from '@/hooks/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { getNurseConfist } from "@/utils/getNursingConfig"
import PCNurseList from "../nurseConf/nurseList/index";
import NurseEdit from "../nurseConf/nurseEdit/index";
import img from '@/assets/images/nurseChuangjian.png'
import { PlusCircleOutlined } from "@ant-design/icons";
import { NavBar } from "antd-mobile";
import { nurseOpen } from '@/redux/Nurse/Nurse'
import './NursingOpen.scss'
interface propsType {
    sensorName?: any,
    type?: number,
    nursePersonTemplate?: any,
    statue?: number,
    title?: string,
    stylee?: any
}
function NursingStencil(props: propsType) {
    const dispatch = useDispatch()
    const param = useParams()
    const sensorName = param.id
    const navigator = useNavigate()
    const [name, setName] = useState<any>('');
    const [nurseConfigList, setNurseConfigList] = useState<any>([])
    const [isModifyNurse, setIsModifyNurse] = useState<any>(false)
    useEffect(() => {
        Instancercv({
            method: "get",
            url: "/device/selectSinglePatient",
            headers: {
                "content-type": "multipart/form-data",
                "token": localStorage.getItem('token')
            },
            params: {
                sensorName: sensorName,
                phoneNum: localStorage.getItem('phone')
            }
        }).then((res: any) => {
            setName(res?.data?.data?.patientName || '[]')
        })
    }, []);

    const gotoEditNurse = () => {
        setIsModifyNurse(true)
    }

    const getNurseConfigfist = () => {
        Instancercv({
            method: "get",
            url: "/nursing/getNursingConfig",
            headers: {
                "content-type": "multipart/form-data",
                "token": localStorage.getItem('token')
            },
            params: {
                deviceId: sensorName
            }
        }).then((res) => {
            let nursingConfig = getNurseConfist(res);      
            setNurseConfigList(nursingConfig)
        })
    }
    const back = () => {
        if (!isModifyNurse) {
            // navigator(-1)
            dispatch(nurseOpen(false))
        } else {

            showModal()
        }
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModifyNurse(false)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    /**
     * 请求护理配置
     */
    useEffect(() => {
        getNurseConfigfist()
    }, [])
    // const titleName=
    return (
        <>
            <Modal title="返回项目" okText='不保存' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className='flex justify-center items-center flex-col'>
                    <p className='text-[#3D3D3D] text-[0.85rem] mb-[0.1rem]'>该模版尚未保存</p>
                    <p className='text-[#8794A1]'>返回将不保存此次编辑的内容</p>
                </div>
            </Modal>
            <div className='w-full mb-[1rem] '>
                <NavBar back={` ${isModifyNurse ? '返回上一页' : ''}`} backIcon={!isModifyNurse ? true : false} className={`${isModifyNurse ? 'NursingStencilnavBar' : ""} bg-[#fff] text-[1.4rem]`} style={{ fontSize: "1.4rem", fontWeight: "500" }} right onBack={back}>护理配置</NavBar>
            </div >
            {
                !isModifyNurse ? <div className="nursingStencil h-full">
                    {
                        nurseConfigList.length === 0 ? <div className="empty_nurse_box" style={{ textAlign: "center" }}>
                            <p style={{ width: "15.5", display: ' flex', justifyContent: 'space-evenly' }}>
                                <img style={{ width: "4.2rem", height: "5.2rem" }} src={img} alt="" />
                            </p>
                            <p className="mb-[1rem] text-[1.15rem] text-[#A4B0BC]">
                                当前无护理计划
                            </p>
                            <Button onClick={() => setIsModifyNurse(true)} type="primary" className="h-[3rem] w-[15.5rem] text-[1rem]"><PlusCircleOutlined />创建护理项</Button>
                        </div>
                            : <div className='bg-[#fff]'>
                                <div className='w-[25rem] text-[#32373E] font-semibold text-2xl ' style={{ margin: '0rem 0 0 3rem', paddingTop: '2rem' }}>
                                    {name}护理项
                                </div>
                                <div className={`nurse_list_box`} style={{ borderBottom: '1px solid #D8D8D8' }}>
                                    <PCNurseList list={nurseConfigList || []} extParams={{ isShowTime: true, className: 'preview' }} />
                                </div >
                                <Button onClick={gotoEditNurse}
                                    className="h-[2.5rem] w-[10rem]" type='primary' style={{ position: 'absolute', bottom: '2.5rem', right: '9rem', }}>
                                    修改当前模版
                                </Button>
                            </div>
                    }
                </div> : <NurseEdit nurseList={nurseConfigList || []} sensorName={sensorName} name={name} />
            }
        </>
    )
}
export default NursingStencil
