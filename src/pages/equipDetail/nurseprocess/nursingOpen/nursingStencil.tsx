import React from 'react'
import shijian1 from '../../../../assets/images/shijian.png'
interface propsType {
    type: number,
    data: any
}
function nursingStencil(props: propsType) {
    const { type, data } = props

    return (
        <>
            {
                type === 10000 ? <div className='text-[#32373E] font-medium ml-[2rem] mt-[1rem]'>
                    老人护理项
                </div> : ''
            }

            <div className='w-full h-[28rem] mt-[10px]'>
                <div className='w-[34rem] h-[2.1rem] bg-[#F5F8FA] rounded flex items-center ml-[2rem] mt-[1rem]'>
                    <div className='ml-[2.7rem] mr-[6.6rem]'>时间</div>
                    <div className='mr-[14.8rem]'>护理内容</div>
                    <div> 状态</div>
                </div>
                <div style={{ height: "27rem", overflow: "hidden", padding: "0 2rem" }}>
                    <div className='' style={{ height: "25.4rem", overflowY: "auto", borderBottom: "solid 1px #D8D8D8", }}>
                        {data.map((item: any, index: number) => {
                            return (
                                < div key={index} className='nursingStencilDoxcount px-2  nursingStencildivBox' style={{ display: "flex", backgroundColor: type === 1 ? "#fff" : "#f3f3f3", }}>
                                    <div className={`nursingStencildiv flex w-[7rem] mr-9 `} style={{ lineHeight: "4rem" }}>
                                        <div className='w-[2.5rem] h-[0.7rem] text-[0.75rem] mt-[0.2rem] ml-[2.1rem] mr-[0.9rem]'>08:00</div>
                                        <div className='w-[1.5rem] h-[1.5rem] rounded-md text-[#fff] bg-[#D1D9E1] flex items-center justify-center' style={{ borderRadius: "1.37rem", position: 'relative', top: '1.5rem', }}>{index + 1}</div>
                                    </div>
                                    <div className=' flex w-[21.rem] py-6' style={{ borderBottom: "solid 1px #D8D8D8" }}>
                                        <div className='flex'>
                                            <img className='w-[0.8rem] h-[0.8rem] mt-[0.33rem] mr-3' src={shijian1} alt="" />
                                            <div className='text-[#32373E] font-medium mt-[0.1rem]'>111</div>
                                        </div>
                                        <div className='w-[3.5rem] h-[2rem] ml-[15rem] flex items-center  text-[#929EAB] bg-[#E6EBF0] rounded-md  font-medium justify-center'>待完成</div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div >

                </div>
            </div>

        </>
    )
}

export default nursingStencil
