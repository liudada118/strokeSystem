import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { press, zeroLine } from '@/utils/matrix';
import { heatmapProp } from '@/utils/constant';
export function addSide(arr: any, width: any, height: any, wnum: any, hnum: any, sideNum: any) {
    let narr = new Array(height);
    let res = [];
    for (let i = 0; i < height; i++) {
        narr[i] = [];

        for (let j = 0; j < width; j++) {
            if (j == 0) {
                narr[i].push(
                    ...new Array(wnum).fill(sideNum >= 0 ? sideNum : 1),
                    arr[i * width + j]
                );
            } else if (j == width - 1) {
                narr[i].push(
                    arr[i * width + j],
                    ...new Array(wnum).fill(sideNum >= 0 ? sideNum : 1)
                );
            } else {
                narr[i].push(arr[i * width + j]);
            }
        }
    }
    for (let i = 0; i < height; i++) {
        res.push(...narr[i]);
    }

    return [
        ...new Array(hnum * (width + 2 * wnum)).fill(sideNum >= 0 ? sideNum : 1),
        ...res,
        ...new Array(hnum * (width + 2 * wnum)).fill(sideNum >= 0 ? sideNum : 1),
    ];
}

var color: any

function gaussBlur_2(scl: any, w: any, h: any, r: any) {
    const tcl = new Array(scl.length).fill(1)
    var rs = Math.ceil(r * 2.57); // significant radius
    for (var i = 0; i < h; i++)
        for (var j = 0; j < w; j++) {
            var val = 0,
                wsum = 0;
            for (var iy = i - rs; iy < i + rs + 1; iy++)
                for (var ix = j - rs; ix < j + rs + 1; ix++) {
                    var x = Math.min(w - 1, Math.max(0, ix));
                    var y = Math.min(h - 1, Math.max(0, iy));
                    var dsq = (ix - j) * (ix - j) + (iy - i) * (iy - i);
                    var wght = Math.exp(-dsq / (2 * r * r)) / (Math.PI * 2 * r * r);
                    val += scl[y * w + x] * wght;
                    wsum += wght;
                }
            tcl[i * w + j] = Math.round(val / wsum);
        }
    return tcl
}




function interpSmall(smallMat: any, width: any, height: any, interp1: any, interp2: any) {
    // for (let x = 1; x <= Length; x++) {
    //   for (let y = 1; y <= Length; y++) {
    //     bigMat[
    //       Length * num * (num * (y - 1)) +
    //       (Length * num * num) / 2 +
    //       num * (x - 1) +
    //       num / 2
    //     ] = smallMat[Length * (y - 1) + x - 1] * 10;
    //   }
    // }
    // 32, 10, 4, 5
    const bigMat = new Array((width * interp1) * (height * interp2)).fill(0)
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            bigMat[(width * interp1) * i * interp2 + (j * interp1)] = smallMat[i * width + j] * 10
            bigMat[(width * interp1) * (i * interp2 + 1) + (j * interp1)] = smallMat[i * width + j] * 10
        }
    }

    // console.log(bigMat.length)
    return bigMat
}

// interface Options = {
//     min 
// }

var data: any = []

var isShadow = true

// valueg1 = localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
let valuef1 = 2, // localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
    valuelInit1 = 2// localStorage.getItem('carValueInit') ? JSON.parse(localStorage.getItem('carValueInit')) : 2,
// valuel1 = localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2
const sitnum1 = 32;
const sitnum2 = 32;
const sitInterp = 2;
const sitOrder = 0;



const Heatmap = React.forwardRef((props: any, refs) => {

    const [colorObj, setColorObj] = useState<any>({})
    const [circleArr, setCircleArr] = useState<Array<any>>([{}])
    const canvasRef = useRef<any>(null)
    const contextRef = useRef<any>(null)

    var options: any = {
        min: 0,
        // max: localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 900,
        max: props.sensorName == 'KgvDXUvdEs9M9AEQDcVc' ? 9000 : 14000,
        size: 4
    }

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

        if (!resData) return
        const newArr = [...resData].map((a, index) => a > valuef1 ? a : 0)
        let resArr = newArr
        resArr = zeroLine(resArr)
        const newArrTotal = newArr.reduce((a, b) => a + b, 0)
        if (newArrTotal < valuelInit1) {
            resArr = new Array(1024).fill(0)
        }

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
        dataToInterpGauss = dataToInterpGauss.map((a) => {
            if (a < (props.type == 'large' && props.sensorName != 'KgvDXUvdEs9M9AEQDcVc' ? 200 : 120)) {
                return 0
            } else {
                return a
            }
        })

        const max = Math.max(...dataToInterpGauss)
        options.max = max * heatmapProp

        data = []
        const count = 64 + 8
        for (let i = 0; i < 64 + 8; i++) {
            for (let j = 0; j < (32 + 4); j++) {
                let obj: any = {}
                obj.y = (i * canvasRef.current.width * 2) / count
                obj.x = (j * canvasRef.current.height) / count
                obj.value = dataToInterpGauss[i * (32 + 4) + j]
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
        let offsetDistance = 10000

        // let newCanvas:UserConstructor = Canvas

        let circle = new (Canvas as any)(r2 * 2, r2 * 2)
        let context = circle.getContext('2d')




        if (isShadow) context.shadowBlur = shadowBlur;
        context.shadowColor = 'black'
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance

        context.beginPath()
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true)
        context.closePath()
        context.fill()
        return circle
    }

    function draw(context: any, data: any) {
        // console.log(options)
        // options.max = 6000
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

        applySharpen(context, canvasRef.current.width, canvasRef.current.height);
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

    function jet(min: any, max: any, x: any) {
        let red, g, blue;
        let dv;
        red = 1.0;
        g = 1.0;
        blue = 1.0;
        if (x < min) {
            x = min;
        }
        if (x > max) {
            x = max;
        }
        dv = max - min;
        if (x < min + 0.25 * dv) {
            // red = 0;
            // g = 0;
            // blue = 0;

            red = 0;
            g = (4 * (x - min)) / dv;
        } else if (x < min + 0.5 * dv) {
            red = 0;
            blue = 1 + (4 * (min + 0.25 * dv - x)) / dv;
        } else if (x < min + 0.75 * dv) {
            red = (4 * (x - min - 0.5 * dv)) / dv;
            blue = 0;
        } else {
            g = 1 + (4 * (min + 0.75 * dv - x)) / dv;
            blue = 0;
        }
        var rgba = new Array();
        rgba[0] = 255 * red;
        rgba[1] = 255 * g;
        rgba[2] = 255 * blue;
        rgba[3] = 1;
        return rgba;
    }


    function bthClickHandle(arr: any, num: number) {

        // const dataArr =[0, 0, 1, 1, 1, 3, 2, 0, 0, 1, 0, 0, 0, 2, 7, 4, 1, 0, 1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 4, 19, 0, 1, 2, 1, 0, 4, 2, 1, 0, 11, 1, 0, 2, 3, 5, 6, 1, 0, 0, 0, 1, 2, 1, 0, 0, 3, 0, 0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 5, 9, 9, 2, 1, 1, 0, 1, 3, 4, 9, 3, 2, 0, 2, 1, 0, 0, 0, 1, 3, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 5, 19, 14, 5, 8, 4, 1, 2, 3, 6, 13, 7, 15, 4, 2, 2, 4, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 5, 9, 14, 19, 27, 8, 3, 3, 2, 6, 13, 15, 17, 12, 5, 1, 2, 1, 0, 2, 2, 0, 1, 0, 0, 1, 0, 11, 2, 1, 1, 1, 3, 10, 11, 13, 12, 4, 4, 1, 2, 5, 13, 9, 8, 9, 4, 3, 1, 2, 1, 1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 1, 1, 1, 3, 5, 15, 11, 11, 10, 3, 3, 8, 8, 14, 11, 9, 8, 3, 2, 1, 1, 1, 2, 1, 0, 2, 12, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 9, 9, 5, 2, 1, 0, 1, 3, 9, 9, 18, 7, 2, 2, 1, 2, 1, 1, 1, 1, 1, 4, 1, 0, 0, 1, 1, 1, 1, 4, 21, 16, 10, 17, 19, 7, 5, 3, 2, 4, 9, 19, 13, 7, 3, 2, 1, 2, 7, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 4, 4, 3, 13, 8, 11, 5, 4, 4, 5, 1, 1, 0, 1, 1, 3, 1, 4, 2, 1, 1, 2, 8, 2, 1, 1, 0, 1, 1, 2, 6, 4, 7, 8, 4, 1, 0, 1, 4, 5, 15, 12, 3, 1, 0, 1, 0, 0, 1, 8, 2, 2, 0, 1, 1, 2, 17, 40, 5, 2, 2, 2, 4, 5, 6, 9, 8, 4, 2, 2, 7, 13, 20, 13, 6, 6, 2, 1, 0, 7, 2, 1, 2, 1, 2, 2, 1, 2, 41, 7, 1, 2, 3, 5, 14, 14, 11, 10, 8, 4, 3, 5, 8, 14, 9, 18, 21, 22, 7, 9, 3, 7, 3, 4, 1, 1, 0, 0, 0, 0, 2, 1, 2, 2, 18, 7, 9, 18, 15, 9, 10, 8, 5, 3, 5, 12, 9, 20, 14, 22, 12, 3, 4, 6, 2, 2, 2, 1, 0, 0, 1, 1, 3, 22, 7, 2, 4, 10, 10, 21, 14, 11, 8, 9, 4, 7, 10, 14, 16, 13, 22, 17, 15, 9, 14, 6, 5, 4, 2, 1, 0, 1, 0, 2, 1, 1, 0, 1, 5, 18, 21, 23, 19, 16, 13, 8, 12, 16, 19, 19, 16, 12, 20, 18, 27, 28, 8, 5, 4, 3, 2, 2, 1, 1, 1, 1, 1, 3, 1, 3, 14, 38, 38, 16, 16, 16, 28, 31, 21, 30, 26, 20, 26, 21, 17, 35, 31, 37, 38, 18, 14, 8, 12, 2, 1, 1, 1, 1, 2, 2, 2, 2, 13, 30, 26, 16, 17, 22, 25, 24, 34, 27, 30, 24, 26, 23, 35, 34, 36, 20, 28, 10, 14, 47, 63, 1, 0, 1, 1, 0, 3, 3, 2, 4, 18, 30, 21, 21, 31, 19, 22, 34, 41, 42, 45, 30, 26, 28, 23, 28, 26, 22, 12, 8, 21, 29, 6, 2, 2, 1, 1, 2, 2, 2, 0, 0, 11, 15, 15, 21, 15, 17, 26, 27, 23, 34, 32, 26, 22, 17, 16, 15, 15, 12, 14, 10, 63, 39, 13, 1, 1, 0, 0, 1, 2, 1, 1, 2, 4, 15, 19, 13, 14, 18, 22, 20, 22, 16, 15, 19, 14, 15, 22, 24, 22, 11, 8, 5, 21, 6, 4, 2, 0, 0, 0, 1, 0, 1, 0, 0, 4, 6, 14, 14, 14, 13, 14, 16, 24, 24, 16, 11, 17, 14, 12, 10, 10, 13, 6, 15, 4, 4, 2, 0, 0, 1, 1, 5, 0, 2, 0, 0, 6, 3, 4, 7, 12, 14, 16, 10, 22, 13, 13, 13, 15, 12, 14, 8, 4, 4, 5, 24, 5, 4, 3, 0, 1, 2, 4, 17, 1, 1, 0, 0, 2, 3, 4, 7, 10, 15, 17, 12, 15, 24, 20, 15, 12, 13, 7, 5, 3, 3, 3, 2, 3, 2, 1, 0, 0, 3, 1, 2, 1, 0, 1, 7, 1, 2, 5, 10, 13, 17, 15, 11, 18, 15, 14, 11, 8, 12, 9, 4, 5, 5, 15, 4, 4, 2, 1, 0, 1, 1, 1, 1, 0, 0, 0, 2, 3, 4, 9, 8, 12, 19, 25, 20, 24, 17, 17, 14, 12, 14, 17, 16, 13, 22, 10, 8, 4, 5, 15, 1, 0, 1, 1, 1, 2, 0, 1, 0, 5, 9, 19, 20, 25, 23, 22, 22, 24, 20, 17, 14, 14, 12, 16, 16, 17, 27, 32, 40, 29, 11, 5, 19, 8, 18, 43, 63, 29, 26, 24, 32, 24, 21, 16, 18, 16, 18, 20, 9, 13, 19, 23, 13, 16, 15, 15, 13, 7, 6, 6, 7, 5, 4, 3, 4, 0, 1, 1, 3, 3, 4, 6, 11, 44, 38, 43, 28, 18, 23, 25, 18, 24, 20, 11, 15, 14, 16, 18, 22, 33, 13, 18, 8, 7, 5, 3, 8, 1, 2, 2, 1, 3, 4, 2, 6, 23, 20, 21, 24, 24, 21, 25, 24, 20, 14, 26, 27, 14, 17, 15, 24, 16, 19, 11, 6, 5, 5, 3, 2, 0, 2, 0, 1, 0, 1, 0, 0, 3, 6, 13, 11, 11, 13, 15, 12, 13, 22, 19, 14, 12, 13, 13, 11, 16, 5, 4, 3, 3, 3, 6, 3, 2, 3, 0, 2, 3, 1, 1, 5, 22, 4, 2, 2, 1, 3, 2, 4, 4, 6, 4, 4, 2, 2, 4, 4, 15, 5, 4, 3, 8, 3, 3, 170, 85, 3, 153, 0, 0, 0]
        generateData(arr, num)
        let context = canvasRef.current.getContext('2d')
        options.size = canvasRef.current.width / 22
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
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
        this.gradient = (color ? JSON.parse(color) : '') || options.gradient || {

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

            // shikai
            0: "#000000",
            0.14: "#0000FF",
            0.28: " #0066FF",
            0.42: "#00FF00",
            0.56: "#FFFF00",
            0.70: "#FF6600",
            0.84: "#FF0000",
            1: "#FF1E42",

            // qin A200
            //    0: "#000000",
            //    0.14: "#40C4FF",
            //    0.28: " #448AFF",
            //    0.42: "#536DFE",
            //    0.56: "#7C4DFF",
            //    0.70: "#E040FB",
            //    0.84: "#FF4081",
            //    1: "#FF5252",

            // qin A400
            // 0: "#000000",
            // 0.14: "#2979FF",
            // 0.28: " #00B0FF",
            // 0.42: "#00E676",
            // 0.56: "#76FF03",
            // 0.70: "#FFEA00",
            // 0.84: "#FF9100",
            // 1: "#FF3D00",

            // qin A700
            // 0: "#000000",
            // 0.14: "#2962FF",
            // 0.28: " #0091EA",
            // 0.42: "#00BFA5",
            // 0.56: "#00C853",
            // 0.70: "#FFD600",
            // 0.84: "#FF6D00",
            // 1: "#DD2C00",

        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.min = options.min || 0;
        this.initPalette();
    }

    Intensity.prototype.setGradient = function (value: any) {
        this.gradient = value
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

    // Intensity.prototype.getColor = function (value) {

    //     var imageData = this.getImageData(value);

    //     return "rgba(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ", " + imageData[3] / 256 + ")";

    // }

    Intensity.prototype.getImageData = function (value: any) {
        // console.log(this.paletteCtx.getImageData(0, 0, 256, 1).data)
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



    const drawContent = () => { }

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
    useEffect(() => {

        let width = window.innerWidth < 999 ? 'phone' : 'pc'
        // canvas = document.getElementById(`heatmapcanvas${props.index || ''}`)

        options.size = canvasRef.current.width / 22
        setFontSize(canvasRef.current.width / 22)
        canvasRef.current.height = canvasRef.current.width * 2


        contextRef.current = canvasRef.current.getContext('2d')

        const devicePixelRatio = window.devicePixelRatio || 1;

        contextRef.current.imageSmoothingEnabled = true;
        contextRef.current.imageSmoothingQuality = 'high';

        // const data = new Array(1024).fill(0)
        bthClickHandle(props.data, props.num)

        if (props.index == 12) {
            console.log(props.data, 'refffff')
            bthClickHandle(props.data, props.num)
            if (props.sensorName == 'KgvDXUvdEs9M9AEQDcVc') {
                let circleArr = [{ x: 12, y: 18, time: 20, radius: 5 }, { x: 24, y: 7, time: 27, radius: 5 }, { x: 30, y: 29, time: 31, radius: 5 }]
                setCircleArr(circleArr)
            }
            console.log(props.circleArr)
            setCircleArr(props.circleArr)
        } else {
            setCircleArr(props.circleArr)
        }

        return () => {
            window.removeEventListener('resize', () => { })
        }

    }, []);
    const [fontSize, setFontSize] = useState(1)
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: '#000', position: 'relative' }}>

            {/* <div><textarea onChange={(e) => {
                // console.log(e.target.value)
                // console.log(Intensity.prototype.setGradient(e.target.value))
                setColorObj(e.target.value)
                color = e.target.value
                console.log(Intensity.prototype.gradient)
            }} /> <button onClick={() => {Intensity.prototype.setGradient(colorObj)}}>change</button></div> */}
            <canvas style={{ width: '100%', }} ref={canvasRef} id={`heatmapcanvas${props.index ? props.index : ''}`} ></canvas>
            {
                circleArr?.map((a, indexs) => {
                    return (
                        <div style={{ fontSize: `${fontSize / 15}rem`, color: '#fff', position: 'absolute', left: `${((a.x) / 36 * 100)}%`, top: `${((a.y * 2 + 2) / 72 * 100)}%`, transform: 'translate(-50% , -50%)', width: `${(4 * 0.75)}rem`, height: `${(4 * 0.75)}rem`, borderRadius: '50%', backgroundColor: 'rgba(132,133,135,0.7)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {a.time}min
                        </div>
                    )
                })
            }
        </div>

    );
})

export default Heatmap