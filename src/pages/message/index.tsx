import { useEffect, useState, useRef } from "react";
import "./index.scss";
import dayjs from "dayjs";
import { alarmValueToType } from "@/utils/messageInfo";
import { instance } from "@/api/api";
import Title from "@/components/title/Title";
import Bottom from "@/components/bottom/Bottom";
import type { TableProps, GetProps } from "antd";
import {
  DatePicker,
  Pagination,
  Button,
  Table,
  Input,
  Space,
  Select,
  ConfigProvider,
  Result,
  message,
} from "antd";
import Icon, {
  CaretDownOutlined,
  LeftOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { useGetWindowSize } from "../../hooks/hook";
import zhCN from "antd/locale/zh_CN";
// import Kdsd from './messageDatePicker'
import isBetween from 'dayjs/plugin/isBetween';
import {
  ActionSheet,
  PullToRefresh,
  SpinLoading,
  Popup,
  Calendar,
  InfiniteScroll,
} from "antd-mobile";
import type {
  Action,
  ActionSheetShowHandler,
} from "antd-mobile/es/components/action-sheet";
import { useNavigate } from "react-router-dom";
import nian from '@/assets/image/nian.png'
import yue from '@/assets/image/yue.png'

dayjs.extend(isBetween);

const { Option } = Select;
const { RangePicker } = DatePicker;
let currentCalendarValue = new Date();
// const { Option } = Select;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
export interface message {
  roomNum?: string;
  patientName?: string;
  status: boolean;
  date: string;
  info: string;
  headImg: string;
}
interface DataType {
  id: string;
  name: string;
  roomNumber: number | string;
  Time: string | number;
  type: string | boolean;
}
export function msgToinfoStr(msg: string): string {
  if (msg === "online") {
    return "设备已上线";
  } else if (msg === "offline") {
    return "设备离线";
  } else if (msg === "breath_stop") {
    return "呼吸暂停风险";
  } else if (msg === "outOffBed") {
    return "已离床";
  } else if (msg === "stroke") {
    return "体动风险";
  } else if (msg === "nursing") {
    return "褥疮护理提醒";
  } else if (msg === "sos") {
    return "SOS求救";
  } else if (msg === "fallbed") {
    return "坠床提醒";
  } else if (msg === "situp") {
    return "坐起提醒";
  }
  return "";
}

const timeArr = [
  new Date(new Date().toLocaleDateString()).getTime(),
  new Date().getTime(),
];
export default function Message() {
  const navigator = useNavigate();
  const phone = localStorage.getItem("phone") || "";
  const token = localStorage.getItem("token") || "";
  const [total, setTotal] = useState(0);
  const [todayAlarmCount, setTodayAlarmCount] = useState(0);
  const WindowSize = useGetWindowSize();
  message.config({
    top: 100,
    duration: 1.5,
    maxCount: 3,
    rtl: true,
  });

  const [visible, setVisible] = useState(false);
  // 昨天提醒 62 次 前天提醒 26 次
  console.log(total, "......total");

  const [datarq, setData] = useState<any>([
    {
      yestodayAlarmCount: "",
      beforeYestodayAlarmCount: "",
      todayAlarmCoun: "",
    },
  ]);
  // 接口参数
  const [params, setParams] = useState({
    phone: phone,
    pageNum: 1,
    pageSize: 10,
    startMills: timeArr[0],
    endMills: timeArr[1],
    types: "nursing,fallbed,outOffBed,situp,offline,sos",
  });
  const [messages, setMessages] = useState<message[]>([]);
  // 请求msg
  useEffect(() => {
    getMessage();
  }, []);
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
  };
  const getMessage = async (reqparms: any = {}) => {
    const param = {
      ...params,
      ...reqparms,
    };
    const res: any = await baseFetch(param);
    if (param.pageNum === 1) {
      setHasMore(true);
    }
    // initMessagesPage(res);
  };
  /**
   *
   * @param param 请求报告信息
   * @returns 服务器返回
   */
  const [dataList, setDataLIst] = useState([]);
  const [isFalse, setFalse] = useState(true);
  localStorage.setItem("dataList", JSON.stringify(dataList));
  // const [todayAlarmCount, setTodayAlarmCount] = useState(0)
  // 接口请求
  const baseFetch = async (param: any) => {
    if (!param.patientName) {
      delete param.patientName;
    }
    try {
      const option = {
        method: "get",
        url: "/sleep/log/selectAlarm",
        params: param,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: token,
        },
      };
      const res = await instance(option);
      if (WindowSize) {
        setMobileData(getDataList(res.data.data.records));
      } else {
        setDataLIst(res.data.data.records);
      }
      setFalse(false);
      initMessagesPage(res);
      return res;
    } catch (err) { }
  };
  /**
   *
   * @param data  服务器接收的信息
   * @returns 格式化后的信息
   */
  const initMessage = (data: any) => {
    const message = data.map((a: any) => {
      a.date = a.timeMills;
      a.info = msgToinfoStr(a.type);
      return a;
    });
    return message;
  };
  const [nurseType, setNurseType] = useState("其他提醒");
  // 表格状态
  const titleList = [
    {
      id: 1,
      key: "nursing,fallbed,outOffBed,situp,offline,sos",
      title: "全部提醒",
    },
    {
      id: 2,
      key: "",
      title: "",
    },
    {
      id: 3,
      key: "sos",
      title: "SOS提醒",
    },
    {
      id: 4,
      key: "fallbed",
      title: "坠床提醒",
    },
    {
      id: 5,
      key: "outOffBed",
      title: "离床提醒",
    },
    {
      id: 6,
      key: "situp",
      title: "坐床边提醒",
    },
    {
      id: 7,
      key: !WindowSize ? "" : "nursing,offline",
      title: nurseType,
    },
  ];
  const titleList1 = [
    {
      id: 1,
      key: "nursing",
      title: "护理提醒",
    },
    {
      id: 2,
      key: "offline",
      title: "离线提醒",
    },
  ];
  console.log(WindowSize, '.....................WindowSizeWindowSize');


  const getDataList = (dataList: any) => {
    return dataList.map((item: any, index: number) => {
      return {
        key: item.id,
        id: index,
        roomNumber: item.roomNum,
        name: item.patientName,
        Time: item.timeMills,
        type: msgToinfoStr(item.type),
        responders: item.responders,
        responseTime: item.responseTime,
        reminderTime: dayjs(item.timeMills).format("YYYY/MM/DD HH:mm:ss"),
        timeDate: dayjs(item.timeMills).format("HH:mm:ss"),
        dateTime: dayjs(item.timeMills).format("YYYY/MM/DD"),
      };
    });
  };
  // 表格数据
  const data: any[] = getDataList(dataList);
  // 标题切换
  const [titleId, setTitleId] = useState(1);
  const [titleKey, setTitleIdKey] = useState("");
  const [title, setTitle] = useState("全部提醒");
  const [hasMore, setHasMore] = useState(true);
  const [mobileData, setMobileData] = useState([]) as any;

  const [nursing, setNursing] = useState(false);
  const [isName, setIsName] = useState(false);
  const [pageTotal, setPageTotal] = useState(0);
  const [titleTrue, setTitleTrue] = useState(false);
  const [weekForFirstMonth, setWeekForFirstMonth] = useState(-1);
  const homeSelectNurse: any = [
    { value: "nursing", label: "护理提醒" },
    { value: "offline", label: "离线提醒" },
  ];
  // 标题切换
  const onTitle = (item: any) => {
    // setIsName(true)
    if (
      item.title !== "全部提醒" ||
      item.title !== "SOS提醒" ||
      item.title !== "坠床提醒" ||
      item.title !== "离床提醒" ||
      item.title !== "坐床边提醒"
    ) {
      setTitleTrue(true);
    }
    if (
      item.title !== "其他提醒" &&
      nurseType !== "护理提醒" &&
      nurseType !== "离线提醒"
    ) {
      setNurseType("其他提醒");
      setTitleTrue(false);
    }
    if (
      item.title == "全部提醒" ||
      item.title == "SOS提醒" ||
      item.title == "坠床提醒" ||
      item.title == "离床提醒" ||
      item.title == "坐床边提醒"
    ) {
      setNurseType("其他提醒");
      setTitleTrue(false);
    }
    setTitle(item.title);
    setTitleId(item.id);
    setTitleIdKey(item.key);
    if (item.key === "otherReminders") return setNursing(true);
    if (!WindowSize) {
      if (item.title == '其他提醒') return ''
    }
    setParams({
      ...params,
      pageNum: 1,
      pageSize: 10,
      types: item.key,
      startMills: timeArr[0],
      endMills: timeArr[1],
    });
    getMessage({
      ...params,
      pageNum: 1,
      pageSize: 10,
      types: item.key,
      startMills: timeArr[0],
      endMills: timeArr[1],
    });
  };
  //请求数据接收
  const initMessagesPage = (res: any) => {
    try {
      const data = res.data.data.records;
      const total = res.data.beforeYestodayAlarmCount;
      const pages = res.data.data.pages;
      const message = initMessage(data);
      setMessages(message);
      setTotal(total);
      setTodayAlarmCount(res.data.todayAlarmCount);
      setPageTotal(res.data.data.total);
      setData({
        yestodayAlarmCount: res.data.yestodayAlarmCount,
        beforeYestodayAlarmCount: res.data.beforeYestodayAlarmCount,
        todayAlarmCoun: res.beforeYestodayAlarmCount,
      });
    } catch (err) { }
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) =>
        (params.pageNum - 1) * params.pageSize + index + 1,
    },
    {
      title: "床号",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "提醒时间",
      dataIndex: "reminderTime",
      key: "reminderTime",
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
      title: "类型",
      dataIndex: "type",
      key: "type",
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
  const [name, setName] = useState("");
  const homeSelect = [
    { value: "patientName", label: "姓名" },
    { value: "roomNum", label: "床号" },
  ];
  const [selectType, setSelectType] = useState("patientName");
  // 搜索框
  const [patientNameRoomNum, setpatientName] = useState<any>("");

  const [timeoutId, setTimeoutId] = useState<any>(null);
  const handleInputChange = (value: any) => {
    setpatientName(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (selectType === 'patientName') {
      const newTimeoutId = setTimeout(() => {
        loadMore({
          ...params,
          pageNum: 1,
          // types: titleKey,
          patientName: value,
        }, []);
      }, 300);
      setTimeoutId(newTimeoutId);
    } else if (selectType === 'roomNum') {
      const newTimeoutId = setTimeout(() => {
        loadMore({
          ...params,
          pageNum: 1,
          // types: titleKey,
          roomNum: value,
        }, []);
      }, 300);
      setTimeoutId(newTimeoutId);
    }
  };

  // 标题切换
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [dataRange, setDataRange] = useState<any>(null); //日期
  const [hours, setHours] = useState<string>("0"); // 小时
  const [minutes, setMinutes] = useState<string>("0"); // 分钟
  const [chooseTimeType, setChooseTimeType] = useState<any>('start');
  const [timeList, setTimeList] = useState<any>(timeArr);

  const today = new Date();

  const timeSearch = () => {
    setVisible(false);
    setMobileData([]);
    loadMore({
      ...params,
      pageNum: 1,
      startMills: dayjs(timeList[0]).valueOf(),
      endMills: dayjs(timeList[1]).valueOf(),
    }, []);
  };
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 月份为0索引
  const disableFutureDates = (date: any) => {
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    // 检查日期是否在当前月份和年份
    if (dateYear === currentYear && dateMonth === currentMonth) {
      return (
        <div>
          {date.getDate()} {/* 渲染当前月份的日期 */}
        </div>
      );
    }
    // 渲染之前月份的日期
    if (
      dateYear < currentYear ||
      (dateYear === currentYear && dateMonth < currentMonth)
    ) {
      return (
        <div>
          {date.getDate()} {/* 渲染之前月份的日期 */}
        </div>
      );
    }
    return null; // 如果日期在未来，则返回 null
  };
  const loadMore = async (searchParams?: any, initData?: any) => {
    const pageNum = params.pageNum + 1;
    setParams({
      ...params,
      pageNum,
      ...searchParams
    });
    const res: any = await baseFetch({
      ...params,
      pageNum,
      ...searchParams
    });
    const list: any = getDataList(res.data?.data?.records || []) as any;
    setMobileData([...(initData ? initData : mobileData), ...list]);
    setHasMore((res.data?.data?.records || []).length > 0);
  };
  const checkoutTime = (value: any) => {
    const currentTime = new Date().getTime();
    if (chooseTimeType === 'start') {
      const start = new Date(value).getTime();
      const end = new Date(timeList[1]).getTime();

      if (start > currentTime) {
        return message.info("开始时间不能大于当前时间");
      }
      if (start > end) {
        return message.info("开始时间不能大于结束时间");
      }
    } else {
      const start = new Date(value).getTime();
      const end = new Date(timeList[0]).getTime();

      if (start > currentTime) {
        return message.info("结束时间不能大于当前时间");
      }
      if (start < end) {
        return message.info("结束时间不能小于开始时间");
      }
    }
    return false;
  };
  const [currentMonth1, setCurrentMonth] = useState(dayjs());
  const startOfMonth = currentMonth1.startOf('month').toDate();
  const endOfMonth = currentMonth1.endOf('month').toDate();
  const renderDate = (date: any) => {
    console.log(new Date(currentCalendarValue).toLocaleDateString(), 'new Date(currentCalendarValue)')
    const { firstDay, lastDay } = getCurrentMonthFirstAndLastDay(currentCalendarValue);
    const firstDate = firstDay.date.getTime()
    const lastDate = lastDay.date.getTime()
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0)
    if (firstDate > date.getTime() || lastDate < date.getTime()) {
      return '';
    }

    const isInRange: any = dayjs(date).isBetween(startOfMonth, endOfMonth, null, '[]');
    const formattedDate = dayjs(date).format('D');
    // if (!isInRange) {
    //   return <div style={{ visibility: 'hidden' }}></div>;
    // }
    return (
      <div style={{ lineHeight: '40px', height: '40px', marginBottom: '12px' }}>
        {formattedDate}
      </div>
    );
  };
  const getCurrentMonthFirstAndLastDay = (date: any) => {
    const now = date;

    // 获取当月第一天（00:00:00）
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    // 获取当月最后一天（23:59:59）
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999); // 设置为当天最后一毫秒

    return {
      firstDay: {
        date: firstDay,
        timestamp: firstDay.getTime(),
        formatted: firstDay.toLocaleDateString()
      },
      lastDay: {
        date: lastDay,
        timestamp: lastDay.getTime(),
        formatted: lastDay.toLocaleDateString()
      }
    };
  }
  const getNaturalMonthOffsetDates = (date: any, type?: any) => {
    const now = date;

    // 一个月后的今天（自然月）
    const nextMonth = new Date(now);
    nextMonth.setDate(1)
    if (type === 'month') {
      nextMonth.setMonth(nextMonth.getMonth() + 1);
    } else {
      nextMonth.setFullYear(nextMonth.getFullYear() + 1);
    }

    // 前一个月的今天（自然月）
    let prevMonth = new Date(now);
    prevMonth.setDate(1)
    if (type === 'month') {
      prevMonth.setMonth(prevMonth.getMonth() - 1);
    } else {
      prevMonth.setFullYear(prevMonth.getFullYear() + 1);
    }
    return {
      nextMonth: {
        date: nextMonth,
        formatted: nextMonth.toLocaleDateString()
      },
      prevMonth: {
        date: prevMonth,
        formatted: prevMonth.toLocaleDateString()
      }
    };
  }
  const handlePrevMonth = () => {
    currentCalendarValue = getNaturalMonthOffsetDates(currentCalendarValue, 'month').prevMonth.date
    setCurrentMonth(currentMonth1.subtract(1, 'month'));
  };
  const handlePrevYear = () => {
    currentCalendarValue = new Date(currentMonth1.subtract(1, 'year').valueOf())
    setCurrentMonth(currentMonth1.subtract(1, 'year'));
  };
  const handleNextMonth = () => {
    currentCalendarValue = getNaturalMonthOffsetDates(currentCalendarValue, 'month').nextMonth.date
    setCurrentMonth(currentMonth1.add(1, 'month'));
  };
  const handleNextYear = () => {
    currentCalendarValue = new Date(currentMonth1.add(1, 'year').valueOf())
    setCurrentMonth(currentMonth1.add(1, 'year'));
  };
  const prevMonthButton = <img style={{ width: "1.5rem", height: "1.5rem", }} src={yue} onClick={handlePrevMonth} alt="" />;
  const prevYearButton = <img style={{ width: "1.6rem", height: "1.6rem", marginLeft: "0.3rem" }} src={nian} onClick={handlePrevYear} alt="" />;
  const nextMonthButton = <img style={{ width: "1.6rem", height: "1.6rem", transform: 'rotate(180deg)', }} src={yue} onClick={handleNextMonth} alt="" />;
  const nextYearButton = <img style={{ width: "1.5rem", height: "1.5rem", transform: "rotate(180deg)", marginRight: "0.3rem" }} src={nian} onClick={handleNextYear} alt="" />;

  return (
    <>
      {!WindowSize ? (
        <>
          <Title
            titleKey={titleKey}
            titleChangeGetMessage={(item: any) => getSearchValue(item)}
          ></Title>
          <div className="messagePage">
            <div className="messageMain">
              <div className="messagetitle">
                <div className="messageTitleBtn">
                  {titleList &&
                    titleList.map((item: any, index) => {
                      return (
                        <Button
                          style={{ border: "none", fontWeight: "900" }}
                          key={`${item.id}_v1`}
                          className={`btn  ${index + 1 === titleId ? "on" : ""
                            } `}
                          onClick={() => onTitle(item)}
                        >
                          {item.title}
                        </Button>
                      );
                    })}
                  {titleTrue === true ? (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        position: "absolute",
                        top: "7.8rem",
                        width: "7rem",
                        height: "7rem",
                        zIndex: "10",
                        left: "59%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: "5px",
                        border: "solid 1px #ccc",
                      }}
                    >
                      {titleList1.map((item: any, index: number) => {
                        return (
                          <div
                            key={`${index}_v2`}
                            onClick={() => {
                              setNurseType(item.title);

                              setParams({
                                ...params,
                                types: item.key,
                                startMills: timeArr[0],
                                endMills: timeArr[1],
                              });
                              getMessage({
                                ...params,
                                types: item.key,
                                startMills: timeArr[0],
                                endMills: timeArr[1],
                              });
                              setTitleTrue(false);
                            }}
                            className="bg-[#fff] py-4 px-7"
                          >
                            {item.title}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="messageMainData">
                <div className="messageMainDatadiv ">
                  <div className="messageMainDataTitle">
                    <div className="messageMainDataTitlediv">
                      <p className="messageMainDataTitledivbac w-[20px] h-[20px] rounded-[2px] mt-[22px] mr-[16px] opacity-100 bg-[#0072EF]"></p>
                      <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal">
                        {title}{" "}
                        <span
                          className="font-pingfang-sc font-bold text-[35px] leading-normal tracking-normal "
                          style={{ color: "#0072EF" }}
                        >

                          {todayAlarmCount}
                        </span>{" "}
                        次
                      </p>
                    </div>
                    <div className="messageMainDataTitlediv ">
                      <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal mr-[1.4rem]">
                        昨天提醒
                        <span
                          className="font-pingfang-sc font-bold text-[1.5rem] leading-normal tracking-normal"
                          style={{ color: "#0072EF" }}
                        >
                          {" "}
                          {datarq.yestodayAlarmCount}{" "}
                        </span>{" "}
                        次
                      </p>
                      <p className="font-pingfang-sc font-bold text-[1.2rem] leading-normal tracking-normal mr-[1.4rem] ">
                        前天提醒{" "}
                        <span
                          className="font-pingfang-sc font-bold text-[1.5rem]  leading-normal tracking-normal"
                          style={{ color: "#0072EF" }}
                        >
                          {" "}
                          {datarq.beforeYestodayAlarmCount}{" "}
                        </span>{" "}
                        次
                      </p>
                    </div>
                  </div>
                  <div className="projectContent">
                    <ConfigProvider locale={zhCN}>
                      <Table
                        locale={{
                          emptyText: <span>暂无数据</span>,
                        }}
                        pagination={false}
                        dataSource={data}
                        columns={columns}
                      />
                    </ConfigProvider>
                  </div>
                  <div className="msgToinfoStrPage ">
                    <div className="msgToinfoStrPageDiv">
                      单页显示数{" "}
                      <span
                        style={{
                          color: "#0072EF",
                          fontVariationSettings: "opsz auto",
                          fontSize: "1rem",
                        }}
                      >
                        {data.length}
                      </span>{" "}
                      条
                    </div>
                    <Pagination
                      style={{ marginRight: "40px" }}
                      pageSize={10}
                      current={params.pageNum}
                      className="pagination"
                      defaultCurrent={1}
                      onChange={onChange}
                      showSizeChanger={false}
                      total={pageTotal}
                    />
                  </div>
                </div>
              </div>
            </div>
            {<Bottom />}
          </div>
        </>
      ) : (
        <div className="message_phone_box">
          <Title titleChangeGetMessage={(item: any) => getSearchValue(item)} ></Title>
          <div className="MessageYiDong">
            <LeftOutlined
              onClick={() => navigator("/")}
              className="MessageYiDongFanHui"
            />
            <div className="MessageYiDongDivInput">
              <Select
                showSearch={false}
                className="MessageYiDOngTitlesearchSelect"
                defaultValue={selectType}
                style={{ width: 80 }}
                onChange={(e) => {
                  setSelectType(e);
                  setpatientName('')
                }}
                options={homeSelect}
              />
              <div
                style={{
                  border: "solid 0.5px #B4C0CA",
                  width: "1px",
                  height: "1rem",
                }}
              ></div>
              <input
                className="messageTitlediv2_you_inp"
                type="text"
                value={patientNameRoomNum}
                onChange={(e: any) => handleInputChange(e.target.value)}
                // onChange={(e) => setpatientName(e.target.value)}
                placeholder="请输入姓名/床号"
              // onBlur={onBlur}
              />
              {/* <img src={fang} style={{ width: "1.5rem", height: "1.5rem" }} alt="" /> */}
              {/* <ZoomInOutlined className="MessageYiDongFangDAJing" /> */}
            </div>
            <span
              // onClick={onShijian}
              onClick={() => {
                setVisible(true);
              }}
              className="MessageYiDongShiJian"
            >
              时间
              <CaretDownOutlined />
            </span>
          </div>
          {/* {
            fale ? <Space style={{ width: "50rem", height: "39px", marginLeft: "10px" }} direction="vertical" size={12}>
              <RangePicker
                placeholder={['开始时间', '结束时间']}
                onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                style={{ width: "18rem", height: "39px", marginLeft: "10px" }}
                showTime />
            </Space> : ""
          } */}
          <div className="MessageYiDOngTitle">
            {titleList &&
              titleList.map((item, index) => {
                return (
                  <Button
                    key={`${item.id}_v3`}
                    className={`btn  ${index + 1 === titleId ? "on" : ""} `}
                    ref={(el: any) => (titleRefs.current[index] = el)}
                    onClick={() => onTitle(item)}
                  >
                    {item.title}
                  </Button>
                );
              })}
            <div
              className="MessageYiDOngTitledivMessageYiDOngTitlediv"
              style={{
                position: "fixed",
                right: "0",
                background: "#FFFFF",
                width: "2rem",
                height: "3rem",
                zIndex: 99,
              }}
            ></div>
          </div>
          <div
            style={{
              background: "#F5F8FA",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <div className="f-[96%] ml-[2%] mr-[2%] bg-[#ffff] rounded-lg h-full">
              <div
                className="messageMainDataTitledivcontainercarddiv"
                style={{ fontWeight: 600 }}
              >
                <div className="messageMainDataTitledivcontainercardqiantian">
                  <h2
                    className="messageMainDataTitledivcontainercardqiantiandiv"
                    style={{ color: "#000", fontWeight: 600 }}
                  >
                    {title}
                  </h2>
                  <p
                    className="messageMainDataTitledivcontainercardqiantianyesterday"
                    style={{
                      color: "#000",
                      fontSize: "1.7rem",
                      marginLeft: "0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontFamily: "PingFang SC",
                        color: "#0072EF",
                      }}
                    >
                      {todayAlarmCount}
                    </span>{" "}
                    <span style={{ fontSize: "14px" }}>次</span>
                  </p>
                </div>
                <div
                  style={{
                    width: "1px",
                    borderLeft: "1px #F5F8FA solid",
                    height: "3rem",
                    marginTop: "10px",
                  }}
                ></div>
                <div
                  className="messageMainDataTitledivcontainercardqiantian1"
                  style={{ color: "#000", fontWeight: 600 }}
                >
                  <h3 className="messageMainDataTitledivcontainercardqiantiandiv">
                    昨天提醒次数
                  </h3>
                  <p className="messageMainDataTitledivcontainercardqiantianyesterday">
                    {" "}
                    {datarq.yestodayAlarmCount} 次
                  </p>
                </div>
                <div
                  style={{
                    width: "1px",
                    borderLeft: "1px #F5F8FA solid",
                    height: "3rem",
                    marginTop: "10px",
                  }}
                ></div>
                <div
                  className="messageMainDataTitledivcontainercardqiantian2"
                  style={{ color: "#000", fontWeight: 600 }}
                >
                  <h3 className="messageMainDataTitledivcontainercardqiantiandiv">
                    前天提醒次数
                  </h3>
                  <p className="messageMainDataTitledivcontainercardqiantianyesterday">
                    {datarq.beforeYestodayAlarmCount} 次
                  </p>
                </div>
              </div>
              <div className="biaogetable">
                <div className="table-container" style={{ overflowY: "auto" }}>
                  <div className="flex w-[98%] h-[3.3rem] ml-[1%] mr-[1%] bg-[#F5F8FA] rounded-xl">
                    <p className="notificationTable w-[20%] ml-[1rem]">序号</p>
                    <p className="notificationTable w-[30%]">床号/姓名</p>
                    <p className="notificationTable w-[30%] pl-[1rem]">
                      提醒时间
                    </p>
                    <p className="notificationTable w-[20%] ml-[4rem]">类型</p>
                  </div>
                  <div className="w-[98%] h-[3.3rem] mt-4">
                    {isFalse === true ? (
                      <div className="text-[hsl(203,8%,80%)] text-lg flex items-center justify-center mt-16">
                        <SpinLoading />{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    {mobileData.length > 0 ? (
                      <>
                        <PullToRefresh
                          onRefresh={async () => {
                            console.log("上拉刷新");
                            setParams({
                              ...params,
                              pageNum: 1,
                            });
                            getMessage({
                              ...params,
                              pageNum: 1,
                            });
                            setHasMore(true);
                          }}
                        >
                          {mobileData &&
                            mobileData.map((item: any, index: number) => {
                              return (
                                <div
                                  key={`${index}_list`}
                                  className="flex"
                                  style={{ borderBottom: "solid 1px #F5F8FA" }}
                                >
                                  <div
                                    className="notificationTable  w-[20%] ml-[1.3rem] "
                                    style={{
                                      fontSize: "1.25rem",
                                      color: "#000",
                                    }}
                                  >
                                    {index + 1}
                                  </div>
                                  <div
                                    className="notificationTableDiv w-[30%] "
                                    style={{}}
                                  >
                                    <p
                                      style={{
                                        fontSize: "1.25rem",
                                        color: "#32373E",
                                      }}
                                    >
                                      {" "}
                                      {item.roomNumber}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "1rem",
                                        color: "#929EAB",
                                      }}
                                    >
                                      {item.name}
                                    </p>
                                  </div>
                                  <div className="notificationTableDiv w-[30%] pl-[1rem]">
                                    <p
                                      style={{
                                        fontSize: "1.25rem",
                                        color: "#32373E",
                                        paddingLeft: "1.2rem",
                                      }}
                                    >
                                      {" "}
                                      {item.timeDate}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "1rem",
                                        color: "#929EAB",
                                        paddingLeft: "1.2rem",
                                      }}
                                    >
                                      {" "}
                                      {item.dateTime}
                                    </p>
                                  </div>
                                  <div
                                    className="notificationTableDiv w-[20%] ml-[4rem]"
                                    style={{
                                      textAlign: "center",
                                      fontSize: "1.25rem",
                                    }}
                                  >
                                    {item.type}
                                  </div>
                                </div>
                              );
                            })}
                        </PullToRefresh>
                        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                      </>
                    ) : (
                      <div className="text-[hsl(203,8%,80%)] text-lg flex items-center justify-center mt-16">
                        暂无数据
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Popup
            visible={visible}
            onMaskClick={() => {
              setVisible(false);
            }}
            onClose={() => {
              setVisible(false);
            }}
            bodyStyle={{ borderRadius: "0.75rem 0.75rem 0 0" }}
          >
            <div>
              <div
                style={{
                  borderBottom: "1px solid #D8D8D8",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 0.8rem",
                  lineHeight: "4rem",
                }}
              >
                <div
                  className="text-lg ml-[0.6rem]"
                  style={{ fontFamily: " PingFang SC" }}
                  onClick={() => setVisible(false)}
                >
                  取消
                </div>
                <div
                  className="text-[#000] text-[1.5rem] from-500 "
                  style={{ fontFamily: " PingFang SC" }}
                >
                  自定义时间
                </div>
                <div
                  className="text-lg mr-[0.6rem]"
                  onClick={() => timeSearch()}
                >
                  确定
                </div>
              </div>
              <div
                className="h-[7.4rem]"
                style={{ borderBottom: "1px solid #D8D8D8" }}
              >
                <div
                  className="my-[1rem] ml-[2.3rem] text-[1.4rem] text-[#000]"
                  style={{ fontFamily: " PingFang SC" }}
                >
                  自定义区间
                </div>
                <div className="flex justify-around">
                  {/* <input
                    value={formattedDates[0]}
                    disabled
                    onChange={(e: any) => setStartInputTime(e.target.value)}
                    placeholder="2025-1-1-10:10"
                    style={{ fontFamily: "PingFang SC", textAlign: "center" }}
                    className="w-[12rem] h-[2.67rem] rounded-[0.9rem] bg-[#ECF0F4] text-[1.2rem] "
                    onClick={() => {
                      console.log('000000000000000')
                    }}
                  /> */}
                  <span
                    className="w-[12rem] h-[2.67rem] rounded-[0.9rem] bg-[#ECF0F4] text-[1.2rem] text-center lint-height-[2.67rem]"
                    style={{ lineHeight: '2.67rem', color: chooseTimeType !== 'start' ? '#666' : '#0072EF' }}
                    onClick={() => {
                      setChooseTimeType('start')
                    }}
                  >
                    {dayjs(timeList[0]).format('YYYY-MM-DD')}-{dayjs(timeList[0]).format('HH:mm')}
                  </span>
                  <span
                    className="w-[2rem] h-[0.1rem] flex justify-center items-center  bg-[#999999]lint-height-[2.67rem]"
                  ></span>
                  {/* <input
                    value={formattedDates[1]}
                    disabled
                    onChange={(e: any) => setEndInputTime(e.target.value)}
                    placeholder="2025-1-1-10:10"
                    style={{ fontFamily: "PingFang SC", textAlign: "center" }}
                    className="w-[12rem] h-[2.67rem] rounded-[0.9rem] bg-[#ECF0F4] text-[1.2rem] "
                  /> */}
                  <span
                    className="w-[12rem] h-[2.67rem] rounded-[0.9rem] bg-[#ECF0F4] text-[1.2rem] text-center lint-height-[2.67rem]"
                    style={{ lineHeight: '2.67rem', color: chooseTimeType !== 'end' ? '#666' : '#0072EF' }}
                    onClick={() => {
                      setChooseTimeType('end')
                    }}
                  >
                    {dayjs(timeList[1]).format('YYYY-MM-DD')}-{dayjs(timeList[1]).format('HH:mm')}
                  </span>
                </div>
              </div>
              <div className="customStyle">
                <Calendar
                  defaultValue={new Date()}
                  renderDate={renderDate}
                  className={`calendar-set-box`}
                  selectionMode="single"
                  allowClear
                  max={new Date()}
                  min={new Date(1900, 0, 1)}
                  prevMonthButton={prevMonthButton}
                  prevYearButton={prevYearButton}
                  nextMonthButton={nextMonthButton}
                  nextYearButton={nextYearButton}
                  onChange={(dataRange: any) => {
                    const date = new Date(dataRange)
                    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    if (chooseTimeType === 'start') {
                      const hourse = dayjs(timeList[0]).format('HH:mm')
                      const date = `${dateStr} ${hourse}`
                      if (!checkoutTime(date)) {
                        setTimeList([date, timeList[1] || null])
                        setDataRange(dataRange)
                      }
                    } else {
                      const hourse = dayjs(timeList[1]).format('HH:mm')
                      const date = `${dateStr} ${hourse}`
                      if (!checkoutTime(date)) {
                        setTimeList([timeList[0] || null, date])
                        setDataRange(dataRange)
                      }
                    }
                  }
                  }
                />
              </div>
              <div className="flex justify-center items-center pb-[1rem]">
                <Select
                  showSearch={false}
                  style={{
                    width: "5.9rem",
                    height: "2.9rem",
                    marginRight: "0.7rem",
                    paddingLeft: "0.6rem",
                    marginTop: ""
                  }}
                  placeholder="10"
                  optionFilterProp="children"
                  value={hours}
                  onChange={(value) => {
                    if (chooseTimeType === 'start') {
                      const date = new Date(timeList[0])
                      date.setHours(+value)
                      if (!checkoutTime(date)) {
                        setTimeList([
                          date,
                          timeList[1],
                        ])
                        setHours(value as string)
                      }
                    } else {
                      const date = new Date(timeList[1])
                      date.setHours(+value)
                      if (!checkoutTime(date)) {
                        setTimeList([
                          timeList[0],
                          date.toISOString(),
                        ])
                        setHours(value as string)
                      }
                    }
                  }}
                >
                  <Select.Option value={"时"} disabled>
                    <div className="flex justify-center">时</div>
                  </Select.Option>
                  {[...Array(24)].map((_, index) => (
                    <Select.Option
                      key={`${index}_v4`}
                      value={index.toString()}
                    >
                      <div className="flex justify-center ">
                        {index.toString().padStart(2, "0")}
                      </div>
                    </Select.Option>
                  ))}
                </Select>{" "}:{" "}
                <Select
                  showSearch={false}
                  style={{
                    width: "5.9rem",
                    height: "2.9rem",
                    marginLeft: "0.7rem",
                  }}
                  placeholder="10"
                  optionFilterProp="children"
                  value={minutes}
                  onChange={(value) => {
                    if (chooseTimeType === 'start') {
                      const date = new Date(timeList[0])
                      date.setMinutes(+value)
                      if (!checkoutTime(date)) {
                        setTimeList([
                          date,
                          timeList[1],
                        ])
                        setMinutes(value as string)
                      }
                    } else {
                      const date = new Date(timeList[1])
                      date.setMinutes(+value)
                      if (!checkoutTime(date)) {
                        setTimeList([
                          timeList[0],
                          date.toISOString(),
                        ])
                        setMinutes(value as string)
                      }
                    }
                  }}
                >
                  <Select.Option value={"分"} disabled>
                    <div className="flex justify-center">分</div>
                  </Select.Option>
                  {[...Array(60)].map((_, index) => (
                    <Select.Option key={`${index}_v5`} value={index.toString()}>
                      <div className="flex justify-center">
                        {index.toString().padStart(2, "0")}
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </Popup >
          {< Bottom />}
        </div >
      )}
    </>
  );
}
