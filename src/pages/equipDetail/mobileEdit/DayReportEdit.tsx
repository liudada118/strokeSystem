import { Switch } from 'antd'
import React, { useState } from 'react'

export default function DayReportEdit() {

    const healthy = [
        {
            text: '特殊体动风险预警',
            query: 'move'
        },
        {
            text: '压疮潜在风险预警',
            query: 'pressUlcer'
        },
        {
            text: '体征健康',
            query: 'physicalHealth'
        },
        {
            text: '睡眠健康',
            query: 'sleepHealth'
        }
    ]

    const nurse = [
        {
            text: '翻身报告',
            query: 'turn'
        },
        {
            text: '护理报告',
            query: 'nurse'
        },
        {
            text: '响应报告',
            query: 'response'
        },
        {
            text: '服务统计',
            query: 'serve'
        }
    ]

    const [config, setConfig] = useState<any>({})

    return (
        <div className='w-[92%] mx-auto'>
            <div className='text-lg font-semibold mb-[12px] pl-[8px]'>健康日报</div>
            <div className='bg-[#fff] px-[13px] py-[6px] rounded-[10px]'>
                {
                    healthy.map((item ,index) => {
                        const { text, query } = item
                        return (
                            <div className={`py-[10px] flex justify-between items-center text-base ${index === healthy.length - 1 ? '' : 'border-b'}`}>
                                {text}
                                <Switch checked={config[query] as boolean} onChange={() => {
                                    setConfig({ ...config, [query]: !config[query] })
                                }} />
                            </div>
                        )
                    })
                }
            </div>

            <div className='text-lg font-semibold mb-[12px] mt-[20px] pl-[8px]'>护理日报</div>
            <div className='bg-[#fff]  px-[13px] py-[6px] rounded-[10px]'>
                {
                    nurse.map((item ,index) => {
                        const { text, query } = item
                        return (
                            <div className={`py-[10px] flex justify-between items-center text-base ${index === healthy.length - 1 ? '' : 'border-b'}`}>
                                {text}
                                <Switch checked={config[query] as boolean} onChange={() => {
                                    setConfig({ ...config, [query]: !config[query] })
                                }} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
