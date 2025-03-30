import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import './index.scss'
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import { useGetWindowSize } from "@/hooks/hook";
import { TitleLeftInfo, TitleRightInfo } from "./ReportTitle";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquips } from "@/redux/equip/equipSlice";
import { fetchPermission } from "@/redux/premission/premission";
import VoicePremission from "./VoicePremission";
dayjs.locale('en');
// const phoneNumber = "18579103020";
let time: any


let first = true



interface titleProps {
  setEquips?: Function
  setSelect?: Function
  setMessages?: Function
  setParams?: Function
  setPageNum?: Function
  setTitleParams?: Function
  select?: number
  name?: string
  setTotal?: Function
  getEquipList?: Function
  getSelectEquipList?: Function
  titleChangeGetMessage?: Function

}

const format = 'HH:mm';



const Title = React.forwardRef((props: titleProps, refs) => {

  const { setMessages, titleChangeGetMessage,  } = props

  const dispatch: any = useDispatch()
  const status = useSelector((state: any) => state.equip.status)
  const permissionStatus = useSelector((state: any) => state.premission.status)

  

  useEffect(() => {
    if (permissionStatus === 'idle' || permissionStatus === 'failed') {
      dispatch(fetchPermission())
    }
  }, [dispatch, permissionStatus])

  useEffect(() => {
    if (status === 'idle' || status === 'failed') {
      dispatch(fetchEquips())
    }
  }, [dispatch, status])

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
    <div className="title" id="title">
      <VoicePremission />
      <div className="homeTitle">
        <TitleLeftInfo text={text} path={path} isMobile={isMobile} />
        <TitleRightInfo titleChangeGetMessage={titleChangeGetMessage} setMessages={setMessages} path={path} isMobile={isMobile} />
      </div>
    </div>
  )
})

export default Title

