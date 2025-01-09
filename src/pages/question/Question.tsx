import { Instancercv, netUrl } from '@/api/api';
import { Button, Radio, message } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
// import { netUrl } from '../../assets/util';

const rankType = [
    {
        name: "感知能力", value: ['完全受限+对疼痛刺激无反应。',
            '非常受限+对疼痛刺激有反应，但不能用语言表达，只能用呻吟、烦躁不安表示。',
            '轻微受限+对指令性语言有反应，但不能总是用语言表达不适，或部分肢体感受疼痛能力或不适能力受损。',
            '无损害+对指令性语言有反应，无感觉受损。'],
    },
    {
        name: "潮湿度", value: ['持续潮湿+每次移动或翻动时总是看到皮肤被分泌物、尿液渍湿。',
            '非常潮湿+床单由于频繁受潮至少每班更换一次。',
            '偶尔潮湿+皮肤偶尔潮湿，床单约每日更换一次。',
            '罕见潮湿+皮肤通常是干的，床单按常规时间更换。'],
    },
    {
        name: "活动能力", value: ['卧床不起+被限制在床上。',
            '能做轮椅+不能步行活动，必须借助椅子或轮椅活动。',
            '扶助行走+白天偶尔步行，但距离非常短。',
            '活动自如+能自主活动，经常步行。'],
    },
    {
        name: "移动能力", value: ['完全受限+在他人帮助下方能改变体位。',
            '重度受限+偶尔能轻微改变身体或四肢的位置，但不能独立改变体位。',
            '轻微受限+只是轻微改变身体或四肢位置，可经常移动且独立进行。',
            '不受限+可独立进行随意体位的改变。'],
    },
    {
        name: "营养摄取能力", value: ['非常差+从未吃过完整一餐，或禁食和(或)进无渣流质饮食。',
            '可能不足+每餐很少吃完，偶尔加餐或少量流质饮食或管饲饮食。',
            '充足+每餐大部分能吃完，但会常常加餐:不能经口进食，能通过鼻饲或静脉营养补充大部分营养需求。',
            '良好+三餐基本正常。'],
    },
    {
        name: "摩擦力剪切力", value: ['存在问题+需要协助才能移动，移动时皮肤与床单表面没有完全托起，坐床上或椅子上经常会向下滑动。',
            '潜在问题+很费力地移动，大部分时间能保持良好的体位，偶尔有向下滑动。',
            '不存在问题+在床上或椅子里能够独立移动，并保持良好的体位。']
    },
]

export default function Question() {
    let token = localStorage.getItem("token");

    // 禁止页面跳转
    // useEffect(() => {

    //     window.history.pushState(null, '', document.URL);
    //     window.onpopstate = function () {
    //         console.log('gaunbi')
    //         window.history.pushState(null, '', document.URL);
    //     }
    // }, [])



    const navigate = useNavigate()
    let location = useLocation()
    const rankValue = location.state.rank ? JSON.parse(location.state.rank) : []

    const [rank, setRank] = useState<any>(rankValue)
    console.log(location.state, rank)

    const setQue = () => {
        if (!rank.every((a: any) => typeof a == 'number')) {
            message.error('请将选项填写完整')
        } else {
            axios({
                method: "post",
                url: netUrl + "/device/update",

                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token": token
                },
                data: {
                    deviceId: location.state.sensorName,
                    rank: JSON.stringify(rank)
                }

            }).then((res) => {

                if (res.data.msg == '更新成功') {
                    message.success('提交成功')
                    // navigate(`${location.state.router}`, { state: { ...location.state, select: location.state.router.includes('small') ? 0 : 1 } })
                    navigate(-1)
                }
            });
        }



    }

    const cancel = () => {
        // navigate(`${location.state.router}`, { state: { ...location.state, select: location.state.router.includes('small') ? 0 : 1 } })
        navigate(-1)
    }

    return (
        <div style={{ padding: '3rem' }}>
            <h2 style={{ textAlign: 'center' }}>请认真填写护理对象信息</h2>
            <div className="contnet">
                {rankType.map((a, typeIndex) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }} className="deviceItem">
                            <div style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}><span style={{ color: 'red' }}>*</span>{typeIndex + 1}.{a.name}</div>
                            <Radio.Group
                                value={rank[typeIndex]}
                                style={{ display: 'flex', flexDirection: 'column' }}
                                onChange={(e) => {
                                    // const value = { ...userinfo, type: e.target.value }
                                    // setUserInfo(value)
                                    let value = [...rank]
                                    value[typeIndex] = e.target.value
                                    setRank(value)

                                }} >
                                {
                                    a.value.map((b, index) => {
                                        return (
                                            <div ><Radio
                                                style={{ borderRadius: '5px', border: '1px #eee solid', padding: '0.5rem', width: '100%', marginBottom: '0.4rem' }}
                                                value={index}>{b.split('+')[0]}--{index + 1}分 {`(${b.split('+')[1]})`}</Radio></div>
                                        )
                                    })
                                }

                            </Radio.Group>
                        </div>
                    )
                })}
                <p>表注:评估分值最高23分，最低6分。评估分值越低压疮风险越高。评估分值≤9分为极高危风险，10-12分为高危风险，13-14 分为中度高危风险，15-18分为低度高危风险。低度高危风险，宜每周评估1次:风险越高，评估周期越短。</p>
                <Button onClick={() => { setQue() }}>提交</Button>
                <Button onClick={() => { cancel() }}>取消</Button>
            </div>
        </div>
    )
}
