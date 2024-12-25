import React, { useState, forwardRef, useEffect, useRef } from "react";
import './index copy.scss'
import './index.scss'
// import mqtt from 'mqtt';
import heart from '@/assets/icon/heart.png'
import bed from '@/assets/icon/bed.png'
import rate from '@/assets/icon/rate.png'
import right from '@/assets/icon/right.png'
import back from '@/assets/icon/back.png'
import left from '@/assets/icon/left.png'
import unRight from '@/assets/icon/unRight.png'
import unBack from '@/assets/icon/unBack.png'
import unLeft from '@/assets/icon/unLeft.png'

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message, Spin } from "antd";

import { useGetWindowSize } from "@/hooks/hook";
import Heatmap from "@/components/heatmap/Heatmap";
import { RealChart } from "@/components/charts";
import ProgressCom from "../progress/Progress";
import { numToHour, numToMin, stampToTime } from "@/utils/timeConvert";
import { instance } from "@/api/api";
import { scrollToAnchor } from "../util";
import { useSelector } from "react-redux";
import { mqttSelect } from "@/redux/mqtt/mqttSlice";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { OUTBEDTYPE } from "@/redux/equip/equipUtil";
import { fakeData } from "../../fakeData";
import NurseTextInfo from "./NurseTextInfo";
import Card from "./Card";
import { cloudSleepToPageSleep, initCircleArr, initRealCircleArr, minDataParam, returnCloudHeatmapData, returnMinData, returnRealtimeData } from "../../heatmapUtil";


export const rainbowTextColors = [

  [255, 0, 0],
  [255, 69, 0],
  [255, 136, 0],
  [255, 170, 0],
  [255, 204, 0],
  [255, 255, 0],
  [204, 255, 0],
  [153, 255, 0],
  [102, 255, 0],
  [51, 255, 0],
  [0, 255, 0],
  [0, 255, 51],
  [0, 255, 102],
  [0, 255, 153],
  [0, 255, 204],
  [0, 255, 255],
  [0, 204, 255],
  [0, 153, 255],
  // ...new Array(1).fill([0, 102, 255]),
  // ...new Array(1).fill([0, 255, 255]),
  // ...new Array(1).fill([0, 204, 255]),
  // ...new Array(1).fill([0, 153, 255]),
  ...new Array(1).fill([0, 102, 255]),
  ...new Array(1).fill([0, 102, 230]),
  [0, 0, 0],
  // [255, 255, 255],
  // [255, 255, 255],
  // ...new Array(5).fill([255, 255, 255]),
];

export function jetWhite3(min: number, max: number, x: number) {
  if (!x) {
    return rainbowTextColors[rainbowTextColors.length - 1]
  }
  const length = rainbowTextColors.length;
  const count = (max - min) * 2 / length;
  const num = Math.floor(x / count) >= length - 1 ? length - 1 : Math.floor(x / count) < 0 ? 0 : Math.floor(x / count);

  return rainbowTextColors[length - 1 - num];
}




const dateFormat = 'YYYY-MM-DD';
let personData = [0, 0, 0, 0, 0, 0, 0, 1, 3, 7, 17, 34, 61, 94, 123, 135, 125, 97, 63, 35, 16, 7, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 2, 5, 12, 25, 44, 67, 87, 96, 89, 69, 45, 25, 12, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 2, 4, 9, 18, 31, 45, 58, 63, 58, 46, 31, 18, 9, 5, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 5, 4, 3, 3, 2, 2, 2, 2, 3, 5, 9, 16, 24, 33, 40, 43, 40, 33, 24, 16, 10, 6, 4, 3, 2, 2, 2, 1, 1, 1, 0, 0, 11, 8, 7, 6, 5, 4, 4, 5, 7, 10, 15, 21, 27, 33, 38, 39, 37, 32, 27, 21, 16, 12, 9, 7, 6, 5, 4, 3, 2, 2, 1, 0, 18, 15, 12, 10, 9, 9, 9, 11, 15, 20, 27, 34, 40, 45, 48, 48, 47, 44, 41, 37, 32, 26, 20, 15, 12, 9, 7, 6, 4, 3, 2, 1, 28, 23, 19, 17, 16, 17, 20, 24, 31, 40, 50, 59, 66, 70, 72, 71, 70, 69, 68, 65, 60, 52, 42, 32, 24, 17, 13, 9, 7, 5, 3, 1, 38, 31, 27, 26, 27, 31, 37, 46, 59, 73, 87, 98, 105, 107, 107, 105, 104, 105, 106, 105, 101, 91, 76, 59, 42, 29, 20, 14, 9, 6, 4, 2, 45, 39, 35, 36, 42, 51, 64, 81, 101, 121, 138, 149, 153, 154, 151, 149, 148, 150, 152, 154, 152, 142, 122, 96, 69, 46, 29, 19, 12, 8, 5, 2, 49, 44, 43, 48, 59, 76, 98, 125, 153, 178, 195, 204, 205, 202, 198, 195, 194, 197, 200, 204, 203, 193, 170, 135, 97, 63, 39, 24, 15, 9, 5, 3, 51, 47, 49, 58, 75, 101, 135, 173, 209, 237, 252, 255, 252, 246, 241, 239, 239, 241, 244, 246, 244, 233, 206, 165, 119, 77, 46, 27, 16, 9, 5, 3, 53, 50, 53, 66, 89, 124, 168, 216, 259, 287, 298, 296, 288, 280, 276, 274, 276, 277, 278, 276, 269, 252, 221, 177, 126, 81, 47, 26, 15, 8, 5, 2, 55, 53, 56, 70, 98, 140, 193, 249, 295, 322, 328, 322, 311, 303, 300, 301, 304, 304, 301, 293, 278, 253, 216, 170, 120, 76, 43, 23, 12, 7, 3, 2, 57, 54, 57, 71, 100, 146, 204, 264, 310, 335, 339, 331, 321, 316, 317, 320, 323, 322, 315, 299, 274, 240, 198, 152, 105, 66, 37, 19, 10, 5, 2, 1, 57, 53, 54, 66, 94, 138, 195, 253, 299, 324, 330, 325, 321, 321, 327, 333, 336, 333, 321, 298, 264, 223, 177, 131, 89, 54, 30, 15, 7, 3, 2, 1, 53, 48, 48, 56, 78, 115, 164, 217, 262, 291, 304, 309, 312, 320, 331, 340, 344, 337, 319, 289, 249, 202, 155, 112, 74, 44, 24, 12, 5, 2, 1, 0, 46, 41, 38, 42, 57, 84, 123, 168, 211, 245, 269, 285, 299, 314, 330, 341, 344, 334, 310, 274, 229, 181, 134, 94, 61, 36, 19, 9, 4, 2, 1, 0, 36, 31, 28, 29, 38, 55, 84, 120, 161, 200, 233, 259, 281, 301, 320, 332, 334, 321, 293, 253, 205, 156, 112, 76, 48, 28, 14, 7, 3, 1, 0, 0, 26, 22, 19, 19, 24, 35, 55, 84, 121, 161, 199, 231, 258, 280, 299, 311, 311, 297, 268, 227, 179, 131, 90, 59, 36, 20, 10, 5, 2, 1, 0, 0, 18, 15, 13, 13, 16, 23, 37, 60, 91, 128, 165, 198, 225, 246, 263, 273, 273, 259, 232, 193, 149, 105, 69, 43, 25, 14, 7, 3, 1, 0, 0, 0, 13, 11, 9, 9, 11, 16, 26, 43, 68, 98, 131, 160, 184, 202, 216, 223, 223, 211, 188, 155, 118, 82, 52, 31, 17, 9, 4, 2, 1, 0, 0, 0, 10, 8, 7, 7, 8, 11, 18, 29, 48, 71, 97, 122, 141, 156, 166, 171, 170, 160, 143, 118, 90, 62, 38, 22, 12, 6, 3, 1, 0, 0, 0, 0, 8, 6, 5, 5, 5, 7, 12, 20, 33, 51, 72, 93, 111, 123, 130, 133, 131, 124, 111, 94, 72, 51, 32, 18, 10, 5, 2, 1, 0, 0, 0, 0, 6, 5, 3, 3, 3, 4, 8, 14, 24, 40, 59, 79, 96, 108, 114, 115, 112, 107, 99, 86, 69, 50, 32, 19, 10, 5, 2, 1, 0, 0, 0, 0, 4, 3, 2, 2, 2, 3, 6, 12, 21, 36, 55, 76, 94, 107, 113, 113, 112, 109, 103, 93, 77, 57, 38, 23, 12, 6, 3, 1, 0, 0, 0, 0, 3, 2, 1, 1, 1, 3, 5, 11, 20, 35, 54, 75, 94, 107, 113, 115, 116, 116, 113, 105, 89, 67, 46, 27, 15, 7, 3, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 2, 5, 11, 20, 33, 51, 71, 89, 102, 109, 113, 116, 120, 120, 114, 98, 76, 52, 31, 17, 8, 4, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 2, 5, 10, 18, 31, 47, 65, 81, 92, 100, 105, 111, 117, 120, 116, 102, 79, 55, 34, 19, 9, 4, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 5, 10, 18, 29, 44, 59, 72, 82, 90, 95, 102, 109, 114, 112, 99, 79, 56, 35, 20, 10, 5, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 5, 10, 18, 28, 41, 54, 65, 73, 79, 85, 91, 98, 103, 102, 92, 74, 53, 34, 20, 11, 5, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 6, 11, 20, 31, 43, 54, 63, 70, 74, 77, 82, 88, 92, 92, 84, 70, 52, 35, 21, 12, 6, 3, 1, 1, 0, 0, 2, 2, 1, 1, 2, 4, 9, 16, 26, 38, 51, 62, 71, 76, 79, 80, 82, 85, 88, 89, 83, 72, 57, 41, 26, 15, 8, 4, 2, 1, 0, 0, 4, 3, 3, 3, 4, 8, 15, 26, 40, 56, 72, 85, 95, 101, 103, 102, 100, 100, 102, 103, 100, 92, 77, 58, 39, 23, 12, 6, 3, 1, 1, 0, 7, 5, 4, 5, 7, 13, 25, 42, 63, 85, 105, 121, 133, 140, 141, 138, 134, 132, 133, 136, 136, 128, 112, 89, 62, 38, 20, 10, 4, 2, 1, 0, 10, 8, 7, 7, 11, 20, 37, 62, 92, 120, 144, 161, 174, 180, 181, 178, 173, 171, 174, 179, 182, 177, 159, 129, 93, 58, 32, 15, 7, 3, 1, 0, 13, 11, 9, 10, 15, 28, 51, 83, 120, 153, 177, 193, 202, 207, 207, 205, 202, 203, 209, 218, 226, 224, 206, 171, 126, 81, 45, 22, 10, 4, 2, 1, 15, 13, 11, 12, 19, 35, 63, 101, 142, 177, 199, 209, 213, 213, 213, 212, 213, 218, 229, 243, 256, 259, 244, 207, 156, 103, 59, 30, 13, 6, 2, 1, 16, 14, 12, 14, 21, 39, 71, 112, 156, 189, 207, 211, 209, 205, 202, 202, 206, 216, 232, 252, 270, 278, 267, 232, 178, 120, 70, 36, 16, 7, 3, 1, 16, 14, 12, 14, 22, 41, 73, 116, 160, 192, 206, 206, 199, 190, 184, 183, 189, 203, 223, 247, 270, 283, 276, 243, 190, 130, 77, 40, 18, 8, 3, 1, 15, 13, 12, 14, 22, 40, 71, 112, 155, 186, 200, 199, 188, 175, 165, 161, 167, 182, 205, 233, 260, 276, 272, 242, 191, 132, 79, 41, 19, 8, 3, 1, 13, 11, 11, 12, 19, 36, 64, 103, 143, 175, 190, 189, 177, 161, 146, 138, 141, 156, 181, 212, 241, 261, 259, 233, 185, 129, 78, 41, 19, 8, 3, 1, 11, 10, 9, 10, 16, 30, 55, 89, 127, 157, 174, 174, 162, 144, 125, 114, 113, 126, 151, 184, 217, 239, 241, 219, 176, 124, 76, 40, 19, 8, 3, 1, 9, 8, 7, 9, 13, 25, 45, 75, 108, 136, 153, 155, 143, 124, 103, 89, 85, 96, 120, 153, 187, 212, 220, 204, 168, 121, 76, 41, 20, 8, 3, 1, 7, 6, 6, 7, 11, 20, 36, 60, 88, 113, 129, 131, 120, 102, 81, 66, 60, 68, 89, 120, 154, 183, 197, 191, 163, 122, 79, 44, 22, 9, 4, 1, 5, 5, 4, 5, 8, 15, 27, 46, 68, 89, 103, 106, 97, 81, 62, 48, 42, 46, 63, 90, 123, 155, 175, 178, 159, 124, 84, 49, 24, 11, 4, 1, 4, 3, 3, 4, 6, 10, 19, 32, 49, 66, 77, 81, 75, 63, 48, 35, 29, 31, 44, 67, 97, 128, 153, 163, 153, 124, 86, 51, 26, 11, 5, 2, 3, 2, 2, 3, 4, 7, 12, 21, 32, 45, 55, 60, 58, 49, 38, 27, 21, 22, 32, 50, 76, 105, 131, 145, 141, 117, 83, 50, 26, 11, 4, 2, 2, 2, 2, 2, 2, 4, 7, 12, 19, 29, 37, 43, 44, 39, 31, 22, 16, 16, 22, 37, 58, 83, 108, 123, 122, 103, 73, 44, 22, 10, 4, 1, 2, 2, 2, 2, 1, 2, 3, 6, 11, 18, 26, 32, 34, 31, 25, 18, 12, 11, 15, 26, 41, 62, 83, 97, 97, 82, 58, 34, 17, 8, 3, 1, 2, 2, 2, 1, 1, 1, 2, 4, 7, 13, 19, 24, 26, 24, 19, 13, 9, 7, 9, 16, 27, 42, 58, 69, 69, 58, 41, 24, 12, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5, 9, 14, 18, 19, 18, 13, 9, 6, 4, 5, 9, 16, 26, 36, 44, 44, 37, 25, 15, 7, 3, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 4, 6, 10, 12, 13, 11, 8, 5, 3, 2, 3, 5, 8, 14, 20, 24, 25, 21, 15, 9, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 4, 6, 8, 8, 6, 4, 3, 2, 1, 2, 2, 4, 7, 10, 13, 14, 13, 10, 7, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 3, 2, 1, 1, 1, 1, 1, 2, 3, 5, 7, 9, 9, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 2, 3, 6, 8, 9, 9, 7, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 5, 8, 10, 10, 8, 5, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 8, 12, 15, 15, 13, 8, 4, 2, 1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 4, 9, 16, 24, 29, 29, 23, 15, 8, 4, 1, 1, 1, 1, 1, 2, 2, 3, 5, 6, 7, 7, 6, 5, 3, 2, 1, 1, 1, 1, 2, 4, 9, 18, 31, 44, 53, 52, 42, 28, 15, 7, 2, 3, 3, 3, 3, 4, 5, 8, 11, 14, 16, 16, 15, 12, 8, 5, 3, 2, 1, 1, 3, 7, 15, 31, 52, 73, 87, 84, 67, 44, 24, 10, 4, 6, 5, 5, 5, 7, 10, 15, 21, 26, 29, 30, 28, 22, 16, 10, 5, 3, 2, 2, 4, 10, 23, 45, 74, 103, 120, 115, 90, 59, 32, 14, 5, 8, 7, 7, 8, 10, 15, 22, 30, 37, 43, 44, 40, 32, 23, 14, 8, 4, 3, 3, 6, 13, 28, 54, 89, 121, 138, 131, 102, 66, 36, 16, 6, 9, 8, 8, 9, 12, 17, 25, 34, 42, 48, 50, 46, 37, 26, 16, 9, 5, 3, 4, 6, 14, 29, 55, 88, 118, 133, 124, 97, 62, 34, 15, 6, 8, 7, 7, 8, 10, 15, 22, 30, 37, 43, 44, 40, 32, 23, 14, 8, 4, 3, 3, 5, 11, 24, 45, 71, 94, 105, 97, 75, 48, 26, 12, 5]

personData = personData.map((a, index) => { if (a > 30) { return a } else { return 0 } })
export const heatmapColor = ["#0000FF", " #0066FF", "#00FF00", "#FFFF00", "#FF6600", "#FF0000", "#FF1E42",]

interface noRenderProp {
  children?: any
  img?: string;
  roomNum?: string;
  age?: string;
  chargeMan?: string;
  userTime?: string;
  sensorName?: string;
  name?: string;
  getEquipInfo?: Function

}
export class NoRender extends React.Component<noRenderProp> {
  constructor(props: noRenderProp) {
    super(props);
  }
  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.props.img != nextProps.img || this.props.age != nextProps.age || this.props.chargeMan != nextProps.chargeMan || this.props.name != nextProps.name;
  }
  render() {
    return <>{this.props.children}</>;
  }
}

const sleepType = [{ name: '左侧', img: right, unImg: unRight }, { name: '仰卧', img: back, unImg: unBack }, { name: '右侧', img: left, unImg: unLeft }]
let rateArr: Array<number> = [], heartArr: Array<number> = []
let realDataInit = [[0]]
for (let i = 0; i < 68; i++) {
  realDataInit[i] = []
  for (let j = 0; j < 40; j++) {
    realDataInit[i][j] = 0
  }
}

let startMatrix: any = new Array(1024).fill(0)

export function valueToSleep(num: number) {
  if (num == 0) {
    return 1
  } else if (num == 1) {
    return 0
  } else {
    return 2
  }
}



export default forwardRef((props: any, refs: any) => {

  const param = useParams()
  const sensorName = param.id || ''
  const equipInfo = useSelector((state) => selectEquipBySensorname(state, sensorName))

  /**
   * 
   * @param param0 circleArr 传入压疮点 ,resSleep 睡姿 , timer 压疮倒计时,wsPointData 矩阵数据
   * 渲染这些数据
   */
  const initPage = ({ circleArr, resSleep, timer, wsPointData }: any) => {
    setSleep(resSleep)
    if (heatMapRef.current) heatMapRef.current.setCircleArr(circleArr)
    if (timer) setTimer(timer ? timer : 0)
    if (heatMapRef.current) heatMapRef.current.bthClickHandle(wsPointData)
    if (progressRef.current) progressRef.current.setCountZero()
  }

  /**
   * 
   * @param param0 heart 心率, rate 呼吸, stroke 脑卒中, bodyMove 体动, onBedTime 在床时间
   */
  const initRealtimePage = ({ heart, rate, stroke, bodyMove, onBedTime }: any) => {
    setValueArr({ heart, rate, stroke, bodyMove, onBedTime })
    if (moveRef.current) moveRef.current.handChangeChart({ ydata: bodyMove })
  }


  /**
   * 获取初始矩阵信息
   */
  const getFirstMaritx = () => {
    const start = location.pathname.includes('small') ? 0 : equipInfo.nurseStart
    const end = location.pathname.includes('small') ? 24 * 60 * 60 * 1000 : equipInfo.nurseEnd
    instance({
      method: "post",
      url: "/sleep/nurse/getMatrixListByName",
      params: {
        deviceName: sensorName,
        scheduleTimePeriod: equipInfo.nursePeriod,
        startTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + start,
        endTimeMills: new Date(new Date().toLocaleDateString()).getTime() + end
      },
    }).then((res) => {
      const { wsPointData, timer, resSleep, circleArr } = returnCloudHeatmapData({ res: res.data, sensorName, equipInfo })
      initPage({ wsPointData, timer, resSleep, circleArr })
    }).catch((err) => {
      message.error('服务器错误')
    });
  }

  useEffect(() => {
    getFirstMaritx()
  }, [sensorName])

  const [valueArr, setValueArr] = useState<any>({ rate: 0, onBedTime: 0 })
  const [timer, setTimer] = useState<any>(0)
  const [sleep, setSleep] = useState<any>(4)
  const isMobile = useGetWindowSize()
  let location: any = useLocation();
  const [matrix, setMatrix] = useState(new Array(1024).fill(0))
  const heatMapRef = useRef<any>()
  const progressRef = useRef<any>()
  const [spinning, setSpinning] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const moveRef = useRef<any>()
  const [circleArr, setCircleArr] = useState<Array<any>>([]);
  const mqtt = useSelector(mqttSelect)

  const mqttEvent: any = {
    minute({ jsonObj, sensorName }: minDataParam) {
      const { wsPointData, circleArr, timer, resSleep } = returnMinData({ jsonObj, sensorName })
      initPage({ circleArr, timer, resSleep, wsPointData })
    },
    realtime({ jsonObj, sensorName }: minDataParam) {
      const { heart, rate, stroke, bodyMove, onBedTime } = returnRealtimeData({ jsonObj, sensorName })
      initRealtimePage({ heart, rate, stroke, bodyMove, onBedTime })
      if (!jsonObj.realtimeOnbedState) {
        initPage({ circleArr: [], wsPointData: new Array(1024).fill(0), resSleep: 4 })
      }
    },

  }



  useEffect(() => {
    mqtt.on('message', ((topic: any, payload: any) => {
      const jsonObj = JSON.parse(payload);
      if (sensorName === jsonObj.deviceName) {
        if (mqttEvent[jsonObj.type]) mqttEvent[jsonObj.type]({ jsonObj, sensorName })
      }

    }));
  }, [])

  useEffect(() => {
    if (typeof props.select == 'number') {
      scrollToAnchor('reportContent')
    }
    window.addEventListener("resize", function () {
      if (heatMapRef.current) {
        if (heatMapRef.current.canvasRef) heatMapRef.current.canvasRef.current.height = heatMapRef.current.canvasRef.current.width * 2
        heatMapRef.current.changeOptions(heatMapRef.current.canvasRef.current.width / 22)
        if (heatMapRef.current) heatMapRef.current.bthClickHandle((startMatrix))
      }
    });

    return () => {
      window.removeEventListener('resize', () => { })
      if (progressRef.current) progressRef.current.setCountZero()
    }
  }, []);

  return (
    <div id="realPc" className="pfBold">

      <Spin className="spin" spinning={spinning} fullscreen />

      < div className="personalChartAndInfo phone" >
        <div className="personalChart">


          <div className="heatmapInfo md:mb-[0.8rem] md:mt-[10px]">
            <Card title='全天压力分布图' margin>
              <div className="heatmapLeft px-[1.9rem] " style={{ position: 'relative', padding: props.sensorName == 'iJ3X0JSttyoiRPafpIka' ? '2.5rem 0' : '' }}>
                {/* <div className="heatmapText">床号:{equipInfo.roomNum}</div> */}
                <div className="heatmapColor">
                  {
                    [...heatmapColor].reverse().map((a, index) => {
                      return (
                        <div style={{ width: '0.48rem', height: props.sensorName == 'iJ3X0JSttyoiRPafpIka' ? '1rem' : '2.84rem', backgroundColor: a, marginBottom: '0.48rem' }}></div>
                      )
                    })
                  }
                </div>
                <div className="heatmapContent ">
                  <NoRender>
                    <Heatmap height ref={heatMapRef} data={matrix} type={props.type} sensorName={props.sensorName} />
                    <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', height: '4rem', width: '4rem' }}>
                      <ProgressCom ref={progressRef} /></div>
                  </NoRender>
                </div>
              </div>
            </Card>
          </div>

          <div className="rightContent">

            <NurseTextInfo equipInfo={equipInfo} timer={timer} sensorName={sensorName} />

            <Card unheight title={'在床体征'}>
              <div className="flex mx-[0.5rem] items-center">
                <div className="flex-1">
                  <div className="text-[0.8rem] text-[#929EAB]">心率</div>
                  <div className="">{!equipInfo.onBed || valueArr.rate == 0 ? '--' : valueArr.rate == 88 || valueArr.rate == -1 ? <Spin /> : <div className="text-[1rem] text-[#000]">{valueArr.heart} <span className="text-[0.6rem] text-[#929EAB]">bmp</span></div>} </div>
                </div>
                <div className="w-[1px] h-[1rem] bg-[#D8D8D8]"></div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="">
                    <div className="text-[0.8rem] text-[#929EAB]">呼吸</div>
                    <div className=""> {!equipInfo.onBed || valueArr.rate == 0 ? '--' : valueArr.rate == 88 || valueArr.rate == -1 ? <Spin /> : <div className="text-[1rem] text-[#000]">{valueArr.rate}<span className="text-[0.6rem] text-[#929EAB]">次/分</span></div>}</div>
                  </div>
                </div>
                <div className="w-[1px] h-[1rem] bg-[#D8D8D8]"></div>
                <div className="flex-1 flex flex-col items-end">
                  <div className="">
                    <div className="text-[0.8rem] text-[#929EAB]">本次在床</div>
                    <div className="text-[1rem] text-[#000]">{numToHour(valueArr.onBedTime)}<span className="text-[0.6rem] text-[#929EAB]">小时</span></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card unheight title={'睡姿'}>
              <div className="bedSoresSleepType">

                {
                  sleepType.map((item, index) => {
                    return <div style={{ flex: '0 0 calc((100% - 1.5rem*2)/3)', height: '100%', borderRadius: '5px', }}>
                      <div className={`bedSoresSleepItem`} style={{ boxShadow: index == sleep ? "0rem 0.28rem 1.56rem 0.08rem rgba(0,116,254,0.33)" : '', background: index == sleep ? 'linear-gradient( 135deg, #009FFF 0%, #006CFD 100%)' : '#F7F8FD', }} key={item.name}>
                        <img src={item.img} style={{ display: index == sleep ? 'none' : 'unset' }} alt="" />
                        <img src={item.unImg} style={{ display: index == sleep ? 'unset' : 'none' }} alt="" />
                      </div>
                      <div className="mt-[1.2rem] text-[#929EAB]" style={{ textAlign: 'center' }}>{item.name}</div>
                    </div>
                  })
                }
              </div>
            </Card>
            <Card unheight title={'实时体动'} margin={true} mdmb={true}>
              <div className="realChart">
                <RealChart
                  index={1}
                  ref={moveRef}
                  xdata={new Array(24).fill(0)}
                  ymax={40}
                  tipFormat={function (params: any) {
                    return `${stampToTime(params[0].name)} ${parseInt(
                      params[0].value
                    )}`;
                  }}
                />
              </div>
            </Card>




          </div>
        </div>

      </ div>


    </div >
  );
})


