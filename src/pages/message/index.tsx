import { useEffect, useState } from "react";
import "./index.scss";
import dayjs from "dayjs";
import { alarmValueToType } from "@/utils/messageInfo";
import { instance } from "@/api/api";
import Title from "@/components/title/Title";
import Bottom from "@/components/bottom/Bottom";
import type { TableProps, GetProps } from 'antd';
import { DatePicker, Pagination, Button, Table, } from 'antd';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
export interface message {
  roomNum?: string;
  patientName?: string;
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

const timeArr = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 86400000]
export default function Message() {

  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''
  const [total, setTotal] = useState(0)

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
  }, [])
  /**
   * 
   * @param e 点击分页加载message数据
   */
  const onChange = (e: any) => {
    setParams({
      ...params,
      pageNum: e,
    });

    getMessage({
      ...params,
      pageNum: e,
    });
  }


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
  localStorage.setItem('dataList', JSON.stringify(dataList));
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
      title: "坐起提醒"
    },
    {
      id: 7,
      key: 'offline',
      title: "离线提醒"
    },
    {
      id: 8,
      key: 'otherReminders',
      title: "其他提醒",
    },
  ]
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
  // 标题切换
  const onTitle = (item: any) => {
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
      render: (text, record, index) => (params.pageNum - 1) * params.pageSize + index + 1,
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
  const getSearchValue = (item: any) => {
    setParams({
      ...params,
      ...item,
      pageNum: 1,
    });

    getMessage({
      ...params,
      ...item,
      pageNum: 1,
    });
  };
  return (
    <>
      <Title titleChangeGetMessage={(item: any) => getSearchValue(item)}></Title>
      <div className="messagePage" >

        <div className="messageMain" >
          <div className="messagetitle">
            <div className="messageTitleBtn">

              {
                titleList && titleList.map((item: any, index) => {
                  return (
                    <Button
                      key={item.id}
                      className={`btn  ${(index + 1) === titleId ? 'on' : ''} `}
                      onClick={() => onTitle(item)}
                    >
                      {item.title}
                    </Button>
                  );
                })
              }
            </div>
          </div>
          <div className="messageMainData">
            <div className="messageMainDatadiv " >
              <div className="messageMainDataTitle" >
                <div className="messageMainDataTitlediv"  >
                  <p className="messageMainDataTitledivbac w-[20px] h-[20px] rounded-[2px] mt-[22px] mr-[16px] opacity-100 bg-[#0072EF]"></p>
                  <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal">护理提醒次数 <span className="font-pingfang-sc font-bold text-[35px] leading-normal tracking-normal " style={{ color: "#0072EF" }}> {total} </span> 次</p>
                </div>
                <div className="messageMainDataTitlediv " >
                  <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal mr-[1.4rem]">
                    昨天提醒<span className="font-pingfang-sc font-bold text-[1.5rem] leading-normal tracking-normal" style={{ color: "#0072EF" }}> {datarq.yestodayAlarmCount} </span> 次
                  </p>
                  <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal mr-[1.4rem] ">
                    前天提醒 <span className="font-pingfang-sc font-bold text-[1.5rem]  leading-normal tracking-normal" style={{ color: "#0072EF" }}> {datarq.beforeYestodayAlarmCount} </span> 次
                  </p>
                </div>
              </div>
              <div className="projectContent">
                <Table
                  pagination={false}
                  dataSource={data}
                  columns={columns}
                />
              </div>
              <div className='msgToinfoStrPage '>
                <div className="msgToinfoStrPageDiv">单页显示数 <span style={{ color: "#0072EF", fontVariationSettings: "opsz auto", fontSize: "1rem" }}>{data.length}</span> 条</div>
                <Pagination style={{ marginRight: "40px" }} pageSize={10} current={params.pageNum} className="pagination" defaultCurrent={1} onChange={onChange} showSizeChanger={false} total={Math.floor(total)} />
              </div>
            </div>
          </div>
        </div>
        {<Bottom />}
      </div >
    </>
  );
}
