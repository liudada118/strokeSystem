import React, { useEffect, useState } from 'react'
import shijian1 from '../../../../assets/images/shijian.png'
import { Instancercv } from "@/api/api";
import { Button } from 'antd';
import { nurseIsOpenAdd } from '../../../../redux/Nurse/Nurse'
import { useDispatch } from 'react-redux'
import NurseTable from '../../../setting/nurseSetting/NurseSetting'
import { useGetWindowSize } from '@/hooks/hook'
import { useNavigate } from 'react-router-dom'
import './NursingOpen.scss'
interface propsType {
    sensorName?: any,
    type?: number,
    nursePersonTemplate?: any,
    statue?: number,
    title?: string,
    stylee?: string
}

function NursingStencil(props: propsType) {
    const { type, nursePersonTemplate, statue, title, sensorName, stylee } = props
    // console.log(stylee, '.......stylee');
    const windowSize = useGetWindowSize()
    const dispatch = useDispatch()
    const [name, setName] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        Instancercv({
            method: "get",
            url: "/device/selectSinglePatient",
            headers: {
                "content-type": "multipart/form-data",
                "token": localStorage.getItem('token')
            },
            params: {
                sensorName: 'KgvDXUvdEs9M9AEQDcVc',
                phoneNum: localStorage.getItem('phone')
            }
        }).then((res: any) => {
            setName(res.data.data.patientName)
        })
    }, []);
    const dian = () => {
        dispatch(nurseIsOpenAdd(true))

    }
    const yyyyds = () => {
        navigate('/userInfo_NurseTable')
    }
    return (
        <>

            {
                !windowSize ? <>{
                    statue === 1 ? <div className='w-[25rem] text-[#32373E] font-semibold text-2xl ' style={{ margin: '2rem 0 0 3rem' }}>
                        {name}护理项
                    </div> : ''
                }
                    <div className={`NursingStencil w-full h-full mt-[1rem]`} style={{ height: 'calc(100% - 6rem)' }}>
                        <div className={`w-[${statue == 1 ? '100%' : '34rem'}] h-[2.1rem] bg-[#F5F8FA] rounded flex items-center ml-[2rem] mr-[3rem] mt-[1rem]`} style={{ width: statue == 1 ? '' : '34rem' }}>
                            <div style={{ marginLeft: statue === 1 ? '3.7rem' : '2.7rem', fontSize: "0.75rem" }}>时间</div>
                            <div style={{ marginLeft: statue === 1 ? '9.9rem' : '5.7rem', marginRight: statue == 1 ? '42rem' : '15.6rem', fontSize: "0.75rem" }} >护理内容</div>
                            <div className={`${statue == 1 ? '100px' : '10px'}`} style={{ fontSize: "0.75rem" }}> 状态</div>
                        </div>
                        <div className={`h-full`} style={{ padding: "0 2rem", width: '100%' }}>
                            <div style={{ overflowY: "auto", borderBottom: "solid 1px #D8D8D8", width: '100%', height: statue == 1 ? "30rem" : '26rem' }}>
                                {(nursePersonTemplate || []).map((item: any, index: number) => {
                                    return (
                                        < div key={index} className='nursingStencilDoxcount px-2  nursingStencildivBox' style={{ display: "flex", backgroundColor: statue === 1 ? "#fff" : "#fff", }}>
                                            <div className={`${statue == 1 ? "nursingStencildiv1" : 'nursingStencildiv'}  flex mr-9 `} style={{ lineHeight: "4rem", width: statue == 1 ? '12.4rem' : "7rem" }}>
                                                <div className='w-[2.5rem] h-[0.7rem] text-[0.9rem] text-[#32373E] mt-[0.2rem] ml-[2.1rem] mr-[0.9rem]' style={{ marginLeft: statue == 1 ? '3rem' : '2.1rem' }}>{item.time}</div>
                                                <div className='w-[1.3rem] h-[1.3rem] rounded-md text-[#fff] bg-[#D1D9E1] flex items-center justify-center' style={{ borderRadius: "1.37rem", position: 'relative', top: '1.6rem', }}>{index + 1}</div>
                                            </div>
                                            <div className='qx flex  py-6' style={{ borderBottom: index === nursePersonTemplate.length ? 'none' : "solid 1px #D8D8D8", width: statue == 1 ? '47rem' : "21.rem" }}>
                                                <div className='flex' style={{ width: statue == 1 ? '10rem' : "" }}>
                                                    <img className='w-[1rem] h-[1rem] mt-[0.33rem] mr-3' src={shijian1} alt="" />
                                                    <div className='text-[#32373E] text-[1rem] font-medium mt-[0.1rem]' style={{ width: stylee == '1' ? '15rem' : '5rem' }}>{item.title}</div>
                                                </div>
                                                <div className='w-[3.5rem] h-[2rem]  flex items-center  text-[#929EAB] bg-[#E6EBF0] text-[0.8rem] rounded-md  font-medium justify-center' style={{ marginLeft: statue == 1 ? '34rem' : '11rem' }}>待完成</div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div >
                        </div>
                    </div >
                    {
                        statue === 1 ? <Button onClick={dian}
                            className="h-[2rem] w-[10rem]" type='primary' style={{ position: 'absolute', bottom: '2rem', right: '2rem', }}>
                            修改当前模版
                        </Button >
                            : ''
                    }
                </>
                    : <div className={`NursingStencil w-full h-full mt-[1rem]`} >
                        <div className={`w-[94%] h-[4rem] bg-[#F5F8FA] rounded flex items-center mx-[3%] rounded-md justify-between`} >
                            <div style={{ fontSize: "1.2rem", width: "20%", textAlign: "center" }}>时间</div>
                            <div style={{ fontSize: "1.2rem", width: '40%', textAlign: "center" }} >护理内容</div>
                            <div style={{ fontSize: "1.2rem", width: '20%', textAlign: "center" }}> 状态</div>
                        </div>
                        {/* // nursingStencil.tsx */}
                        <div style={{ width: '94%', margin: "0 3%", height: "30rem", overflow: 'hidden' }}>
                            <div style={{ height: "22rem", overflowY: "auto" }}>
                                {(nursePersonTemplate || []).map((item: any, index: number) => {
                                    return (
                                        <div key={index} className='' style={{ display: "flex" }}>
                                            <div className={`${statue == 1 ? "nursingStencildiv1yidong" : 'nursingStencildivyidong'} flex w-[30%]`} style={{ lineHeight: "4rem" }}>
                                                <div className='w-[50%] h-[0.7rem] text-[1.2rem] text-[#32373E] mt-[0.2rem] ml-[2.1rem] mr-[rem]' style={{ marginLeft: statue == 1 ? '' : '1.4rem' }}>{item.time}</div>
                                                <div className='w-[1.5rem] h-[1.5rem] rounded-md text-[#fff] bg-[#D1D9E1] flex items-center justify-center' style={{ borderRadius: "1.37rem", position: 'relative', top: '1.5rem', alignItems: "center" }}>{index + 1}</div>
                                            </div>
                                            <div className='qx flex py-6' style={{ borderBottom: index === nursePersonTemplate.length - 1 ? 'none' : "solid 1px #D8D8D8", width: '80%' }}>
                                                <div className='flex' style={{ width: "70%", marginLeft: "2rem" }}>
                                                    <img className='w-[1rem] h-[1rem] mt-[0.3rem] mr-3' src={shijian1} alt="" />
                                                    <div className='text-[#32373E] text-[1.4rem] font-medium' style={{ width: stylee == '1' ? '15rem' : '5rem' }}>{item.title}</div>
                                                </div>
                                                <div className='w-[5rem] h-[2.7rem] flex items-center text-[#929EAB] bg-[#E6EBF0] text-[1.2rem] rounded-md font-medium justify-center'>待完成</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <Button onClick={() => {
                                yyyyds()
                            }} type='primary' style={{ width: "100%", padding: "0 2%", height: "4rem", marginTop: "1rem" }}>选择模版</Button>
                        </div>
                    </div >
            }
        </>
    )
}
export default NursingStencil
