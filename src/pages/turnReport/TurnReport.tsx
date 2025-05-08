import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import nullImg from '@/assets/image/null.png'
import returnPng from "@/assets/image/return.png";
import dayjs from 'dayjs';
import Heatmap from "@/components/heatmap/Heatmap";
import HeatmapR from "@/components/heatmap/HeatmapModal";
import { secToHourstamp, secToHourstamp1 } from '@/utils/timeConvert';
import { useGetWindowSize } from '@/hooks/hook';
import Card, { CardContainTitle, CardText } from './Card';
import { instance, Instancercv } from '@/api/api';
import { useSelector } from 'react-redux';
import { tokenSelect } from '@/redux/token/tokenSlice';
import { Spin } from 'antd';
// import { secToHourstamp } from '../../assets/util';
const nurseItems = ['助餐', '助浴', '更换床单', '更换衣物', '敷药']
const skinObj: any = {
    '6': '正常',
    '7': '发红',
    '8': '水泡',
    '9': '破溃',
}
const sleepArr = ['仰卧', '左侧卧', '右侧卧']
interface PropsType {
    turnOver?: any
    idturnOver?: string
    id?: any
    logid?: any
}
export default function TurnReport(props: PropsType) {
    const { idturnOver, turnOver } = props
    let location = useLocation()
    const navigate = useNavigate()
    const WindowSize = useGetWindowSize()
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
        startMatrix: '',
        endMatrix: '',
        sensorName: '',
    }) as any
    const isMobile = useGetWindowSize()
    console.log(data, '................datadatadatadata');

    const { logid, id, dataListName } = isMobile ? location.state : props
    const [timeId, setTimeId] = useState()
    const token = useSelector(tokenSelect)
    const leftRef = useRef<any>(null)
    const rightRef = useRef<any>(null)
    // const [useNameList, setUseNameList] = useState([])
    // const paramsName: any = window.location.href.split('/')[4] || ''
    const [dataList, setDataList] = useState<any>([])

    const timeName = data.id && data.id.substring(0, 10);
    const timeMills = logid.split(' ')[0]
    const timeMills1 = logid.split(' ')[1]
    useEffect(() => {
        instance({
            method: "get",
            url: "/sleep/nurse/getRecords",
            params: {
                deviceName: id,
                startTime: new Date(new Date().toLocaleDateString()).getTime(),
                endTime: new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 - 1) * 60 * 1000,
                pageNum: 1,
                pageSize: 99
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
        }).then((res) => {
            const record = res.data.page.records//.map((item :any )=> item.posture)
            let timeId: any = ''

            if (record.length) {
                record.forEach((item: any) => {
                    const id = item.id.split(' ')[1]

                    console.log(id, timeMills1, '............1111.......timeIdtimeIdtimeId');

                    if (id === timeMills1) {
                        timeId = item.id
                    }

                })
            }
            // console.log(timeId, '....................2222...........timeIdtimeIdtimeId');

            instance({
                method: "get",
                url: "/sleep/nurse/getFliplog",
                headers: {
                    "content-type": "multipart/form-data",
                    "token": token
                },
                params: {
                    logid: timeId
                }
            }).then((res) => {
                const data = res.data.data
                const { startMatrix, endMatrix, posture, extra, did, remark, timeMillsEnd, timeMills, id } = data
                console.log(data, extra, 'dat1111a...1111..')
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
                    timeMills: timeMills,
                    id: id,
                    headImg: data.headImg
                }
                setData(obj)
                // const arr = [0,9,13,44,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,15,12,0,12,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,26,27,0,0,0,36,0,20,0,0,0,8,0,6,8,7,0,0,0,0,0,6,9,10,6,37,24,5,0,0,0,5,7,0,0,0,0,0,14,38,0,0,0,0,6,0,6,7,0,0,11,10,13,9,8,0,0,0,0,31,0,8,5,11,8,0,0,0,0,0,0,0,0,19,0,6,8,0,0,5,0,0,7,6,0,0,0,0,5,0,43,8,0,0,32,11,0,9,16,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,8,9,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,8,0,0,13,17,0,28,5,18,0,31,0,0,0,0,6,0,0,0,0,0,0,8,0,0,5,0,0,0,0,0,0,0,0,0,0,7,6,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,5,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,6,9,0,0,0,0,10,7,39,24,13,6,0,0,0,0,0,0,0,0,6,40,14,0,0,0,10,0,0,0,0,7,23,15,11,0,0,5,6,6,10,29,22,8,17,13,0,7,6,0,0,5,0,9,0,28,25,12,0,5,8,0,47,0,0,0,0,0,0,0,0,0,6,25,0,6,0,0,0,0,0,0,0,0,0,5,23,21,5,61,7,75,7,7,0,0,0,30,6,0,9,14,20,0,0,6,6,18,5,0,0,0,0,0,32,10,5,15,5,11,12,25,19,5,0,0,0,0,0,0,0,26,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,13,14,9,11,44,0,0,17,0,0,13,0,0,0,8,7,0,0,0,0,0,0,20,6,0,0,0,5,27,21,6,10,17,0,0,5,0,34,8,0,0,19,6,0,0,0,0,0,0,0,0,15,7,0,0,0,0,0,7,47,9,5,6,38,14,0,5,0,0,10,34,11,6,0,0,0,0,0,0,0,0,0,9,32,0,0,0,0,0,0,7,8,6,0,7,0,0,0,13,0,0,5,0,0,0,14,0,0,0,0,0,5,28,0,0,0,0,0,0,31,0,0,0,0,0,13,0,0,0,0,6,0,0,0,8,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,27,8,9,0,0,0,0,0,0,5,16,10,8,0,0,0,8,13,12,6,0,11,0,22,11,5,0,0,0,0,31,6,9,5,12,20,17,7,0,0,0,23,23,14,5,28,0,0,5,5,15,16,13,5,0,9,0,7,11,40,10,0,0,0,10,13,11,9,7,44,24,16,34,23,56,48,53,39,67,15,20,85,70,35,33,30,14,17,10,38,44,38,15,0,26,20,19,105,88,60,51,65,50,50,83,29,91,34,16,19,20,9,19,29,73,23,15,13,22,34,32,34,55,23,74,44,85,90,96,51,101,94,105,113,85,22,27,73,42,60,50,22,10,17,46,100,22,38,50,12,9,24,34,33,18,22,24,8,33,12,17,29,57,26,89,95,54,153,40,38,39,48,116,68,70,12,19,30,35,63,48,62,17,18,19,60,47,83,58,17,23,16,29,54,59,39,31,60,44,39,13,33,22,50,22,63,149,84,99,61,91,19,36,23,10,59,110,65,27,23,32,22,108,84,56,56,27,106,39,17,16,10,7,45,28,23,26,45,16,31,243,115,120,36,69,13,12,80,31,47,23,65,14,7,49,43,26,17,23,13,13,19,48,12,5,19,26,59,20,68,64,18,17,8,21,88,97,90,48,82,19,84,77,38,82,19,80,13,26,110,35,19,27,39,38,109,33,204,111,33,15,43,18,5,18,36,14,19,76,62,7,25,56,57,22,45,30,7,26,65,44,14,66,94,28,49,52,31,29,41,132,85,149,16,57,20,44,31,27,49,32,121,27,100,60,48,84,63,43,18,90,93,131,93]
                // if (leftRef.current) leftRef.current.bthClickHandle(arr)
                // if (rightRef.current) rightRef.current.bthClickHandle(JSON.parse(endMatrix))
            }).catch((err) => {
            })
        }).catch((err) => [
            console.log(err)
        ])
        Instancercv({
            method: "get",
            url: "/device/selectSinglePatient",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                sensorName: id,
                phoneNum: localStorage.getItem('phone')
            }
        }).then((res: any) => {
            setDataList(res.data.data)
        })

    }, [])
    // useEffect(() => {
    //     console.log(leftRef.current, '000', rightRef.current, '99', data.startMatrix, '222222222222')
    // if (leftRef.current) leftRef.current.bthClickHandle(data.startMatrix || [])
    // if (rightRef.current) rightRef.current.bthClickHandle(data.endMatrix || [])
    // }, [leftRef, rightRef, data.endMatrix,])
    // charge_man
    return (
        <>
            {/* <div className='flex items-center justify-center w-full h-full bg-[#fff] z-30'>
                {
                    !isMobile && data.startMatrix == '' && data.endMatrix == '' ? <Spin /> : ''
                }
            </div> */}
            {
                isMobile ?
                    <div className='flex items-center justify-center w-full h-[100vh] bg-[#fff] z-30'>
                        {
                            data.startMatrix == '' && data.endMatrix == '' ? <Spin /> :
                                <div className='nurseReport2 font' style={{ height: '100vh', display: 'flex', flexDirection: "column" }}>
                                    <div className="nurseTitleReal" style={{ margin: '1rem 0' }}>
                                        <img src={returnPng} alt="" onClick={() => {
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
                                                    {/* <div className="img" style={{
                                          background: `url(${data.headImg ? data.headImg : nullImg
                                              })  center center / cover no-repeat`,
                                      }}></div> */}
                                                    <img src={dataList.headImg ? dataList.headImg : nullImg} alt="" />
                                                </div>
                                                <div className="itemContents">
                                                    <div className="personalName">{dataList.patientName}</div>
                                                    <div className="itemContent">
                                                        <div className="itemTitle">年龄</div>
                                                        <div className="itemData">{dataList.age}</div>
                                                    </div>
                                                    <div className="itemContent">
                                                        <div className="itemTitle">床号</div>
                                                        <div className="itemData">{dataList.roomNum}</div>
                                                    </div>
                                                    <div className="itemContent">
                                                        <div className="itemTitle">护理日期</div>
                                                        <div className="itemData">{timeMills}</div>
                                                    </div>
                                                    <div className="itemContent">
                                                        <div className="itemTitle">护理员</div>
                                                        <div className="itemData">{dataList.chargeMan}</div>
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
                                                <div>{dayjs((data.timeMills)).format('HH:mm')}</div>
                                            </div>
                                        </CardText>
                                        <CardContainTitle title={'护理前后压力对比'}>
                                            {/* <div className="secondHint">
                          护理前后对比
                      </div> */}
                                            <div className="secondHeatmap justify-between">
                                                <div style={{ flex: `0 0 calc(50% - 0.4rem)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                                    <div style={{ width: '100%' }}>
                                                        <Heatmap ref={leftRef} width={'100%'}
                                                            data={data.startMatrix || []}
                                                            index={5} type={data.type} sensorName={data.sensorName} />
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                                                            <div className='text-[1rem]' style={{ textAlign: 'center', padding: '0.5rem 1rem', }}>护理前</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ flex: `0 0 calc(50% - 0.4rem)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                                    <div style={{ width: '100%' }}>
                                                        <HeatmapR ref={rightRef} less={3} index={12}
                                                            data={data.endMatrix || []}
                                                            type={data.type} sensorName={data.sensorName} />
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

                                            {data.sleepPosImg !== 'extraData' ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>

                                                <div>在床照片</div>
                                                <div><img src={data.sleepPosImg} style={{ height: '6rem' }} alt="" /></div>
                                            </div> : ''}
                                        </CardContainTitle>

                                    </div>
                                </div>
                        }
                    </div>
                    :
                    <div className='flex items-center justify-center w-full h-[33rem] bg-[#fff] z-30'>
                        {data.startMatrix == '' && data.endMatrix == '' ? <Spin /> :

                            <div className='w-full h-[33rem]  bg-[#F7F8FD]'>
                                <div className='w-full h-[10rem] bg-[#FFFFFF] rounded-md'>
                                    <div className='h-[3.8rem] px-[1rem] flex  lh-[3,7rem]' style={{ width: '95%', margin: '0 auto', borderBottom: "solid 1px #ccc" }}>
                                        <div className='h-[1.35rem] w-full flex  justify-center text-[1rem] font-bold  mt-[1.3rem]' style={{ fontSize: " Source Han Sans" }}>{dataList.patientName}的护理报告</div>
                                        {/* <div className='mt-[1.78rem] ml-[6.9rem] text-[#888888]'>护理员编号{dataList.chargeMan}</div> */}
                                    </div>
                                    <div className='mt-[0.8rem] flex' style={{ width: '95%', margin: '0.8rem auto 0', }}>
                                        <div className="">
                                            <img style={{ width: "4rem", height: "4rem" }} src={dataList.headImg ? dataList.headImg : nullImg} alt="" />
                                        </div>
                                        <div className="ml-[1.35rem]">
                                            <div className="w-[5.7rem] h-[1.3rem] text-[#3D3D3D]  font-bold" style={{ fontFamily: 'Source Han Sans' }}>{dataList.patientName}</div>
                                            <div className='flex mt-[7px]'>
                                                <div className="w-[10rem]">
                                                    <div className=" "><span className='text-[#888888]'>年龄</span><span className='font-bold ml-[0.75rem]' style={{ fontFamily: 'Source Han Sans' }}>{dataList.age}</span></div>
                                                    <div><span className=' text-[#888888]'>护理员</span><span className='font-bold ml-[1rem]' style={{ fontFamily: 'Source Han Sans' }}>{dataList.chargeMan}</span></div>
                                                </div>
                                                <div className="w-[11rem]">
                                                    <div className=""><span className=' text-[#888888]'>床号</span><span style={{ fontFamily: 'Source Han Sans' }} className='font-bold  ml-[0.75rem]'>{dataList.roomNum}</span></div>
                                                    <div className='w-[20rem]'><span className=' text-[#888888]'>护理日期</span><span style={{ fontFamily: 'Source Han Sans' }} className='font-bold w-[8rem]  ml-[0.7rem]'>{timeMills}</span></div>
                                                </div>
                                                <div className="w-[5rem] ml-[3rem]">
                                                    <div><span className=' text-[#888888]'>性别</span><span style={{ fontFamily: 'Source Han Sans' }} className='font-bold  ml-[0.75rem]'>男</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full mt-[0.6rem] flex bg-[#F7F8FD]' >
                                    <div className='mr-[0.6rem]'>
                                        <div className='w-[8.3rem] h-[5.4rem] bg-[#fff] rounded-md' style={{}}>
                                            <div className='text-[#000000] text-[0.9rem] font-bold pt-[1rem]  pl-[1.1rem]' style={{ fontFamily: 'Source Han Sans' }}>在床时间</div>
                                            <div style={{ fontWeight: "800" }} className=' pt-[1rem] pl-[1.1rem]'>
                                                {secToHourstamp1(parseInt(data.onBedTime))}
                                                {/* {dayjs((data.timeMills)).format('HH:mm')} */}
                                            </div>
                                        </div>
                                        <div className='w-[8.3rem]  mt-[0.6rem] h-[5.4rem] bg-[#fff] rounded-md' style={{}}>
                                            <div className='text-[#000000] text-[0.9rem] font-bold pt-[1rem]  pl-[1.1rem]' style={{ fontFamily: 'Source Han Sans' }}>翻身时间</div>
                                            <div style={{ fontWeight: "800" }} className=' pt-[1rem] pl-[1.1rem]'>{dayjs((data.timeMills)).format('HH:mm')}</div>
                                        </div>

                                        < div className='h-[10rem] w-[8.3rem] mt-[0.6rem]  bg-[#fff] rounded-md'>
                                            <div className='text-[#000000] text-[0.9rem] font-bold pt-[1rem]  pl-[1.1rem]' style={{ fontFamily: 'Source Han Sans' }}>睡姿记录</div>

                                            <div className='pt-[0.5rem] pl-[1.1rem]'>{sleepArr[data.sleepPos]}</div>
                                            {data.sleepPosImg !== 'extraData' ?
                                                <img className='pt-[0.5rem] pl-[1.1rem]' style={{ width: "6.6rem", height: "5.6rem", }} src={data.sleepPosImg ? data.sleepPosImg : nullImg} alt="" />
                                                : '  '}
                                            {/* <img src={data.headImg} style={{ height: '6rem' }} alt="" /> */}
                                        </div>

                                    </div>
                                    <div className='flex-1 h-[22rem]'>
                                        <CardContainTitle style={{ color: "#000000", }} title={'护理前后压力对比'}>
                                            <div className="flex secondHeatmap justify-between" style={{ height: isMobile ? '' : '17.6rem' }}>
                                                <div style={{ flex: 1, marginRight: '1rem', height: "3rem" }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile ? '0.5rem' : "0" }}>
                                                        <div style={{ textAlign: 'center', padding: isMobile ? '0.5rem 1rem' : "0", fontSize: isMobile ? '1rem' : '0.75rem', fontFamily: isMobile ? '' : 'Source Han Sans', color: isMobile ? "" : "#ccc" }}>护理前</div>
                                                    </div>
                                                    <div style={{ width: '100%', height: "17rem" }}>
                                                        <Heatmap
                                                            ref={leftRef}
                                                            width={'100%'}
                                                            data={data.startMatrix || []}
                                                            index={5}
                                                            type={data.type}
                                                            height='17rem'
                                                            sensorName={data.sensorName} />

                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, height: "3rem" }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile ? '0.5rem' : "0" }}>
                                                        <div style={{ textAlign: 'center', padding: isMobile ? '0.5rem 1rem' : "0", fontSize: isMobile ? '1rem' : '0.75rem', fontFamily: isMobile ? '' : 'Source Han Sans', color: isMobile ? '' : "#ccc" }}>护理后</div>
                                                    </div>
                                                    <div style={{ width: '100%', height: "17rem" }}>
                                                        <HeatmapR
                                                            ref={rightRef}
                                                            less={3}
                                                            index={12}
                                                            data={data.endMatrix || []}
                                                            width={'100%'}
                                                            height='100%'
                                                            type={data.type}
                                                            sensorName={data.sensorName} />

                                                    </div>
                                                </div>
                                            </div>
                                        </CardContainTitle>
                                    </div>
                                </div >
                            </div >
                        }
                    </div>

            }
        </>

    )
}
