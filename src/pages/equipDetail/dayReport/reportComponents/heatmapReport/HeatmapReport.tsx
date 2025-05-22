import React, { memo, useEffect, useRef, useState } from 'react'
import Heatmap from '@/components/heatmap/Heatmap'
import last from '@/assets/image/jiantozuo.png'
import next from '@/assets/image/jiantoyou.png'
import { message } from 'antd'
import dayjs from 'dayjs'
import './index.scss'
import { instance } from '@/api/api'
import { heatmapColor, NoRender } from '@/pages/equipDetail/Monitor/realReport'
import { changePxToValue, moveValue } from './util'
import { CardWithoutTitle } from '@/pages/equipDetail/Monitor/realReport/Card'
import { useGetWindowSize } from '@/hooks/hook'

interface heatmapProps {
    sensorName: any
    dayDate: any
    token?: any
}

function HeatmapReport(props: heatmapProps) {
    const token = props.token || localStorage.getItem('token') || ''
    const heatMapRef = useRef<any>(null)
    const [lineFlag, setLineFlag] = useState(false)
    const [onbedDate, setOnBedDate] = useState(20 * 60 * 60 * 1000)
    const [heatmapData, setHeatmapData] = useState<Array<any>>([{ data: new Array(1024).fill(0) }])
    const [progressTime, setProgressTime] = useState('')
    const isMobile = useGetWindowSize()
    useEffect(() => {
        getDayPressData(onbedDate)
    }, [props.dayDate])
    const changeLeftProgressFalse = () => {
        setLineFlag(false)
    }
    const getDayPressData = (date: any) => {
        const currentDay = (new Date(props.dayDate).setHours(0, 0, 0, 0))
        console.log(currentDay)
        instance({
            method: "get",
            url: "/sleep/nurse/getMatrixPressData",
            params: {
                deviceName: props.sensorName,
                startMills: currentDay + date - 24 * 60 * 60 * 1000,
                endMills: currentDay + date + 1 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
        }).then((res) => {
            const ewe = res.data.data.map((item: any) => {
                return {
                    sjian: dayjs(item.timeMills).format('HH:mm')
                }
            })
            if (heatMapRef.current && res.data.data.length) {
                setHeatmapData((res.data.data))
                const listData = Array.isArray(res.data?.data[0]?.data) ? res.data?.data[0]?.data : JSON.parse(res.data?.data[0]?.data || '[]')
                heatMapRef.current.bthClickHandle(listData)

                setProgressTime(getTimeString(res.data.data[0].timeMills))
            } else {
                setHeatmapData([{ data: new Array(1024).fill(0) }])
                if (heatMapRef.current) heatMapRef.current.bthClickHandle([{ data: new Array(1024).fill(0) }])
            }
        })
    }
    const getTimeString = (date: any) => {
        const now = new Date(date);
        const formatTime = (num: any) => num.toString().padStart(2, '0');

        const timeString = [
            formatTime(now.getHours()),
            formatTime(now.getMinutes()),
            formatTime(now.getSeconds())
        ].join(':');

        return timeString;
    }
    const changeLeftProgress = (e: any) => {
        // 当帧条被按住调节帧时
        if (lineFlag && document.querySelector(".pressProgressIndex")) {
            // const leftX = document.querySelector(".progress").getBoundingClientRect().x;
            // var moveX = e.clientX;
            // const left = parseInt(document.querySelector(".leftProgress").style.left);
            // const right = parseInt(document.querySelector(".rightProgress").style.left);
            // document.querySelector(".progressLine").style.left = `${moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)}px`;

            // const lineleft = parseInt(document.querySelector(".progressLine").style.left);

            // let value = changePxToValue({ value: lineleft, type: "line", length: props.length });
            const progressWidth = 3
            const pressProgressIndex = document.querySelector(".pressProgressIndex") as HTMLElement
            const left = Number(document.querySelector('.pressProgressLine')?.getBoundingClientRect().left);
            const lineWidth = Number(document.querySelector('.pressProgressLine')?.getBoundingClientRect().width)
            // // 让表示进度帧的竖线定位到点击的位置
            const relativeDisplace = (e.clientX ? e.clientX : e.changedTouches[0].clientX) - left

            const lineLocaltion = moveValue({ value: relativeDisplace, width: lineWidth - progressWidth })

            pressProgressIndex.style.left = `${lineLocaltion}px`;

            const lineleft = parseInt(pressProgressIndex.style.left);

            let value = changePxToValue({ value: lineleft, type: "line", length: heatmapData.length, progressWidth, lineWidth });
            // setProgressIndex(value)



            // if (heatmapData[value] && heatmapData[value].data) {
            //     if (heatMapRef.current) heatMapRef.current.bthClickHandle(JSON.parse(heatmapData[value].data))
            //     setProgressTime(dayjs(heatmapData[value].timeMills).format('HH:mm'))
            // } else {
            //     if (heatMapRef.current) heatMapRef.current.bthClickHandle(new Array(1024).fill(0))
            // }
            renderDate(value)

        }
    }

    const onClickProgress = (e: any) => {

        const progressWidth = 3
        const pressProgressIndex = document.querySelector(".pressProgressIndex") as HTMLElement

        const left = Number(document.querySelector('.pressProgressLine')?.getBoundingClientRect().left);
        const lineWidth = Number(document.querySelector('.pressProgressLine')?.getBoundingClientRect().width)
        // // 让表示进度帧的竖线定位到点击的位置
        const relativeDisplace = e.clientX - left

        const lineLocaltion = moveValue({ value: relativeDisplace, width: lineWidth - progressWidth })



        const lineleft = parseInt(pressProgressIndex.style.left);

        let value = changePxToValue({ value: lineleft, type: "line", length: heatmapData.length, progressWidth, lineWidth });
        // if (heatmapData[value] && heatmapData[value].data) {
        //     if (heatMapRef.current) {
        //         heatMapRef.current.bthClickHandle(JSON.parse(heatmapData[value].data))
        //         setProgressTime(dayjs(heatmapData[value].timeMills).format('HH:mm'))
        //     }
        // } else {
        //     if (heatMapRef.current) heatMapRef.current.bthClickHandle(new Array(1024).fill(0))
        // }
        renderDate(value)
    }



    const renderDate = (value: any) => {
        if (heatmapData[value] && heatmapData[value].data) {
            if (heatMapRef.current) {
                const heatmapDataList = Array.isArray(heatmapData[value]?.data) ? heatmapData[value]?.data : JSON.parse(heatmapData[value]?.data)
                heatMapRef.current.bthClickHandle(heatmapDataList)
                console.log(value, '........value..........')
                setProgressTime(getTimeString(heatmapData[value].timeMills))
            }
        } else {
            if (heatMapRef.current) heatMapRef.current.bthClickHandle(new Array(1024).fill(0))
        }
    }


    useEffect(() => {
        console.log('useEffect')
        window.addEventListener("mousemove", changeLeftProgress);
        window.addEventListener("mouseup", changeLeftProgressFalse);

        window.addEventListener('touchmove', changeLeftProgress)
        window.addEventListener('touchend', changeLeftProgressFalse)

        return () => {
            console.log('remove')
            window.removeEventListener("mousemove", changeLeftProgress)
            window.removeEventListener("mouseup", changeLeftProgressFalse)
            window.removeEventListener("touchmove", changeLeftProgress)
            window.removeEventListener("touchend", changeLeftProgressFalse)
        }



    }, [lineFlag])

    const afterAnHour = () => {
        const pressProgressIndex = document.querySelector(".pressProgressIndex") as HTMLElement
        pressProgressIndex.style.left = `0px`;
        if (onbedDate < (20 + 15) * 60 * 60 * 1000) {
            const newDate = onbedDate + 1 * 60 * 60 * 1000
            setOnBedDate(newDate)
            getDayPressData(newDate)
        } else {
            message.error('不能超过午间十二点')
        }
    }
    const oneHourBefore = () => {
        const pressProgressIndex = document.querySelector(".pressProgressIndex") as HTMLElement
        pressProgressIndex.style.left = `0px`;
        if (onbedDate > 20 * 60 * 60 * 1000) {
            const newDate = onbedDate - 1 * 60 * 60 * 1000
            setOnBedDate(newDate)
            getDayPressData(newDate)
        } else {
            message.error('不能小于晚间八点')
        }
    }


    return (
        <CardWithoutTitle>
            <div className="pressCharts nurseContent">
                <div className="nurseTitleName" style={{ marginBottom: '1.9rem' }}>睡眠回放</div>
                <div className="nurseHeatmapContents">
                    <div className='nurseHeatmapContent'>
                        <div className="heatmapColor">
                            {
                                [...heatmapColor].reverse().map((a, index) => {
                                    return (
                                        <div style={{ width: '0.3rem', height: '1rem', backgroundColor: a, marginBottom: '0.48rem' }}></div>
                                    )
                                })
                            }
                        </div>
                        <div style={{ width: isMobile ? '70%' : '100%' }}>
                            {/* <Heatmap data={heatmapData} index={5} type={'large'} sensorName={props.sensorName} /> */}
                            <NoRender>
                                {heatmapData[0].data ? <Heatmap ref={heatMapRef} data={heatmapData[0].data} type={'large'} sensorName={props.sensorName}
                                    width
                                // width={isMobile ? true : false} height={isMobile ?false  : true} 
                                /> : ''}
                            </NoRender></div>
                        {/* <Heatmap ref={heatMapRef} data={heatmapData} type={'large'} sensorName={props.sensorName} /> */}
                    </div></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                    <span className='sleepDataUtil'>{dayjs(new Date(props.dayDate).setHours(0, 0, 0, 0) + onbedDate).format('HH:mm')}</span>
                    <span className='sleepDataUtil'>{progressTime == 'NaN:NaN:NaN' ? '' : progressTime.slice(0, 5)}</span>
                    <span className='sleepDataUtil'>{dayjs(new Date(props.dayDate).setHours(0, 0, 0, 0) + onbedDate + 1 * 59 * 60 * 1000).format('HH:mm')}</span>
                </div>
                {heatmapData[0].data ? <div className="pressProgress"
                    onClick={onClickProgress}
                    onMouseDown={(e) => {
                        setLineFlag(true)
                    }}
                    onTouchStart={(e) => {
                        console.log('start')
                        setLineFlag(true)
                    }}
                >
                    <div className="pressProgressLine"></div>
                    <div className="pressProgressIndex" style={{ left: 0 }}></div>
                </div> : ''}
                <div className="progressButtonContent">
                    <div className="progressLeftButton  text-[#006cfd] cursor-pointer" onClick={() => oneHourBefore()} > <img style={{ height: '0.8rem', marginRight: '0.2rem', }} src={last} alt="" /> 前一小时</div>
                    <div className="progressTime">
                        {dayjs(new Date(props.dayDate).setHours(0, 0, 0, 0) + onbedDate).format('HH:mm')}-{dayjs(new Date(props.dayDate).setHours(0, 0, 0, 0) + onbedDate + 1 * 59 * 60 * 1000).format('HH:mm')}
                    </div>
                    <div className="progressRightButton text-[#006cfd] cursor-pointer" onClick={() => afterAnHour()}>后一小时  <img style={{ height: '0.8rem', marginLeft: '0.2rem' }} src={next} alt="" /></div>
                </div>
            </div>
        </CardWithoutTitle >
    )
}
export default memo(HeatmapReport)
