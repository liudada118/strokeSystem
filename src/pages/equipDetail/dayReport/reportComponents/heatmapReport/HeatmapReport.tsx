import React, { memo, useEffect, useRef, useState } from 'react'
import Heatmap from '@/components/heatmap/Heatmap'
import last from '@/assets/image/last.png'
import next from '@/assets/image/next.png'
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


            if (heatMapRef.current && res.data.data.length) {
                setHeatmapData((res.data.data))
                heatMapRef.current.bthClickHandle(JSON.parse(res.data.data[0].data))
                setProgressTime(dayjs(res.data.data[0].timeMills).format('HH:mm'))
            } else {
                setHeatmapData([{ data: new Array(1024).fill(0) }])
                if (heatMapRef.current) heatMapRef.current.bthClickHandle([{ data: new Array(1024).fill(0) }])
            }
        })
    }

    const changeLeftProgress = (e: any) => {
        // 当帧条被按住调节帧时
        if (lineFlag &&  document.querySelector(".pressProgressIndex")) {
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

            let value = changePxToValue({ value: lineleft, type: "line", length: 60, progressWidth, lineWidth });
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

        let value = changePxToValue({ value: lineleft, type: "line", length: 60, progressWidth, lineWidth });
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
                heatMapRef.current.bthClickHandle(JSON.parse(heatmapData[value].data))
                setProgressTime(dayjs(heatmapData[value].timeMills).format('HH:mm'))
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
                        <div style={{ width: '100%' }}>
                            {/* <HeatmapH data={heatmapData} index={5} type={'large'} sensorName={props.sensorName} /> */}
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
                    <span className='sleepDataUtil'>{progressTime}</span>
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
                    <div className="progressLeftButton" onClick={() => oneHourBefore()}> <img style={{ height: '0.8rem', marginRight: '0.2rem' }} src={last} alt="" /> 前一小时</div>
                    <div className="progressTime">
                        {dayjs(new Date(props.dayDate).setHours(0, 0, 0, 0) + onbedDate).format('HH:mm')}-{dayjs(new Date(props.dayDate).setHours(0, 0, 0, 0) + onbedDate + 1 * 59 * 60 * 1000).format('HH:mm')}
                    </div>
                    <div className="progressRightButton" onClick={() => afterAnHour()}>  后一小时 <img style={{ height: '0.8rem', marginLeft: '0.2rem' }} src={next} alt="" /></div>
                </div>
            </div>
        </CardWithoutTitle >
    )
}

export default memo(HeatmapReport)
