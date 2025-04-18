import { selectEquipBySensorname } from '@/redux/equip/equipSlice'
import { message } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

export default function EquipTypeEdit() {
    const param = useParams()
    const location = useLocation()
    const sensorName = param.id || location.state.sensorName
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))
    console.log(equipInfo, sensorName, '........................SettingMobileSettingMobileSettingMobileSettingMobile')
    const equipType: any = [
        {
            text: '床垫类型',
            query: 'type'
        },
        {
            text: 'MAC地址',
            query: 'deviceId',

        },
        {
            text: '调试',
            query: 'leavebedParam'
        }
    ]
    const handleCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        message.info('复制成功！');
    };
    return (
        <div className='w-[92%] m-auto'>
            <div className='bg-[#fff] px-[13px] py-[6px] rounded-[10px] text-[#6C7784]'>
                {
                    equipType.map((item: any, index: number) => {
                        return (
                            <div className={`py-[10px] flex items-center text-base ${index === equipType.length - 1 ? '' : 'border-b'}`}>
                                <span className='w-[7rem]'>{item.text}</span>
                                <div className='flex  w-full'>
                                    <span>{equipInfo[item.query]}
                                    </span>
                                    {
                                        item.query === 'deviceId' ? <div onClick={() => handleCopy(equipInfo[item.query])} style={{ position: "absolute", right: "3rem", color: "#1677ff", cursor: "pointer" }}>复制</div> : ""
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
