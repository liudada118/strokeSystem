import { useGetWindowSize } from '@/hooks/hook'
import React from 'react'

interface cardProps {
  title?: string
}

export default function Card(props: any) {
  const { children, title, unheight, mdmb } = props
  return (
    <div className={`md:w-[94%] md:mx-auto bg-[#fff] py-[1.4rem] flex flex-col px-[1.1rem] w-full rounded-[10px] ${unheight ? '' : 'h-full'} ${props.margin ? '' : 'mb-[0.8rem]'} ${mdmb ? 'md:mb-[0.8rem]' : ''}`} >
      {title ? <div className='mb-[1rem] flex items-center'>
        <div className='bg-[#0072EF] w-[0.5rem] h-[0.5rem] mr-[0.4rem]'></div> <div className='text-lg font-semibold'>{title}</div>
      </div> : ''}
      {children}
    </div>
  )
}

export function CardWithoutTitle(props: any) {
  const { children, title, unheight, mdmb } = props
  const isMobile = useGetWindowSize()
  if(!isMobile){
    return <>
    {children}
    </>
  }
  return (
    <div className={`md:w-[94%] md:mx-auto bg-[#fff] flex flex-col w-full ${unheight ? '' : 'h-full' } rounded-[10px] ${props.margin ? '' : 'mb-[0.8rem]'} ${mdmb ? 'md:mb-[0.8rem]' : ''}`} >
      {children}
    </div>
  )
}
