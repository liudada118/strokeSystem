import { useEffect, useState } from "react";
// import Title, { alarmType } from "../../phoneComponents/title/Title";
import { Pagination } from 'antd';
import "./index.scss";

// import Bottom from "../../phoneComponents/bottom/Bottom";
// import { reportInstance } from "../../assets/util";
import dayjs from "dayjs";
import mqtt from 'mqtt';
import nullImg from '../../assets/image/null.png'
import { useLocation, useNavigate } from "react-router-dom";
import { useGetWindowSize } from "../../hooks/hook";
import { alarmValueToType } from "@/utils/messageInfo";
import { instance } from "@/api/api";
import Title from "@/components/title/Title";
import Bottom from "@/components/bottom/Bottom";


export interface message {
  roomNum: string;
  patientName: string;
  status: boolean;
  date: string;
  info: string;
  headImg: string
}
let overMessage: any
function msgToinfo(msg: string): string {
  console.log(msg)
  let infoArr = msg.split('|')
  console.log(infoArr)
  if (infoArr[1] === 'status') {
    if (infoArr[2] === 'online') {
      return '设备已上线'
    } else {
      return '设备已离线'
    }
  } else if (infoArr[1] === 'breath_stop') {
    return '呼吸暂停风险'
  } else if (infoArr[1] === 'outOffBed') {
    return '已离床'
  } else if (infoArr[1] === 'stroke') {
    return '体动风险'
  } else if (infoArr[1] === 'nursing') {
    return '褥疮护理提醒'
  }
  return ''
}


export function msgToinfoStr(msg: string): string {
  // console.log(msg)
  // let infoArr = msg.split('|')
  // console.log(infoArr)

  if (msg === 'online') {
    return '设备已上线'
  } else if (msg === 'offline') {
    return '设备离线'
  }
  else if (msg === 'breath_stop') {
    return '呼吸暂停风险'
  } else if (msg === 'outOffBed') {
    return '已离床'
  } else if (msg === 'stroke') {
    return '体动风险'
  } else if (msg === 'nursing') {
    return '褥疮护理提醒'
  } else if (msg === 'sos') {
    return 'SOS求救'
  } else if (msg === 'fallbed') {
    return '坠床提醒'
  } else if (msg === 'situp') {
    return '坐起提醒'
  }
  return ''
}
const dateFormat = 'YYYY/MM/DD-HH:mm';
const timeArr = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 86400000]
export default function Message() {
  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState({
    phone: phone,
    pageNum: 1,
    pageSize: 10,
    startMills: timeArr[0],
    endMills: timeArr[1],
    types: alarmValueToType(0),
  })
  const [messages, setMessages] = useState<message[]>([]);
  // 请求msg
  useEffect(() => {
    getMessage(1)
  }, [])

  /**
   * 
   * @param e 点击分页加载message数据
   */
  const onChange = (e: any) => {
    getMessage(e)
  }

  /**
   * 
   * @param num 页数
   * 加载对应页数的数据
   */
  const getMessage = async (num: number) => {
    const param = {
      ...params,
      pageNum: num,
    }
    const res: any = await baseFetch(param)
    initMessagesPage(res)
  }

  /**
  * 
  * @param param 请求报告信息
  * @returns 服务器返回
  */
  const baseFetch = async (param: any) => {
    const option = {
      method: "get",
      url: "/sleep/log/selectAlarm",
      params: param,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      }
    }

    const res = await instance(option)
    return res
  }

  /**
   * 
   * @param data  服务器接收的信息
   * @returns 格式化后的信息
   */
  const initMessage = (data: any) => {
    const message = data.map((a: any) => {
      a.date = a.timeMills
      a.info = msgToinfoStr(a.type)
      return a
    })
    return message
  }

  /**
   * 
   * @param params 收到title组件传来的params
   * 等待服务器返回后 渲染页面
   */
  const titleChangeGetMessage = async (params: any) => {
    setParams(params)
    const res: any = await baseFetch(params)
    initMessagesPage(res)
  }

  /**
   * 
   * @param res 服务器返回值
   * 渲染报告页面
   */
  const initMessagesPage = (res: any) => {
    const data = res.data.data.records
    const total = res.data.data.total
    console.log(total)
    const pages = res.data.data.pages
    const message = initMessage(data)
    setMessages(message)
    setTotal(total)
  }

  return (
    <div className="messagePage sy">
      <Title titleChangeGetMessage={titleChangeGetMessage} />
      <div className="messageMain">
        <div className="messageContentBox">
          {messages.map((message, index) => {
            return (
              <div key={index} className="messageItem">
                <div className="messageInfos">
                  <img className="messageImg" src={message.headImg ? message.headImg : nullImg} alt="" />
                  <div className="" style={{}}>
                    <div className="messageInfo">
                      <div className="messageRoom">{message.roomNum}</div>
                      <div className="messageName">{message.patientName}</div>
                    </div>
                    <div className="messageHint">
                      {message.info}
                    </div>
                  </div>
                </div>
                <div className="messageDate">{dayjs(message.date).format(dateFormat)}</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: '1.39rem', bottom: '1.39rem' }}>{total}条</div>
          <Pagination className="pagination" defaultCurrent={1} onChange={onChange} showSizeChanger={false} total={Math.floor(total)} />
        </div>
      </div>
      {<Bottom />}
    </div>
  );
}
