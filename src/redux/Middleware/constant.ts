import { message } from "antd";

// export const HOST = 'sensor.bodyta.com'
// export const HOST = 'juqiao.bodyta.com'
export const PORT = 443

const textMap: { [key: string]: string } = {
    '0': '零',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '七',
    '8': '八',
    '9': '九',
    '-': '杠',
    '_': '杠'
};

export function exChangeText(str: string) {

    let strArr = str.split('').map((a: string) => {
        if (Object.keys(textMap).includes(a)) {
            return textMap[a]
        } else {
            return a
        }
    })

    return strArr.join('')
}

export function reloadWebview() {
    try {
        const u = window.navigator.userAgent
        if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
            eval(`Android.reloadWebView();`)
        }
    } catch (err) {
        console.log(err)
    }
}

export function audioPlay() {
    // message.info('audioPlay')
    try {
        const u = window.navigator.userAgent
        if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
            eval(`Android.audioPlay();`)
        }
    } catch (err) {
        console.log(err)
    }
}

export function audioPause(){
    // message.info('audioPause')
    try {
        const u = window.navigator.userAgent
        if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
            eval(`Android.audioPause();`)
        }
    } catch (err) {
        console.log(err)
    }
}