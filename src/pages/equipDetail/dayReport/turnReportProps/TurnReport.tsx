import { Table } from 'antd';
import React, { memo, useEffect, useState } from 'react'
import yes from "@/assets/image/yes.png";
import noReport from "@/assets/image/noReport.png";
import './index.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { numToTime, stampToTime } from '@/utils/timeConvert';
import { CardWithoutTitle } from '../../Monitor/realReport/Card';
// import { netRepUrl, numToTime, reportInstance, secToHourstamp, stampToTime } from '../../assets/util';
const columns: any = [

  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: '4rem'
  },
  {
    title: '完成时间',
    dataIndex: 'plan',
    key: 'plan',
    // width : '4rem'
  },
  // {
  //   title: '完成时间',
  //   dataIndex: 'startTime',
  //   key: 'startTime',
  // },
  {
    title: '左侧卧',
    dataIndex: 'left',
    key: 'left',
    align: 'center',
    render: (record: any) => {

      return (
        <div className='flex justify-center'>
          {record ? <img className="careImg" src={yes} style={{ height: '1rem', width: '1rem' }} /> : <img className="careImg" src={noReport} style={{ height: '1rem', width: '1rem' }} />}
        </div>
      )
    }
  },
  {
    title: '仰卧',
    dataIndex: 'center',
    key: 'center',
    align: 'center',
    render: (record: any) => {

      return (
        <div className='flex justify-center'>
          {record ? <img className="careImg" src={yes} style={{ height: '1rem', width: '1rem' }} /> : <img className="careImg" src={noReport} style={{ height: '1rem', width: '1rem' }} />}
        </div>
      )
    }
  },
  {
    title: '右侧卧',
    dataIndex: 'right',
    key: 'right',
    align: 'center',
    render: (record: any) => {
      return (
        <div className='flex justify-center'>
          {record ? <img className="careImg" src={yes} style={{ height: '1rem', width: '1rem' }} /> : <img className="careImg" src={noReport} style={{ height: '1rem', width: '1rem' }} />}
        </div>
      )
    }
  },



  // {
  //   title: '皮肤情况',
  //   dataIndex: 'condition',
  //   key: 'condition',
  // },
  {
    title: '护理员',
    dataIndex: 'nurseNum',
    key: 'nurseNum',
    width: '3rem',
    align: 'center',
  },

];

interface turnReport {
  sensorName: any
  date: number
  pageRecords: any
  changeFlag?: Function

}

const paginationProps = {

  pageSize: 3,
  current: 0,
  total: 8,

}
let posArrCn = ['仰卧', '左侧卧', '右侧卧']
function TurnReportProps(props: turnReport) {
  // const [tableLoading, setTableLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [turnNumber, setTurnNumber] = useState(0)
  const [turnMax, setTurnMax] = useState(0)
  const [posMax, setPosMax] = useState(0)
  let location = useLocation()
  const { logid, id } = location.state || {}
  const navigate = useNavigate()


  // const getNurseReport = (date: number) => {

  //   const token = localStorage.getItem('token') || ''
  //   reportInstance({
  //     method: "get",
  //     url: netRepUrl + "/sleep/nurse/getRecords",
  //     params: {
  //       deviceName: props.sensorName,
  //       startTime: new Date(date).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000,
  //       endTime: new Date(date).setHours(23, 59, 59, 0) - 24 * 60 * 60 * 1000,
  //       pageNum: 1,
  //       pageSize: 99
  //     },
  //     headers: {
  //       "content-type": "application/x-www-form-urlencoded",
  //       "token": token
  //     },
  //   }).then((res) => {

  //     setTableLoading(false)
  //     const arr = res.data.page.records
  //     // setNurse(res.data.nursingCount)
  //     // setAlarm(res.data.todayAlarmCount)
  //     // setMissNurse(res.data.missNursingCount)
  //     console.log(res, '/sleep/nurse/getRecords')
  //     const objArr: any = []
  //     let turnNumber = 0, turnMax = 0
  //     let posArr = new Array(arr.length).fill(0)
  //     arr.forEach((a: any, index: number) => {
  //       let obj: any = {}

  //       obj.startTime = stampToTime(a.timeMills)
  //       obj.plan = stampToTime(a.timeMillsEnd)
  //       if (a.posture == 1) {
  //         obj.left = true
  //       } else if (a.posture == 0) {
  //         obj.center = true
  //       } else {
  //         obj.right = true
  //       }
  //       obj.nurseNum = a.chargeMan
  //       obj.drRemark = a.remark
  //       objArr.push(obj)
  //       posArr[a.posture] = posArr[a.posture] + 1

  //       if (index >= 1) {
  //         if (a.posture != arr[index - 1].posture) {
  //           turnNumber++
  //         }
  //         turnMax = Math.max(arr[index - 1].timeMillsEnd - a.timeMillsEnd, turnMax)

  //       }

  //       setTurnNumber(turnNumber)


  //     })
  //     setTurnMax(turnMax)
  //     setPosMax(posArr.indexOf(Math.max(...posArr)))

  //     setDataSource(objArr)
  //   })
  // }

  useEffect(() => {
    const arr = props.pageRecords//res.data.page.records
    const objArr: any = []
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
      objArr.push(obj)
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

    setDataSource(objArr)
  }, [props.pageRecords])


  // useEffect(() => {
  // getNurseReport(props.date)
  // }, [props.date])

  return (
    <CardWithoutTitle>
      <div className="turnReportContent nurseContent">
        <div className="nurseTitleName">翻身卡
          {/* 后期开发 */}
          {/* <div className="learnMore cursor-pointer" onClick={() => {
            if (props.changeFlag) props.changeFlag(true)
          }}>查看更多</div> */}
        </div>
        <div className="nurseValueItems">
          <div className="nurseValueItem">
            <div className="nurseValueTitle">实际翻身次数</div>
            <div className="nurseValueContent">
              <span className="sleepDataNum"> {turnNumber}</span>
              <span className="sleepDataUtil">次</span>
            </div>
          </div>
          <div className="nurseValueItem">
            <div className="nurseValueTitle">最长时间间隔</div>
            <div className="nurseValueContent"><div className="nurseValueContent">{turnMax ? <>
              {numToTime(turnMax)[1] ? (
                <>
                  <span className="sleepDataNum">{numToTime(turnMax)[1]}</span>
                  <span className="sleepDataUtil">时</span>
                </>
              ) : null}
              <span className="sleepDataNum">{numToTime(turnMax)[0]}</span>
              <span className="sleepDataUtil">分</span>
            </> : <>
              <span className="sleepDataNum">0</span>
              <span className="sleepDataUtil">分</span>
            </>}</div></div>
          </div>
          <div className="nurseValueItem">
            <div className="nurseValueTitle">最频睡姿</div>
            <div className="nurseValueContent sleepDataNumZh" style={{}}>{posArrCn[posMax] ? posArrCn[posMax] : '无'}</div>
          </div>
        </div>
        <Table className='TurnReportPropsStyle' onRow={(record: any) => {

          return {
          };
        }} dataSource={dataSource} columns={columns} />
      </div>
    </CardWithoutTitle>
  )
}

export default memo(TurnReportProps)