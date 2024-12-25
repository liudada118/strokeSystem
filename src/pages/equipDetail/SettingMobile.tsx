import React from 'react'
import right from '@/assets/image/rigthLogo.png'
import mobileRemind from '@/assets/image/mobileRemind.png'
import mobileEquiptype from '@/assets/image/mobileEquiptype.png'
import mobileNurse from '@/assets/image/mobileNurse.png'
import mobilePush from '@/assets/image/mobilePush.png'
import mobileTurn from '@/assets/image/mobileTurn.png'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
interface cardParam {
    title: string
    img: any
    border?: boolean
    margin?: boolean
    borderBottom?: boolean
    type: string
    // onClick: Function
}
function Card(props: cardParam) {

    const param = useParams()
    // console.log(param)
    const location = useLocation()

    const sensorName = param.id || location.state.sensorName

    const { img, title, margin, border, borderBottom, type } = props
    const navigate = useNavigate()
    const setClick = (type: string) => {
        navigate('/userInfo_editing', { state: { sensorName, type } })
    }

    return (
        <div onClick={() => {
            setClick(type)
        }} className={` px-[8px] flex items-center justify-between bg-[#fff] md:mx-auto md:w-[96%] ${border ? '' : 'rounded-[10px]'} ${margin ? '' : 'mb-[15px]'}`}>
            <div className={`flex py-[14px]  px-[7px] w-full items-center ${borderBottom ? 'border-b' : ''}`}>
                <div className='flex basis-full'>
                    <div className='bg-[#0072EF] rounded-[3px] items-center mr-[12px]'>
                        <img className='w-[22px] h-[22px]' src={img} alt="" />   </div>
                    <span>{title}</span>
                </div>
                <div>
                    <img src={right} className='w-[8px]' alt="" />
                </div>
            </div>
        </div>
    )
}



export default function SettingMobile() {




    return (
        <div className='pb-[15px]'>
            <Card title='提醒设置' img={mobileRemind} type='remind' />
            <Card title='翻身设置' img={mobileTurn} type='turn' border margin borderBottom />
            <Card title='护理设置' img={mobileNurse} type='nurse' border />
            <Card title='推送日报设置' img={mobilePush} type='pushReport' />
            <Card title='设备类型设置' img={mobileEquiptype} type='equipType' margin />
        </div>
    )
}