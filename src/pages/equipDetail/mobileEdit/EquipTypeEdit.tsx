import { selectEquipBySensorname } from '@/redux/equip/equipSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

export default function EquipTypeEdit() {
    const param = useParams()
    const location = useLocation()
    const sensorName = param.id || location.state.sensorName
    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))
    console.log(equipInfo)
    const equipType = [
        {
            text: '床垫类型',
            query: 'type'
        },
        {
            text: 'MAC地址',
            query: 'deviceId'
        },
        {
            text: '调试',
            query: 'leavebedParam'
        }
    ]

    return (
        <div className='w-[92%] m-auto'>
            <div className='bg-[#fff] px-[13px] py-[6px] rounded-[10px] text-[#6C7784]'>
                {
                    equipType.map((item , index) => {
                        return (
                            <div className={`py-[10px] flex items-center text-base ${index === equipType.length - 1 ? '' : 'border-b'}`}>
                                <span className='w-[7rem]'>{item.text}</span>
                                <span>{equipInfo[item.query]}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
