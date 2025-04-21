import { Button, DatePicker, Table } from 'antd';
import React, { memo, useEffect, useState } from 'react'
// import { netRepUrl, reportInstance, stampToTime } from '../../assets/util';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import segment from '@/assets/image/segment.png'
import returnblack from '@/assets/image/returnblack.png'
import './index.scss'
import DayNurseReport from '../dayNurseReport/DayNurseReport';
import TurnReportProps from '../turnReportProps/TurnReport';
import { stampToTime } from '@/utils/timeConvert';
import { instance } from '@/api/api';
import { useGetWindowSize } from '@/hooks/hook';
import { useSelector } from 'react-redux';
import { selectEquipBySensorname } from '@/redux/equip/equipSlice';
interface nurseRecord {
  dayDate: number

  heatmap: boolean
  changeFlag?: any
}

const { RangePicker } = DatePicker;
const sleepArr = ['正常', '发红', '水泡', '破溃']
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
    render: (res: any) => {

      if (!res) return
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

export const strToObj = (str: any) => {

  const newConfig = str.replaceAll("a1a", "[")
  const newConfig1 = newConfig.replaceAll("b1b", "]")
  const newConfig2 = newConfig1.replaceAll("c1c", "{")
  const newConfig3 = newConfig2.replaceAll("d1d", "}")
  // const newConfig4 = newConfig3.replaceAll("\\", "}")
  return newConfig3
}

function NurseRecord(props: nurseRecord) {

  const param = useParams()
  const sensorName = param.id
  const isMobile = useGetWindowSize()
  const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName))

  const token = localStorage.getItem('token') || ''
  const [dataSource, setDataSource] = useState<Array<any>>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true)
  const [isModalContentOpen, setIsModalContentOpen] = useState(false);
  const [exportDate, setExportDate] = useState<any>([])
  const [contentImg, setContentImg] = useState([])
  const [alarm, setAlarm] = useState(0)
  const [nurse, setNurse] = useState(0)
  const [missNurse, setMissNurse] = useState(0)
  const [sleep, setSleep] = useState<any>([])
  const [remark, setRemark] = useState<any>([])
  const [contentArr, setContentArr] = useState<any>([])
  const [pageRecords, setPageRecords] = useState<any>([])
  let navigate = useNavigate();
  let location: any = useLocation();
  useEffect(() => {
    getNurseReport(props.dayDate + (24 * 60 - 1) * 60 * 1000)
  }, [props.dayDate])

  const getNurseReport = (date: number) => {

    instance({
      method: "get",
      url: "/sleep/nurse/getRecords",
      params: {
        deviceName: sensorName,
        startTime: new Date(date).setHours(0, 0, 0, 0),
        endTime: date,
        pageNum: 1,
        pageSize: 99
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {

      setTableLoading(false)
      const arr = res.data.page.records
      setPageRecords(arr)
      setNurse(res.data.nursingCount)
      setAlarm(res.data.todayAlarmCount)
      setMissNurse(res.data.missNursingCount)
      const objArr: any = []

      arr.forEach((a: any, index: number) => {
        let obj: any = {}
        obj.serialNum = index
        obj.startTime = stampToTime(a.timeMills)
        obj.endTime = stampToTime(a.timeMillsEnd)
        obj.chargeNum = a.chargeMan
        obj.bedNum = a.bedNum
        // obj.changeMan = a.chargeMan
        // obj.careImg = (record: string) => {
        //   <img src={record} width="20px" alt="" />
        // }
        obj.careImg = a.completeFlag
        obj.result = a.completeFlag ? '有效' : '无效'
        obj.careContent = a.nurseContent
        obj.careData = a.extra
        obj.id = a.id
        obj.startMatrix = a.startMatrix
        obj.endMatrix = a.endMatrix
        obj.drName = a.drName
        obj.drRemark = a.remark
        objArr.push(obj)

      })



      setDataSource(objArr)
    })
  }



  return (
    <>
      {!location.pathname.includes('small') ? <>

        {dataSource[0] && dataSource[0].startMatrix != "undefined" && dataSource[0].startMatrix.length && props.heatmap ? <> <DayNurseReport img={dataSource[0].careImg} sensorName={sensorName} startMatrix={JSON.parse('[' + dataSource[0].startMatrix + ']')} endMatrix={JSON.parse('[' + dataSource[0].endMatrix + ']')} />
          <TurnReportProps pageRecords={pageRecords} date={props.dayDate} sensorName={sensorName} />
        </> : ''}
        { }
        <div className="nurseContent" style={{ margin: 0, marginTop: isMobile ? '1rem' : 'unset' }} id="nurseContent">
          <div className="nurseTitleName" style={{ justifyContent: 'unset' }}>
            <img onClick={() => {
              console.log(props.changeFlag)
              if (props.changeFlag) {
                props.changeFlag(false)
              }
            }} style={{ width: '0.8rem', height: "0.8rem", marginRight: '2rem', marginTop: "0.7rem" }} src={returnblack} alt="" /> 护理记录 </div>
          {/* <div onClick={() => {
              navigate(`/turnReport`, {
                state: {
                  contentArr, remark,
                  name: props.name,
                  age: props.age,
                  roomNum: props.roomNum,
                  chargeMan: props.chargeMan,
                  date: props.dayDate,

                  sensorName: props.sensorName,
                  // date : date,
                  router: location.pathname,
                  props: location.state
                },
              });
            }}>
              <img style={{ width: '1.5rem' }} src={turn} alt="" /> 电子翻身卡</div> */}

          <div>
            <Table onRow={(record: any) => {
              return {
                onClick: (event: any) => {
                  // if (event.target.className === 'careImg') {
                  //   setIsModalOpen(true)
                  //   startMatrix = record.startMatrix
                  //   endMatrix = record.endMatrix
                  //   setMatrixObj({
                  //     startMatrix: JSON.parse(record.startMatrix),
                  //     endMatrix: JSON.parse(record.endMatrix),
                  //   })



                  //   if (heatmapStart.current) heatmapStart.current.bthClickHandle(JSON.parse(record.startMatrix))
                  //   if (heatmapEnd.current) heatmapEnd.current.bthClickHandle(JSON.parse(record.endMatrix))



                  //   const data = record.careContent.split('|')
                  //   const imgStr = data[0]
                  //   const contentStr = data[1]
                  //   if (imgStr) {
                  //     const img = imgStr.split('+')[1].split(',')
                  //     setContentImg(img)

                  //   }

                  //   if (contentStr) {
                  //     const contentArr = contentStr.split('+')[1].split(',')
                  //     setContentArr(contentArr)

                  //   }

                  //   if (data[3]) {
                  //     const remark = data[3].split('+')[1]
                  //     setRemark(remark)
                  //   }
                  //   if (data[2]) {
                  //     const sleep = data[2].split('+')[1]
                  //     setSleep(sleepArr[Number(sleep - 6)])
                  //   }


                  // }
                  if (event.target.className === 'contentImg') {
                    setIsModalContentOpen(true)
                    const data = record.careContent.split('|')
                    const nurseData = record.careData.split('|')
                    const imgStr = data[0]
                    const bedImgStr = data[4]
                    const contentStr = data[1]
                    const rateArr = nurseData[0]
                    const heartArr = nurseData[1]
                    const onbedTime = nurseData[2]

                    // data = {
                    //   normalArr: content,
                    //   imgArr: img1,
                    //   selectArr: selectContent,
                    //   inputArr: inputContent
                    // }
                    const normalArr = data.filter((a: any) => {
                      return a.includes('normalArr')
                    })
                    const imgArr = data.filter((a: any) => {
                      return a.includes('imgArr')
                    })
                    const selectArr = data.filter((a: any) => {
                      return a.includes('selectArr')
                    })
                    const inputArr = data.filter((a: any) => {
                      return a.includes('inputArr')
                    })

                    const normalArrRes = strToObj(normalArr[0].split('+')[1])
                    const imgArrRes = strToObj(imgArr[0].split('+')[1])
                    const selectArrRes = strToObj(selectArr[0].split('+')[1])
                    const inputArrRes = strToObj(inputArr[0].split('+')[1])

                    let img, contentArr, remark, rate, heart, onBedTime, bedImg, skin, sleep
                    if (imgStr) {
                      img = imgStr.split('+')[1].split(',')
                      setContentImg(img)
                    }
                    if (contentStr) {
                      contentArr = contentStr.split('+')[1].split(',')
                      setContentArr(contentArr)
                    }
                    if (data[3]) {
                      remark = data[3].split('+')[1]
                      setRemark(remark)
                    }

                    if (data[4]) {
                      bedImg = data[4].split('+')[1]
                      // setRemark(remark)
                    }
                    if (data[5]) {
                      skin = data[5].split('+')[1]
                      // setRemark(remark)
                    }

                    if (data[2]) {
                      sleep = data[2].split('+')[1]
                      setSleep(sleepArr[Number(sleep - 6)])
                    }

                    if (rateArr) {
                      rate = rateArr.split('+')[1].split(',')
                    }

                    if (heartArr) {
                      heart = heartArr.split('+')[1].split(',')
                    }

                    if (onbedTime) {
                      onBedTime = onbedTime.split('+')[1]
                    }


                    // startMatrix = record.startMatrix
                    // endMatrix = record.endMatrix
                    navigate(`/nurseReport`, {
                      state: {
                        startMatrix: JSON.parse('[' + record.startMatrix + ']'),
                        endMatrix: JSON.parse('[' + record.endMatrix + ']'),
                        img, contentArr, remark, rate, heart, onBedTime, bedImg, skin, sleep, normalArrRes, imgArrRes, selectArrRes, inputArrRes,
                        name: equipInfo.name,
                        age: equipInfo.age,
                        roomNum: equipInfo.roomNum,
                        chargeMan: record.chargeNum,
                        date: props.dayDate,
                        startTime: record.startTime,
                        endTime: record.endTime,
                        id: record.id,
                        drRemark: record.drRemark,
                        drName: record.drName,
                        sensorName: sensorName,
                        // date : date,
                        router: location.pathname,
                        props: location.state
                      },
                    });
                  }

                }, // 点击行
                onDoubleClick: (event) => { },
                onContextMenu: (event) => { },
                onMouseEnter: (event) => { }, // 鼠标移入行
                onMouseLeave: (event) => { },
                onSelect: (event) => {

                }
              };
            }} dataSource={dataSource} loading={tableLoading} columns={columns} />


          </div>
          {/* <div id="download">
            <RangePicker showTime={{ format: 'HH' }} onChange={(value, dateString) => {

              setExportDate(dateString)
            }} />  <Button onClick={() => {
              // setIsModalExportOpen(true)
              exportNurse()
            }}>导出</Button>
          </div> */}
        </div>
      </> : ''}</>
  )
}

export default memo(NurseRecord)