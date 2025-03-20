import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import nullImg from '@/assets/image/null.png'
import returnPng from "@/assets/image/return.png";
import dayjs from 'dayjs';
import Heatmap from "@/components/heatmap/Heatmap";
import HeatmapR from "@/components/heatmap/HeatmapModal";
import { secToHourstamp } from '@/utils/timeConvert';
import { useGetWindowSize } from '@/hooks/hook';
import Card, { CardContainTitle, CardText } from './Card';
import { instance } from '@/api/api';
import { useSelector } from 'react-redux';
import { tokenSelect } from '@/redux/token/tokenSlice';
// import { secToHourstamp } from '../../assets/util';

const nurseItems = ['助餐', '助浴', '更换床单', '更换衣物', '敷药']

const skinObj: any = {
    '6': '正常',
    '7': '发红',
    '8': '水泡',
    '9': '破溃',
}

const sleepArr = ['仰卧', '左侧躺', '右侧躺']



export default function TurnReport() {
    let location = useLocation()
    const navigate = useNavigate()
    // const data = location.state
    // const data = {
    //     normalArrRes: '',
    //     inputArrRes: '',
    //     selectArrRes: '',
    //     imgArrRes: '',
    //     headImg: nullImg,
    //     name: 'liuda',
    //     age: 12,
    //     roomNum: 100,
    //     date: '12',
    //     chargeMan: '123',
    //     onBedTime: '12',
    //     startMatrix: [],
    //     endMatrix: [],
    //     sensorName: '',
    //     type: '',
    //     sleepPos: 1,
    //     sleepPosImg: ''
    // }
    const [data, setData] = useState<any>({
        startMatrix: [],
        endMatrix: [],
    })
    const logid = location.state.logid
    const token = useSelector(tokenSelect)
    const isMobile = useGetWindowSize()

    console.log(logid)

    const leftRef = useRef<any>(null)
    const rightRef = useRef<any>(null)

    useEffect(() => {

        instance({
            method: "get",
            url: "/sleep/nurse/getFliplog",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                logid: logid
            }
        }).then((res) => {
            console.log(res.data.data)
            const data = res.data.data
            const { startMatrix, endMatrix, posture, extra, did, remark, timeMillsEnd } = data
            console.log(JSON.parse(JSON.parse(startMatrix)))
            let obj = {
                //     normalArrRes: '',
                //     inputArrRes: '',
                //     selectArrRes: '',
                //     imgArrRes: '',
                //     headImg: nullImg,
                //     name: 'liuda',
                //     age: 12,
                //     roomNum: 100,
                //     date: '12',
                //     chargeMan: '123',
                onBedTime: Number(remark),
                startMatrix: JSON.parse(JSON.parse(startMatrix)),
                endMatrix: JSON.parse(JSON.parse(endMatrix)),
                sensorName: did,
                //     type: '',
                sleepPos: posture,
                sleepPosImg: extra,
                turnTime: timeMillsEnd,
            }
            setData(obj)
            // if (leftRef.current) leftRef.current.bthClickHandle(startMatrix)
            // if (rightRef.current) rightRef.current.bthClickHandle(endMatrix)
        }).catch((err) => {

        })
    }, [])

    // console.log(data, normalArr, JSON.parse(data.inputArrRes))
    return (

        <div className='nurseReport2 font' style={{ height: '100vh', display: 'flex', flexDirection: "column" }}>
            <div className="nurseTitleReal" style={{ margin: '1rem 0' }}>
                <img src={returnPng} onClick={() => {
                    navigate(-1)
                    // navigate(`${location.state.router}`, { state: { ...location.state.props, date: location.state.date, select: location.state.router.includes('small') ? 1 : 2 } })
                }} style={{ width: '2rem', position: 'absolute', left: '1rem' }} />护理报告</div>
            <div className="nurseReportContent">
                <Card>
                    {/* <div className="bgc">
                        <img src={data.img} style={{ width: '6rem',}} alt="" />
                    </div> */}
                    <div className="personLeft">
                        <div className="personalImg">
                            <div className="img" style={{
                                background: `url(${data.headImg ? data.headImg : nullImg
                                    })  center center / cover no-repeat`,
                            }}></div>
                            {/* <img src={showUserinfo.img} alt="" /> */}
                        </div>

                        <div className="itemContents">
                            <div className="personalName">{data.name}</div>

                            <div className="itemContent">
                                <div className="itemTitle">年龄</div>
                                <div className="itemData">{data.age}</div>
                            </div>
                            <div className="itemContent">
                                <div className="itemTitle">床号</div>
                                <div className="itemData">{data.roomNum}</div>
                            </div>

                            <div className="itemContent">
                                <div className="itemTitle">护理日期</div>
                                <div className="itemData">{dayjs(data.date).format('YYYY-MM-DD')}</div>
                            </div>
                            <div className="itemContent">
                                <div className="itemTitle">护理员</div>
                                <div className="itemData">{data.chargeMan}</div>
                            </div>

                        </div>
                    </div>
                </Card>
                <CardText>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>在床时间</div>
                        <div>{secToHourstamp(parseInt(data.onBedTime))}</div>
                    </div>
                </CardText>

                <CardText>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>翻身时间</div>
                        <div>{dayjs((data.turnTime)).format('HH:mm')}</div>
                    </div>
                </CardText>

                <CardContainTitle title={'护理前后对比'}>
                    {/* <div className="secondHint">
                        护理前后对比
                    </div> */}
                    <div className="secondHeatmap justify-between">
                        <div style={{ flex: `0 0 calc(50% - 0.4rem)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <div style={{ width: '100%' }}>
                                <Heatmap ref={leftRef} width={'100%'} data={data.startMatrix} index={5} type={data.type} sensorName={data.sensorName} />
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    <div className='text-[1rem]' style={{ textAlign: 'center', padding: '0.5rem 1rem', }}>护理前</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: `0 0 calc(50% - 0.4rem)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <div style={{ width: '100%' }}>
                                <HeatmapR ref={rightRef} less={3} index={12} data={data.endMatrix} type={data.type} sensorName={data.sensorName} />
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    <div className='text-[1rem]' style={{ textAlign: 'center', padding: '0.5rem 1rem', }}>护理后</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContainTitle>

                <CardContainTitle title={'睡姿记录'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <div>睡姿</div>
                        <div>{sleepArr[data.sleepPos]}</div>
                    </div>
                    {data.sleepPosImg ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <div>在床照片</div>
                        <div><img src={data.sleepPosImg} style={{ height: '6rem' }} alt="" /></div>
                    </div> : ''}
                </CardContainTitle>

            </div>
        </div>
    )
}
