import CommonTitle from '@/components/CommonTitle'
import { useGetWindowSize } from '@/hooks/hook'
import { EditType } from '@/pages/equipDetail/mobileEdit/NurseEdit'
import nurseSelectItemDelete from '@/assets/image/nurseSelectItemDelete.png'
import React from 'react'

export default function BaseUi() {
  return (
    <div>BaseUi</div>
  )
}

// interface cardParam {
//   children: any
//   title: string
//   changeItemValue: Function
//   index: number
//   type: string
//   editItem?: boolean
//   setEditItem?: Function
//   display?: boolean
// }

// function Card(props: cardParam) {
//   const { children, title, changeItemValue, type, index, editItem, setEditItem, display } = props

//   const deleteItems = () => {
//       changeItemValue({ index, type: EditType.DELETE })
//   }
//   const isMobile = useGetWindowSize()

//   // 展示表单的页面
//   if (props.hasOwnProperty("display") && display) {
//       if (isMobile) {
//           return <div className='p-[16px] pb-[15px] bg-[#fff] w-full m-auto rounded-[10px] mb-[16px]'>
//               <CommonTitle name={title} type='rect' />
//               <div className='flex flex-col ml-[9px] mb-[20px]'>
//                   {children}
//               </div>
//           </div>
//       } else {
//           return <><CommonTitle name={title} type='rect' />
//               <div className='flex flex-col ml-[9px] mb-[20px]'>
//                   {children}
//               </div>
//           </>
//       }
//   }
//   // 编辑的表单页面
//   else {
//       return <div className='p-[16px] bg-[#fff] w-full m-auto rounded-[10px] mb-[16px]'>
//           <div className='flex items-center justify-between font-bold mb-[13px] text-base'>
//               {title}
//               <div className='flex text-base text-[#0072EF] font-normal'>
//                   {props.hasOwnProperty("editItem") ? <div onClick={() => {
//                       console.log(editItem)
//                       setEditItem && setEditItem(!editItem)
//                   }} className='mr-[15px]'>编辑</div> : ''}
//                   <div className='flex items-center' onClick={() => { deleteItems() }}>
//                       <img src={nurseSelectItemDelete} className='w-[20px]' alt="" /></div>
//               </div>
//           </div>
//           <div className='flex flex-col'>
//               {children}
//           </div>
//       </div>
//   }


// }

export function CardWithoutTitle(props: any) {
  const { children, title, unheight, mdmb } = props
  const isMobile = useGetWindowSize()
  if (!isMobile) {
    return <>
      {children}
    </>
  }
  return (
    <div className={`md:w-[94%] md:mx-auto bg-[#fff] flex flex-col w-full ${unheight ? '' : 'h-full'} rounded-[10px] ${props.margin ? '' : 'mb-[0.8rem]'} ${mdmb ? 'md:mb-[0.8rem]' : ''}`} >
      {children}
    </div>
  )
}


// export function Card(props: any) {
//   const { children, title, unheight, mdmb } = props
//   return (
//     <div className={`md:w-[94%] md:mx-auto bg-[#fff] py-[1.4rem] flex flex-col px-[1.1rem] w-full rounded-[10px] ${unheight ? '' : 'h-full'} ${props.margin ? '' : 'mb-[0.8rem]'} ${mdmb ? 'md:mb-[0.8rem]' : ''}`} >
//       {title ? <div className='mb-[1rem] flex items-center'>
//         <div className='bg-[#0072EF] w-[0.5rem] h-[0.5rem] mr-[0.4rem]'></div> <div className='text-lg font-semibold'>{title}</div>
//       </div> : ''}
//       {children}
//     </div>
//   )
// }

// export function Card(props: any) {

//   const { onMargin } = props
//   return (
//       <div className={`px-[1.2rem] py-[1.5rem] bg-[#fff] rounded-[6px] ${onMargin ? 'mb-[0]' : 'mb-[0.8rem]'}`}>
//           {props.children}
//       </div>
//   )
// }

// export function CardText(props: any) {

//   const { onMargin } = props
//   return (
//       <div className={`px-[1.2rem] py-[1.2rem] bg-[#fff] rounded-[6px] ${onMargin ? 'mb-[0]' : 'mb-[0.8rem]'} text-[1.3rem]`}>
//           {props.children}
//       </div>
//   )
// }

// export function CardContainTitle(props: any) {
//   const { onMargin, title } = props
//   return (
//       <div className={`px-[1.2rem] py-[1.2rem] bg-[#fff] rounded-[6px] ${onMargin ? 'mb-[0]' : 'mb-[0.8rem]'} text-[1.3rem]`}>
//           <div className='flex items-center mb-[0.9rem]'>
//               <div className='h-[13px] w-[5px] rounded-[3px] bg-[#0072EF] mr-[7px] '></div>
//               <div>{title}</div>
//           </div>
//           {props.children}
//       </div>
//   )
// }

// 五种类型Card 没有标题  标题logo为矩形 标题logo为方形 标题为null 标题右边有可点击的内容

type cardType = 'noTitle' | 'onlyDisplayTitle' | 'functionalTitle'
type titleType = 'rect' | 'square'
interface baseParam {
  children: any
  // type: cardType
  title?: string
  titleType?: titleType
  Component?: any
  margin?: boolean
  unheight?: boolean
  mdmb?: boolean
}



function Card(props: baseParam) {
  const { children, title, titleType, Component, unheight, mdmb } = props
  return (
    <div className={`md:w-[94%] md:mx-auto bg-[#fff] py-[1.4rem] flex flex-col px-[1.1rem] w-full rounded-[10px] ${unheight ? '' : 'h-full'} ${props.margin ? '' : 'mb-[0.8rem]'} ${mdmb ? 'md:mb-[0.8rem]' : ''}`} >
      {title ? <Title title={title} titleType={titleType} Component={Component} /> : ''}
      {children}
    </div>
  )
}

interface titleParam {
  titleType?: titleType
  title: string
  Component: any
}

function Title(props: titleParam) {
  const { titleType, title, Component } = props
  // switch(titleType){
  //   case 'rect' :
  //     return <></>
  //   default
  //     return <></>
  // }
  return <div className='flex items-center mb-[1rem]'>
    {titleType ?
      <span className={`bg-[#0072EF] ${titleType === 'square' ? 'w-[10px] h-[10px]' : 'w-[4px] h-[13px] rounded-[2px]'} mr-[10px]`} />
      : ''}
    <span className={`${titleType === 'square' ? 'text-[#32373E] text-lg font-semibold' : 'text-[#3D3D3D] font-medium md:font-semibold text-base'}`}>{title}</span>
    <Component />
  </div>
}