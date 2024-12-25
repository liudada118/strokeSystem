import React, { useEffect } from 'react'
// import { sulRank } from '../../personCard'
import nullImg from '@/assets/image/null.png'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.scss'
import { sulRank } from '@/utils/dataToFormat'

interface leftContentProps {
    // width: string
    // person: any
    // nurseReportFlag: boolean
    props: any
    users: any
    evalaute?: boolean
    // img: any
    // name: any
    // age: any
    // roomNum: any
    // sensorName: any
    // rank: any

}

export default function LeftContent(props: leftContentProps) {
    let navigate = useNavigate();
    let location: any = useLocation();

    return (
        <>
            <div className="dayPersonCard">
                {(props.props.width == 'phone' || props.props.width == 'pad') ? '' : <div className="name" style={{
                    background: `url(${props.props.img ? props.props.img : nullImg
                        })  center center / cover no-repeat`,
                }}></div>}
                <div className="nameText">{props.props.name} {(props.props.width == 'phone' || props.props.width == 'pad') ? <div className="roomText" style={{ marginLeft: '1rem' }}> {props.props.age}岁</div> : ''}</div>
                {(props.props.width == 'phone' || props.props.width == 'pad') ?
                    ''
                    : <div className="bedInfo"><div className="bedTitle">年龄</div> <div className="roomText">{props.props.age}</div> </div>}
                <div className="bedInfo"><div className="bedTitle">床号</div> <div className="roomText">{props.props.roomNum}</div> </div>

                {props.props.sensorName == 'KgvDXUvdEs9M9AEQDcVc' ? '' : <div className="bedInfo"><div className="bedTitle" style={{ width: '3rem' }}>护理员</div> <div className="roomText" style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                    {props.users.map((a: any) => {
                        return <div>{a},</div>
                    })}</div>
                </div>}
                <div className="bedInfo" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                        <div className="bedTitle">Braden评分</div>
                        <div className="roomText">{props.props.rank ? `${JSON.parse(props.props.rank).reduce((a: number, b: number) => a + 1 + b, 0)}分 ${sulRank(JSON.parse(props.props.rank).reduce((a: number, b: number) => a + 1 + b, 0))}` : '未评估'}</div>
                    </div>
                    <div style={{ color: '#0072EF' }} onClick={() => {
                        navigate('/que', {
                            state:
                            {
                                ...location.state,
                                router: location.pathname, rank: props.props.rank
                            }
                        })
                    }}>{!props.evalaute ? props.props.rank ? JSON.parse(props.props.rank).every((a: any) => typeof a === 'number') ? '重新评估' : '去评估' : '去评估' : ''}</div>
                </div>
            </div>
        </>
    )
}
