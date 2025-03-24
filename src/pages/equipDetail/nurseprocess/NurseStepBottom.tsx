import guidePng from "@/assets/image/guide.png";
import { useState } from "react";

interface nurseBottomParam {
    index: number
    setIndex: Function
    setGuide: Function
    guide: boolean
    total: number
    setNurseFinish: Function
    submitReport: Function
}


export default function NurseBottom(props: nurseBottomParam) {
    const { guide, index, setGuide, setIndex, total, setNurseFinish, submitReport } = props

    const [indexMax, setIndexMax] = useState(0)

    const changeIndex = () => {
        const nowIndex = index
        setIndex(nowIndex + 1)
        setIndexMax(Math.max(indexMax, nowIndex + 1))
    }

    const arr = new Array(total).fill(1)
  
    return (
        <>
            {
                guide ? '' :
                    <>{
                        index == 1 ? <div className="nurseBottomContent h-[8rem]">
                            <div style={{ marginRight: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={guidePng} onClick={() => { setGuide(true) }} style={{ width: '2.64rem' }} />
                                <div style={{ fontSize: '0.8rem' }}>护理指导</div>
                            </div>
                            <div className="nurseButton" onClick={() => {
                                changeIndex()
                            }}>
                                完成，下一步
                            </div>
                        </div> : index == total ? <div className="nurseBottomContent  h-[8rem]">
                            <div className="nurseSecondButton" style={{ flex: 1 }} onClick={() => {
                                const res = index - 1 <= 1 ? 1 : index - 1
                                setIndex(res)
                            }}>上一步</div>

                            <div className="nurseButton" style={{ flex: 1 }} onClick={() => {
                                setNurseFinish(true)
                                submitReport()
                            }}>全部完成,提交</div>
                        </div> :
                            <div className="nurseBottomContent  h-[8rem]">
                                <div className="nurseSecondButton" style={{ flex: 1 }} onClick={() => {
                                    const res = index - 1 <= 1 ? 1 : index - 1
                                    setIndex(res)
                                }}>上一步</div>

                                <div className="nurseButton" style={{ flex: 1 }} onClick={() => {
                                    changeIndex()
                                }}>完成，下一步</div>
                            </div>
                    }</>
            }
        </>
    )
}