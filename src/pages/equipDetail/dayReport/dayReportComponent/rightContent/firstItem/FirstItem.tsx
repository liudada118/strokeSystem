import React, { memo, useEffect, useState } from 'react'
import { CategoryChart, CurveChart } from '@/components/charts'
import deletewithe from '@/assets/image/deletewithe.png'
// import { calAver, rateArrToHeart, rateToHeart, stampToTime, timeArrToTimer } from '../../../../assets/util'
import dayjs from 'dayjs'
import CapZeroUtil from './CapZeroUtil'
import { stampToTime, timeArrToTimer } from '@/utils/timeConvert'
import { oriRateToRate, rateArrToHeart } from '@/utils/dataToFormat'
import { calAver } from '@/utils/math'
import { useGetWindowSize } from '@/hooks/hook'
import { CardWithoutTitle } from '@/pages/equipDetail/Monitor/realReport/Card'
import { instance } from '../../../../../../api/api'
interface firstItemProps {
    stroke: any
    posChangeHour: any
    posChangeDay: any
    bodymove: any
    data: any
    onbedList: any
    dayData: any
    sensorName?: string
}



function calMin(arr: any) {
    if (!Array.isArray(arr)) {
        return 0
    }
    if ([...arr].filter((a: any) => a > 0).length) {
        return Math.min(...[...arr].filter((a: any) => a > 0))
    }
    return 0

}

export const positionArr = [20, 10, 35, 20]

function handleStorkeAbnormal({ arr, }: any) {
    return arr.map((a: any) => {
        if (a > 10) {
            return 1
        } else {
            return a
        }
    })
}

// startDate
export function objToTidyChartsData({ data, startDate }: any) {
    if (data.length) {

        const xdata = [], obj: any = {}
        for (let i = 40; i <= 72; i++) {
            let time = dayjs(startDate + i * 30 * 60 * 1000).format('HH:mm')
            xdata.push(time)
            obj[time] = {
                onbed: [],
                stroke: [],
                bodymove: []
            }
        }
        const objKey = Object.keys(obj)
        for (let i = 0; i < data.length; i++) {
            // (startDate - 4 * 60 * 60 * 1000) 为data的最小的时间
            const index = Math.floor((data[i].time - (startDate - 4 * 60 * 60 * 1000)) / (30 * 60 * 1000))

            if (!obj[objKey[index]]) break
            obj[objKey[index]].onbed.push(parseInt(data[i].onbed) > 10 ? 1 : parseInt(data[i].onbed))
            obj[objKey[index]].stroke.push(data[i].stroke)
            obj[objKey[index]].bodymove.push(data[i].bodymove > 10 ? 1 : data[i].bodymove)
        }
        // obj['24:00'] = { ...obj['23:30'] }
        // obj['11:59'] = { ...obj['12:00'] }

        const valueArr: any = Object.values(obj)
        const bodymoveArr = [], strokeValue = [], onbedArr = []
        for (let i = 0; i < valueArr.length; i++) {
            if (!valueArr[i].onbed.length) {
                bodymoveArr.push(0)
                strokeValue.push(0)
                onbedArr.push(0)
            } else {
                const stroke = valueArr[i].stroke.reduce((a: any, b: any) => a + b, 0)
                const onbed = valueArr[i].onbed.includes(0) ? 0 : 1
                let bodymove = Math.max(...valueArr[i].bodymove.filter((a: any) => a < 10))
                if (onbed == 0 && stroke == 0) {
                    bodymoveArr.push(0)
                } else {
                    bodymoveArr.push(bodymove)
                }

                strokeValue.push(stroke)

                if (onbed == 0 && stroke != 0) {
                    onbedArr.push(1)
                } else {
                    onbedArr.push(onbed)
                }
            }
        }

        return { onbedArr, strokeValue, bodymoveArr, timeArr: Object.keys(obj) }
    }
    return {
        onbedArr: [], strokeValue: [], bodymoveArr: [], timeArr: []
    }
}



function FirstItem(props: firstItemProps) {
    const isMobile = useGetWindowSize()
    const [strokeFlag, setStrokeFlag] = useState(false)
    const [healthyFlag, setHealthyFlag] = useState(false)
    const [showHeartOrRate, setShowHeartOrRate] = useState('heart')

    const [strokeArr, setStrokeArr] = useState<any>([])
    const [bodyValueArr, setBodyValueArr] = useState<any>([])
    const [bodyTimeArr, setBodyTimeArr] = useState<any>([])

    console.log(props.data);

    useEffect(() => {
        let bodyValueArr: Array<any> = [], bodyTimeArr: Array<any> = [], strokeArr: any = []

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
        //             arr.push(0)
        //             break
        //         }
        //         if (props.onbedList[i * onbedNum + j].stroke != 0) {
        //             strokeArr[i] = '#cf7445'
        //         }
        //         arr.push(props.onbedList[i * onbedNum + j].bodymove)
        //     }


        //     bodyValueArr[i] = Math.max(...arr)
        //     if (arr.includes(0)) {
        //         bodyValueArr[i] = 0
        //     }
        //     bodyTimeArr[i] = dayjs(props.onbedList[i * onbedNum].time).format('HH:mm')
        //     if (!strokeArr[i]) strokeArr[i] = '#006CFD'
        // }



        // const xdata = [], obj: any = {}
        // for (let i = 0; i < 48; i++) {
        //     let time = dayjs(props.dayData + i * 30 * 60 * 1000).format('HH:mm')
        //     xdata.push(time)
        //     obj[time] = {
        //         onbed: [],
        //         stroke: [],
        //         bodymove: []
        //     }
        // }

        // const objKey = Object.keys(obj)
        // for (let i = 0; i < props.onbedList.length; i++) {
        //     const index = Math.floor((props.onbedList[i].time - props.dayData + 24 * 60 * 60 * 1000) / (30 * 60 * 1000))
        //     obj[objKey[index]].onbed.push(props.onbedList[i].onbed > 10 ? 1 : props.onbedList[i].onbed)
        //     obj[objKey[index]].stroke.push(props.onbedList[i].stroke)
        //     obj[objKey[index]].bodymove.push(props.onbedList[i].bodymove > 10 ? 1 : props.onbedList[i].bodymove)
        // }
        // obj['24:00'] = { ...obj['23:30'] }

        // const valueArr: any = Object.values(obj)

        // const yValue = [], strokeValue = [], onbedArr = []
        // for (let i = 0; i < valueArr.length; i++) {
        //     if (!valueArr[i].onbed.length) {
        //         yValue.push(0)
        //         strokeValue.push(0)
        //         onbedArr.push(0)
        //     } else {
        //         const stroke = valueArr[i].stroke.reduce((a: any, b: any) => a + b, 0)
        //         const onbed = valueArr[i].onbed.includes(0) ? 0 : 1
        //         let bodymove = Math.max(...valueArr[i].bodymove.filter((a: any) => a < 10))
        //         if (onbed == 0 && stroke == 0) {
        //             yValue.push(0)
        //         } else {
        //             yValue.push(bodymove)
        //         }
        //         strokeValue.push(stroke)
        //         onbedArr.push(onbed)
        //     }

        // }

        const res = objToTidyChartsData({ data: props.onbedList, startDate: props.dayData })

        // console.log(obj, yValue, onbedArr, strokeValue, 'obj')

        setStrokeArr(res.strokeValue)
        setBodyTimeArr(res.timeArr)
        setBodyValueArr(res.bodymoveArr)


    }, [props.onbedList, props.dayData,])
    // console.log(props.stroke)

    function storkeTip(params: any) {
        let tip = '';
        tip += params.marker + `<span style=''> ${params.name} </span>` + '     ' + (!strokeArr[params.dataIndex] ? `<span style='font-weight : 600; margin-left : 10px'> ${params.data} </span>` : '') + ' ' + (strokeArr[params.dataIndex] ? `<span style='font-weight : 600; margin-left : 10px'> ${strokeArr[params.dataIndex]} </span>` + '次' : '')
        return tip;
    }

    // 心率计算
    const [heartRateMax, srtHeartRateMax] = useState()
    const [heartRateMin, srtHeartRateMin] = useState()
    function mostCommonValue(arr: any) {
        if (arr.length === 0) return null;  // 如果数组为空，返回 null  

        const countMap: any = {};  // 创建一个对象用于存储每个值的计数  
        let maxCount = 0;     // 记录最大计数  
        let mostCommon = null; // 记录出现次数最多的值  

        // 遍历数组并计数  
        arr.forEach((value: any) => {
            countMap[value] = (countMap[value] || 0) + 1; // 如果不存在则初始化为 0，并加 1  
            // 更新最多值和最大计数  
            if (countMap[value] > maxCount) {
                maxCount = countMap[value];
                mostCommon = value;
            }
        });

        return mostCommon; // 返回最多的值  
    }
    useEffect(() => {
        instance({
            method: "get",
            url: "/sleep/nurse/getRecords",
            params: {
                deviceName: props.sensorName,
                startTime: new Date(new Date().toLocaleDateString()).getTime(),
                endTime: new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 - 1) * 60 * 1000,
                pageNum: 1,
                pageSize: 99
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": localStorage.getItem("token") || ""
            },
        }).then((result: any) => {
            // [].flat
            const flat = result.data.onbedList
            const data = flat.flat()
            const res = data.map((item: any) => item.perMinuteBreathRate)
            const xinLv: any = rateArrToHeart(res)
            console.log(xinLv, '................................................................xinLvxinLvxinLv');
            // const filteredData = xinLv.filter((item: any) => item >= 50 || item === 0);
            // 最大心率计算
            const max: any = Math.max(...xinLv)
            // 最小心率计算
            const min: any = calMinExcludingZero(xinLv)
            setDataList(xinLv)
            srtHeartRateMin(min)

            srtHeartRateMax(max)
        }).catch((err: any) => {
        });
    }, [])
    function calMinExcludingZero(arr: any) {
        if (!Array.isArray(arr)) {
            return 0;
        }
        const filteredArr = arr.filter((a: any) => a > 0);
        if (filteredArr.length === 0) {
            return 0;
        }
        return Math.min(...filteredArr);
    }
    const [dataList, setDataList] = useState([])
    console.log(dataList, '.........dataList');



    return (
        <div className="firstItem">
            <CardWithoutTitle>
                <div className="strokeItem nurseContent" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {
                        strokeFlag ?
                            <div className="infoMask" >
                                <img onClick={() => { setStrokeFlag(false) }} src={deletewithe} alt="" />
                                <div className="infoMaskTitle">脑卒中潜在风险</div>
                                <p>脑卒中(脑梗、中风、脑血栓)目前是我国居民死亡第一位原因，每5位死者中至少有1人死于脑卒中。3分之1的脑卒中病人是夜间发作。  </p>
                                <p>高风险：特殊体动频发，每小时多达60次以上，并伴有持续时间超过50秒两次以上，系统判定为三级风险。建议立即咨询医生进行检查。</p>
                                <p>中风险：特殊体动较为频发，每小时30次-60次，并伴有持续时间超过30秒两次以上，系统判定为二级风险。持续关注，持续发生则建议在医院进行中风前期筛查。 </p>
                                <p>低风险：特殊体动每小时小于30次，未发生持续时间超过30秒的特殊体动，系统判定为一级风险。建议保持关注。</p>

                            </div> : ''
                    }
                    <div className="strokeTitle nurseTitleName cursor-pointer"> <div className="">特殊体动风险监测</div>  <div className="learnMore" onClick={() => { setStrokeFlag(true) }}>了解更多</div> </div>

                    <div className="nurseRiskContent">风险等级: {props.stroke ?
                        props.stroke.length > 720 ? <><span style={{ color: '#4ad75c' }}>高风险</span>:建议咨询医生。</>
                            : props.stroke.length > 360 ? <><span style={{ color: '#4ad75c' }}>中风险</span>:持续关注，持续发生则建议在医院进行中风前期筛查。</>
                                : <><span style={{ color: '#4ad75c' }}>低风险</span>:建议保持关注。</>
                        : <> <span style={{ color: '#4ad75c' }}>低风险</span>:建议保持关注。</>}</div>
                    <div className="nurseSecondTitleName">特殊体动次数</div>
                    <div>{<div className="nurseMoveValue">{props.stroke ? <span>{props.stroke.length}</span> : <span>0</span>} <span style={{ fontSize: "0.7rem", color: '#aaa' }}>次</span></div>}</div>

                    <div className="nurseChartsContent firstCharts" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                        <div className="nurseChartTitleName" style={{ display: 'block', padding: isMobile ? '0.9rem 1rem' : '' }}>特殊体动</div>
                        <div className="daySleepInfo" style={{ flex: 1 }}>
                            <div className="daySleepItem">
                                {/* <span className="sleepDataNum">{props.posChangeHour}<span className="sleepDataUtil">次/小时</span></span>
                            <div className="sleepDataUtil">平均更换睡姿</div> */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="circle" style={{ backgroundColor: '#006CFD' }}></div>
                                    <span className="sleepDataUtil">正常体动</span>
                                </div>
                            </div>
                            <div className="daySleepItem">
                                {/* <span className="sleepDataNum">{props.posChangeDay}<span className="sleepDataUtil">次/天</span></span>
                            <div className="sleepDataUtil">睡姿更换总数</div> */}

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="circle" style={{ backgroundColor: '#cf7445' }}></div>
                                    <span className="sleepDataUtil">异常体动</span>
                                </div>
                            </div>
                        </div>
                        <div className="nurseStati">
                            <div className="nurseChart">
                                {bodyValueArr.length ? (
                                    <CategoryChart
                                        fontsize={isMobile ? 8 : 8}
                                        strokeArr={strokeArr}
                                        moveFlag={true}
                                        // index={'stroke'}
                                        padding={positionArr}
                                        // stroke={strokeArr}
                                        xdata={bodyTimeArr}
                                        ydata={bodyValueArr.map((a: any) => a > 10 ? 0 : a)}
                                        index={36}
                                        tipFormat={storkeTip}
                                    />

                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </CardWithoutTitle>
            <CardWithoutTitle>
                <div className="heartBreatheItem nurseContent" style={{ position: 'relative' }}>
                    {
                        healthyFlag ? <div className="infoMask" >
                            <img onClick={() => { setHealthyFlag(false) }} src={deletewithe} alt="" />
                            <div className="infoMaskTitle">了解心率和呼吸</div>
                            <p>心率和呼吸可以帮助人们评估身体健康情况，因为它们是身体内在状态的重要指标，提供了有关整体健康状况的重要信息。  </p>
                            <p>活动水平：通过监测心率和呼吸频率，人们可以评估自己的活动水平。一般来说，运动时心率和呼吸频率都会增加，而在休息状态下会降低。异常的心率和呼吸频率可能暗示着身体活动水平的改变，有助于人们评估自己的运动状态是否适当。 </p>
                            <p>应激反应：心率和呼吸频率也可以反映身体对应激的反应。例如，在焦虑或紧张状态下，心率和呼吸频率会增加。通过监测这些指标，人们可以更好地了解自己的应激反应，进而采取相应的调节措施。</p>
                            <p>疾病风险：异常的心率和呼吸频率可能表明潜在的健康问题，比如心脏疾病、呼吸系统问题等。定期监测这些指标可以帮助人们及早发现健康问题，采取预防措施或及时就医。</p>
                            <p>心率和呼吸频率作为生理指标，可以为人们提供实时的身体健康状况反馈，有助于评估自己的整体健康情况。</p>
                            <p>呼吸：成人呼吸频率通常在每分钟 12 到 20 次之间。老年人呼吸频率可能会稍有降低。</p>
                            <p>心率：安静状态下的成人心率通常在每分钟 60 到 100 次之间。老年人的心率可能会略有降低</p>
                        </div> : ''
                    }
                    <div className="strokeTitle nurseTitleName cursor-pointer"> <div className="">健康体征</div>  <div className="learnMore" onClick={() => { setHealthyFlag(true) }}>了解更多</div> </div>
                    <div className="nurseRiskContent">心率和呼吸可以帮助人们评估身体健康情况</div>
                    <div className="nurseValueItems">
                        <div className="nurseValueItem">
                            <div className="nurseValueTitle">平均心率</div>
                            {/* <div> <span className="sleepDataNum" style={{ lineHeight: "unset" }}>{props.data.breathrate && calAver(rateArrToHeart(oriRateToRate(props.data.breathrate)), 0)}</span>
                            <span className="sleepDataUtil">bpm</span></div> */}

                            <CapZeroUtil value={props.data.breathrate && calAver(rateArrToHeart(oriRateToRate(props.data.breathrate)), 0)} util='bpm' />
                        </div>
                        <div className="nurseValueItem">
                            <div className="nurseValueTitle">平均呼吸</div>
                            {/* <div> <span className="sleepDataNum" style={{ lineHeight: "unset" }}>{props.data.breathrate && calAver(oriRateToRate(props.data.breathrate), 0)}</span>
                            <span className="sleepDataUtil">次/分</span></div> */}
                            <CapZeroUtil value={props.data.breathrate && calAver(oriRateToRate(props.data.breathrate), 0)} util='bpm' />
                        </div>
                        <div className="nurseValueItem">
                            <div className="nurseValueTitle">呼吸异常提醒</div>
                            <div> <span className="sleepDataNum" style={{ lineHeight: "unset" }}>0</span>
                                <span className="sleepDataUtil">次</span></div>
                        </div>
                    </div>
                    <div className="nurseRateAndHeart">
                        {isMobile ?
                            <div className="seleteRateOrHeart">
                                <div className="nurseSeleteHeart seleteRateOrHeartItem">
                                    <div className="seleteRateOrHeartValue"
                                        style={{ color: showHeartOrRate == 'heart' ? '#0072EF' : '#929EAB', backgroundColor: showHeartOrRate == 'heart' ? '#fff' : 'unset', }}
                                        onClick={() => { setShowHeartOrRate('heart') }}>心率</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.68rem' }}>
                                    <div style={{ width: '1px', height: '80%', backgroundColor: '#eee' }}></div>
                                </div>
                                <div className="nurseSeleteRate seleteRateOrHeartItem">
                                    <div className="seleteRateOrRateValue"
                                        style={{ color: showHeartOrRate == 'rate' ? '#0072EF' : '#929EAB', backgroundColor: showHeartOrRate == 'rate' ? '#fff' : 'unset' }}
                                        onClick={() => { setShowHeartOrRate('rate') }}>呼吸</div>
                                </div>
                            </div> : ''}
                        {(isMobile && showHeartOrRate == 'heart') || !isMobile ?
                            <div className="nurseContent nurseChartsContent nurseHeartCharts firstCharts">
                                <div className="nurseChartTitleName" >心率</div>
                                <div className="daySleepInfo">
                                    <div className="daySleepItem">
                                        {/* <div>  <span className="sleepDataNum">{props.data.breathrate ? Math.max(...rateArrToHeart(oriRateToRate(props.data.breathrate))) : 0}</span><span className="sleepDataUtil">bpm</span></div> */}
                                        <CapZeroUtil value={heartRateMax ? heartRateMax : 0} util='bpm' />
                                        <div className="sleepDataUtil">最高心率</div>
                                    </div>


                                    <div className="daySleepItem">
                                        {/* <div> <span className="sleepDataNum">{props.data.breathrate ? calMin(rateArrToHeart(oriRateToRate(props.data.breathrate))) : 0}</span><span className="sleepDataUtil">bpm</span></div> */}
                                        <CapZeroUtil value={heartRateMin ? heartRateMin : 0} util='bpm' />
                                        <div className="sleepDataUtil">最低心率</div>
                                    </div>
                                </div>
                                <div className="nurseStati">
                                    <div className="nurseChart">
                                        {props.data.breathrate && Array.isArray(props.data.inbed_timestamp_list) ? (
                                            <CurveChart
                                                index={2}
                                                // dataList={dataList}
                                                ydata={rateArrToHeart(oriRateToRate(props.data.breathrate))}
                                                fontsize={!isMobile ? 8 : 8}
                                                xdata={timeArrToTimer(props.data.inbed_timestamp_list)}
                                                // 假数据
                                                padding={positionArr}
                                                lineColor='#EA0000'
                                                tipFormat={function (params: any) {
                                                    return `${stampToTime(params[0].name)} ${parseInt(params[0].value)}次`;
                                                }}
                                            // mark={false}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </div> : ''}
                        {(isMobile && showHeartOrRate == 'rate') || !isMobile ?
                            <div className="nurseContent nurseChartsContent firstCharts nurseRateCharts" >
                                <div className="nurseChartTitleName" >呼吸趋势</div>
                                <div className="daySleepInfo">
                                    <div className="daySleepItem">
                                        {/* <div>      <span className="sleepDataNum">{props.data.breathrate ? Math.max(...(oriRateToRate(props.data.breathrate))) : 0}</span><span className="sleepDataUtil">次/分</span></div> */}
                                        <CapZeroUtil value={props.data.breathrate ? Math.max(...(oriRateToRate(props.data.breathrate))) : 0} util='次/分' />
                                        <div className="sleepDataUtil">最高呼吸</div>
                                    </div>
                                    <div className="daySleepItem">
                                        {/* <div>   <span className="sleepDataNum">{props.data.breathrate ? calMin((oriRateToRate(props.data.breathrate))) : 0}</span><span className="sleepDataUtil">次/分</span></div> */}
                                        <CapZeroUtil value={props.data.breathrate ? calMin((oriRateToRate(props.data.breathrate))) : 0} util='次/分' />
                                        <div className="sleepDataUtil">最低呼吸</div>
                                    </div>
                                </div>
                                <div className="nurseStati">
                                    <div className="nurseChart">
                                        {props.data.breathrate && Array.isArray(props.data.inbed_timestamp_list) ? (
                                            <CurveChart
                                                index={3}
                                                ydata={oriRateToRate(props.data.breathrate)}
                                                xdata={timeArrToTimer(props.data.inbed_timestamp_list)}
                                                fontsize={!isMobile ? 8 : 8}
                                                // 假数据
                                                padding={positionArr}
                                                tipFormat={function (params: any) {
                                                    return `${stampToTime(params[0].name)} ${parseInt(params[0].value)}次`;
                                                }}

                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </div> : ''}
                    </div>
                </div>
            </CardWithoutTitle>
        </div>
    )
}

export default memo(FirstItem)
