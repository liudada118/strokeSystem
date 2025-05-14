import React, { memo, useEffect, useState } from 'react'
import { strToObj } from '../../nurseRecord/NurseRecord'
import { CategoryChart, CurveChart } from '@/components/charts'
import './index.scss'
import dayjs from 'dayjs'
import { objToTidyChartsData, positionArr } from '../../dayReportComponent/rightContent/firstItem/FirstItem'
import { numToTime, stampToTime } from '@/utils/timeConvert'
import { useGetWindowSize } from '@/hooks/hook'
import PCNurseList from '@/pages/equipDetail/nurseprocess/nurseConf/nurseList/index'
import PCNurseConfList from '@/pages/equipDetail/nurseprocess/nurseConf/nurseList/conf_list'
import lanse from '@/assets/images/蓝色.png'
interface nurseChartsProps {
    dataSource: any
    onbed: any
    changeFlag: any
    // width: any
    onbedTime: any
    max: any
    pageRecords: any
    onbedList: any
    outBed: any
    dayData: any
    user?: boolean
    sensorName?: string
}


function isJSON(str: string) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    console.log('It is not a string!')
}

function lessZeroIsZero(arr: any) {
    return arr.map((a: any) => {
        if (a < 0) {
            return 0
        } else {
            return Number(a)
        }
    })
}

const includesObj = ({ str, arr }: any) => {
    for (let i = 0; i < arr.length; i++) {
        console.log(str, arr[i])
        if (str.includes(arr[i])) {
            console.log('first')
            return true
        }
    }
    return false
}

function NurseCharts(props: nurseChartsProps) {

    const isMobile = useGetWindowSize()


    function onbedTip(params: any) {
        let tip = '';
        tip += params.marker + `<span style=''> ${params.name} </span>` + '     ' + (`<span style='font-weight : 600; margin-left : 10px'> ${params.data ? '在床' : '离床'} </span>`)
        return tip;
    }

    const [nurseTotal, setNurseTotal] = useState<any>(0)
    const [nurseProjectTotal, setProjectNurseTotal] = useState<any>(0)
    const [nurseChartsData, setNurseChartsData] = useState({})
    const [showNurseOrOnbed, setShowNurseOrOnbed] = useState('nurse')

    const [onBedValueArr, setOnBedValueArr] = useState<any>([])
    const [onBedTimeArr, setOnBedTimeArr] = useState<any>([])
    const [nurseConfigList, setNurseConfigList] = useState([])

    useEffect(() => {
        const objArr: any = []
        const arr = props.pageRecords
        arr.forEach((a: any, index: number) => {
            let obj: any = {}
            obj.serialNum = index
            obj.startTime = stampToTime(a.timeMills)
            obj.endTime = stampToTime(a.timeMillsEnd)
            obj.chargeNum = a.chargeMan
            obj.bedNum = a.bedNum
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
        const data = objArr
        let chartsData: any = {

        }
        let dataIndex = 0
        // data.forEach((a: any, index: any) => {
        //     const data = a.careContent.split('|')

        //     const nurseData = a.careData.split('|')
        //     const normalArr = data.filter((a: any) => {
        //         return a.includes('normalArr')
        //     })
        //     console.log(normalArr[0])
        //     if (includesObj({ str: normalArr[0].split('+')[1], arr: ["a1a", "b1b", "c1c", "d1d",] }) && isJSON(strToObj(normalArr[0].split('+')[1]))) {
        //         const normalArrRes = JSON.parse(strToObj(normalArr[0].split('+')[1]))
        //         if (dataIndex == 0) {
        //             normalArrRes.forEach((a: any) => {
        //                 chartsData[a.title] = a.value
        //             })
        //         } else {
        //             if (normalArrRes.length > 0 && Object.keys(chartsData).length > 0) {
        //                 normalArrRes.forEach((a: any) => {
        //                     chartsData[a.title] += a.value
        //                 })
        //             }
        //         }
        //         console.log(chartsData, 'chartsData')
        //         dataIndex++
        //     }


        // })
        const nurseTotal = Object.values(chartsData).reduce((a: any, b: any) => a + b, 0)
        setNurseTotal(nurseTotal)
        setProjectNurseTotal(Object.keys(chartsData).length)
        setNurseChartsData(chartsData)


        const res = objToTidyChartsData({ data: props.onbedList, startDate: props.dayData })

        let bodymoveArr: any = [], onBedValueArr: Array<any> = [], onBedTimeArr: Array<any> = []
        onBedValueArr = res.onbedArr
        onBedTimeArr = res.timeArr
        setOnBedValueArr(onBedValueArr)
        setOnBedTimeArr(onBedTimeArr)

    }, [props.dataSource, props.onbed, props.dayData, props.onbedTime, props.onbedList])

    // 多少分钟的数据整合为一个显示在charts上的点
    // const onbedNum = 30
    // for (let i = 0; i < props.onbedList.length / onbedNum; i++) {
    //     // bodymoveArr[i] = {}
    //     let arr = []
    //     for (let j = 0; j < onbedNum; j++) {
    //         if (i * onbedNum + j == props.onbedList.length) {
    //             break;
    //         }
    //         if (props.onbedList[i * onbedNum + j].onbed == 0) {
    //             onBedValueArr[i] = 0
    //             break
    //         }
    //         onBedValueArr[i] = 1
    //     }
    //     onBedTimeArr[i] = dayjs(props.onbedList[i * onbedNum].time).format('HH:mm')
    // }

    //   setBodymove({ bodyValueArr: [...bodyValueArr].reverse(), bodyTimeArr: [...bodyTimeArr].reverse() })


    //   const onbedStampArr = onbedList.map((a: any) => dayjs(a.time).format('HH:mm'))

    return (
        <>{!props.user ?
            <div>
                <div className="nurseItemContent nurseContent" style={{}}>
                    {/* <div className="nurseTitleName" style={{ marginBottom: '1.9rem' }}>护理记录 </div> */}
                    {/* <div className="nurseValueItems">
                <div className="nurseValueItem">
                    <div className="nurseValueTitle">在床时间</div>
                    <div className="nurseValueContent">{props.onbedTime ? <>
                        {numToTime(props.onbedTime * 1.4)[1] ? (
                            <>
                                <span className="sleepDataNum">{numToTime(props.onbedTime * 1.4)[1]}</span>
                                <span className="sleepDataUtil">时</span>
                            </>
                        ) : null}
                        <span className="sleepDataNum">{numToTime(props.onbedTime * 1.4)[0]}</span>
                        <span className="sleepDataUtil">分</span>
                    </> : 0}</div>
                </div>
                <div className="nurseValueItem">
                    <div className="nurseValueTitle">护理项目</div>
                    <div className="nurseValueContent"><span className="sleepDataNum">{nurseTotal}</span>   <span className="sleepDataUtil">次</span></div>
                </div>
                <div className="nurseValueItem">
                    <div className="nurseValueTitle">最大时间间隔</div>
                    <div className="nurseValueContent">{props.max ? <>
                        {numToTime(props.max)[1] ? (
                            <>
                                <span className="sleepDataNum">{numToTime(props.max)[1]}</span>
                                <span className="sleepDataUtil">时</span>
                            </>
                        ) : null}
                        <span className="sleepDataNum">{numToTime(props.max)[0]}</span>
                        <span className="sleepDataUtil">分</span>
                    </> : <>
                        <span className="sleepDataNum">0</span>
                        <span className="sleepDataUtil">分</span>
                    </>}</div>
                </div>
            </div> */}
                    {
                        isMobile ? <div className="h-[100%] bg-[#FFFFFF]" style={{ width: '100%' }}>
                            <div className='text-[#000000] text-[1.2rem] pl-[1rem] flex items-center' style={{ fontFamily: 'PingFang SC', fontWeight: "600" }}>

                                <img style={{ width: "4px", height: "14px", marginRight: "0.4rem" }} src={lanse} alt="" />
                                <span>护理记录</span>
                            </div>
                            <div className=' px-[3%]  h-full'>
                                <PCNurseConfList type='daEeport' sensorName={props.sensorName} />
                            </div>
                        </div> : ""
                    }
                    <div className='nurseAndOnbedContent'>

                        {
                            !isMobile ? <div className="h-[100%] bg-[#FFFFFF]" style={{ width: '100%' }}>
                                <div className='text-[#000000] text-[1.2rem] pl-[1rem] flex items-center' style={{ fontFamily: 'PingFang SC', fontWeight: "600" }}>

                                    <img style={{ width: "0.25rem", height: "1.2rem", marginRight: "0.6rem" }} src={lanse} alt="" />
                                    <span>护理记录</span>
                                </div>
                                <div className=' px-[3%]  h-full'>
                                    <PCNurseConfList type='daEeport' sensorName={props.sensorName} />
                                </div>
                            </div> : ''
                        }

                        {(isMobile && showNurseOrOnbed == 'onbed') || !isMobile ?
                            <div className="nurseStatis nurseChartsContent" style={{ flex: '0 0 calc(50% - 0.45rem)' }}>
                                <div className="nurseChartTitleName">在离床统计</div>
                                <div className="daySleepInfo">
                                    <div className="daySleepItem">
                                        <div>
                                            {numToTime(props.onbedTime)[1] ? (
                                                <>
                                                    <span className="sleepDataNum"> {numToTime(props.onbedTime)[1]}</span>
                                                    <span className="sleepDataUtil">时</span>
                                                </>
                                            ) : null}
                                            <span className="sleepDataNum"> {numToTime(props.onbedTime)[0]}</span>
                                            <span className="sleepDataUtil">分钟</span>
                                        </div>
                                        <div className="sleepDataUtil">在床时间</div>
                                    </div>
                                    {/* <div className="daySleepItem">
                            <span className="sleepDataNum">{22}<span className="sleepDataUtil">次/天</span></span>
                            <div className="sleepDataUtil">最长在床时间</div>
                        </div> */}
                                    <div className="daySleepItem">
                                        <span className="sleepDataNum">{props.outBed}<span className="sleepDataUtil">次</span></span>
                                        <div className="sleepDataUtil">离床次数</div>
                                    </div>
                                </div>
                                <div className="nursecharts">
                                    {props.onbed.onbedStampArr ? <CategoryChart
                                        tipFormat={onbedTip}
                                        yFormat={function (value: any) {
                                            if (value == 1) {
                                                return '在床'
                                            } else {
                                                return '离床'
                                            }
                                        }} padding={positionArr} xdata={[...onBedTimeArr]} ydata={[...lessZeroIsZero([...onBedValueArr])]} index={32} /> : ''}
                                </div>
                            </div>
                            : ''}
                    </div>
                </div>
            </div > :
            <div className="nurseItemContent nurseContent">
                <div className="nurseTitleName" style={{ marginBottom: '1.9rem' }}>在离床统计</div>

                <div className="nurseChartsContent firstCharts" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="daySleepInfo" style={{ flex: 1 }}>
                        <div className="daySleepItem">
                            <div>
                                {numToTime(props.onbedTime)[1] ? (
                                    <>
                                        <span className="sleepDataNum"> {numToTime(props.onbedTime)[1]}</span>
                                        <span className="sleepDataUtil">时</span>
                                    </>
                                ) : null}
                                <span className="sleepDataNum"> {numToTime(props.onbedTime)[0]}</span>
                                <span className="sleepDataUtil">分钟</span>
                            </div>
                            <div className="sleepDataUtil">在床时间</div>
                        </div>
                        <div className="daySleepItem">
                            <div> <span className="sleepDataNum">{props.outBed}</span><span className="sleepDataUtil">次</span></div>
                            <div className="sleepDataUtil">离床次数</div>
                        </div>
                    </div>
                    <div className="nurseStati">
                        <div className="nurseChart">
                            {props.onbed.onbedStampArr ? <CategoryChart
                                tipFormat={onbedTip}
                                yFormat={function (value: any) {
                                    if (value == 1) {
                                        return '在床'
                                    } else {
                                        return '离床'
                                    }
                                }} padding={positionArr} xdata={[...onBedTimeArr]} ydata={[...lessZeroIsZero([...onBedValueArr])]} index={32} /> : ''}
                        </div>
                    </div>

                </div>
            </div>
        }
        </>
    )
}

export default memo(NurseCharts)