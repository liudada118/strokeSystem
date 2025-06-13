import { useGetWindowSize } from '@/hooks/hook'
import { alarmSelect, deleteAlarm, equipPcPlaySelect, equipPcSelect, equipPlaySelect, equipSelect, fetchEquips, newVoiceExampleSelect } from '@/redux/equip/equipSlice'
import { Button, Carousel, Empty, message, Popover, Skeleton, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { equip } from './Home'
import { alarmStampToTime, alarmtype, ALARMTYPE } from '@/redux/equip/equipUtil'

// import { fetchEquips } from '../../redux/equip/equipSlice'
import newAlarmBgc from "@/assets/image/newAlarmBgc.png";
import top from "../../assets/image/top.png";
import setTop from "../../assets/image/settop.png";
import sitTop from "../../assets/image/sitTop.png";
import sitSetTop from "../../assets/image/sitSetTop.png";
import sitHeart from '../../assets/image/sitHeart.png'
import sitRate from '../../assets/image/sitRate.png'
import newHeart from '../../assets/image/newHeart.png'
import newRate from '../../assets/image/newRate.png'
import { nurseInfoClass, OnBedState, onBedState, onBedStateText, onBedStateTime, stateToObj } from './TimeState'
import { useNavigate, useLocation } from 'react-router-dom'
import { equip } from '.'
import { netUrl, instance, fetchDatarcv } from '../../api/api'
import AddUseModla from '../../components/Modal/addUseModla'
import addImg from '../../assets/image/add.jpg'
import { initEquipPc } from "@/redux/equip/equipUtil";
import { setHomeSelectValue, setHomeSelectType } from '../../redux/home/home'
import HomeImg from '@/assets/image/hoemAdd.png'
import { nurseOpen } from "@/redux/Nurse/Nurse";
// import { setHomeSelectValue } from '../../redux/home/home'

export default function Equip() {
    const navigate = useNavigate()
    const equip = useSelector(equipPlaySelect)
    const equipPc = useSelector(equipPcPlaySelect)
    const newVoiceExample = useSelector(newVoiceExampleSelect)
    const alarm = useSelector(alarmSelect)
    const homeSelectValue = useSelector((state: any) => state.home.homeSelectValue)
    const homeSelectType = useSelector((state: any) => state.home.homeSelectType)
    const isMobile = useGetWindowSize()
    const alarmConfirmFunSensorName = ({ sensorName }: any) => {
        dispatch(deleteAlarm({ sensorName }))
    }
    const dispatch: any = useDispatch()
    const [fals, setFals] = useState(false)
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [equipPc1, setequipPc] = useState()
    const [datalist, setDataList] = useState([])
    const [datalistOld, setDataListOld] = useState([])
    const [isFalse, setFasle] = useState(false)
    const location = useLocation();
    useEffect(() => {
        dispatch(setHomeSelectValue(''))
        dispatch(setHomeSelectType('patientName'))
    }, [location]);
    useEffect(() => {
        if (!homeSelectValue && equipPc.length > 0 && JSON.stringify(datalistOld) !== JSON.stringify(equipPc)) {
            setDataListOld(equipPc)
            const datalist = JSON.parse(JSON.stringify(equipPc))
            // datalist[datalist.length - 1].push({ type: 'add' })
            setDataList(datalist)
            setFasle(true)
        }
    }, [equipPc, homeSelectValue])
    useEffect(() => {
        if (homeSelectValue) {
            const res = equip.filter((equip: any) => {
                return equip[homeSelectType] && equip[homeSelectType].toString().includes(homeSelectValue)
            })
            // res.unshift({ type: 'add' })
            const list = initEquipPc(res)
            const datalist = JSON.parse(JSON.stringify(list))

            setDataList(datalist)
        }
    }, [homeSelectValue])
    const [i, setI] = useState()
    const data = () => {
        try {
            instance({
                method: "get",
                url: netUrl + "/device/selectDeviceWithPatient",
                params: {
                    phoneNum: phone,
                    pageSize: 500,
                },
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token": token
                },
            }).then((res: any) => {

                setequipPc(res.data.data.records)
            });
        } catch (error) {

        }
    }
    useEffect(() => {
        data()
    }, [fals])
    //   设备置顶
    const setEquipTop = (did: string, index: any) => {
        instance({
            method: "post",
            url: netUrl + "/device/stickDevice",
            params: {
                phoneNum: phone,
                orderNum: index + 1,
                deviceName: did,
            },
        }).then((res: any) => {
            message.success(res.data.msg)
            setFals(true)
            dispatch(fetchEquips())
            setI(index)
        });
    };
    //   设备取消置顶
    const setEquipUnTop = (did: string, index: any) => {
        instance({
            method: "post",
            url: netUrl + "/device/stickDevice",
            params: {
                phoneNum: phone,
                orderNum: 0,
                deviceName: did,
            },
        }).then((res) => {
            message.success('取消置顶成功')
            setFals(false)
            dispatch(fetchEquips())
        });
    };
    // 添加设备
    const [isOPen, setOpen] = useState(false)
    const onOPen = () => {
        setOpen(true)
        setFals(true)
    }
    console.log(datalist, '.................................build/apkTest/staticbuild/apkTest/staticbuild/apkTest/static');

    return (
        <div className="main"

        >
            {
                isOPen ? <AddUseModla isAddModalOpen={isOPen} onClose={((val: boolean) => setOpen(val))}></AddUseModla> : null
            }
            {
                datalist.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> : ''
            }
            {!isMobile ? <Carousel
                className='Equipcarousel'
                // arrows
                // afterChange={onChange}
                dots={datalist.length > 1}
                autoplaySpeed={6000} >
                {datalist.length ? datalist.map((equips: Array<equip>, indexs: any) => {
                    return <div className="equipsContent" key={indexs + 'equips'}>
                        <div className={`equips`}>
                            {equips?.map((item, index) => {
                                const alarmInfo = alarm.filter((a: any) => {
                                    return a.sensorName == item.sensorName
                                })
                                if (item.type === 'add') {
                                    return <div style={{ width: "13.2rem", marginRight: "1rem", height: "14.5rem", borderColor: "#F5F8FA", boxShadow: "0px 0px 10px 0px rgba(164, 176, 188, 0.4)", borderRadius: "0.63rem", marginBottom: "1rem", border: "1px #ccc solid", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: 'column' }} key={index}>
                                        <img className='w-[7rem] h-[7rem] mb-[1rem]' onClick={() => onOPen()} src={HomeImg} alt="" />
                                        <Button onClick={() => onOPen()} color="primary" style={{ color: "#fff", borderRadius: "3rem", background: "#fff !important", border: "solid 1px " }}>添加设备</Button>
                                    </div>
                                }
                                return (
                                    <div className={`equip`} key={index + 'HomeEquips'}
                                        onClick={() => {

                                        }}
                                    >
                                        {
                                            alarmInfo && alarmInfo.length > 0 &&
                                            <>
                                                {/* {
                                                alarmInfo[0].type === 'onBed' ? */}

                                                <div className="newAlarmContent">
                                                    <img style={{ position: 'absolute', width: '100%', bottom: '0', left: 0, opacity: '0.5' }} src={newAlarmBgc} alt="" />
                                                    <div className='flex'>
                                                        <div style={{ position: 'absolute', width: '2rem', height: '2rem', textAlign: 'center', right: '0.5rem', top: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)', color: '#EC6E38', lineHeight: '2rem', fontWeight: '600', fontSize: '1rem' }}>{alarmStampToTime(Number(alarmInfo[0].time))}</div>
                                                    </div>

                                                    <div className="newAlarmTypeAndInfo">
                                                        <div className="newAlarmType" style={{ width: '8.5rem' }}><div >{ALARMTYPE[alarmInfo[0].type as alarmtype].text}</div> </div>
                                                        <div className="newAlarmInfo" style={{ width: '8rem' }}>
                                                            <div className="newAlarmRoomnum newAlarmText" >
                                                                {alarmInfo[0].roomNum}
                                                            </div>
                                                            <div className="newAlarmNum newAlarmText">{alarmInfo[0].name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="newAlarmButton"
                                                        onClick={() => {
                                                            alarmConfirmFunSensorName({ a: alarmInfo[0], sensorName: item.sensorName })
                                                            // console.log(alarmInfo[0].roomNum ,'roomNum')
                                                            // alert(alarmInfo[0].roomNum)
                                                            newVoiceExample.clickVoice(alarmInfo[0].roomNum)
                                                        }}
                                                    >我已知晓</div>
                                                </div>
                                            </>
                                        }
                                        <div className={`equipItem  ${stateToObj[onBedState(item)].class}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                if (item.type == 'large') {

                                                    navigate(`/report/0/${item.sensorName}`, {
                                                        state: {
                                                            person: item
                                                        },
                                                    });
                                                    dispatch(nurseOpen(false))
                                                }
                                                else {

                                                    navigate(`/report/0/${item.sensorName}`, {
                                                        state: {
                                                            person: item
                                                        },
                                                    });
                                                    dispatch(nurseOpen(false))
                                                }
                                            }}
                                        >
                                            <div className="equipInfos">
                                                <p className="equipName">{item.roomNum}</p>
                                                <div className="equipTextInfo">
                                                </div>
                                                {item.orderNum > 0 ? (
                                                    <div
                                                        className="equipTop"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setEquipUnTop(item.sensorName, item.orderNum);
                                                        }}
                                                    >
                                                        <img src={item.onBed == 4 ? sitTop : top} alt="" />
                                                    </div>
                                                ) : <div
                                                    className="equipUnTop"
                                                    onClick={(event) => {
                                                        event.stopPropagation();


                                                        setEquipTop(item.sensorName, item.orderNum);
                                                    }}
                                                >

                                                    <img src={item.orderNum == 0 ? setTop : sitSetTop} alt="" />
                                                </div>}
                                            </div>
                                            <div className="equipData">
                                                <div className="heartContent">
                                                    <div className="equipRoom">{item.patientName}
                                                    </div>
                                                </div>
                                                <div className="heartContent">
                                                    <div className="equipTitle"  >
                                                        <img className="equipTitleImg" src={item.onBed == 4 ? sitHeart : newHeart} alt="" /></div>
                                                    <div className="equipText">
                                                        {item.onBed ? item.heartRate ? item.breath == 88 || item.breath == -1 ? <Spin /> : item.heartRate : '--' : '--'}
                                                    </div>
                                                </div>
                                                <div className="breatheContent">
                                                    <div className="equipTitle"  >
                                                        <img className="equipTitleImg" src={item.onBed == 4 ? sitRate : newRate} alt="" /></div>
                                                    <div className="equipText">
                                                        {item.onBed ? item.breath ? item.breath == 88 || item.breath == -1 ? <Spin /> : item.breath : '--' : '--'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`nurseInfo ${nurseInfoClass(item)}`}
                                            >
                                                <div className="nurseTitle" > {onBedStateText(item)}</div>
                                                <div className="nurseTime">{onBedStateTime(item)}</div>
                                            </div>
                                            <div className="onbedState">
                                                <OnBedState item={item} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }) : <></>}
            </Carousel> :
                <div className="equipsContent">
                    <div className={`equips`}>
                        {datalist.length > 0 ? datalist?.flat()?.map((item: equip, indexs: any) => {
                            const alarmInfo = alarm.filter((a: any) => {
                                return a.sensorName == item.sensorName
                            })
                            if (item.type === 'add') {
                                return ''
                            }
                            return (
                                <div className={`equip`} key={item.sensorName}
                                    onClick={(e) => {

                                        navigate(`/report/0/${item.sensorName}`, {
                                            state: {
                                                person: item
                                            },
                                        });
                                        dispatch(nurseOpen(false))
                                    }}
                                >
                                    {alarmInfo.length ?
                                        < div className="newAlarmContent">
                                            <img style={{ position: 'absolute', width: '100%', bottom: '0', left: 0, opacity: '0.5' }} src={newAlarmBgc} alt="" />
                                            <div style={{ position: 'absolute', width: '2rem', height: '2rem', textAlign: 'center', right: '0.5rem', top: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)', color: '#EC6E38', lineHeight: '2rem', fontWeight: '600', fontSize: '1rem' }}>{alarmStampToTime(Number(alarmInfo[0].time))}</div>
                                            <div className="newAlarmTypeAndInfo">
                                                <div className="newAlarmType" style={{ width: '8.5rem' }}><div >{ALARMTYPE[alarmInfo[0].type as alarmtype].text}</div> </div>
                                                <div className="newAlarmInfo" style={{ width: '7.8rem' }}>
                                                    <div className="newAlarmRoomnum newAlarmText" >
                                                        {alarmInfo[0].roomNum}
                                                    </div>
                                                    <div className="newAlarmNum newAlarmText">{alarmInfo[0].name}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="newAlarmButton"
                                                onClick={(e) => {

                                                    e.stopPropagation();
                                                    newVoiceExample.clickVoice(alarmInfo[0].roomNum)
                                                    alarmConfirmFunSensorName({ a: alarmInfo[0], sensorName: item.sensorName })
                                                }}
                                            >我已知晓</div>
                                        </div> : ''}

                                    <div
                                        className={`equipItem  ${stateToObj[onBedState(item)].class}`}
                                        onClick={() => {
                                            if (item.type == 'large') {

                                                navigate(`/report/0/${item.sensorName}`, {
                                                    state: {
                                                        person: item
                                                    },
                                                });
                                                dispatch(nurseOpen(false))
                                            }
                                            else {

                                                navigate(`/report/0/${item.sensorName}`, {
                                                    state: {
                                                        person: item
                                                    },
                                                });
                                                dispatch(nurseOpen(false))

                                            }
                                        }}
                                    >
                                        <div className="equipInfos">
                                            <p className="equipName">{item.roomNum}</p>
                                            <div className="equipTextInfo">
                                            </div>

                                            {item.orderNum > 0 ? (
                                                <div
                                                    className="equipTop"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setEquipUnTop(item.sensorName, item.orderNum);
                                                    }}
                                                >
                                                    <img src={item.onBed == 4 ? sitTop : top} alt="" />
                                                </div>
                                            ) : <div
                                                className="equipUnTop"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setEquipTop(item.sensorName, item.orderNum);
                                                }}
                                            >
                                                <img src={item.onBed == 4 ? sitSetTop : setTop} alt="" />
                                            </div>}
                                        </div>
                                        <div className="equipData">
                                            <div className="heartContent">
                                                <div className="equipRoom">{item.patientName}
                                                </div>
                                            </div>
                                            <div className="heartContent">
                                                <div className="equipTitle"  >
                                                    <img className="equipTitleImg" src={item.onBed == 4 ? sitHeart : newHeart} alt="" /></div>
                                                <div className="equipText">
                                                    {item.heartRate ? item.breath == 88 || item.breath == -1 ? <Spin /> : item.heartRate : '--'}
                                                </div>
                                            </div>
                                            <div className="breatheContent">
                                                <div className="equipTitle"  >
                                                    <img className="equipTitleImg" src={item.onBed == 4 ? sitRate : newRate} alt="" /></div>
                                                <div className="equipText">
                                                    {item.breath ? item.breath == 88 || item.breath == -1 ? <Spin /> : item.breath : '--'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`nurseInfo ${nurseInfoClass(item)}`} >
                                            <div className="nurseTitle" > {onBedStateText(item)}</div>
                                            <div className="nurseTime">{onBedStateTime(item)}</div>
                                        </div>
                                        <div className="onbedState">
                                            <OnBedState item={item} />
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : ''}
                    </div>
                </div>
            }
        </div >
    )
}
