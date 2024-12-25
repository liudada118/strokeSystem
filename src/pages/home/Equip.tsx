import { useGetWindowSize } from '@/hooks/hook'
import { alarmSelect, deleteAlarm, equipPcPlaySelect, equipPcSelect, equipPlaySelect, equipSelect, fetchEquips } from '@/redux/equip/equipSlice'
import { Carousel, Popover, Spin } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { equip } from './Home'
import { alarmStampToTime, alarmtype, ALARMTYPE } from '@/redux/equip/equipUtil'


import newAlarmBgc from "@/assets/image/newAlarmBgc.png";
import top from "../../assets/image/top.png";
import setTop from "../../assets/image/settop.png";
import sitTop from "../../assets/image/sitTop.png";
import sitSetTop from "../../assets/image/sitSetTop.png";
import sitHeart from '../../assets/image/sitHeart.png'
import sitRate from '../../assets/image/sitRate.png'
import newHeart from '../../assets/image/newHeart.png'
import newRate from '../../assets/image/newRate.png'

import { phoneSelect, tokenSelect } from '@/redux/token/tokenSlice'
// import { alarmStampToTime } from './util'
import { nurseInfoClass, OnBedState, onBedState, onBedStateText, onBedStateTime, stateToObj } from './TimeState'
import { useNavigate } from 'react-router-dom'
import { mqttSelect } from '@/redux/mqtt/mqttSlice'
import { equip } from '.'
// import { ALARMTYPE } from '@/redux/equip/equipUtil'

const content = (
    <div>
        <p>点击将卡片置顶</p>
    </div>
);



export default function Equip() {
    const navigate = useNavigate()
    const equip = useSelector(equipPlaySelect)
    const equipPc = useSelector(equipPcPlaySelect)
    const alarm = useSelector(alarmSelect)
    const isMobile = useGetWindowSize()
    const alarmConfirmFunSensorName = ({ sensorName }: any) => {
        dispatch(deleteAlarm({ sensorName }))
    }
    const dispatch: any = useDispatch()
    return (
        <div className="main">
            {!isMobile ? <Carousel
                // autoplay 
                autoplaySpeed={6000} >
                {equipPc.length ? equipPc.map((equips: Array<equip>, indexs: any) => {
                    return <div className="equipsContent" key={indexs}>
                        <div className={`equips`}>
                            {equips?.map((item, index) => {
                                const alarmInfo = alarm.filter((a: any) => {
                                    return a.sensorName == item.sensorName
                                })
                                return (

                                    <div className={`equip`} key={item.sensorName}>
                                        {alarmInfo.length ?
                                            <div className="newAlarmContent">
                                                <img style={{ position: 'absolute', width: '100%', bottom: '0', left: 0, opacity: '0.5' }} src={newAlarmBgc} alt="" />
                                                <div style={{ position: 'absolute', width: '2rem', height: '2rem', textAlign: 'center', right: '0.5rem', top: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)', color: '#EC6E38', lineHeight: '2rem', fontWeight: '600', fontSize: '1rem' }}>{alarmStampToTime(Number(alarmInfo[0].time))}</div>
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
                                                    }}
                                                >我已知晓</div>
                                            </div> : ''}
                                        <div
                                            className={`equipItem  ${stateToObj[onBedState(item)].class}
                  `}
                                            onClick={() => {
                                                if (item.type == 'large') {
                                                    navigate(`/report/${item.sensorName}`, {
                                                        state: {
                                                            person: item
                                                        },
                                                    });
                                                }
                                                else {
                                                    navigate(`/report/${item.sensorName}`, {
                                                        state: {
                                                            person: item
                                                        },
                                                    });
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
                                                            // setEquipUnTop(item.sensorName);
                                                        }}
                                                    >
                                                        <img src={item.onBed == 4 ? sitTop : top} alt="" />
                                                    </div>
                                                ) : <div
                                                    className="equipUnTop"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        // setEquipTop(item.sensorName);
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
                }) : ''}
            </Carousel> :
                <div className="equipsContent">
                    <div className={`equips`}>
                        {equip?.map((item: equip) => {
                            const alarmInfo = alarm.filter((a: any) => {
                                return a.sensorName == item.sensorName
                            })
                            return (
                                <div className={`equip`} key={item.sensorName}>
                                    {alarmInfo.length ?
                                        <div className="newAlarmContent">
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
                                                onClick={() => {
                                                    alarmConfirmFunSensorName({ a: alarmInfo[0], sensorName: item.sensorName })
                                                }}
                                            >我已知晓</div>
                                        </div> : ''}
                                    <div
                                        className={`equipItem  ${stateToObj[onBedState(item)].class}`}
                                        onClick={() => {
                                            if (item.type == 'large') {
                                                navigate(`/report/${item.sensorName}`, {
                                                    state: {
                                                        person: item
                                                    },
                                                });
                                            }
                                            else {
                                                navigate(`/report/${item.sensorName}`, {
                                                    state: {
                                                        person: item
                                                    },
                                                });
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
                                                        // setEquipUnTop(item.sensorName);
                                                    }}
                                                >
                                                    <img src={item.onBed == 4 ? sitTop : top} alt="" />
                                                </div>
                                            ) : <div
                                                className="equipUnTop"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    // setEquipTop(item.sensorName);
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
                        })}

                    </div>
                </div>
            }
        </div>
    )
}
