import React from 'react'
import NurseTitleProgress from './NurseTitleProgress'
import returnPng from "@/assets/image/return.png";

interface nurseTitleParam {
    guide: boolean
    setIndex: Function
    setOpen: Function
    setIsModalOpenSend: Function,
    setGuide: Function
    index: number
    nurseStepArr: Array<any>
}
export default function NurseTitle(props: nurseTitleParam) {
    const { guide, setIndex, setOpen, setIsModalOpenSend, setGuide, index, nurseStepArr } = props
    return (
        <> {!guide ?
            <><div className="nurseTitleReal pfBold">
                <img src={returnPng} onClick={() => {
                    setIsModalOpenSend(false)
                    setIndex(1)
                    setOpen(true)
                }} style={{ width: '2rem', position: 'absolute', left: '-1rem', top: '-0.24rem' }} /> {nurseStepArr[index - 1].title}</div>
                <NurseTitleProgress total={nurseStepArr.length} index={index} />
            </> :
            <div className="nurseTitleReal">
                <img src={returnPng} onClick={() => { setGuide(false) }} style={{ width: '2rem', position: 'absolute', left: '-1rem', top: '-0.24rem' }} />护理指导
            </div>}
        </>
    )
}
