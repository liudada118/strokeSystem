import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import Heatmap from '@/components/heatmap/HeatmapRef'
import sores from "@/assets/image/sores.jpg";
import sores1 from "@/assets/image/sores1.jpg";

interface dayNurse {
    sensorName: string
    startMatrix: any
    endMatrix: any
    img: any
    remark: any
}
export default function DayNurseReport(props: any) {

    const heatmapStart = useRef<any>(null)
    const heatmapEnd = useRef<any>(null)

    useEffect(() => {

        // document.documentElement.style.fontSize = 'unset'
        if (heatmapStart.current) heatmapStart.current.bthClickHandle((props.startMatrix))
        if (heatmapEnd.current) heatmapEnd.current.bthClickHandle((props.endMatrix))
    }, [])


    return (
        <div className='dayNurse nurseContent' style={{ paddingBottom: '3rem' }}>
            <div className="nurseTitleName">近期护理记录 </div>
            <div className="dayNurseContent">
                <div className="dayNurseTitle">
                    <div className="dayHeatmapTitle">
                        <div className="dayNurseLeftTile">护理前</div>
                        <div className="dayNurseRightTile">护理后</div>
                    </div>
                    <div className="dayNurseContentTitle">
                        <div className="dayNurseLeftTile">护理内容</div>
                        <div className="dayNurseRightTile">状态</div>
                    </div>
                </div>
                <div className="dayNurseContentDiv">
                    <div className="dayHeatmapContent">
                        <div className="leftTitle heatmap">
                            <div className="leftTitleItem2 leftTitleItem"> <div className="nurseHeatmap">
                                <Heatmap ref={heatmapStart} sensorName={props.sensorName} arr={props.startMatrix} index={1} />
                            </div></div>
                            <div className="leftTitleItem3 leftTitleItem"> <div className="nurseHeatmap">
                                <Heatmap ref={heatmapEnd} sensorName={props.sensorName} arr={props.endMatrix} index={2} />
                            </div></div>
                        </div>
                    </div>
                    <div className="nurseContentDiv">

                        <div className="rightTabel">

                            <div className="rightTitle">
                                <div className="rightTitleItem1 leftTitleItem">记录褥疮</div>
                                <div className="rightTitleItem2 leftTitleItem">{props.sensorName === "KgvDXUvdEs9M9AEQDcVc" ? 2 : props.img ? props.img.length : ''}张照片</div>
                            </div>
                            <div className="rightTitle">
                                <div className="rightTitleItem1 leftTitleItem">清洁</div>
                                <div className="rightTitleItem2 leftTitleItem">完成</div>
                            </div>
                            <div className="rightTitle">
                                <div className="rightTitleItem1 leftTitleItem">调整体位</div>
                                <div className="rightTitleItem2 leftTitleItem">完成</div>
                            </div>
                            <div className="rightTitle">
                                <div className="rightTitleItem1 leftTitleItem">涂药</div>
                                <div className="rightTitleItem2 leftTitleItem">完成</div>
                            </div>
                            <div className="rightTitle">
                                <div className="rightTitleItem2 leftTitleItem">照片备注:{props.remark}</div>
                            </div>
                            <div className="rightTitle imgItem">
                                {/* <div className="rightImg">
                <img src={logo} alt="" />
              </div>
              <div className="rightImg">
                <img src={logo} alt="" />
              </div> */}
                                {props.sensorName === "KgvDXUvdEs9M9AEQDcVc" ?
                                    <>
                                        <div className="rightImg" style={{ marginBottom: '2px' }}>
                                            <img src={sores} alt="" />
                                        </div>
                                        <div className="rightImg">
                                            <img src={sores1} alt="" />
                                        </div>
                                    </> : props.img && props.img.length &&props.img[0].length ? props.img.map((a: any) => {
                                        return (
                                            <div className="rightImg">
                                                <img src={a} alt="" />
                                            </div>
                                        )
                                    }) : ''}
                            </div>
                            {/* </div> */}
                        </div>




                    </div>
                </div>
            </div>
        </div>
    )
}
