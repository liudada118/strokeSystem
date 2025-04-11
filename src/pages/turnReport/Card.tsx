import { useGetWindowSize } from '@/hooks/hook'
import React from 'react'

export default function Card(props: any) {

    const { onMargin } = props
    return (
        <div className={`px-[1.2rem] py-[1.5rem] bg-[#fff] rounded-[6px] ${onMargin ? 'mb-[0]' : 'mb-[0.8rem]'}`}>
            {props.children}
        </div>
    )
}
export function CardText(props: any) {

    const { onMargin } = props
    return (
        <div className={`px-[1.2rem] py-[1.2rem] bg-[#fff] rounded-[6px] ${onMargin ? 'mb-[0]' : 'mb-[0.8rem]'} text-[1.3rem]`}>
            {props.children}
        </div>
    )
}
export function CardContainTitle(props: any) {
    const { onMargin, title } = props
    const useGetWind = useGetWindowSize()
    return ( //px - [1.2rem] py - [1.2rem] bg - [#fff] rounded - [6px] ${ onMargin ? 'mb-[0]' : 'mb-[0.8rem]' } text - [1.3rem]
        < div className={`${useGetWind ? 'px-[1.2rem] py-[1.2rem]  text - [1.3rem]' : 'px-[1rem] py-[1rem]  text-[1rem] text-[#000000] font-bold'} bg-[#fff] rounded-[6px] ${onMargin ? 'mb-[0]' : 'mb-[0.8rem]'}}`
        }>
            <div className='flex items-center mb-[0.9rem]'>
                <div className={`${useGetWind ? 'h-[13px] w-[5px] rounded-[3px] bg-[#0072EF] mr-[7px]' : ""} `}></div>
                <div>{title}</div>
            </div>
            {props.children}
        </div >
    )
}
