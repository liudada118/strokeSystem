export function press(arr: any, width: any, height: any, type = "row") {
    let wsPointData: any = [...arr];

    if (type == "row") {
        let colArr = [];
        for (let i = 0; i < height; i++) {
            let total = 0;
            for (let j = 0; j < width; j++) {
                total += wsPointData[i * width + j];
            }
            colArr.push(total);
        }
        // //////okok
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                wsPointData[i * width + j] = Math.round(
                    (wsPointData[i * width + j] /
                        (1245 - colArr[i] == 0 ? 1 : 1245 - colArr[i])) *
                    1000
                );
            }
        }
    } else {
        let colArr = [];
        for (let i = 0; i < height; i++) {
            let total = 0;
            for (let j = 0; j < width; j++) {
                total += wsPointData[j * height + i];
            }
            colArr.push(total);
        }
        // //////okok
        // const value = Math.max(...colArr) + 100
        const value = 1245
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                wsPointData[j * height + i] = Math.round(
                    (wsPointData[j * height + i] /
                        (value - colArr[i] <= 0 ? 1 : value - colArr[i])) *
                    1000
                );
            }
        }
    }

    //////

    // wsPointData = wsPointData.map((a,index) => {return calculateY(a)})
    return wsPointData;
}

export function rotate90(arr: Array<number>, height: number, width: number) {
    //逆时针旋转 90 度
    //列 = 行
    //行 = n - 1 - 列(j);  n表示总行数
    let matrix: any = [];
    for (let i = 0; i < height; i++) {
        matrix[i] = [];
        for (let j = 0; j < width; j++) {
            matrix[i].push(arr[i * height + j]);
        }
    }

    var temp: any = [];
    var len = matrix.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            var k = len - 1 - j;
            if (!temp[k]) {
                temp[k] = [];
            }
            temp[k][i] = matrix[i][j];
        }
    }
    let res: any = [];
    for (let i = 0; i < temp.length; i++) {
        res = res.concat(temp[i]);
    }
    return res;
}

export function zeroLine(arr: Array<number>) {
    let wsPointData = [...arr];
    let colArr = [],
        rowArr = [];
    for (let i = 0; i < 32; i++) {
        let coltotal = 0,
            rowtotal = 0;
        for (let j = 0; j < 32; j++) {
            coltotal += wsPointData[j * 32 + i];
            rowtotal += wsPointData[i * 32 + j];
        }
        colArr.push(coltotal);
        rowArr.push(rowtotal);
    }

    for (let i = 1; i < 31; i++) {
        if (rowArr[i + 1] > 100 && rowArr[i] < 40 && rowArr[i - 1] > 100) {
            for (let j = 0; j < 32; j++) {
                wsPointData[i * 32 + j] =
                    (wsPointData[(i - 1) * 32 + j] + wsPointData[(i + 1) * 32 + j]) / 2;
            }
        }
    }

    for (let i = 1; i < 31; i++) {
        if (colArr[i + 1] > 100 && colArr[i] < 40 && colArr[i - 1] > 100) {

            for (let j = 0; j < 32; j++) {
                wsPointData[j * 32 + i] = (wsPointData[(j) * 32 + i - 1] + wsPointData[(j) * 32 + i + 1]) / 2;
            }
        }
    }
    return wsPointData;
}

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



export function gaussBlur_2(scl: any, w: any, h: any, r: any) {
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




export function interpSmall(smallMat: any, width: any, height: any, interp1: any, interp2: any) {
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


export function interpSmall1(smallMat: any, width: any, height: any, interp1: any, interp2: any) {
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
            bigMat[(width * interp1) * i * interp2 + (j * interp1)

                // + (width * interp1) * Math.floor(interp2/2)

                // + Math.floor(interp1/2)
            ] = smallMat[i * width + j] * 10
        }
    }
    // console.log(bigMat.length)
    return bigMat
}