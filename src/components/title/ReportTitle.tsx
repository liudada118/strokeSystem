import { useGetWindowSize } from '@/hooks/hook'
import { selectEquipBySensorname } from '@/redux/equip/equipSlice'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import logo from "@/assets/image/logo.png";
import { MessageRightTitle } from './MessageRightTitle'
import { HomeRightTitle } from './HomeRightTitle'
import { headImgSelect } from '@/redux/premission/premission'
export default function ReportTitle() {
    const location = useLocation()
    const pathname = location.pathname
    const pathToText: any = {
        message: '消息',
        setting: '设置',
        other: '工作台'
    }
    const isMobile = useGetWindowSize()
    /**
     * 
     * @param pathname 路由pathname
     * @returns 不同的title类型
     */

    type convertPathReturn = 'home' | 'report' | 'message' | 'setting' | 'other'
    const convertPath: (pathname: string) => convertPathReturn = (pathname: string) => {
        if (pathname == '/' || pathname.includes('home')) {
            return 'home'
        } else if (pathname.includes('report')) {
            return 'report'
        } else if (pathname.includes('message')) {
            return 'message'
        } else if (pathname.includes('setting')) {
            return 'setting'
        } else {
            return 'other'
        }
    }
    const path = convertPath(pathname)
    /**
     * 
     * @param pathname 路由pathname
     * @returns 返回title显示的文字
     */
    const calTitleText = (pathname: string) => {
        const name = pathname.split('/')[1]
        if (name) {
            return pathToText[name]
        } else {
            return pathToText.other
        }
    }
    const text = calTitleText(pathname)
    return (
        <div className="homeTitle">
            <TitleLeftInfo text={text} path={path} isMobile={isMobile} />
            <TitleRightInfo path={path} isMobile={isMobile} />
        </div>
    )
}
export const TitleLeftInfo = (props: any) => {
    const headImg = useSelector(headImgSelect)
    return (
        <>
            {(!props.isMobile) ? <PcLeftTitle text={props.text} path={props.path} /> : <div style={{ width: "100px" }} className="titleLeft" >
                <img src={headImg ? headImg : logo} alt="" />
            </div>}
        </>
    )
}

export const PcLeftTitle = (props: any) => {
    const param = useParams()
    const equipInfo = useSelector(state => selectEquipBySensorname(state, param.id))

    return (
        <>{props.path == 'report' ? <div className="titleContentItem" style={{ marginRight: '1rem', color: '#0072EF', fontSize: '1.1rem', fontWeight: '600' }}>
            <div style={{ paddingRight: '1.2rem', borderRight: '2px solid #BFBFBF' }}>工作台</div>
            <span className='w-[2px] mr-[15px]' />
            <span className='text-base font-semibold'>{equipInfo?.patientName}</span>
        </div> : <>{props.text}</>}</>
    )
}
export const TitleRightInfo = (props: any) => {
    const { setMessages, titleChangeGetMessage, } = props
    const phone = localStorage.getItem('phone')
    const windo: any = window.location.href.split('/')[4]
   

    if (props.path == 'home') {
        return <HomeRightTitle />
    }
    else if (props.path == 'message') {
        return <MessageRightTitle titleChangeGetMessage={titleChangeGetMessage} />
    } else if (props.path == 'setting') {
        return <div className="titleRight">{phone}</div>
    } else if (windo == 'userInfo_NursingOpen') {
        return <div className="" style={{ display: "flex", justifyContent: "normal" }}>JQ HEALTHCARE</div>
    }
    return <></>
}


