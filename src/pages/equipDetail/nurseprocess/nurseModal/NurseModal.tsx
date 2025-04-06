import React, { useState } from 'react'
import './index.scss'
import { Button } from 'antd'
interface modal {
    open: boolean
    children: any
}

export const noticeObj = [
    {
        title: "培训后上岗",
        info: '初次护理请在指导下进行翻身操作。'
    },
    {
        title: "使用辅助工具",
        info: '使用辅助工具来帮助完成翻身过程，避免给患者造成过多的压力和不适。'
    },
    {
        title: "避免进食后立即翻身",
        info: '避免进食后30分钟内翻身，以防呕吐或不适。'
    },
    {
        title: "避免压迫区域过度按摩",
        info: ''
    },
    {
        title: "操作时保持温柔舒适",
        info: '护理过程中观察老人神情，避免老人不适。'
    },
    {
        title: "翻身动作规范",
        info: '翻身时，要注意保持正确的姿势，避免拖、拉、推、拽等动作，以降低剪切力。'
    },
    {
        title: "调整头部位置",
        info: '翻避免颈部弯曲或歪斜，可利用卷轴做适当支托，使头颈成一直线；'
    },
    {
        title: "注意体位限制",
        info: '如心脏病患者可能需要抬高头部。'
    },
    {
        title: "整理床褥",
        info: '如心脏病患者可能需要抬高头部。'
    },
    {
        title: "定时翻身",
        info: '按照医生或护士的建议定时翻身。通常建议每隔2小时翻身一次。'
    },
    {
        title: "观察皮肤状况",
        info: '在翻身过程中，观察记录上报患者身体各部位的皮肤情况，以便及早调整护理方案。'
    },
]

export default function NurseModal(props: modal) {


    const changeIndex = () => {
        const nowIndex = index
        setIndex(nowIndex + 1)
    }
    const [index, setIndex] = useState(0)
    return (
        <div className="mask" style={{ transform: props.open ? 'scale(1)' : 'scale(0)' }}>
            <div className="nurseModal" >
                {/* {index == 0 ? <><h2 className='noticeTitle'>注意事项</h2>
                {
                    noticeObj.map((a: any, index) => {
                        return (
                            <div>
                                <h3 style={{ fontWeight: 'bold' }}>{index + 1}.{a.title}</h3>
                                <div>{a.info}</div>
                            </div>
                        )
                    })
                }
                <Button onClick={changeIndex} className='noticeButton'>确认</Button>
            </> :
                <>
                    <div style={{ flex: 1, backgroundColor: '#000' }}>
                        <HeatmapR circleArr={circleArr} index={12} data={matrix} ref={heatMapRef1} type={props.type} sensorName={props.sensorName} />
                    </div>
                </>} */}
                {props.children}
            </div>
        </div>
    )
}
