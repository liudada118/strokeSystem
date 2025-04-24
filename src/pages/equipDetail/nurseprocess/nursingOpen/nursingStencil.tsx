import React, { useEffect, useState } from 'react'
import shijian1 from '../../../../assets/images/shijian.png'
import { Instancercv } from "@/api/api";
import { Button } from 'antd';
import { nurseIsOpenAdd } from '../../../../redux/Nurse/Nurse'
import { useDispatch } from 'react-redux'
import { useGetWindowSize } from '@/hooks/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { getNurseConfist } from "@/utils/getNursingConfig"
import PCNurseList from "../nurseConf/nurseList/index";
import NurseEdit from "../nurseConf/nurseEdit/index";
import img from '@/assets/images/nurseChuangjian.png'
import { PlusCircleOutlined } from "@ant-design/icons";
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
            setName(res.data.data.patientName || '[]')
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
            console.log(nursingConfig, 'ddddddddddd.....')

            setNurseConfigList(nursingConfig)
        })
    }

    /**
     * 请求护理配置
     */
    useEffect(() => {
        getNurseConfigfist()
    }, [])
    return (
        <>
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
                            : <>

                                <div className='w-[25rem] text-[#32373E] font-semibold text-2xl ' style={{ margin: '0rem 0 0 3rem', paddingTop: '2rem' }}>
                                    {name}护理项
                                </div>
                                <div className={`nurse_list_box`}>
                                    <PCNurseList list={nurseConfigList || []} extParams={{ isShowTime: true, className: 'preview' }} />
                                </div >
                                <Button onClick={gotoEditNurse}
                                    className="h-[2.5rem] w-[10rem]" type='primary' style={{ position: 'absolute', bottom: '2rem', right: '2rem', }}>
                                    修改当前模版
                                </Button >
                            </>
                    }
                </div> : <NurseEdit nurseList={nurseConfigList || []} sensorName={sensorName} name={name} />
            }
        </>

    )
}

export default NursingStencil
