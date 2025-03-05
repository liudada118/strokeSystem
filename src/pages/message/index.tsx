import { useEffect, useState } from "react";
// import Title, { alarmType } from "../../phoneComponents/title/Title";

import "./index.scss";


// import dayjs from 'dayjs'
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


import type { DatePickerProps, MenuProps, TableProps, GetProps, } from 'antd';
import { DatePicker, Space, Pagination, Dropdown, Input, Button, Table, Tag, Modal, } from 'antd';
import { DownOutlined } from "@ant-design/icons";
import fang from '../../assets/images/容器@2x.png'
import { Menu } from "antd/lib";
import { messagePageAdded } from '../../api/api'
import { log } from "console";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

export interface message {
  roomNum: string;
  patientName: string;
  status: boolean;
  date: string;
  info: string;
  headImg: string
}
interface DataType {
  id: string;
  name: string;
  roomNumber: number | string;
  Time: string | number;
  type: string | boolean;
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

  const { RangePicker } = DatePicker;
  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''
  const [total, setTotal] = useState(0)
  // 搜索框
  const [patientNameRoomNum, setpatientName] = useState<string>('')
  // 昨天提醒 62 次 前天提醒 26 次
  const [datarq, setData] = useState<any>([
    {
      yestodayAlarmCount: "",
      beforeYestodayAlarmCount: ""
    }
  ])
  // 接口参数
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
    getMessage()
    if (!patientNameRoomNum) {

      getMessage()
    }
  }, [patientNameRoomNum])
  /**
   * 
   * @param e 点击分页加载message数据
   */
  const onChange = (e: any) => {
    getMessage(
      {
        pageNum: e
      }
    )
  }

  /**
   * 
   * @param num 页数
   * 加载对应页数的数据
   */
  const getMessage = async (reqparms: any = {}) => {

    const param = {
      ...params,
      ...reqparms
    }
    const res: any = await baseFetch(param)
    initMessagesPage(res)
  }
  /**
  * 
  * @param param 请求报告信息
  * @returns 服务器返回
  */
  const [dataList, setDataLIst] = useState([])

  // 接口请求
  const baseFetch = async (param: any) => {
    try {
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
      setDataLIst(res.data.data.records)
      return res
    } catch (err) {
      console.log('1111111111', err)
    }
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


  /**
   * 
   * @param res 服务器返回值
   * 渲染报告页面
   */
  // 表格状态
  const titleList = [
    {
      id: 1,
      key: 'nursing,fallbed,outOffBed,situp,offline,otherReminders',
      title: "全部提醒"
    },
    {
      id: 2,
      key: '',
      title: ""
    },
    {
      id: 3,
      key: 'nursing',
      title: "护理提醒"
    },
    {
      id: 4,
      key: 'fallbed',
      title: "坠床提醒"
    }, {
      id: 5,
      key: 'outOffBed',
      title: "离床提醒"
    }, {
      id: 6,
      key: 'situp',
      title: "起床提醒"
    },
    {
      id: 7,
      key: 'offline',
      title: "离线提醒"
    },
    {
      id: 8,
      key: 'otherReminders',
      title: "其他提醒"
    },
  ]
  // 时间选择器
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    console.log(dateStrings, dates, '.......dateStringsdateStrings');

    if (dates && dates.length === 2) {
      const startMills = dayjs(dates[0]).format('YYYY-MM-DD HH:mm:ss');
      const endMills = dayjs(dates[1]).format('YYYY-MM-DD HH:mm:ss');
      setParams(prevParams => ({
        ...prevParams,
        startMills: new Date(startMills).valueOf(),
        endMills: new Date(endMills).valueOf()
      }));
      getMessage({
        startMills: new Date(startMills).valueOf(),
        endMills: new Date(endMills).valueOf()
      });
    }
    if (!dates) {
      // 日期被清空
      setParams(prevParams => ({
        ...prevParams,
        startMills: timeArr[0],
        endMills: timeArr[1]
      }));
      getMessage({
        ...params,
        startMills: timeArr[0],
        endMills: timeArr[1]
      });
    }
  };

  // 表格数据
  const data: any[] = dataList.map((item: any, index: number) => {

    return {
      key: item.id,
      id: index,
      roomNumber: item.roomNum,
      name: item.patientName,
      Time: item.timeMills,
      type: msgToinfoStr(item.type),
      responders: item.responders,
      responseTime: item.responseTime,
      reminderTime: dayjs(item.timeMills).format('YYYY/MM/DD HH:mm:ss'),
    }
  })
  // 标题切换
  const [titleId, setTitleId] = useState(3)
  const [title, setTile] = useState('')
  const transformedTitleList = titleList.map((item) => {
    return item.key
  })
  const titleListString = transformedTitleList.join(',');
  // 标题切换
  const titleChangeGetMessage = (item: any) => {


    setTitleId(item.id)
    setParams({
      ...params,
      types: item.key,
    })

    getMessage({
      ...params,
      types: item.key,
    })
  }


  const [dataList1, setDataList1] = useState<message[]>([]);
  //请求数据接收
  const initMessagesPage = (res: any) => {
    try {
      const data = res.data.data.records
      const total = res.data.data.total
      const pages = res.data.data.pages
      const message = initMessage(data)
      setMessages(message)
      setTotal(total)
      setData({
        yestodayAlarmCount: res.data.yestodayAlarmCount,
        beforeYestodayAlarmCount: res.data.beforeYestodayAlarmCount

      })
    } catch (err) {

    }
  }



  const columns: TableProps<DataType>['columns'] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '提醒时间',
      dataIndex: 'reminderTime',
      key: 'reminderTime',
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
    },
    {
      title: '响应人',
      dataIndex: 'responders',
      key: 'responders',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },



  ];

  // 搜索框姓名，房间渲染
  const menu = (
    <Menu >
      <>
        <Menu.SubMenu key={`sub1-1`} title="姓名">
          {dataList.map((item: any, index: number) => (
            <Menu.Item onClick={() => setpatientName(item.patientName)} key={`name-${index}`}>{item.patientName}</Menu.Item>
          ))}
        </Menu.SubMenu>
        <Menu.SubMenu key={`sub2-2`} title="床号">
          {dataList.map((item: any, index: number) => (
            <Menu.Item onClick={() => setpatientName(item.roomNum)} key={`name1-${index}`}>{item.roomNum}</Menu.Item>
          ))}
        </Menu.SubMenu>
      </>
    </Menu>
  );

  // 搜索请求
  const onSearch = () => {

    setParams(prevParams => ({
      ...prevParams,

      roomNumber: patientNameRoomNum,
      patientName: patientNameRoomNum,
    }));
    getMessage({
      roomNumber: patientNameRoomNum,
      patientName: patientNameRoomNum,
    })
  }
  return (

    <div className="messagePage sy" style={{ marginLeft: '4.3rem' }}>
      <div className="messageTitle">
        <div className="messageTitlediv1">
          <p> 消息</p>
        </div>
        <div className="messageTitlediv2">
          <Space style={{ width: "296px", height: "39px", marginLeft: "10px" }} direction="vertical" size={12}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}

              onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
              style={{ width: "296px", height: "39px", marginLeft: "10px" }}
              showTime
            />
          </Space>

          <div className="messageTitlediv2_you">
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link " style={{ display: "flex", width: "50px", marginLeft: "10px" }} onClick={(e) => e.preventDefault()}>
                姓名 <DownOutlined />
              </a>
            </Dropdown>

            <Input className="messageTitlediv2_you_inp" allowClear value={patientNameRoomNum} onChange={(e) => setpatientName(e.target.value)} placeholder="请输入姓名/床号" />
            <img onClick={onSearch} style={{ width: "24px", height: "24px", marginRight: "20px" }} src={fang} alt="" />
          </div>
        </div>
      </div>
      <div className="messageMain">
        <div className="w-full h-[115px] bg-[#F2F5F8]">
          <div className="w-[70%] pl-[60px] h-[115px] " style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: '#F2F5F8', }}>

            {
              titleList && titleList.map((item: any, index) => {
                return (
                  <Button
                    key={item.id}
                    className={`bun ${(index + 1) === titleId ? 'on' : ''}  w-[130px] h-[50px] bg-[#FFFFFF]  text-[#000] rounded-lg fz-[20px]`}
                    style={{ display: "flex", color: "#000", fontSize: "16px", fontWeight: "900", }}
                    onClick={() => titleChangeGetMessage(item)}
                  >
                    {item.title}
                  </Button>
                );
              })
            }
          </div>
        </div>
        <div className="w-full h-[848px] ">
          <div className="h-[800px] ml-[60px] bg-[#FFFFFF] rounded-lg" style={{ width: 'calc(100% - 60px)' }}>
            <div style={{ display: "flex", marginLeft: "20px", justifyContent: 'space-between' }}>
              <div style={{ display: "flex", marginTop: "20px", marginLeft: "8px" }}>
                <p className=" w-[20px] h-[20px] rounded-[2px] mt-[22px] mr-[16px] opacity-100 bg-[#0072EF]"></p>
                <p className="font-pingfang-sc font-bold text-[20px] leading-normal tracking-normal">护理提醒次数 <span className="font-pingfang-sc font-bold text-[35px] leading-normal tracking-normal " style={{ color: "#0072EF" }}> {total} </span> 次</p>
              </div>
              <div style={{ display: "flex", marginTop: "40px", marginLeft: "5px", marginRight: "150px" }}>
                <p className="font-pingfang-sc font-bold text-[20px] leading-normal tracking-normal mr-[20px]">
                  昨天提醒<span className="font-pingfang-sc font-bold text-[20px] leading-normal tracking-normal" style={{ color: "#0072EF" }}> {datarq.yestodayAlarmCount} </span> 次
                </p>
                <p className="font-pingfang-sc font-bold text-[20px] leading-normal tracking-normal ">
                  前天提醒 <span className="font-pingfang-sc font-bold text-[20px] leading-normal tracking-normal" style={{ color: "#0072EF" }}> {datarq.beforeYestodayAlarmCount} </span> 次
                </p>
              </div>
            </div>

            <div className="projectContent"
              style={{
                height: 'calc(100% - 150px)',

                padding: '1rem 1rem ',
                backgroundColor: '#fff',
              }}>
              <Table
                pagination={false}
              
                dataSource={data}
                columns={columns}
            
              />
       

            </div>
            <div style={{ display: "flex", height: "30px", justifyContent: 'space-between' }}>
              <div style={{ marginLeft: "25px", fontFamily: 'PingFang SC' }}>单页显示数 <span style={{ color: "#0072EF", fontVariationSettings: "opsz auto", fontSize: "14px" }}>{data.length}</span> 条</div>
              <Pagination style={{ marginRight: "40px" }} className="pagination" defaultCurrent={1} onChange={onChange} showSizeChanger={false} total={Math.floor(total)} />
            </div>
          </div>
        </div>
        {/* <div className="messageContentBox">
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
        </div> */}
      </div>
      {<Bottom />}
    </div >
  );
}
