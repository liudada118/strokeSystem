import { gaussBlur_2, interpSmall, interpSmall1, press, rotate90, zeroLine } from '@/utils/matrix';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { addSide } from './HeatmapModal copy';
// import { press, rotate90, rotateMatrix, zeroLine } from '../../assets/util';
// import ProgressCom from '../progress/Progress';


// interface Options = {
//     min 
// }

var data: any = []
const sitMax = 23000
const sitWidth = 8

// const bedOption: any = {
//     min: 0,
//     // max: localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 900,
//     max: bedMax,
//     size: 4
// }
var options: any = {
    min: 0,
    // max: localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 900,
    max: 9000,
    size: 4
}
var isShadow = true

// valueg1 = localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
let valuef1 = 2, // localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
    valuelInit1 = 2// localStorage.getItem('carValueInit') ? JSON.parse(localStorage.getItem('carValueInit')) : 2,
// valuel1 = localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2
const sitnum1 = 32;
const sitnum2 = 32;
const sitInterp = 2;
const sitOrder = 0;
const dataFalse = [0, 0, 1, 0, 1, 2, 1, 2, 2, 3, 4, 2, 3, 3, 5, 9, 35, 126, 127, 98, 34, 12, 7, 3, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 2, 2, 1, 3, 3, 4, 4, 5, 10, 49, 91, 70, 49, 33, 45, 39, 17, 8, 3, 2, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 12, 19, 8, 8, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 2, 1, 3, 7, 11, 17, 16, 13, 23, 19, 12, 10, 9, 4, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0, 5, 5, 12, 34, 115, 89, 28, 15, 10, 12, 25, 23, 34, 39, 39, 48, 60, 31, 41, 35, 44, 35, 77, 52, 16, 5, 7, 2, 1, 2, 5, 8, 9, 19, 67, 67, 64, 53, 106, 68, 65, 53, 59, 59, 46, 42, 47, 44, 39, 39, 43, 67, 51, 78, 160, 63, 50, 28, 50, 40, 7, 3, 3, 1, 12, 36, 97, 101, 60, 48, 44, 37, 76, 76, 81, 78, 52, 43, 46, 30, 56, 30, 64, 41, 44, 50, 80, 112, 53, 205, 104, 18, 23, 7, 7, 8, 57, 135, 113, 57, 31, 14, 17, 19, 36, 58, 68, 85, 73, 50, 48, 50, 50, 65, 47, 42, 35, 47, 37, 97, 155, 86, 86, 135, 30, 23, 16, 16, 228, 115, 70, 26, 38, 12, 20, 17, 44, 56, 59, 70, 102, 92, 61, 36, 57, 39, 19, 10, 9, 16, 12, 19, 65, 32, 69, 200, 49, 144, 104, 28, 74, 80, 20, 9, 5, 5, 9, 23, 30, 21, 26, 39, 41, 58, 51, 51, 19, 17, 6, 3, 3, 3, 2, 4, 11, 19, 22, 45, 100, 101, 44, 92, 70, 13, 5, 2, 2, 2, 4, 4, 9, 27, 36, 24, 16, 10, 12, 23, 18, 23, 8, 3, 1, 1, 1, 1, 3, 1, 3, 10, 35, 40, 30, 6, 11, 2, 1, 1, 1, 3, 7, 18, 23, 29, 38, 34, 37, 39, 18, 20, 28, 15, 6, 3, 2, 1, 1, 1, 2, 2, 17, 13, 5, 4, 13, 3, 26, 5, 2, 2, 4, 4, 14, 15, 18, 22, 18, 23, 21, 16, 16, 21, 21, 15, 8, 12, 4, 2, 1, 1, 1, 1, 1, 0, 1, 1, 3, 17, 10, 7, 19, 6, 5, 9, 32, 37, 32, 24, 32, 26, 29, 30, 30, 42, 21, 15, 10, 6, 3, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 6, 4, 4, 6, 8, 30, 43, 51, 64, 65, 78, 51, 89, 86, 96, 95, 84, 53, 56, 29, 16, 7, 4, 3, 4, 2, 2, 2, 2, 1, 1, 1, 8, 5, 6, 7, 10, 36, 40, 44, 72, 87, 92, 100, 117, 127, 128, 116, 90, 82, 38, 43, 25, 9, 6, 3, 5, 3, 3, 3, 3, 2, 1, 1, 6, 4, 4, 7, 8, 20, 53, 70, 75, 67, 91, 108, 111, 121, 98, 72, 84, 61, 31, 46, 21, 12, 6, 3, 5, 3, 2, 3, 3, 3, 1, 0, 3, 3, 4, 7, 10, 43, 46, 54, 48, 59, 56, 53, 40, 52, 56, 55, 50, 46, 50, 63, 68, 18, 9, 4, 6, 3, 2, 2, 1, 1, 1, 0, 2, 3, 2, 4, 4, 11, 30, 75, 58, 43, 31, 30, 15, 19, 8, 18, 17, 23, 17, 36, 22, 22, 13, 9, 45, 5, 4, 2, 5, 1, 1, 0, 0, 0, 1, 2, 4, 29, 8, 12, 13, 17, 6, 2, 2, 1, 4, 11, 6, 18, 26, 31, 22, 9, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 20, 26, 6, 5, 1, 0, 0, 0, 0, 0, 1, 3, 4, 7, 16, 5, 7, 3, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 3, 6, 2, 1, 0, 1, 5, 2, 6, 20, 58, 21, 11, 7, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 25, 8, 4, 10, 4, 3, 2, 0, 0, 2, 0, 0, 2, 3, 7, 4, 11, 2, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 4, 2, 0, 1, 2, 2, 9, 3, 6, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 6, 18, 40, 24, 11, 4, 3, 1, 1, 1, 1, 4, 7, 26, 24, 35, 65, 14, 4, 2, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 9, 24, 44, 46, 40, 10, 4, 2, 2, 3, 3, 8, 27, 43, 48, 54, 86, 23, 7, 4, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 5, 5, 21, 45, 45, 28, 25, 8, 3, 2, 2, 2, 3, 9, 16, 30, 36, 77, 63, 30, 8, 3, 2, 1, 1, 1, 0, 0, 0, 2, 1, 2, 2, 5, 13, 46, 33, 32, 34, 10, 5, 3, 2, 2, 4, 6, 17, 45, 47, 67, 83, 55, 12, 5, 3, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 3, 9, 19, 22, 5, 2, 0, 1, 0, 0, 0, 1, 2, 5, 18, 53, 54, 13, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

var canvas: any, context
interface circleInterface {
    x: number;
    y: number;
    time: number;
    radius: number;
}

const Heatmap = React.forwardRef((props: any, refs) => {

    const bedMax = (props.sensorName == 'KgvDXUvdEs9M9AEQDcVc') ? 9000 : 14000
    // const bedMax = 14000
    const [fontSize, setFontSize] = useState(1)


    const [circleArr, setCircleArr] = useState<Array<any>>([{}])
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    function getRandomIntInclusive(min: any, max: any) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useEffect(() => {

    }, [])
    // 生成随机数据
    function generateData(arr: any, num: number) {

        let resData = arr

        // resData = [39,37,37,41,37,44,42,37,43,42,42,42,43,43,40,43,46,51,51,50,48,51,51,50,50,51,51,48,49,49,50,49,38,37,36,39,36,42,37,38,42,41,40,40,42,43,40,42,45,49,50,49,49,50,50,50,50,50,50,48,49,49,49,49,35,37,36,39,36,41,41,38,41,41,40,40,42,42,40,42,45,50,50,49,49,50,50,50,50,50,49,48,49,49,49,48,38,37,35,39,36,42,40,38,42,41,40,40,41,42,39,41,44,50,50,49,49,50,49,49,50,50,50,47,48,48,49,48,38,38,36,39,36,42,41,38,39,41,40,41,42,43,40,42,45,51,51,49,49,51,50,50,50,50,50,48,49,49,49,49,37,37,36,39,35,43,41,38,41,40,40,40,41,43,39,41,45,50,50,48,49,50,50,49,50,50,50,48,49,49,47,48,38,37,36,39,32,42,41,38,42,42,40,41,42,42,40,42,45,50,50,49,49,50,50,50,50,50,50,48,48,50,49,49,35,38,37,42,36,42,42,38,42,41,39,41,42,40,40,42,40,50,50,49,49,51,50,48,50,50,50,48,49,49,49,49,37,37,36,41,36,42,41,38,42,41,41,41,42,43,40,42,45,50,51,49,48,51,50,50,50,51,50,48,49,49,50,49,38,37,36,40,36,41,39,38,42,41,40,40,42,42,40,42,45,50,50,49,49,50,50,50,50,50,50,48,49,50,49,49,39,38,37,41,37,43,42,39,44,42,41,42,43,44,41,43,46,52,52,50,51,52,51,51,52,51,51,49,50,50,50,49,39,37,37,47,37,44,42,39,42,41,41,41,42,43,40,43,46,51,50,50,50,51,51,51,51,51,51,49,50,49,50,49,38,37,36,40,36,42,41,38,43,41,41,39,43,43,39,42,45,51,51,50,50,51,51,50,51,50,50,48,49,49,50,49,39,37,37,40,36,43,41,38,42,41,41,42,42,46,42,43,45,51,51,49,50,51,51,50,51,50,51,48,49,49,50,49,38,37,37,40,34,42,41,38,42,42,42,43,42,44,42,43,45,51,51,49,50,51,51,50,51,50,52,48,49,49,50,49,38,37,36,40,36,42,41,39,42,45,42,42,43,43,40,43,45,52,51,50,50,51,51,51,51,51,51,48,50,49,50,47,39,38,37,41,37,43,42,40,43,43,42,43,47,44,40,44,47,52,51,51,50,52,52,52,52,52,52,49,51,50,49,51,38,37,36,40,37,42,41,38,42,42,41,41,42,43,37,42,45,48,50,49,50,51,50,50,49,50,50,48,49,50,49,49,39,37,36,40,36,42,41,38,42,41,40,41,42,43,40,42,46,51,51,49,49,51,50,51,51,49,50,48,49,49,47,49,39,38,37,41,35,43,42,39,43,42,41,42,43,44,41,43,46,50,51,50,51,51,51,51,51,51,51,49,50,51,50,50,37,36,33,33,28,35,36,34,39,39,39,39,41,42,39,41,45,50,50,49,49,51,50,50,50,49,50,48,49,49,49,49,38,37,36,40,36,42,42,39,42,42,44,42,43,44,42,43,46,51,51,50,50,51,51,50,51,51,51,49,49,49,51,50,41,40,40,43,40,46,45,45,45,46,44,48,46,46,45,46,48,54,54,52,52,53,52,52,53,53,53,50,51,54,51,51,43,41,40,44,40,48,46,43,46,44,43,45,46,47,43,46,48,54,54,52,53,54,54,53,54,54,54,53,52,52,56,52,46,41,39,42,37,44,44,41,44,43,42,43,44,45,42,44,47,52,52,51,51,52,52,52,52,52,52,50,51,51,51,51,40,39,37,43,46,45,42,47,45,47,43,42,45,45,42,43,45,51,51,50,50,52,51,51,51,51,51,49,50,50,47,50,41,34,37,42,37,42,42,43,45,46,47,48,44,45,42,43,45,51,51,49,49,51,51,50,51,50,51,48,48,49,49,50,42,51,43,43,44,43,41,42,47,42,42,42,43,47,46,44,45,50,50,49,49,50,50,50,50,50,50,47,49,49,49,49,46,41,42,44,43,48,44,42,45,43,42,43,44,43,45,50,48,49,50,49,49,51,50,50,50,50,51,48,49,49,50,50,52,49,57,43,41,45,48,43,51,48,48,50,51,47,44,49,51,53,53,53,49,54,53,54,53,53,53,51,52,51,51,51,46,48,45,45,48,49,47,44,48,49,46,45,49,47,46,51,55,54,54,54,53,55,54,55,54,52,54,51,53,54,54,53,42,41,40,43,40,45,52,48,44,45,44,45,46,51,45,47,49,53,54,53,53,54,54,54,54,54,54,51,51,52,53,53]

        const newArr = [...resData].map((a, index) => a > valuef1 ? a : 0)
        let resArr = newArr
        const newArrTotal = newArr.reduce((a, b) => a + b, 0)
        if (newArrTotal < valuelInit1) {
            resArr = new Array(1024).fill(0)
        }

        // resArr = dataFalse
        resArr = zeroLine(resArr)

        resArr = press(resArr, 32, 32, 'col')



        resArr = addSide(
            resArr,
            32,
            32,
            2,
            2,
            1
        );
        const interpArr = interpSmall(resArr, 32 + 4, 32 + 4, 1, 2)
        let dataToInterpGauss = gaussBlur_2(interpArr, 32 + 4, 64 + 8, 1.4)
        // console.log(props.type)
        dataToInterpGauss = dataToInterpGauss.map((a) => {
            if (a < (props.type == 'large' && props.sensorName != 'KgvDXUvdEs9M9AEQDcVc' ? 200 : 120)) {
                return 0
            } else {
                return a
            }
        })
        data = []
        const count = 64 + 8
        for (let i = 0; i < 64 + 8; i++) {
            for (let j = 0; j < (32 + 4); j++) {
                let obj: any = {}
                obj.y = (i * canvas.width * 2) / count
                obj.x = (j * canvas.height) / count
                obj.value = dataToInterpGauss[i * (32 + 4) + j]
                data.push(obj)
            }

        }


    }


    function generateData100(arr: any, num: number) {

        let resData = arr

        const newArr = [...resData].map((a, index) => a > valuef1 ? a : 0)
        let resArr = newArr
        const newArrTotal = newArr.reduce((a, b) => a + b, 0)
        if (newArrTotal < valuelInit1) {
            resArr = new Array(100).fill(0)
        }

        resArr = zeroLine(resArr)
        resArr = rotate90(resArr, 10, 10)
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 5; j++) {
                [resArr[i * 10 + j], resArr[i * 10 + 9 - j]] = [resArr[i * 10 + 9 - j], resArr[i * 10 + j]]
            }
        }
        resArr = press(resArr, 10, 10, 'col')
        // console.log(resArr.map((a) => a * 4))
        // resArr = new Array(100).fill(100)    
        resArr = addSide(
            resArr,
            10,
            10,
            2,
            2,
            1
        );

        const interpArr = interpSmall1(resArr, 10 + 4, 10 + 4, 2, 2)
        // console.log(first)
        let dataToInterpGauss = gaussBlur_2(interpArr, 20 + 8, 20 + 8, 1)
        dataToInterpGauss = dataToInterpGauss.map((a) => {
            if (a < 100) {
                return 0
            } else {
                return a
            }
        })
        data = []
        const count = 20 + 8
        for (let i = 0; i < 20 + 8; i++) {
            for (let j = 0; j < (20 + 8); j++) {
                let obj: any = {}
                obj.y = (i * canvas.width) / count
                obj.x = (j * canvas.height) / count
                obj.value = dataToInterpGauss[i * (20 + 8) + j]
                data.push(obj)
            }

        }


    }

    // 构造一个离屏canvas
    function Canvas(width: any, height: any): any {
        let canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
    }
    interface UserConstructor {
        new(width: any, height: any): any;
    }
    // 画圆
    function createCircle(size: any) {
        let shadowBlur = size / 2
        let r2 = size + shadowBlur
        // let offsetDistance = 10000
        let offsetDistance = 10000
        // let newCanvas:UserConstructor = Canvas

        let circle = new (Canvas as any)(r2 * 2, r2 * 2)
        let context = circle.getContext('2d')




        // if (isShadow) context.shadowBlur = shadowBlur;
        if (isShadow) context.shadowBlur = shadowBlur;
        context.shadowColor = 'black'
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance

        context.beginPath()
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true)
        context.closePath()
        context.fill()
        return circle
    }
    // 绘制热力图
    function draw(context: any, data: any) {
        // console.log(options)
        let circle = createCircle(options.size)
        let circleHalfWidth = circle.width / 2
        let circleHalfHeight = circle.height / 2

        // 按透明度分类
        let dataOrderByAlpha: any = {}
        data.forEach((item: any) => {
            let alpha = Math.min(1, item.value / options.max).toFixed(2)
            dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || []
            dataOrderByAlpha[alpha].push(item)
        })

        // 绘制不同透明度的圆形
        for (let i in dataOrderByAlpha) {
            if (isNaN(Number(i))) continue;
            let _data = dataOrderByAlpha[i]
            context.beginPath()
            context.globalAlpha = i
            _data.forEach((item: any) => {
                context.drawImage(circle, item.x - circleHalfWidth, item.y - circleHalfHeight)
            })
        }
        // 圆形着色
        let intensity = new (Intensity as any)()
        let colored = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
        colorize(colored.data, intensity.getImageData())

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = '#666'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        // console.log(colored)
        context.putImageData(colored, 0, 0)

        applySharpen(context, canvas.width, canvas.height);
    }

    function applySharpen(context: any, width: any, height: any) {
        // 获取原始图像数据
        let originalImageData = context.getImageData(0, 0, width, height);
        let originalPixels = originalImageData.data;

        // 创建一个用于存放处理后的图像数据的 ImageData 对象
        let outputImageData = context.createImageData(width, height);
        let outputPixels = outputImageData.data;

        const kernel = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0,
        ];

        const kernelSize = Math.sqrt(kernel.length);
        const halfKernelSize = Math.floor(kernelSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;

                for (let ky = 0; ky < kernelSize; ky++) {
                    for (let kx = 0; kx < kernelSize; kx++) {
                        // 考虑边缘像素
                        let pixelY = y + ky - halfKernelSize;
                        let pixelX = x + kx - halfKernelSize;

                        if (pixelY < 0 || pixelY >= height || pixelX < 0 || pixelX >= width) continue;

                        // 卷积计算
                        let offset = (pixelY * width + pixelX) * 4;
                        let weight = kernel[ky * kernelSize + kx];

                        r += originalPixels[offset] * weight;
                        g += originalPixels[offset + 1] * weight;
                        b += originalPixels[offset + 2] * weight;
                    }
                }

                let destOffset = (y * width + x) * 4;
                outputPixels[destOffset] = r;
                outputPixels[destOffset + 1] = g;
                outputPixels[destOffset + 2] = b;
                outputPixels[destOffset + 3] = originalPixels[destOffset + 3]; // 保持相同的 alpha 值
            }
        }

        // 将处理后的图像数据绘制回画布
        context.putImageData(outputImageData, 0, 0);
    }


    function colorize(pixels: any, gradient: any) {

        // console.log(gradient)

        var max = options.max;
        var min = options.min;
        var diff = max - min;
        var range = options.range || null;

        var jMin = 0;
        var jMax = 1024;
        if (range && range.length === 2) {
            jMin = (range[0] - min) / diff * 1024;
        }

        if (range && range.length === 2) {
            jMax = (range[1] - min) / diff * 1024;
        }

        var maxOpacity = options.maxOpacity || 1;
        var range = options.range;
        // console.log(pixels.length)
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value

            // if (pixels[i] / 256 > maxOpacity) {
            //     pixels[i] = 256 * maxOpacity;
            // }
            if (pixels[i] / 256 < 1) {
                pixels[i] = 256 * 1;
            }
            // const value = jet()
            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            } else {
                pixels[i] = 0;
            }
            // pixels[i] = 256 *0
        }
    }

    function bthClickHandle(arr: any, num: number) {
        if (props.sensorName !== 'iJ3X0JSttyoiRPafpIka') {
            options.size = canvas.width / 22
            generateData(arr, num)
            options.max = bedMax
        } else {
            canvas.height = canvas.width
            options.size = canvas.width / sitWidth
            // options.gradient = {
            //     0: "#000000",
            //     0.3: "#0000FF",
            //     0.4: " #0066FF",
            //     0.5: "#00FF00",
            //     0.6: "#FFFF00",
            //     0.7: "#FF6600",
            //     0.8: "#FF0000",
            //     1: "#FF1E42",
            // }
            options.max = sitMax
            const arr = [1, 0, 21, 82, 147, 110, 145, 146, 169, 83, 1, 0, 49, 100, 157, 128, 153, 147, 126, 51, 2, 0, 73, 113, 176, 144, 146, 121, 98, 27, 2, 0, 99, 157, 173, 161, 158, 81, 32, 10, 7, 0, 192, 213, 186, 44, 39, 31, 13, 5, 35, 2, 147, 179, 170, 31, 31, 20, 16, 5, 18, 0, 58, 108, 170, 152, 154, 81, 85, 21, 3, 0, 45, 105, 155, 148, 139, 117, 134, 59, 0, 0, 44, 86, 148, 157, 121, 119, 139, 91, 0, 1, 18, 60, 121, 153, 170, 123, 165, 99]
            generateData100(arr, num)
        }



        let context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
        isShadow = true
        draw(context, data)
        isShadow = false
    }

    function sitValue(prop: any) {
        // const { valuej, valueg, value, valuel, valuef, valuelInit } = prop;
        // if (valuej) options.max = valuej;
        // if (valueg) valueg1 = valueg;
        // // if (value) value1 = value;
        // if (valuel) valuel1 = valuel;
        // if (valuef) valuef1 = valuef;
        // if (valuelInit) valuelInit1 = valuelInit;
        // console.log(valuel, 'valuel')
    }



    function Intensity(this: any, options?: any): any {


        options = options || {};
        this.gradient = options.gradient || {

            // #0000FF
            // #0066FF
            // #00FF00
            // #FFFF00
            // #FF6600
            // #FF0000
            // #FF1E42

            // 0: "rgba(0, 0, 0, 1)",

            // 0.28: "rgba(0, 0, 255, 1)",
            // 0.40: "rgba(0, 0, 255, 1)",
            // 0.60: "rgba(0, 0, 255, 1)",
            // 0.70: "rgba(62, 0, 248, 1)",
            // 0.80: "rgba(149, 253, 237, 1)",
            // 0.90: "rgba(154, 255, 62, 1)",
            // 1: "rgba(246, 254, 71, 1)",


            // 0: "#0000FF",
            // 0.17: " #0066FF",
            // 0.34: "#00FF00",
            // 0.51: "#FFFF00",
            // 0.68: "#FF6600",
            // 0.85: "#FF0000",
            // 1: "#FF1E42",

            // 士凯
            0: "#000000",
            0.14: "#0000FF",
            0.28: " #0066FF",
            0.42: "#00FF00",
            0.56: "#FFFF00",
            0.70: "#FF6600",
            0.84: "#FF0000",
            1: "#FF1E42",

            // qin A200
            // 0: "#000000",
            // 0.14: "#40C4FF",
            // 0.28: " #448AFF",
            // 0.42: "#536DFE",
            // 0.56: "#7C4DFF",
            // 0.70: "#E040FB",
            // 0.84: "#FF4081",
            // 1: "#FF5252",


        };
        if (props.sensorName == 'iJ3X0JSttyoiRPafpIka') {
            this.gradient = {
                0: "#000000",
                0.1: "#0000FF",
                0.3: " #0066FF",
                0.5: "#00FF00",
                0.7: "#FFFF00",
                0.85: "#FF6600",
                0.95: "#FF0000",
                1: "#FF1E42",
            }
        }
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.min = options.min || 0;
        this.initPalette();
    }

    Intensity.prototype.setMax = function (value: any) {
        this.max = value || 100;
    }

    Intensity.prototype.setMin = function (value: any) {
        this.min = value || 0;
    }

    Intensity.prototype.setMaxSize = function (maxSize: any) {
        this.maxSize = maxSize || 35;
    }

    Intensity.prototype.setMinSize = function (minSize: any) {
        this.minSize = minSize || 0;
    }

    Intensity.prototype.initPalette = function () {

        var gradient = this.gradient;

        var canvas = new (Canvas as any)(256, 1);

        var paletteCtx = this.paletteCtx = canvas.getContext('2d', { willReadFrequently: true });

        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }

        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);

    }



    Intensity.prototype.getImageData = function (value: any) {

        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

        if (value === undefined) {
            return imageData;
        }

        var max = this.max;
        var min = this.min;

        if (value > max) {
            value = max;
        }

        if (value < min) {
            value = min;
        }

        var index = Math.floor((value - min) / (max - min) * (256 - 1));

        return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
    }

    /**
     * @param Number value 
     * @param Number max of value
     * @param Number max of size
     * @param Object other options
     */
    Intensity.prototype.getSize = function (value: any) {

        var size = 0;
        var max = this.max;
        var min = this.min;
        var maxSize = this.maxSize;
        var minSize = this.minSize;

        if (value > max) {
            value = max;
        }

        if (value < min) {
            value = min;
        }

        size = minSize + (value - min) / (max - min) * (maxSize - minSize);

        return size;

    }

    Intensity.prototype.getLegend = function (options: any) {
        var gradient = this.gradient;


        var width = options.width || 20;
        var height = options.height || 180;

        var canvas = new (Canvas as any)(width, height);

        var paletteCtx = canvas.getContext('2d');

        var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }

        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, width, height);

        return canvas;
    }


    useImperativeHandle(refs, () => ({
        // sitData  
        bthClickHandle,
        sitValue,
        setCircleArr,
        canvasRef,
        changeOptions
    }));
    const changeOptions = (value: number) => {
        options.size = value
    }

    function resize() {
        if (props.sensorName === 'iJ3X0JSttyoiRPafpIka') {
            canvas.height = canvas.width
            options.size = canvas.width / sitWidth
            options.gradient = {
                0: "#000000",
                0.3: "#0000FF",
                0.4: " #0066FF",
                0.5: "#00FF00",
                0.6: "#FFFF00",
                0.7: "#FF6600",
                0.8: "#FF0000",
                1: "#FF1E42",
            }
            options.max = sitMax
        } else {
            options.size = canvas.width / 22
            canvas.height = canvas.width * 2
            options.max = bedMax
        }
    }

    useEffect(() => {


        canvas = document.getElementById(`heatmapcanvas${props.index || ''}`)


        if (props.sensorName === 'iJ3X0JSttyoiRPafpIka') {
            canvas.height = canvas.width
            options.size = canvas.width / sitWidth
            options.gradient = {
                0: "#000000",
                0.4: "#0000FF",
                0.5: " #0066FF",
                0.6: "#00FF00",
                0.7: "#FFFF00",
                0.8: "#FF6600",
                0.9: "#FF0000",
                1: "#FF1E42",
            }
            options.max = sitMax
        } else {
            options.size = canvas.width / 22
            setFontSize(canvas.width / 22)
            canvas.height = canvas.width * 2
            options.max = bedMax
        }



        context = canvas.getContext('2d')

        const devicePixelRatio = window.devicePixelRatio || 1;
        // 设置高清画布
        // console.log(canvas.width, canvas.clientWidth, canvas.clientWidth * devicePixelRatio)
        // canvas.width = canvas.clientWidth * devicePixelRatio;
        // canvas.height = canvas.clientHeight * devicePixelRatio;
        // // 修改缩放比，在高分辨率屏幕上仍然能够以预期的尺寸绘制图形，且在保留清晰度的同时防止模糊
        // context.scale(devicePixelRatio, devicePixelRatio);

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 6, 12, 13, 22, 36, 27, 29, 20, 11, 7, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 4, 8, 7, 14, 23, 24, 31, 39, 38, 30, 23, 19, 12, 10, 5, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 13, 13, 12, 33, 23, 24, 24, 54, 38, 31, 27, 43, 33, 42, 31, 31, 33, 37, 46, 66, 29, 16, 8, 2, 2, 1, 0, 0, 0, 0, 2, 4, 26, 26, 34, 35, 23, 24, 33, 42, 31, 37, 34, 29, 46, 40, 32, 40, 31, 26, 34, 35, 29, 49, 30, 19, 9, 3, 0, 0, 0, 1, 5, 17, 15, 15, 14, 17, 28, 37, 29, 40, 31, 44, 42, 36, 44, 38, 50, 37, 41, 36, 48, 31, 45, 18, 19, 24, 18, 5, 0, 0, 1, 2, 18, 25, 6, 5, 3, 9, 19, 23, 20, 21, 41, 39, 36, 49, 41, 57, 74, 36, 37, 30, 44, 20, 18, 3, 4, 17, 29, 7, 0, 0, 2, 5, 43, 24, 4, 4, 2, 2, 5, 17, 26, 21, 46, 33, 42, 32, 48, 53, 47, 45, 43, 44, 28, 9, 3, 2, 3, 8, 40, 84, 17, 0, 2, 5, 18, 3, 1, 1, 1, 1, 2, 7, 11, 15, 22, 31, 56, 45, 38, 45, 56, 49, 42, 27, 17, 3, 1, 0, 0, 1, 4, 15, 1, 0, 5, 3, 4, 2, 1, 1, 1, 1, 2, 3, 8, 26, 45, 47, 37, 31, 30, 33, 35, 31, 45, 33, 8, 2, 0, 0, 0, 0, 1, 3, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 3, 15, 28, 30, 26, 24, 13, 38, 38, 26, 37, 16, 3, 1, 0, 0, 0, 0, 2, 2, 0, 0, 3, 1, 3, 3, 1, 1, 1, 1, 1, 2, 9, 13, 37, 22, 22, 12, 6, 24, 18, 30, 19, 29, 10, 3, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 3, 10, 23, 20, 23, 21, 35, 31, 42, 23, 29, 17, 32, 18, 5, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 2, 3, 21, 22, 45, 22, 21, 30, 41, 30, 16, 22, 36, 35, 35, 17, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 0, 1, 2, 6, 31, 50, 36, 31, 39, 51, 69, 51, 26, 23, 26, 31, 28, 15, 4, 1, 0, 0, 0, 1, 2, 0, 0, 1, 0, 1, 2, 3, 4, 16, 23, 43, 63, 32, 54, 50, 31, 42, 44, 42, 47, 43, 52, 47, 31, 45, 29, 3, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 2, 2, 11, 77, 47, 45, 30, 33, 41, 46, 52, 28, 24, 30, 57, 50, 32, 40, 53, 36, 5, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 3, 12, 35, 75, 32, 49, 38, 47, 61, 35, 28, 53, 31, 34, 28, 32, 37, 26, 41, 13, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 16, 46, 34, 58, 50, 40, 31, 45, 36, 26, 43, 53, 40, 32, 44, 44, 42, 22, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 2, 2, 16, 25, 62, 45, 56, 51, 29, 23, 18, 6, 14, 33, 34, 56, 35, 48, 31, 24, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 14, 21, 36, 26, 44, 24, 7, 5, 3, 1, 1, 2, 7, 23, 25, 26, 20, 28, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 2, 21, 22, 14, 18, 31, 11, 3, 1, 1, 0, 1, 1, 2, 18, 16, 12, 22, 18, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 11, 26, 17, 32, 27, 6, 1, 1, 0, 0, 0, 0, 1, 10, 14, 12, 13, 11, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 9, 27, 29, 16, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 17, 16, 9, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 12, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 15, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 3, 2, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 26, 25, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 20, 10, 4, 1, 0, 0, 0, 0, 1, 2, 7, 19, 69, 69, 9, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 10, 53, 62, 45, 22, 6, 2, 0, 0, 3, 18, 85, 93, 115, 115, 16, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 32, 76, 92, 119, 104, 36, 7, 0, 0, 5, 45, 108, 118, 139, 139, 19, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 22, 66, 79, 141, 121, 62, 13, 0, 1]
        const data = new Array(1024).fill(0)

        bthClickHandle(data, props.num)
        // window.onload = function () {

        // }
        // const ws = new WebSocket(" ws://localhost:19999");
        // ws.onopen = () => {
        //     // connection opened
        //     console.info("connect success");
        // };
        // ws.onmessage = (e) => {
        //     let jsonObject = JSON.parse(e.data);
        //     //处理空数组

        //     if (jsonObject.sitData != null) {
        //         // sitData(jsonObject.sitData)
        //         if (jsonObject.sitData.length === 1024) {
        //             bthClickHandle(jsonObject.sitData)
        //         }
        //     }
        // };
        // ws.onerror = (e) => {
        //     // an error occurred
        // };
        // ws.onclose = (e) => {
        //     // connection closed
        // };

        if (props.index == 12) {
            console.log(123123)
            bthClickHandle(props.data, props.num)
            if (props.sensorName == 'KgvDXUvdEs9M9AEQDcVc') {
                let circleArr = [{ x: 12, y: 18, time: 20, radius: 5 }, { x: 24, y: 7, time: 27, radius: 5 }, { x: 30, y: 29, time: 31, radius: 5 }]
                setCircleArr(circleArr)
            }
            console.log(props.circleArr)
            setCircleArr(props.circleArr)
        }

        bthClickHandle(props.data, props.num)

        return () => {
            window.removeEventListener('resize', () => { })
        }
    }, [props.sensorName]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: '#000', height: props.height ? '100%' : 'unset', width: props.width ? props.width : 'unset' }}>
            <canvas style={{ height: props.height ? '100%' : 'unset', width: props.width ? '100%' : 'unset', flex: 1 }} ref={canvasRef} id={`heatmapcanvas${props.index ? props.index : ''}`} ></canvas>
            {
                circleArr && circleArr[0] && Object.keys(circleArr[0]).length ? circleArr?.map((a, indexs) => {
                    return (
                        <div style={{ fontSize: `${fontSize / 15}rem`, fontWeight: 'bold', color: '#fff', position: 'absolute', left: `${((a.x) / 36 * 100)}%`, top: `${((a.y * 2 + 2) / 72 * 100)}%`, transform: 'translate(-50% , -50%)', width: `${(4 * 0.75)}rem`, height: `${(4 * 0.75)}rem`, borderRadius: '50%', backgroundColor: a.time > 30 ? 'rgba(211,0,0,0.5)' : 'rgba(132,133,135,0.7)', textAlign: 'center', display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center' }}>
                            <div>{a.time}</div> <div>{a.time ? 'min' : ''}</div>
                        </div>
                    )
                })
                    : ''}
        </div>
    );
})

export default Heatmap