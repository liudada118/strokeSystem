import React, { useEffect } from 'react'
import shijian1 from '../../../../assets/images/shijian.png'
import { Instancercv } from "@/api/api";
import { Button } from 'antd';
import { nurseIsOpenAdd } from '../../../../redux/Nurse/Nurse'
import { useDispatch } from 'react-redux'
import NurseTable from '../../../setting/nurseSetting/NurseSetting'
interface propsType {
    sensorName?: any,
    type?: number,
    nursePersonTemplate?: any,
    statue?: number,
    title?: string
}

function NursingStencil(props: propsType) {
    const { type, nursePersonTemplate, statue, title, sensorName } = props
    const dispatch = useDispatch()

    console.log(nursePersonTemplate, '............nursePersonTemplate....................................................data');

    const dian = () => {
        dispatch(nurseIsOpenAdd(true))
        console.log('........nurseIsOpenAdd');
    }
    return (
        <>
            {
                statue === 1 ? <div className='w-[10rem] text-[#32373E] font-semibold text-2xl ' style={{ margin: '2rem 0 0 3rem' }}>
                    老人护理项
                </div> : ''
            }

            <div className={`NursingStencil w-full h-full mt-[1rem]`} style={{ height: 'calc(100% - 6rem)' }}>
                <div className={`w-[${statue == 1 ? '100%' : '34rem'}] h-[2.1rem] bg-[#F5F8FA] rounded flex items-center ml-[2rem] mr-[3rem] mt-[1rem]`} style={{ width: statue == 1 ? '' : '34rem' }}>
                    <div style={{ marginLeft: statue === 1 ? '3.7rem' : '2.7rem', }}>时间</div>
                    <div style={{ marginLeft: statue === 1 ? '9.9rem' : '2.7rem', marginRight: statue == 1 ? '42rem' : '6.6rem' }} >护理内容</div>
                    <div className={`${statue == 1 ? '100px' : '10px'}`}> 状态</div>
                </div>
                <div className={`h-full`} style={{ padding: "0 2rem", width: '100%' }}>
                    <div style={{ overflowY: "auto", borderBottom: "solid 1px #D8D8D8", width: '100%', height: statue == 1 ? "30rem" : '26rem' }}>
                        {nursePersonTemplate.map((item: any, index: number) => {
                            return (
                                < div key={index} className='nursingStencilDoxcount px-2  nursingStencildivBox' style={{ display: "flex", backgroundColor: statue === 1 ? "#fff" : "#fff", }}>
                                    <div className={`${statue == 1 ? "nursingStencildiv1" : 'nursingStencildiv'}  flex mr-9 `} style={{ lineHeight: "4rem", width: statue == 1 ? '12.4rem' : "7rem" }}>
                                        <div className='w-[2.5rem] h-[0.7rem] text-[0.75rem] mt-[0.2rem] ml-[2.1rem] mr-[0.9rem]' style={{ marginLeft: statue == 1 ? '3rem' : '2.1rem' }}>{item.time}</div>
                                        <div className='w-[1.5rem] h-[1.5rem] rounded-md text-[#fff] bg-[#D1D9E1] flex items-center justify-center' style={{ borderRadius: "1.37rem", position: 'relative', top: '1.5rem', }}>{index + 1}</div>
                                    </div>
                                    <div className='qx flex  py-6' style={{ borderBottom: index === nursePersonTemplate.length ? 'none' : "solid 1px #D8D8D8", width: statue == 1 ? '47rem' : "21.rem" }}>
                                        <div className='flex' style={{ width: statue == 1 ? '10rem' : "" }}>
                                            <img className='w-[0.8rem] h-[0.8rem] mt-[0.33rem] mr-3' src={shijian1} alt="" />
                                            <div className='text-[#32373E] w-[5rem] font-medium mt-[0.1rem]'>{item.title}</div>
                                        </div>
                                        <div className='w-[3.5rem] h-[2rem]  flex items-center  text-[#929EAB] bg-[#E6EBF0] rounded-md  font-medium justify-center' style={{ marginLeft: statue == 1 ? '36rem' : '11rem' }}>待完成</div>
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

            {/* <NurseTable type={'project'} sensorName={sensorName} getNurseTemplate={getNurseTemplate} templateId={templateId} data={nurseTemplate || []} /> */}

        </>
    )
}

export default NursingStencil
