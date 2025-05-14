import React, { useImperativeHandle, useRef, useState, useEffect } from 'react'
import { message, Spin, Tooltip } from 'antd'
import HeatmapR1 from "@/components/heatmap/HeatmapModal copy";
import notice from "@/assets/image/notice.png";
import ask from "@/assets/image/ask.png";

import imgadd from '@/assets/image/imgadd.png'
import no from '@/assets/icon/no.png'

import right from '@/assets/icon/right.png'
import back from '@/assets/icon/back.png'
import left from '@/assets/icon/left.png'
import unRight from '@/assets/icon/unRight.png'
import unBack from '@/assets/icon/unBack.png'
import unLeft from '@/assets/icon/unLeft.png'

import { compressionFile } from '@/utils/imgCompressUtil';
import { Instancercv, netUrl } from '@/api/api';
import axios from 'axios';
const turnOverInfoText = [
    {
        posture: '仰卧',
        hint: '仰卧：将护理对象置为仰卧'
    },
    {
        posture: '左侧卧',
        hint: '左侧卧：护理对象左手侧'
    },
    {
        posture: '右侧卧',
        hint: '右侧卧：护理对象右手侧'
    },
]

const sleepType = [{ key: "1", name: '左侧', img: right, unImg: unRight }, { key: "2", name: '仰卧', img: back, unImg: unBack }, { key: "3", name: '右侧', img: left, unImg: unLeft }]
interface nurseTitleParam {
    index: number
    total: number
}

export default function NurseTitleProgress(props: nurseTitleParam) {
    const { index, total } = props
    const arr = new Array(total - 1).fill(1)
    return (
        <div className="nurseTitleProgress">
            {
                arr.map((item, _index) => {
                    return (
                        <>
                            <div className="progressItem" style={{ borderColor: index >= _index + 1 ? '#0067ff' : '#ccc', backgroundColor: index >= _index + 2 ? '#0067ff' : '' }}></div>
                            <div className="progressInter" style={{ backgroundColor: index >= _index + 2 ? '#0067ff' : '#ccc' }}></div>
                        </>
                    )
                })
            }
            <div className="progressItem" style={{ borderColor: index >= total ? '#0067ff' : '#ccc' }}></div>
        </div>
    )
}





// const nurseTitle = ['第一步：为护理对象翻身', '第二步：查看护理效果', '第三步：上传睡姿记录', '第四步：选择护理项目',]
// const {}
interface turnOverParam {
    nextPos: number
    newPos: number
    open: boolean
    type: string
    sensorName: string
}
export const TurnOver = React.forwardRef((props: turnOverParam, refs) => {
    const heatMapRef2 = useRef<any>(null)
    const { newPos, nextPos, open, type, sensorName } = props
    // const [open, setOpen] = useState(true);


    const renderHeatmapData = ({ wsPointData, circleArr }: any) => {
        if (heatMapRef2.current) heatMapRef2.current.bthClickHandle(wsPointData)
        if (heatMapRef2.current) heatMapRef2.current.setCircleArr(circleArr)
    }
    useImperativeHandle(refs, () => ({
        renderHeatmapData
    }));
    // const handleVisibilityChange = () => {
    //     const html = document.getElementsByTagName("html")[0];
    //     console.log("页面状态变化：", document.hidden);

    //     if (!document.hidden) {
    //         // 当页面重新显示在前台时
    //         html.style.fontSize = '14.2667px';
    //         // window.location.reload(); // 刷新页面
    //     }
    // };

    // useEffect(() => {
    //     handleVisibilityChange(); // 初始化时执行一次
    //     // 添加事件监听器
    //     window.addEventListener('resize', handleVisibilityChange);
    //     window.addEventListener('visibilitychange', handleVisibilityChange);
    //     // 组件卸载时移除监听器
    //     return () => {
    //         window.removeEventListener('resize', handleVisibilityChange);
    //         window.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };
    //     // 添加123
    // }, []);
    return (
        <div className="pfBold" style={{ backgroundColor: '#F7F8FD', width: '100%', padding: '1rem', flex: 1 }}> <div style={{ flex: 1, width: '100%', backgroundColor: '#000', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', margin: '2rem 1rem 0 1rem', borderRadius: '5px', padding: '1rem', textAlign: 'center', width: '90%', fontSize: '1.2rem' }}>
                <img src={notice} style={{ width: '2.64rem', marginRight: '0.5rem' }} />
                {open ? "加载睡姿中.." : <div style={{ display: 'flex', alignItems: 'center' }}>翻身任务: 将<div style={{ borderBottom: '1px solid #000' }}>{turnOverInfoText[newPos].posture}</div>
                    调整为
                    <div style={{ borderBottom: '1px solid #000' }}>{turnOverInfoText[nextPos].posture}</div>
                    <Tooltip className="tooltip" placement="bottomRight" title={turnOverInfoText[nextPos].hint}>
                        <img style={{ width: '1.12rem', height: '1.12rem', marginLeft: '0.56rem' }} src={ask} />
                    </Tooltip>
                </div>}
            </div>
            <div className="realNurseHeatmap" style={{ backgroundColor: '#000', width: '50%', borderRadius: '1rem', marginBottom: '2.5rem' }}>
                <HeatmapR1 less={3} index={6} ref={heatMapRef2} type={type} sensorName={sensorName} />
            </div>
        </div>
        </div>

    )
})

interface uploadSleepParam {
    img: any
    setImg: Function
    setSleepType: Function
    sleepTypenur: any
    changeData: Function
}
export const UploadSleep = (props: uploadSleepParam) => {
    const { img, setImg, setSleepType, sleepTypenur, changeData } = props
    const [spinning, setSpinning] = React.useState<boolean>(false);
    const changeImg = (param: any) => {
        setImg(param)
        changeData({ sleepPosImg: param })
    }

    const changeSleepPos = (indexs: any) => {
        setSleepType(indexs)
        changeData({ sleepPos: indexs })
    }
    const dias = (name: string) => {
    }
    return (
        <div style={{ backgroundColor: '#F7F8FD', width: '100%', padding: '1rem', flex: 1 }}>
            <Spin className="spin" spinning={spinning} fullscreen />
            <div className="nursecard">
                <div className="secondHint">
                    上传照片
                </div>
                <div className="secondImgContent">
                    {
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            {
                                img ? <div style={{ position: 'relative', width: '6rem', height: '6rem', borderRadius: '6px', overflow: 'hidden', }}>
                                    <div style={{
                                        width: '6rem', height: '6rem', background: `url(${img}) center center / cover no-repeat `,
                                    }}></div>
                                    <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', right: 0, top: 0, width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: '0.8rem' }}>
                                        <img src={no}
                                            onClick={() => {
                                                changeImg('')
                                            }}
                                            alt="" style={{ width: '0.5rem' }} />
                                    </div>
                                </div> : ''
                            }
                        </div>
                    }
                    {!img ? <div className="addImg">
                        <img src={imgadd} style={{ marginBottom: '0.38rem', width: '1.28rem' }} alt="" />
                        添加照片
                        <input type="file" accept="image/*" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }} id="img" onChange={(e) => {
                            setSpinning(true);
                            if (e.target.files) {
                                let res = compressionFile(e.target.files[0])
                                res.then((e) => {
                                    axios({
                                        method: "post",
                                        url: netUrl + "/file/fileUpload",
                                        headers: {
                                            "content-type": "multipart/form-data",
                                            "token": token
                                        },
                                        data: {
                                            file: e//e.target.files[0],
                                        }
                                    }).then((res) => {

                                        setSpinning(false);
                                        message.success('上传成功')
                                        const imgArr = res.data.data.src
                                        // setImg(imgArr)
                                        changeImg(imgArr)
                                    }).catch((err) => {
                                        setSpinning(false);
                                        message.success('上传失败')
                                    })
                                })
                                const token = localStorage.getItem('token')
                            }
                        }} />
                    </div> : ''}

                </div>
            </div>
            <div className="nursecard">
                <div className="secondHint">
                    选择睡姿
                </div>
                <div className="bedSoresSleepType">
                    {
                        sleepType.map((item, index) => {
                            return <div onClick={() => changeSleepPos(index)} style={{ flex: '0 0 calc((100% - 0.72rem*2)/3)', height: '100%', borderRadius: '5px', paddingBottom: '0.68rem' }} key={item.key}>
                                <div className={`bedSoresSleepItem`} style={{ boxShadow: index == sleepTypenur ? "0rem 0.28rem 1.56rem 0.08rem rgba(0,116,254,0.33)" : '', background: index == sleepTypenur ? 'linear-gradient( 135deg, #009FFF 0%, #006CFD 100%)' : '#F7F8FD', }}>
                                    <img onClick={(() => dias(item.name))} src={item.img} style={{ display: index == sleepTypenur ? 'none' : 'unset' }} alt="" />
                                    <img onClick={(() => dias(item.name))} src={item.unImg} style={{ display: index == sleepTypenur ? 'unset' : 'none' }} alt="" />
                                </div>
                                <div onClick={(() => dias(item.name))} style={{ textAlign: 'center', marginTop: "0.8rem" }}>{item.name}</div>
                            </div>
                        })
                    }
                </div>
                <div style={{ color: '#aaa' }}>注:睡姿以护理对象的左右为基准</div>
            </div>
        </div>
    )
}




