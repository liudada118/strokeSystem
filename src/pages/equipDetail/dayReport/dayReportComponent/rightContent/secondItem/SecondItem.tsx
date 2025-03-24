import { Divider } from 'antd'
import React, { memo, useState } from 'react'
// import { numToTime, stampToTime, timeArrToIntegerTimer } from '../../../../assets/util'
import { Charts, SleepDateTypeChart, SleepSegAndProp } from '@/components/charts'
import { useLocation } from 'react-router-dom'
import { numToTime, timeArrToIntegerTimer } from '@/utils/timeConvert'
import { useGetWindowSize } from '@/hooks/hook'
import { CardWithoutTitle } from '@/pages/equipDetail/Monitor/realReport/Card'

interface secondItemProps {
    data: any
    alarm: any
    nurse: any
    sleepNums: any
    posChangeHour: any
    posChangeDay: any
    allTime: any
    outBed: any
}

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

export const colorArr = ["#FFD900", "#4AD75C", "#18D0FC", "#4789F7 "];

function SecondItem(props: secondItemProps) {
    const [showSleepType, setShowSleepType] = useState('segment')
    const [sleepNowNum, setSleepNowNum] = useState<number>(1);

    const isMobile = useGetWindowSize()

    let location: any = useLocation();
    return (
        <CardWithoutTitle>
            <div className="secondItem nurseContent">

                <div className="nurseTitleName" style={{ marginBottom: '1.56rem' }}>睡眠</div>
                <div className="nurseValueItems">
                    {!isMobile ? <div className="nurseValueItem">
                        <div className="nurseValueTitle">睡眠得分</div>
                        <div className="sleepDataInfo">
                            <div className="sleepDataNum" style={{ color: props.data.sleep_scores >= 80 ? '#006CFD' : 'unset' }}>{props.data.sleep_scores}</div>
                            <div className="sleepDataUtil">分</div>
                        </div>

                    </div> : ''}
                    <div className="nurseValueItem">
                        <div className="nurseValueTitle">睡眠时长</div>
                        <div className="sleepDataInfo">
                            {props.data[realArr[0].name] ? <>
                                {numToTime(props.data[realArr[0].name])[1] ? (
                                    <>
                                        <span className="sleepDataNum">{numToTime(props.data[realArr[0].name])[1]}</span>
                                        <span className="sleepDataUtil">时</span>
                                    </>
                                ) : null}
                                <span className="sleepDataNum">{numToTime(props.data[realArr[0].name])[0]}</span>
                                <span className="sleepDataUtil">分</span>
                            </> : 0}
                        </div>
                    </div>
                    {!isMobile ? <div className="nurseValueItem">
                        <div className="nurseValueTitle">异常提醒</div>
                        <div className="sleepDataInfo">
                            <div className="sleepDataNum">{props.alarm}</div>
                            <div className="sleepDataUtil">次</div>
                        </div>
                    </div> : ''}
                    <div className="nurseValueItem">
                        <div className="nurseValueTitle">护理次数</div>
                        <div className="sleepDataInfo">
                            <div className="sleepDataNum"> {location.pathname.includes('small') ? props.data.out_bed_numbers : props.nurse}</div>
                            <div className="sleepDataUtil">次</div>
                        </div>
                    </div>
                    <div className="nurseValueItem">
                        <div className="nurseValueTitle">离床次数</div>
                        <div className="sleepDataInfo">
                            <div className="sleepDataNum"> {props.outBed}</div>
                            <div className="sleepDataUtil">次</div>
                        </div>
                    </div>
                </div>
                <div className="secondChartsItem">
                    {isMobile ?
                        <div className="seleteRateOrHeart">
                            <div className="nurseSeleteHeart seleteRateOrHeartItem">
                                <div className="seleteRateOrHeartValue"
                                    style={{ color: showSleepType == 'segment' ? '#0072EF' : '#929EAB', backgroundColor: showSleepType == 'segment' ? '#fff' : 'unset', }}
                                    onClick={() => { setShowSleepType('segment') }}>睡眠分段</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.68rem' }}>
                                <div style={{ width: '1px', height: '80%', backgroundColor: '#eee' }}></div>
                            </div>
                            <div className="nurseSeleteHeart seleteRateOrHeartItem">
                                <div className="seleteRateOrRateValue seleteRateOrHeartValue"
                                    style={{ color: showSleepType == 'nursePos' ? '#0072EF' : '#929EAB', backgroundColor: showSleepType == 'nursePos' ? '#fff' : 'unset', }}
                                    onClick={() => { setShowSleepType('nursePos') }}>睡姿</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.68rem' }}>
                                <div style={{ width: '1px', height: '80%', backgroundColor: '#eee' }}></div>
                            </div>
                            <div className="nurseSeleteRate seleteRateOrHeartItem">
                                <div className="seleteRateOrRateValue"
                                    style={{ color: showSleepType == 'sleepQuality' ? '#0072EF' : '#929EAB', backgroundColor: showSleepType == 'sleepQuality' ? '#fff' : 'unset', }}
                                    onClick={() => { setShowSleepType('sleepQuality') }}>睡眠质量</div>
                            </div>
                        </div> : ''}
                    {((isMobile) && showSleepType == 'segment') || (!isMobile) ?
                        // <div className="nurseContent sleepSeg nurseChartsContent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        //     <div className="card marginbottom" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        //         <div className="SegInfo">
                        //             <div className="itemTitleAndData">
                        //                 <div className="nurseChartTitleName">分段睡眠数据</div>
                        //             </div>
                        //             <div className="daySleepInfo">
                        //                 <div className="daySleepItem">
                        //                     <div>
                        //                         {numToTime(props.data.light_sleep_time)[1] ? (
                        //                             <>
                        //                                 <span className="sleepDataNum"> {numToTime(props.data.light_sleep_time)[1]}</span>
                        //                                 <span className="sleepDataUtil">时</span>
                        //                             </>
                        //                         ) : null}
                        //                         <span className="sleepDataNum"> {numToTime(props.data.light_sleep_time)[0]}</span>
                        //                         <span className="sleepDataUtil">分钟</span>
                        //                     </div>
                        //                     <div className="sleepDataUtil">浅睡时长</div>
                        //                 </div>
                        //                 <div className="daySleepItem">
                        //                     <div className="daySleepItemData">{numToTime(props.data.deep_sleeping_times)[1] ? (
                        //                         <>
                        //                             <span className="sleepDataNum"> {numToTime(props.data.deep_sleeping_times)[1]}</span>
                        //                             <span className="sleepDataUtil">时</span>
                        //                         </>
                        //                     ) : null}
                        //                         <span className="sleepDataNum">   {numToTime(props.data.deep_sleeping_times)[0]}</span>
                        //                         <span className="sleepDataUtil">分钟</span></div>
                        //                     <div className="sleepDataUtil">深睡时长</div>
                        //                 </div>
                        //             </div>
                        //         </div>
                        //         <div className="circles marginbottom">
                        //             <div className="circleItem">
                        //                 <div
                        //                     className="circle"
                        //                     style={{ backgroundColor: "#4ec46d" }}
                        //                 ></div>
                        //                 <span>清醒</span>
                        //             </div>
                        //             <div className="circleItem">
                        //                 <div
                        //                     className="circle"
                        //                     style={{ backgroundColor: "#497dea" }}
                        //                 ></div>
                        //                 <span>浅度睡眠</span>
                        //             </div>
                        //             <div className="circleItem">
                        //                 <div
                        //                     className="circle"
                        //                     style={{ backgroundColor: "#344fff" }}
                        //                 ></div>
                        //                 <span>深度睡眠</span>
                        //             </div>
                        //             <div className="circleItem">
                        //                 <div
                        //                     className="circle"
                        //                     style={{ backgroundColor: "#ffb500" }}
                        //                 ></div>
                        //                 <span>离床</span>
                        //             </div>
                        //         </div>
                        //         <div className="sleepStatuss">
                        //             {props.data?.sleep_state?.map((item: any, index: number) => {

                        //                 return (
                        //                     <div
                        //                         onClick={() => {
                        //                             setSleepNowNum(index);
                        //                         }}
                        //                         style={{
                        //                             width: `${(100 * item[1]) / props.sleepNums}%`,
                        //                             position: "relative",
                        //                             height: "2.81rem",
                        //                             backgroundColor: colorArr[item[0]],
                        //                             display: "flex",
                        //                             // alignItems: "center",
                        //                             justifyContent: "center",
                        //                         }}
                        //                     >
                        //                         {sleepNowNum == index ? (
                        //                             <div className="showSleep">
                        //                                 <div className="showSleepItem">
                        //                                     <span> {stampToTime(item[2])}</span>
                        //                                     <span style={{ width: '2.5rem', textAlign: 'center' }}>
                        //                                         {" "}
                        //                                         {item[0] === 0
                        //                                             ? "离床"
                        //                                             : item[0] === 1
                        //                                                 ? "清醒"
                        //                                                 : item[0] === 2
                        //                                                     ? "浅睡"
                        //                                                     : "深睡"}
                        //                                     </span>
                        //                                 </div>
                        //                                 <div className="showSleepTriang"></div>
                        //                             </div>
                        //                         ) : null}
                        //                     </div>
                        //                 );
                        //             })}
                        //         </div>
                        //         <div className="timeBar">
                        //             {
                        //                 new Array(20).fill(0).map((a: any, index: any) => {
                        //                     return (
                        //                         <div style={{ width: '1px', height: '5px', backgroundColor: "#B0B3B8" }}></div>
                        //                     )
                        //                 })
                        //             }
                        //         </div>
                        //         <div className="startAndEndTime">
                        //             <div className="timeItem">
                        //                 {props.data.data_time ? stampToTime(props.data.data_time[0]) : null}
                        //             </div>
                        //             <div className="timeItem">
                        //                 {props.data.data_time ? stampToTime(props.data?.data_time[1]) : null}
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div> 

                        <SleepSegAndProp data={props.data} sleepNums={props.sleepNums} />

                        : ''}
                    {(isMobile && showSleepType == 'nursePos') || !isMobile ?
                        <div className="nurseContent nursePos nurseChartsContent">
                            <div className="card marginbottom" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                <div className="SegInfo">
                                    <div className="nurseChartTitleName">睡姿统计</div>
                                    <div className="daySleepInfo">
                                        <div className="daySleepItem">
                                            <span className="sleepDataNum">{props.posChangeHour}<span className="sleepDataUtil">次/小时</span></span>
                                            <div className="sleepDataUtil">平均更换睡姿</div>
                                        </div>
                                        <div className="daySleepItem">
                                            <span className="sleepDataNum">{props.posChangeDay}<span className="sleepDataUtil">次/天</span></span>
                                            <div className="sleepDataUtil">睡姿更换总数</div>
                                        </div>
                                    </div></div>
                                {/* <div className="nursecharts"> */}

                                {props.data.sleeping_position && !!props.data.sleeping_position[0] ? (
                                    <SleepDateTypeChart xArr={timeArrToIntegerTimer(props.data.inbed_timestamp_list)} data={Array.isArray(props.data.sleeping_position[0]) ? (props.data.sleeping_position[0]) : [props.data.sleeping_position[0]]} />
                                ) : <div style={{}}>未获取到睡姿</div>}
                            </div></div> : ''}
                    {(isMobile && showSleepType == 'sleepQuality') || !isMobile ?
                        <div className="nurseContent sleepQuality nurseChartsContent" >
                            <div className="card marginbottom" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                <div className="SegInfo">
                                    <div className="nurseChartTitleName">睡眠质量</div>
                                    <div className="daySleepInfo">
                                        <div className="daySleepItem">
                                            <span className="sleepDataNum"> {Math.ceil(
                                                (props.data.light_sleep_time / (props.allTime === 0 ? 1 : props.allTime)) *
                                                100
                                            )}<span className="sleepDataUtil">%</span></span>
                                            <div className="sleepDataUtil">浅睡时长</div>
                                        </div>
                                        <div className="daySleepItem">
                                            <span className="sleepDataNum">{Math.floor(
                                                (props.data.deep_sleeping_times / (props.allTime === 0 ? 1 : props.allTime)) * 100
                                            )}<span className="sleepDataUtil">%</span></span>
                                            <div className="sleepDataUtil">深睡时长</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="nurseStati">
                                    <div className="nurseChart">
                                        {props.data.deep_sleeping_times ? (
                                            <Charts
                                                xdata={Math.ceil(
                                                    (props.data.deep_sleeping_times / (props.allTime === 0 ? 1 : props.allTime)) *
                                                    100
                                                )}
                                                title={['深睡', '浅睡']}
                                                index={6}
                                                ydata={Math.floor(
                                                    (props.data.light_sleep_time / (props.allTime === 0 ? 1 : props.allTime)) *
                                                    100
                                                )}
                                            />
                                        ) : null}</div>
                                    <div className="nurseTitle">
                                        <div className="propsDateItem" style={{ fontSize: '0.6rem' }}>
                                            <div
                                                className="circle"
                                                style={{ backgroundColor: "#03DCD2" }}
                                            ></div>
                                            <span>浅睡时长</span>
                                            <Divider type="vertical" />
                                            <span>
                                                {Math.ceil(
                                                    (props.data.light_sleep_time / (props.allTime === 0 ? 1 : props.allTime)) *
                                                    100
                                                )}
                                                %</span>
                                            <span style={{ marginLeft: 5 }}>

                                                {numToTime(props.data.light_sleep_time)[1] ? (
                                                    <>
                                                        {numToTime(props.data.light_sleep_time)[1]}
                                                        <span>时</span>
                                                    </>
                                                ) : null}
                                                {numToTime(props.data.light_sleep_time)[0]}
                                                <span>分钟</span>
                                            </span>
                                        </div>
                                        <div className="propsDateItem" style={{ fontSize: '0.6rem' }}>
                                            <div
                                                className="circle"
                                                style={{ backgroundColor: "#007BFE" }}
                                            ></div>
                                            深睡时长
                                            <Divider type="vertical" />
                                            {Math.floor(
                                                (props.data.deep_sleeping_times / (props.allTime === 0 ? 1 : props.allTime)) * 100
                                            )}
                                            %
                                            <div style={{ marginLeft: 5 }}>

                                                {numToTime(props.data.deep_sleeping_times)[1] ? (
                                                    <>
                                                        {numToTime(props.data.deep_sleeping_times)[1]}
                                                        <span>时</span>
                                                    </>
                                                ) : null}
                                                {numToTime(props.data.deep_sleeping_times)[0]}
                                                <span>分钟</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div></div> : ''}
                </div>

            </div>
        </CardWithoutTitle>
    )
}

export default memo(SecondItem)