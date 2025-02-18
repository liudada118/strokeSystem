import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";

import segment from '@/assets/image/segment.png'
import low from '@/assets/image/low.png'
import high from '@/assets/image/high.png'
import medium from '@/assets/image/medium.png'


import "./index1.scss";
import './index copy.scss'

// import "./index1.scss";
import HeatmapH from "@/components/heatmap/HeatmapRef";
// import { NoRender, personDate } from "../realReport";
// import { calAver, changePxToValue, dataReport, getMonthStartEndTimestamps, moveValue, netRepUrl, netUrl, numToTime, rateArrToHeart, rateToHeart, reportInstance, stampToTime, timeArrToIntegerTimer, timeArrToTimer } from "../../assets/util";
import { CategoryChart, Charts, CurveChart, SleepChart, SleepDateTypeChart } from "@/components/charts";
import { Button, DatePicker, Divider, message, Modal, Table, theme } from "antd";
import nullImg from '../../assets/image/null.png'
import dayjs from "dayjs";
import Heatmap from "@/components/heatmap/HeatmapRef";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { GetProps, useSelector } from "react-redux";
import NurseRecord from "./nurseRecord/NurseRecord";
import DayNurseReport from "./dayNurseReport/DayNurseReport";
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
import TurnReportProps from "./turnReportProps/TurnReport";
import NurseCharts from "./reportComponents/nurseCharts/NurseCharts";
import HeatmapReport from "./reportComponents/heatmapReport/HeatmapReport";
import LeftContent from "./dayReportComponent/leftContent/LeftContent";
import FirstItem from "./dayReportComponent/rightContent/firstItem/FirstItem";
import SecondItem from "./dayReportComponent/rightContent/secondItem/SecondItem";
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { instance, Instancercv } from "@/api/api";
import { fakeData } from "../fakeData";
import { getMonthStartEndTimestamps, stampToTime } from "@/utils/timeConvert";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { CardWithoutTitle } from "../Monitor/realReport/Card";
const { RangePicker } = DatePicker;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const dateFormat = 'YYYY-MM-DD';
const realArr = [
  { title: "睡眠时长", util: null, name: "sleeping_times" },
  { title: "入睡时刻", util: null, name: "sleep_time" },
  { title: "离床时刻", util: null, name: "wakeup_time" },
  {
    title: "睡眠中断次数", util: "次",
    name: "sleep_stop_times"
  },
  { title: "呼吸暂停", util: "次", name: "breath_stop_f" },
  { title: "中风风险", util: "级", name: "stroke_risk" },
  { title: "浅睡时长", util: null, name: "light_sleep_time" },
  { title: "深睡时长", util: null, name: "deep_sleeping_times" },
];
let startMatrix: any = [], endMatrix: any = []
const contentStrArr = ['记录褥疮的类型、大小、位置', '清洁风险区域', '调整体位', '更换床单', '更换衣物']
const sleepArr = ['正常', '发红', '水泡', '破溃']
const colorArr = ["#FFD900", "#4AD75C", "#18D0FC", "#4789F7 "];
const columns = [
  {
    title: '序号',
    dataIndex: 'serialNum',
    key: 'serialNum',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '护理编号',
    dataIndex: 'chargeNum',
    key: 'chargeNum',
  },
  // {
  //   title: '床号',
  //   dataIndex: 'bedNum',
  //   key: 'bedNum',
  // },
  // {
  //   title: '压力分布',
  //   dataIndex: 'careImg',
  //   key: 'careImg',
  //   render: (record: any) => {

  //     return (
  //       <div>
  //         <img className="careImg" src={record ? segment : unsegment} style={{ height: '2rem', width: '2rem' }} />
  //       </div>
  //     )
  //   }
  // },
  {
    title: '护理内容',
    dataIndex: 'careContent',
    key: 'careContent',
    render: () => {
      return (
        <div>
          <img className="contentImg" src={segment} style={{ height: '2rem', width: '2rem' }} />
        </div>
      )
    }
  },
  {
    title: '分析结果',
    dataIndex: 'result',
    key: 'result',
  }
];

const columnsStroke = [
  {
    title: '序号',
    dataIndex: 'serialNum',
    key: 'serialNum',
  },
  {
    title: '触发时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '触发次数',
    dataIndex: 'strokeFreq',
    key: 'strokeFreq',
  },
  {
    title: '间隔时间',
    dataIndex: 'interTime',
    key: 'interTime',
  },
]

{/* <span>序号</span>
            <span>开始时间</span>
            <span>结束时间</span>
            <span>护理员编号</span>
            <span>床号</span>
            <span>护理前后压力分布图</span>
            <span>护理内容</span> */}

export const scrollToAnchor = (anchorName: any) => {
  if (anchorName) {
    // 找到锚点
    let anchorElement = document.getElementById(anchorName);
    // 如果对应id的锚点存在，就跳转到锚点
    if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  }
}
interface personCard {
  patientName: any;
  img: any;
  roomNum: any;
  age: any;
  chargeMan: any;
  userTime: any;
  did: any;
  pressureInjury: any;
  type: any;
  sex: any;
  sensorName: any;
  rank: any;
  checkedList: any;
  nursePeriod?: any;
  nurseStart?: any
  nurseEnd?: any
  leaveBedAlarm?: any
  leaveBedEnd?: any
  leaveBedStart?: any
  leaveBedPeriod?: any
  fallbedAlarm: any
  fallbedStart: any,
  fallbedEnd: any,
  situpEnd: any,
  situpStart: any,
  situpAlarm: any,
  leavebedParam: any
}

interface noTypePerson {
  img: string;
  roomNum: string;
  age: string;
  chargeMan: string;
  userTime: string;
  did?: string;
  sex?: string;
  name: string;
  getEquipInfo: Function
  sensorName: string
  rank?: string
}

interface personDate extends noTypePerson {
  img: string;
  date: number;
  getEquipInfo: Function
  cellRender?: Function
  dateArr?: any
  select?: any
  person: personCard
  width?: any
}

export default function DayReport() {

  const param = useParams()
  const sensorName = param.id
  const equipInfo = useSelector((state) => selectEquipBySensorname(state, sensorName))

  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''
  let navigate = useNavigate();
  let location: any = useLocation();
  const [turnNumber, setTurnNumber] = useState(0)
  const [turnMax, setTurnMax] = useState(0)
  const [posMax, setPosMax] = useState(0)
  const [posChangeHour, setPosChangeHour] = useState(0)
  const [dayReport, setDayReport] = useState(true)
  const [posChangeDay, setPosChangeDay] = useState(0)
  const [date, setDate] = useState(new Date().getTime());
  const [matrixObj, setMatrixObj] = useState<any>({ startMatrix: new Array(1024).fill(0), endMatrix: new Array(1024).fill(0), })
  const [data, setData] = useState<any>({});
  const [dayDate, setDayDate] = useState(new Date().setHours(0, 0, 0, 0))
  const [onbedDate, setOnBedDate] = useState(0)
  const [sleepNums, setSleepNums] = useState<number>(0);
  const [sleepNowNum, setSleepNowNum] = useState<number>(1);
  const [dateArr, setDateArr] = useState<any>([])
  const [allTime, setAllTime] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRiskOpen, setIsModalRiskOpen] = useState(false);
  const [isModalContentOpen, setIsModalContentOpen] = useState(false);
  const [isModalExportOpen, setIsModalExportOpen] = useState(false);
  const [contentImg, setContentImg] = useState([])
  const [sleep, setSleep] = useState<any>([])
  const [remark, setRemark] = useState<any>([])
  const [contentArr, setContentArr] = useState<any>([])
  const [exportDate, setExportDate] = useState<any>([])
  const heatmapStart = useRef<any>()
  const heatmapEnd = useRef<any>()
  const [nurse, setNurse] = useState(0)
  const [alarm, setAlarm] = useState(0)
  const [missNurse, setMissNurse] = useState(0)
  const [tableLoading, setTableLoading] = useState(true)
  const [storke, setStroke] = useState<any>({})
  const [onbedList, setOnbedList] = useState<any>([])
  const [onbed, setOnbed] = useState<any>({})
  const [bodymove, setBodymove] = useState<any>({})
  const [heatmapData, setHeatmapData] = useState<Array<any>>([{}])
  const [strokeFlag, setStrokeFlag] = useState(false)
  const [healthyFlag, setHealthyFlag] = useState(false)
  const [nurseReportFlag, setNueseReportFlag] = useState(false)
  const heatMapRef = useRef<any>()
  const [showHeartOrRate, setShowHeartOrRate] = useState('heart')
  const [showSleepType, setShowSleepType] = useState('segment')
  const [onbedTime, setOnbedTime] = useState(0)
  // let cellRender:any 
  const handleOk = () => {

    setIsModalOpen(false);

  }

  const handleCancel = () => {

    setIsModalOpen(false);
  }

  const handleRiskOk = () => {

    setIsModalRiskOpen(false);

  }

  const handleRiskCancel = () => {

    setIsModalRiskOpen(false);
  }

  const handleContentOk = () => {

    setIsModalContentOpen(false);

  }

  const handleContentCancel = () => {

    setIsModalContentOpen(false);
  }

  const handleExportOk = () => {

    setIsModalExportOpen(false);

  }

  const handleExportCancel = () => {

    setIsModalExportOpen(false);
  }

  const setDateLocation = () => {

    const dropdown = document.querySelector('.ant-picker-dropdown') as HTMLElement
    const pickerContainer = document.querySelector('.ant-picker-panel-container') as HTMLElement

    // .ant-picker-panel-container
    // console.log( document.querySelector('.ant-picker-dropdown').style)
    if (dropdown && dropdown.style && dropdown.style.inset) {
      const splitArr = dropdown.style.inset.split(' ')
      // alert( splitArr[splitArr.length - 1])
      if (parseInt(splitArr[splitArr.length - 1]) < 0) {
        pickerContainer.style.transform = 'translateX(22%)'
      } else {
        pickerContainer.style.transform = 'translateX(-22%)'
      }
    }
  }

  const [dataSource, setDataSource] = useState([])
  const [pageRecords, setPageRecords] = useState<any>([])
  const [strokeSource, setStrokeSource] = useState([])
  const [outoffbed, setOutoffbed] = useState(0)
  const [users, setUsers] = useState([])
  useEffect(() => {
    if (sensorName) {
      getReport(dayDate + 12 * 60 * 60 * 1000)
      getNurseReport(dayDate + (24 * 60 - 1) * 60 * 1000)
      fetchMouthReport(dayjs(dayDate).format(dateFormat))
      getNursePersons(sensorName)
      getNurseTimeReport(dayDate + 12 * 60 * 60 * 1000)
    }
    // setDateLocation()
  }, [dayDate, sensorName]);



  const getNursePersons = (did: string) => {
    Instancercv({
      method: "get",
      url: "/organize/getNursingsBydid",
      params: {
        deviceId: did,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {

      const arr = res.data.nursingAssisstantInfo.map((a: any) => a.nickname)
      setUsers(arr)
    })
  }

  const getReport = (date: number) => {



    instance({
      method: "get",
      url: "/sleep/getSleepReport",
      params: {
        deviceName: sensorName,
        startTimestamp: date - 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
        endTimestamp: date,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {

      let data = res.data
      if (data.errCode == 666) {

        if (sensorName == 'KgvDXUvdEs9M9AEQDcVc') {
          // fakeData.bed.report
          data = fakeData.bed.report
          setData(data)
          setDayReport(true)

        }

        initReport(data)

      } else {

        setDayReport(false)

        if (sensorName == 'KgvDXUvdEs9M9AEQDcVc') {
          // fakeData.bed.report
          data = fakeData.bed.report
          setData(data)
          setDayReport(true)
          initReport(data)
        }
      }
    });
  }

  function initReport(data:any){
    if (sensorName == 'KgvDXUvdEs9M9AEQDcVc') {
      // fakeData.bed.report
      data = fakeData.bed.report
      setData(data)
      setDayReport(true)

    }

    setDayReport(true)
    if (data.sleeping_position[0]) data.sleeping_position[0] = data.sleeping_position[0].some((a: number) => a < 0) ? new Array(16).fill(0) : data.sleeping_position[0]

    let pos = 0
    for (let i = 1; i < data.sleeping_position[0].length; i++) {
      if (data.sleeping_position[0][i] - data.sleeping_position[0][i - 1] != 0) {
        pos++
      }
    }
    // setPosChangeDay
    let hourend = (data.inbed_timestamp_list[data.inbed_timestamp_list.length - 1]) < 19 ? (data.inbed_timestamp_list[data.inbed_timestamp_list.length - 1]) + 24 : (data.inbed_timestamp_list[data.inbed_timestamp_list.length - 1])
    let hourstart = (data.inbed_timestamp_list[0])

    const hour = (hourend - hourstart)
    setPosChangeHour(Math.round(pos / hour))
    setPosChangeDay(pos)


    setData(data);

    const sleepTime = data.sleeping_times
    const sleepProp = data.sleep_state.map((a: any) => {
      if (a[0] == 2 || a[0] == 3) {
        return a[1]
      } else {
        return 0
      }
    })
    const wideProp = data.sleep_state.map((a: any) => {
      if (a[0] == 1) {
        return a[1]
      } else {
        return 0
      }
    })
    // console.log(wideProp)

    const onbedtime = sleepTime * (sleepProp.reduce((a: any, b: any) => a + b, 0) + wideProp.reduce((a: any, b: any) => a + b, 0)) / (sleepProp.reduce((a: any, b: any) => a + b, 0))


    setOnbedTime(onbedtime)



    let sleepNums = 0;
    data.sleep_state.forEach((a: any) => {
      sleepNums += a[1];
    });
    setSleepNums(sleepNums);
    const allTime = data.deep_sleeping_times + data.light_sleep_time;
    setAllTime(allTime);

  }

  const getNurseReport = (date: number) => {
    const token = localStorage.getItem('token') || ''
    instance({
      method: "get",
      url: "/sleep/nurse/getRecords",
      params: {
        deviceName: sensorName,
        startTime: new Date(date).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000,
        endTime: date - 24 * 60 * 60 * 1000,
        pageNum: 1,
        pageSize: 99
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {

      setTableLoading(false)

      // 获取护理
      const arr = res.data.page.records
      setPageRecords(arr)



      const objArr1: any = []

      let turnNumber = 0, turnMax = 0
      let posArr = new Array(arr.length).fill(0)
      arr.forEach((a: any, index: number) => {
        let obj: any = {}

        obj.startTime = stampToTime(a.timeMills)
        obj.plan = stampToTime(a.timeMillsEnd)
        if (a.posture == 1) {
          obj.left = true
        } else if (a.posture == 0) {
          obj.center = true
        } else {
          obj.right = true
        }
        obj.nurseNum = a.chargeMan
        obj.drRemark = a.remark
        objArr1.push(obj)
        posArr[a.posture] = posArr[a.posture] + 1

        if (index >= 1) {
          if (a.posture != arr[index - 1].posture) {
            turnNumber++
          }
          turnMax = Math.max(arr[index - 1].timeMillsEnd - a.timeMillsEnd, turnMax)

        }

        setTurnNumber(turnNumber)

      })

      setTurnMax(turnMax)
      setPosMax(posArr.indexOf(Math.max(...posArr)))

    })
  }

  const getNurseTimeReport = (date: number) => {
    const token = localStorage.getItem('token') || ''
    instance({
      method: "get",
      url: "/sleep/nurse/getRecords",
      params: {
        deviceName: sensorName,
        startTime: date - 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
        endTime: date,
        pageNum: 1,
        pageSize: 99
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {

      // setOnbedTime(Number(res.data.todayOnbedTime) * 1000)
      setNurse(res.data.nursingCount)
      setAlarm(res.data.todayAlarmCount)
      setMissNurse(res.data.missNursingCount)
      setStroke(res.data.strokeAlarmList)
      setOutoffbed(res.data.outoffbedCount)

      const onbedList = res.data.onbedList

      setOnbedList(onbedList)

      const onbedArr = onbedList.map((a: any) => {
        if (a.onbed >= 1) {
          return 1
        } else {
          return a.onbed
        }
      })
      const onbedStampArr = onbedList.map((a: any) => dayjs(a.time).format('HH:mm'))
      setOnbed({ onbedArr, onbedStampArr })

    }).catch((err) => {
      alert(err)
    })
  }

  const style: React.CSSProperties = {
    border: `1px solid ${theme.useToken().token.colorPrimary}`,
    borderRadius: '50%',
  };

  const cellRender: any = (current: any, info: any) => {

    if (info.type !== 'date') {
      return info.originNode;
    }
    if (typeof current === 'number' || typeof current === 'string') {
      return <div className="ant-picker-cell-inner">{current}</div>;
    }
    return (
      <div className="ant-picker-cell-inner" style={dateArr.includes(`${current.year()}-${current.month() + 1 < 10 ? `0${current.month() + 1}` : current.month() + 1}-${current.date() < 10 ? `0${current.date()}` : current.date()}`) ? style : {}}>
        {current.date()}
      </div>
    );
  };

  function fetchMouthReport(date: any) {
    const dateObj = getMonthStartEndTimestamps(date)
    instance({
      method: "get",
      url: "/sleep/getWhetherGenerate",
      params: {
        deviceName: sensorName,
        startTimestamp: dateObj.startOfMonthTimestamp,
        endTimestamp: dateObj.endOfMonthTimestamp,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((e) => {

      const dateArr = e.data.data.map((a: any) => a.today)
      setDateArr(dateArr)
    })
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today

    return current && !dateArr.includes(dayjs(current).format(dateFormat));
  };
  const [buttonFlag, setFlag] = useState(false)
  const getBlobPng = () => {
    setFlag(false)

    const node = document.querySelector(".dataContent");

    if (node) {
      domtoimage.toBlob(node).then((blob) => {

        // a
        // 调用file-save方法 直接保存图片
        saveAs(blob, `日报-${equipInfo.patientName}-${dayjs(dayDate).format('DD/MM/YYYY')}`)
      }).catch(err => {
        console.log(err)
      })
    }



  }


  return (
    <>
      <Modal title="压力分布图" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="singleNurseContent">
          <div style={{ display: 'flex' }}>

            {!location.pathname.includes('/reportsmall') ? <> <div style={{ flex: '0 0 calc((100 - 0.5rem) / 2)', marginRight: '0.5rem' }}>
              <Heatmap ref={heatmapStart} arr={matrixObj.startMatrix} index={1} />
              <div style={{ fontWeight: 'bold', textAlign: 'center' }}>护理前</div>
            </div>

              <div style={{ flex: '0 0 calc((100 - 0.5rem) / 2)' }} >

                <Heatmap ref={heatmapEnd} arr={matrixObj.endMatrix} index={2} />
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>护理后</div>
              </div> </> : ''}
          </div>

          <h2>护理内容</h2>
          <ul>{contentStrArr.map((a, index) => {
            if (contentArr.includes(String(index))) {
              return (
                <li>{a}</li>
              )
            }
          })}</ul>

          <h2>睡姿</h2>
          <div>{sleep ? sleep : '未填写'}</div>
          <h2>备注</h2>
          <div>{remark ? remark : '未填写'}</div>
          <h2>上传图片</h2>
          {contentImg ? contentImg.map((a, index) => {
            return (
              <img style={{ width: '50%' }} src={a} alt="" />
            )
          }) : '暂无上传'}
        </div>
      </Modal>

      <Modal title="了解脑卒中潜在风险" open={isModalRiskOpen} onOk={handleRiskOk} onCancel={handleRiskCancel}>
        <p>脑卒中(脑梗、中风、脑血栓)目前是我国居民死亡第一位原因，每5位死者中至少有1人死于脑卒中。3分之1的脑卒中病人是夜间发作。</p>
        <p>AI模型:</p>
        <p><span style={{ fontWeight: 'bold', color: '#b82c20' }}> <img style={{ height: '1rem', verticalAlign: 'baseline' }} src={high} alt="" /> 高风险：</span>特殊体动频发，整晚多达90次以上，并伴有持续时间超过50秒两次以上，系统判定为三级风险。建议立即咨询医生进行检查。
        </p>
        <p>
          <span style={{ fontWeight: 'bold', color: '#f1df3f' }}> <img style={{ height: '1rem', verticalAlign: 'baseline' }} src={medium} alt="" /> 中风险：</span>特殊体动较为频发，整晚60次-90次，并伴有持续时间超过30秒两次以上，系统判定为二级风险。建议咨询医生进行检查特殊体动偶发。
        </p>
        <p><span style={{ fontWeight: 'bold', color: '#86da66' }}><img style={{ height: '1rem', verticalAlign: 'baseline' }} src={low} alt="" /> 低风险：</span>整晚小于60次，无持续时间超过30秒体动，系统判定为一级风险。建议保持关注。
          脑卒中(脑梗、中风、脑血栓)目前是我国居民死亡第一位原因，每5位死者中至少有1人死于脑卒中。3分之1的脑卒中病人是夜间发作。</p>

      </Modal>

      <Modal title="护理内容" open={isModalContentOpen} onOk={handleContentOk} onCancel={handleContentCancel}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>

        </div>
      </Modal>

      <div className="fixDataSelectContent pf">
        <div className="dataSelectContent">
          <div className="dataSelect">
            <div className="clickSelectDate">
              <CaretLeftOutlined onClick={() => {
                setDayDate(dayDate - 24 * 60 * 60 * 1000)
              }} />
              <div className="clickDateValue">{`${dayjs(new Date(dayDate)).format('YYYY-MM-DD')}`}</div>
              <CaretRightOutlined onClick={() => {
                if (dayDate < new Date().setHours(0, 0, 0, 0)) {
                  setDayDate(dayDate + 24 * 60 * 60 * 1000)
                }

              }} style={{ color: dayDate >= new Date().setHours(0, 0, 0, 0) ? '#D8D8D8' : 'unset' }} />
            </div>
            <DatePicker placement='bottomLeft' cellRender={cellRender} inputReadOnly

              onClick={() => {
                setDateLocation()
              }}

              className="dataSelectPicker"
              onPanelChange={(value, mode) => {
                console.log(value.month() + 1, value.year(), mode)
                const date = `${value.year()}-${value.month() + 1}-5`
                fetchMouthReport(date)
              }}

              onChange={(e, str: any) => {
                console.log(new Date(dayDate).getMonth() != new Date(str).getMonth())
                if (new Date(dayDate).getMonth() != new Date(str).getMonth()) {
                  fetchMouthReport(str)
                }

                setDayDate(new Date(new Date(str).toLocaleDateString()).getTime())

              }}
              // value={dayjs(new Date(dayDate))} 
              defaultValue={dayjs(new Date(dayDate))} format={dateFormat} />


          </div>
          <Button onClick={getBlobPng} className='action'>导出</Button>
        </div>
      </div>
      <div className="dayContent">
        {!dayReport ? <div className="reprotMask">
          <div style={{}}>
            暂无报告,睡一晚再来看看吧
          </div>

        </div> : ''}
        <div className="dayPc">
          {/* {<div className="dayLeft">
            <LeftContent users={users} props={equipInfo} />
          </div>} */}

          <div className="dayRight">

            {!nurseReportFlag ? <>
              <FirstItem dayData={dayDate} stroke={storke} posChangeHour={posChangeHour} posChangeDay={posChangeDay} onbedList={onbedList} bodymove={bodymove} data={data} />
              <SecondItem outBed={outoffbed} data={data} alarm={alarm} nurse={nurse} sleepNums={sleepNums} posChangeDay={posChangeDay} posChangeHour={posChangeHour} allTime={allTime} />
              {!location.pathname.includes('small') ?

                <div className="thirdItem">
                  <HeatmapReport dayDate={dayDate} sensorName={sensorName} />
                  <div style={{ flex: '0 0 66%', }}>
                    <TurnReportProps changeFlag={setNueseReportFlag} pageRecords={pageRecords} date={dayDate} sensorName={sensorName} />
                  </div>

                </div> : ''}
              <div className="turnContent">
                {/* <div style={{width : '66%'}}> */}
                <CardWithoutTitle>
                  <NurseCharts dayData={dayDate} outBed={outoffbed} max={turnMax} onbedList={onbedList} onbedTime={onbedTime} changeFlag={setNueseReportFlag} pageRecords={pageRecords} dataSource={dataSource} onbed={onbed} />
                </CardWithoutTitle>{/* </div> */}
              </div>
              <div style={{ fontSize: '0.8rem' }}>注意：这些结果并不是诊断，如有不适请及时就医。</div>
            </> :
              // <CardWithoutTitle>
              <NurseRecord changeFlag={setNueseReportFlag} heatmap={false} dayDate={dayDate} />
              // </CardWithoutTitle>
            }
          </div>
        </div>
      </div >
    </>
  );
}


