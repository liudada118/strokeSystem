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
import {
  CaretDownOutlined,
  LeftOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { useGetWindowSize } from "../../hooks/hook";
import zhCN from "antd/locale/zh_CN";
// import Kdsd from './messageDatePicker'

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
  new Date(new Date().toLocaleDateString()).getTime() + 86400000,
];
export default function Message() {
  const navigator = useNavigate();
  const phone = localStorage.getItem("phone") || "";
  const token = localStorage.getItem("token") || "";
  const [total, setTotal] = useState(0);
  const [todayAlarmCount, setTodayAlarmCount] = useState(0);
  const WindowSize = useGetWindowSize();

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
    patientName: "",
    roomNum: "",
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
    initMessagesPage(res);
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
      return res;
    } catch (err) {}
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
    } catch (err) {}
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
  const [otherRemindersType, setOtherRemindersType] = useState("");
  const [selectType, setSelectType] = useState("patientName");
  const [fale, seFalse] = useState(false);
  // 搜索框
  const [patientNameRoomNum, setpatientName] = useState<any>("");
  // useEffect(() => {
  //   if (!patientNameRoomNum) {
  //     setParams({
  //       ...params,
  //       pageNum: 1,
  //       pageSize: 10,
  //     });
  //     getMessage({
  //       ...params,
  //       pageNum: 1,
  //       pageSize: 10,
  //     });
  //   }
  // }, [patientNameRoomNum]);

  const onBlur = () => {
    setMobileData([]);
    if (selectType === "patientName") {
      loadMore({
        ...params,
        pageNum: 1,
        patientName: patientNameRoomNum,
      }, []);
    } else if (selectType === "roomNum") {
      loadMore({
        ...params,
        pageNum: 1,
        roomNum: patientNameRoomNum,
      }, []);
    }
  };
  // 标题切换
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const defaultRange: [Date, Date] = [
    dayjs().toDate(),
    dayjs().add(2, "day").toDate(),
  ];
  const [dataRange, setDataRange] = useState<any>([]); //日期
  const [hours, setHours] = useState<string>("10"); // 小时
  const [minutes, setMinutes] = useState<string>("10"); // 分钟
  const [startInputTime, setStartInputTime] = useState<any>(null);
  const [endInputTime, setEndInputTime] = useState<any>(null);
  const regex = /^\d{4}-\d{1,2}-\d{1,2}-\d{2}:\d{2}$/;
  // const timeSearch = () => {
  //   console.log(dataRange, startInputTime, endInputTime, '..................endInputTimeendInputTime');
  //   const startTimestamp = dayjs(dataRange[0]).hour(Number(hours)).minute(Number(minutes)).valueOf();
  //   const endTimestamp = dayjs(dataRange[1]).hour(Number(hours)).minute(Number(minutes)).valueOf();
  //   const startTimestampInput: any = dayjs(startInputTime).valueOf();
  //   const endTimestampInput: any = dayjs(dataRange[1]).valueOf();
  //   if (!dataRange && !(startInputTime && endInputTime)) return message.error('请输入时间或者选择时间范围')
  //   if (dataRange) {
  //     setParams({
  //       ...params,
  //       startMills: startTimestamp,
  //       endMills: endTimestamp,
  //     });
  //     getMessage({
  //       ...params,
  //       startMills: startTimestamp,
  //       endMills: endTimestamp,
  //     });
  //     return
  //   }
  //   if (!startInputTime && !endInputTime) return message.error('开始和结束时间不能为空')
  //   if (startInputTime && endInputTime) {
  //     setParams({
  //       ...params,
  //       startMills: startTimestampInput,
  //       endMills: endTimestampInput,
  //     });
  //     getMessage({
  //       ...params,
  //       startMills: startTimestampInput,
  //       endMills: endTimestampInput,
  //     });
  //   }
  //   // if (startTimestampInput > endTimestampInput && endTimestampInput > new Date().getTime()) return message.error('开始和结束时间不能大于当前时间')
  //   // if (!(regex.test(startInputTime) && regex.test(endInputTime))) return message.info('请输入正确的时间格式,示例 2025-1-1-10:10')
  //   // if (dataRange || (startInputTime && endInputTime)) {

  //   // }
  //   setVisible(false)
  // };
  const today = new Date();
  const timeSearch = () => {
    const startTimestamp = dayjs(dataRange[0])
      .hour(Number(hours))
      .minute(Number(minutes))
      .valueOf();
    const endTimestamp = dayjs(dataRange[1])
      .hour(Number(hours))
      .minute(Number(minutes))
      .valueOf();
    const startTimestampInput = dayjs(startTimestamp).valueOf();
    const endTimestampInput = dayjs(endTimestamp).valueOf();
    console.log(startTimestampInput, startTimestamp, endTimestamp, 'endTimestamp...')
    // 检查 dataRange 是否存在
    if (dataRange && dataRange.length > 0) {
      // setParams({
      //   ...params,
      //   startMills: startTimestamp,
      //   endMills: endTimestamp,
      // });
      // getMessage({
      //   ...params,
      //   startMills: startTimestamp,
      //   endMills: endTimestamp,
      // });
      setMobileData([]);
      loadMore({
        ...params,
        pageNum: 1,
        startMills: startTimestampInput,
        endMills: endTimestampInput,
      }, []);
      setVisible(false);
      return;
    }
    if (!startInputTime || !endInputTime) {
      return message.error("开始和结束时间不能为空");
    }
    if (!regex.test(startInputTime) || !regex.test(endInputTime)) {
      return message.info("请输入正确的时间格式,示例 2025-1-1-10:10");
    }
    if (startTimestampInput >= endTimestampInput) {
      return message.error("开始时间不能大于或等于结束时间");
    }

    if (endTimestampInput > new Date().getTime()) {
      return message.error("结束时间不能大于当前时间");
    }

    // setParams({
    //   ...params,
    //   startMills: startTimestampInput,
    //   endMills: endTimestampInput,
    // });
    // getMessage({
    //   ...params,
    //   startMills: startTimestampInput,
    //   endMills: endTimestampInput,
    // });

    setMobileData([]);
    loadMore({
      ...params,
      pageNum: 1,
      startMills: startTimestampInput,
      endMills: endTimestampInput,
    }, []);

    setVisible(false);
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
    console.log(pageNum, "pageNum....");
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
                          className={`btn  ${
                            index + 1 === titleId ? "on" : ""
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
                          {" "}
                          {todayAlarmCount}{" "}
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
          <Title
            titleChangeGetMessage={(item: any) => getSearchValue(item)}
          ></Title>
          <div className="MessageYiDong">
            <LeftOutlined
              onClick={() => navigator("/")}
              className="MessageYiDongFanHui"
            />
            <div className="MessageYiDongDivInput">
              <Select
                className="MessageYiDOngTitlesearchSelect"
                defaultValue={selectType}
                style={{ width: 80 }}
                onChange={(e) => {
                  setSelectType(e);
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
                onChange={(e) => setpatientName(e.target.value)}
                placeholder="请输入姓名/床号"
                onBlur={onBlur}
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
            bodyStyle={{ height: "66vh", borderRadius: "0.75rem 0.75rem 0 0" }}
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
                  <input
                    onChange={(e: any) => setStartInputTime(e.target.value)}
                    placeholder="2025-1-1-10:10"
                    style={{ fontFamily: "PingFang SC", textAlign: "center" }}
                    className="w-[12rem] h-[2.67rem] rounded-[0.9rem] bg-[#ECF0F4] text-[1.4rem] "
                  />
                  <input
                    onChange={(e: any) => setEndInputTime(e.target.value)}
                    placeholder="2025-1-1-10:10"
                    style={{ fontFamily: "PingFang SC", textAlign: "center" }}
                    className="w-[12rem] h-[2.67rem] rounded-[0.9rem] bg-[#ECF0F4] text-[1.4rem] "
                  />
                </div>
              </div>
              <div className="h-[18.8rem]">
                <Calendar
                  defaultValue={null}
                  renderDate={disableFutureDates}
                  style={{ height: "26.8rem" }}
                  className="calendar-custom"
                  selectionMode="range"
                  allowClear
                  value={dataRange}
                  max={new Date()}
                  min={new Date(1900, 0, 1)}
                  onChange={(dataRange: any) => {
                    setDataRange(dataRange);
                  }}
                />
              </div>
              <div className="flex justify-center">
                <Select
                  showSearch
                  style={{
                    width: "5.9rem",
                    height: "2.9rem",
                    marginRight: "0.7rem",
                    paddingLeft: "0.6rem",
                  }}
                  placeholder="10"
                  optionFilterProp="children"
                  value={hours}
                  onChange={(value) => setHours(value as string)}
                >
                  <Select.Option value={"时"} disabled>
                    <div className="flex justify-center">时</div>
                  </Select.Option>
                  {[...Array(24)].map((_, index) => (
                    <Select.Option
                      key={`${index}_v4`}
                      value={index.toString().padStart(2, "0")}
                    >
                      <div className="flex justify-center ">
                        {index.toString().padStart(2, "0")}
                      </div>
                    </Select.Option>
                  ))}
                </Select>{" "}
                <Select
                  showSearch
                  style={{
                    width: "5.9rem",
                    height: "2.9rem",
                    marginLeft: "0.7rem",
                  }}
                  placeholder="10"
                  optionFilterProp="children"
                  value={minutes}
                  onChange={(value) => setMinutes(value as string)}
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
          </Popup>
          {<Bottom />}
        </div>
      )}
    </>
  );
}
