import { useEffect, useState, useRef } from "react";
import "./index.scss";
import dayjs from "dayjs";
import { alarmValueToType } from "@/utils/messageInfo";
import { instance } from "@/api/api";
import Title from "@/components/title/Title";
import Bottom from "@/components/bottom/Bottom";
import type { TableProps, GetProps } from 'antd';
import { DatePicker, Pagination, Button, Table, Input, Space, Select, ConfigProvider, Result } from 'antd';
import { CaretDownOutlined, LeftOutlined, ZoomInOutlined } from '@ant-design/icons';
import { useGetWindowSize } from '../../hooks/hook'
import zhCN from 'antd/locale/zh_CN';
// import Kdsd from './messageDatePicker'

import { ActionSheet, CalendarPicker, SpinLoading } from "antd-mobile";
import type {
  Action,
  ActionSheetShowHandler,
} from 'antd-mobile/es/components/action-sheet'
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { RangePicker } = DatePicker;
// const { Option } = Select;
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
  const navigator = useNavigate()
  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''
  const [total, setTotal] = useState(0)
  const [todayAlarmCount, setTodayAlarmCount] = useState(0)
  const WindowSize = useGetWindowSize()
  const [visible, setVisible] = useState(false)
  // 昨天提醒 62 次 前天提醒 26 次
  console.log(total, '......total');

  const [datarq, setData] = useState<any>([
    {
      yestodayAlarmCount: "",
      beforeYestodayAlarmCount: "",
      todayAlarmCoun: ""
    }
  ])
  // 接口参数
  const [params, setParams] = useState({
    phone: phone,
    pageNum: 1,
    pageSize: 10,
    startMills: timeArr[0],
    endMills: timeArr[1],
    types: 'nursing,fallbed,outOffBed,situp,offline,sos',
  })
  const [messages, setMessages] = useState<message[]>([]);
  // 请求msg
  useEffect(() => {
    getMessage(
    )
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
  const [isFalse, setFalse] = useState(true)
  localStorage.setItem('dataList', JSON.stringify(dataList));
  // const [todayAlarmCount, setTodayAlarmCount] = useState(0)
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
      setFalse(false)
      // setTodayAlarmCount(res.data.todayAlarmCoun)
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
  const [nurseType, setNurseType] = useState('其他提醒');
  // 表格状态
  const titleList = [
    {
      id: 1,
      key: 'nursing,fallbed,outOffBed,situp,offline,sos',
      title: "全部提醒"
    },
    {
      id: 2,
      key: '',
      title: ""
    },
    {
      id: 3,
      key: 'sos',
      title: "SOS提醒"
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
      title: "坐床边提醒"
    },
    {
      id: 7,
      key: !WindowSize ? '' : 'nursing,offline',
      title: nurseType,
    },


  ]
  const titleList1 = [
    {
      id: 1,
      key: 'nursing',
      title: "护理提醒"
    },
    {
      id: 2,
      key: 'offline',
      title: "离线提醒"
    }
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
      timeDate: dayjs(item.timeMills).format('HH:mm:ss'),
      dateTime: dayjs(item.timeMills).format('YYYY/MM/DD'),
    }
  })
  // 标题切换
  const [titleId, setTitleId] = useState(1)
  const [titleKey, setTitleIdKey] = useState('')
  const [title, setTitle] = useState('全部提醒')

  const [nursing, setNursing] = useState(false)
  const [isName, setIsName] = useState(false)
  const [pageTotal, setPageTotal] = useState(0)
  const [titleTrue, setTitleTrue] = useState(false)
  const homeSelectNurse: any = [
    { value: 'nursing', label: '护理提醒' },
    { value: 'offline', label: '离线提醒' },
  ]
  // 标题切换
  const onTitle = (item: any) => {
    // setIsName(true)

    if ((item.title !== '全部提醒' || item.title !== 'SOS提醒' || item.title !== '坠床提醒' || item.title !== '离床提醒' || item.title !== '坐起提醒')) {
      setTitleTrue(true)
    }
    if (item.title !== '其他提醒' && nurseType !== '护理提醒' && nurseType !== '离线提醒') {
      setNurseType('其他提醒')
      setTitleTrue(false)
    }
    if ((item.title == '全部提醒' || item.title == 'SOS提醒' || item.title == '坠床提醒' || item.title == '离床提醒' || item.title == '坐起提醒')) {
      setNurseType('其他提醒')
      setTitleTrue(false)
    }
    setTitle(item.title)
    setTitleId(item.id)
    setTitleIdKey(item.key)
    if (item.key === 'otherReminders') return setNursing(true)
    setParams({
      ...params,
      pageNum: 1,
      pageSize: 10,
      types: item.key,
      startMills: timeArr[0],
      endMills: timeArr[1],
    })
    getMessage({
      ...params,
      pageNum: 1,
      pageSize: 10,
      types: item.key,
      startMills: timeArr[0],
      endMills: timeArr[1],
    })
  }
  //请求数据接收
  const initMessagesPage = (res: any) => {
    try {
      const data = res.data.data.records
      const total = res.data.beforeYestodayAlarmCount
      const pages = res.data.data.pages
      const message = initMessage(data)
      setMessages(message)
      setTotal(total)
      setTodayAlarmCount(res.data.todayAlarmCount)
      setPageTotal(res.data.data.total)
      setData({
        yestodayAlarmCount: res.data.yestodayAlarmCount,
        beforeYestodayAlarmCount: res.data.beforeYestodayAlarmCount,
        todayAlarmCoun: res.beforeYestodayAlarmCount,
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
      title: '床号',
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
    // {
    //   title: '响应时间',
    //   dataIndex: 'responseTime',
    //   key: 'responseTime',
    // },
    // {
    //   title: '响应人',
    //   dataIndex: 'responders',
    //   key: 'responders',
    // },
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
  const [name, setName] = useState('')
  const homeSelect = [
    { value: 'patientName', label: '姓名' },
    { value: 'roomNum', label: '床号' },
  ]
  const [otherRemindersType, setOtherRemindersType] = useState('');
  const [selectType, setSelectType] = useState('patientName');
  const [fale, seFalse] = useState(false)
  const onShijian = () => {
    setPopupVisible(true)
    setVisible(true)
  }
  // 时间选择器
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {

  }
  // 搜索框
  const [patientNameRoomNum, setpatientName] = useState<any>('')
  const [popupVisible, setPopupVisible] = useState(false);
  useEffect(() => {
    if (!patientNameRoomNum) {
      setParams({
        ...params,
        pageNum: 1,
        pageSize: 10,
      });
      getMessage({
        ...params,
        pageNum: 1,
        pageSize: 10,
      });
    }
  }, [patientNameRoomNum])

  const onBlur = () => {
    if (patientNameRoomNum && selectType === 'patientName') {
      setParams({
        ...params,
      });
      getMessage({
        ...params,
        pageNum: 1,
        pageSize: 10,
        // startMills: timeArr[0],
        // endMills: timeArr[1],
        patientName: patientNameRoomNum

      });
    } else if (patientNameRoomNum && selectType === 'roomNum') {
      setParams({
        ...params,
      });
      getMessage({
        ...params,
        pageNum: 1,
        pageSize: 10,
        // startMills: timeArr[0],
        // endMills: timeArr[1],
        roomNum: patientNameRoomNum
      });
    }

  }
  // 标题切换
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const defaultRange: [Date, Date] = [
    dayjs().toDate(),
    dayjs().add(2, 'day').toDate(),
  ]
  const [val, setVal] = useState<any>([])
  const [setDefaultRange, setsetDefaultRange] = useState()
  console.log(setDefaultRange);
  useEffect(() => {
    if (val[0] && val[1]) {

      setParams({
        ...params,

        startMills: val[0] && val[0].getTime(),
        endMills: val[1] && val[1].getTime(),
      })
      getMessage({
        ...params,
        startMills: val[0] && val[0].getTime(),
        endMills: val[1] && val[1].getTime(),
      })
    }
  }, [val])
  // setVisible
  const actions: Action[] = [
    { text: '复制', key: 'copy' },
    { text: '修改', key: 'edit' },
    { text: '保存', key: 'save' },
  ]
  return (
    <>
      {
        !WindowSize ? <><Title titleKey={titleKey} titleChangeGetMessage={(item: any) => getSearchValue(item)}></Title><div className="messagePage">
          <div className="messageMain">
            <div className="messagetitle">
              <div className="messageTitleBtn">
                {titleList && titleList.map((item: any, index) => {
                  return (
                    <Button
                      style={{ border: "none", fontWeight: "900" }}
                      key={item.id}
                      className={`btn  ${(index + 1) === titleId ? 'on' : ''} `}
                      onClick={() => onTitle(item)}
                    >
                      {item.title}
                    </Button>
                  );
                })}
                {
                  titleTrue === true ? <div style={{ fontSize: "0.8rem", position: 'absolute', top: '7.8rem', width: '7rem', height: '7rem', zIndex: '10', left: '59%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: "5px", border: "solid 1px #ccc" }}>
                    {
                      titleList1.map((item: any) => {
                        return (
                          <div onClick={() => {

                            setNurseType(item.title)

                            setParams({
                              ...params,
                              types: item.key,
                              startMills: timeArr[0],
                              endMills: timeArr[1],
                            })
                            getMessage({
                              ...params,
                              types: item.key,
                              startMills: timeArr[0],
                              endMills: timeArr[1],
                            })
                            setTitleTrue(false)
                          }} className="bg-[#fff] py-4 px-7">
                            {item.title}
                          </div>
                        )
                      })
                    }
                  </div> : ""
                }



              </div>
            </div>
            <div className="messageMainData">
              <div className="messageMainDatadiv ">
                <div className="messageMainDataTitle">
                  <div className="messageMainDataTitlediv">
                    <p className="messageMainDataTitledivbac w-[20px] h-[20px] rounded-[2px] mt-[22px] mr-[16px] opacity-100 bg-[#0072EF]"></p>
                    <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal">{title} <span className="font-pingfang-sc font-bold text-[35px] leading-normal tracking-normal " style={{ color: "#0072EF" }}> {todayAlarmCount} </span> 次</p>
                  </div>
                  <div className="messageMainDataTitlediv ">
                    <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal mr-[1.4rem]">
                      昨天提醒<span className="font-pingfang-sc font-bold text-[1.5rem] leading-normal tracking-normal" style={{ color: "#0072EF" }}> {datarq.yestodayAlarmCount} </span> 次
                    </p>
                    <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal mr-[1.4rem] ">
                      前天提醒 <span className="font-pingfang-sc font-bold text-[1.5rem]  leading-normal tracking-normal" style={{ color: "#0072EF" }}> {datarq.beforeYestodayAlarmCount} </span> 次
                    </p>
                  </div>
                </div>
                <div className="projectContent">
                  <ConfigProvider locale={zhCN}>
                    <Table
                      locale={{
                        emptyText: <span>暂无数据</span>
                      }}
                      pagination={false}
                      dataSource={data}
                      columns={columns} />
                  </ConfigProvider>
                </div>
                <div className='msgToinfoStrPage '>
                  <div className="msgToinfoStrPageDiv">单页显示数 <span style={{ color: "#0072EF", fontVariationSettings: "opsz auto", fontSize: "1rem" }}>{data.length}</span> 条</div>
                  <Pagination style={{ marginRight: "40px" }} pageSize={10} current={params.pageNum} className="pagination" defaultCurrent={1} onChange={onChange} showSizeChanger={false} total={pageTotal} />
                </div>
              </div>
            </div>
          </div>
          {<Bottom />}
        </div></> : <div className="message_phone_box">
          <Title titleChangeGetMessage={(item: any) => getSearchValue(item)}></Title>
          <div className="MessageYiDong">
            <LeftOutlined onClick={() => navigator('/')} className="MessageYiDongFanHui" />
            <div className="MessageYiDongDivInput">
              <Select
                className="MessageYiDOngTitlesearchSelect"
                defaultValue={selectType}
                style={{ width: 80 }}
                onChange={(e) => { setSelectType(e) }}
                options={homeSelect}
              />
              <div style={{ border: "solid 0.5px #B4C0CA", width: "1px", height: "1rem" }}></div>
              <input
                className="messageTitlediv2_you_inp" type="text"
                value={patientNameRoomNum}
                onChange={(e) => setpatientName(e.target.value)}
                placeholder="请输入姓名/床号"
                onBlur={onBlur}
              />
              {/* <img src={fang} style={{ width: "1.5rem", height: "1.5rem" }} alt="" /> */}
              {/* <ZoomInOutlined className="MessageYiDongFangDAJing" /> */}
            </div>
            <span onClick={onShijian} className="MessageYiDongShiJian">时间<CaretDownOutlined />
            </span>
          </div>
          {
            fale ? <Space style={{ width: "50rem", height: "39px", marginLeft: "10px" }} direction="vertical" size={12}>
              <RangePicker
                placeholder={['开始时间', '结束时间']}
                onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                style={{ width: "18rem", height: "39px", marginLeft: "10px" }}
                showTime />
            </Space> : ""
          }
          <div className="MessageYiDOngTitle">
            {
              titleList && titleList.map((item, index) => {
                return (
                  <Button
                    key={item.id}
                    className={`btn  ${(index + 1) === titleId ? 'on' : ''} `}
                    ref={(el: any) => (titleRefs.current[index] = el)}
                    onClick={() => onTitle(item)}
                  >
                    {item.title}
                  </Button>
                )
              })
            }
            {/* {
              titleTrue === true ? <div style={{ fontSize: "1.3rem", position: 'absolute', top: '10.4rem', width: '7rem', height: '7rem', zIndex: '99999', left: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: "5px", border: "solid 1px #ccc", background: "#fff" }}>

                {
                  titleList1.map((item: any) => {
                    return (
                      <div onClick={() => {

                        setNurseType(item.title)

                        setParams({
                          ...params,
                          types: item.key,
                          startMills: timeArr[0],
                          endMills: timeArr[1],
                        })
                        getMessage({
                          ...params,
                          types: item.key,
                          startMills: timeArr[0],
                          endMills: timeArr[1],
                        })
                        setTitleTrue(false)
                      }} className="bg-[#fff]  p-[0.25rem 0.75rem 0.25rem 0.5rem]" style={{ padding: "0.75rem 0.25rem 0.5rem 0.25rem" }}>
                        {item.title}
                      </div>
                    )
                  })
                }
              </div> : ""
            } */}
            <div className="MessageYiDOngTitledivMessageYiDOngTitlediv" style={{ position: 'fixed', right: "0", background: '#FFFFF', width: "2rem", height: "3rem", zIndex: 99 }}></div>
          </div>
          <div style={{ background: '#F5F8FA', overflow: "hidden", height: '100%', }}>
            <div className="f-[96%] ml-[2%] mr-[2%] bg-[#ffff] rounded-lg h-full">
              <div className="messageMainDataTitledivcontainercarddiv" style={{ fontWeight: 600 }}>
                <div className="messageMainDataTitledivcontainercardqiantian">
                  <h2 className="messageMainDataTitledivcontainercardqiantiandiv" style={{ color: "#000", fontWeight: 600 }}>{title}</h2>
                  <p className="messageMainDataTitledivcontainercardqiantianyesterday" style={{ color: "#000", fontSize: "1.7rem", marginLeft: "0" }}><span style={{ fontSize: "20px", fontFamily: 'PingFang SC', color: "#0072EF" }}>{todayAlarmCount}</span> <span style={{ fontSize: "14px" }}>次</span></p>
                </div>
                <div style={{ width: "1px", borderLeft: "1px #F5F8FA solid", height: "3rem", marginTop: "10px" }}></div>
                <div className="messageMainDataTitledivcontainercardqiantian1" style={{ color: "#000", fontWeight: 600 }}>
                  <h3 className="messageMainDataTitledivcontainercardqiantiandiv" >昨天提醒次数</h3>
                  <p className="messageMainDataTitledivcontainercardqiantianyesterday" > {datarq.yestodayAlarmCount} 次</p>
                </div>
                <div style={{ width: "1px", borderLeft: "1px #F5F8FA solid", height: "3rem", marginTop: "10px" }}></div>
                <div className="messageMainDataTitledivcontainercardqiantian2" style={{ color: "#000", fontWeight: 600 }} >
                  <h3 className="messageMainDataTitledivcontainercardqiantiandiv" >前天提醒次数</h3>
                  <p className="messageMainDataTitledivcontainercardqiantianyesterday">{datarq.beforeYestodayAlarmCount} 次</p>
                </div>
              </div>
              <div className="biaogetable">
                <div className="table-container" style={{ overflowY: "auto" }}>
                  <div className="flex w-[98%] h-[3.3rem] ml-[1%] mr-[1%] bg-[#F5F8FA] rounded-xl">
                    <p className="notificationTable w-[20%] ml-[1rem]">序号</p>
                    <p className="notificationTable w-[30%]" >床号/姓名</p>
                    <p className="notificationTable w-[30%] pl-[1rem]">提醒时间</p>
                    <p className="notificationTable w-[20%] ml-[4rem]">类型</p>
                  </div>
                  <div className="w-[98%] h-[3.3rem] mt-4">
                    {
                      isFalse === true ? <div className="text-[hsl(203,8%,80%)] text-lg flex items-center justify-center mt-16"><SpinLoading /> </div> : ""
                    }
                    {
                      data.length > 0 ?
                        data && data.map((item: any, index: number) => {
                          return <div key='index' className="flex" style={{ borderBottom: "solid 1px #F5F8FA" }}>
                            <div className="notificationTable  w-[20%] ml-[1.3rem] " style={{ fontSize: "1.25rem", color: "#000" }}>
                              {(params.pageNum - 1) * params.pageSize + index + 1}
                            </div>
                            <div className="notificationTableDiv w-[30%] " style={{}}>
                              <p style={{ fontSize: "1.25rem", color: "#32373E" }}>   {
                                item.roomNumber
                              }</p>
                              <p style={{ fontSize: "1rem", color: "#929EAB" }}>
                                {
                                  item.name
                                }
                              </p>
                            </div>
                            <div className="notificationTableDiv w-[30%] pl-[1rem]">
                              <p style={{ fontSize: "1.25rem", color: "#32373E", paddingLeft: "1.2rem" }}> {item.timeDate}</p>
                              <p style={{ fontSize: "1rem", color: "#929EAB", paddingLeft: "1.2rem" }}> {item.dateTime}</p>
                            </div>
                            <div className="notificationTableDiv w-[20%] ml-[4rem]" style={{ textAlign: "center", fontSize: "1.25rem" }}>
                              {item.type}
                            </div>
                          </div>
                        })
                        : < div className="text-[hsl(203,8%,80%)] text-lg flex items-center justify-center mt-16">暂无数据</div>
                    }
                    <div className='msgToinfoStrPage '>
                      <Pagination style={{ marginRight: "40px" }} pageSize={10} current={params.pageNum} className="pagination" defaultCurrent={1} onChange={onChange} showSizeChanger={false} total={pageTotal} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CalendarPicker
            min={new Date(1970, 1, 1)}  // 设置为一个较早的时间点
            max={new Date()}
            visible={popupVisible}
            defaultValue={defaultRange}
            selectionMode='range'
            // precision='minute'
            onClose={() => setPopupVisible(false)}
            onMaskClick={() => setPopupVisible(false)}
            // shouldDisableDate={(date: any) => {
            //   // 例如，禁用今天之后的日期
            //   return dayjs(date).isAfter(dayjs(), 'day'); // 禁用今天之后的日期  
            // }}
            onChange={(val: [Date, Date] | null) => {
              setVal(val)
            }}
          />


          {<Bottom />}
        </div >
      }
    </>
  );
}
