import { voiceUrl } from "@/api/api"
import axios from "axios"

export class voiceArr {
    voiceQueue: any
    voicePush: Function
    playVoice: Function
    tts: Function
    audio: any
    playFlag: boolean
    constructor() {
        this.voiceQueue = []
        this.playFlag = true
        this.voicePush = function (...value: any) {
            this.voiceQueue.push(...value)
            // alert(JSON.stringify(this.voiceQueue))
            // messageAntd.success(JSON.stringify(this.voiceQueue))
        }
        // getAccessToken()
        this.playVoice = async function () {
            // messageAntd.error(`${this.voiceQueue.length} , ${this.playFlag}`)
            if (this.voiceQueue.length && this.playFlag) {
                const text = this.voiceQueue[0]
                // console.log(this.voiceQueue)
                // messageAntd.error('请求语音')
                await this.tts(text)
                this.playFlag = false;
            }
        }
        // this.audio = document.createElement('audio')
        this.audio = document.getElementById('audio')
        // this.audio.style.visibility = 'hidden'
        // this.audio.className = 'audio'
        this.tts = async (text: any) => {
            const that = this
            // console.log(text)
            // 调用语音合成接口
            // 参数含义请参考 https://ai.baidu.com/docs#/TTS-API/41ac79a6
            // alert(JSON.stringify(this.voiceQueue))
            // messageAntd.success('发起请求')
            newBtts({
                tex: text,
                tok: localStorage.getItem('access_token') || await getAccessToken(),//'',// await getAccessToken(),
                spd: 5,
                pit: 5,
                vol: 15,
                per: 5
            }, {
                volume: 0.3,
                autoDestory: true,
                timeout: 10000,
                hidden: false,
                onInit: function (htmlAudioElement: any) {

                },
                onSuccess: function (htmlAudioElement: any) {
                    // messageAntd.error('播放语音')
                    that.audio.play();

                },
                onError: function (text: any) {
                    // alert(text)
                    console.log(text)
                    getAccessToken()
                },
                onTimeout: function () {
                    alert('timeout')
                }
            }, this.audio, that);
        }
    }
}

const AK = 'nS2bB52F6AsadNQYiOpENhXk'
const SK = 'MCVBLg09ddPVFgkxTk35ENhTz2OX6yXG'

function getAccessToken() {
    let options = {
        'method': 'POST',
        'url': voiceUrl + '/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
      axios(options)
          .then(res => {
              resolve(res.data.access_token)
              localStorage.setItem("access_token", res.data.access_token);
          })
          .catch(error => {
              reject(error)
          })
    })

}


function newBtts(param: any, options: any, audio: any, that: any) {
    // var audio = document.createElement('audio');
    // audio.className = 'audio'
    // audio.style.visibility = 'hidden'
    var url = 'https://tsn.baidu.com/text2audio';
    var opt = options || {};
    var p = param || {};

    // 如果浏览器支持，可以设置autoplay，但是不能兼容所有浏览器

    if (opt.autoplay) {
        audio.setAttribute('autoplay', 'autoplay');
    }


    if (!opt.hidden) {
        audio.setAttribute('controls', 'controls');
    } else {
        audio.style.display = 'none';
    }

    // 隐藏控制栏


    // 设置音量
    if (typeof opt.volume !== 'undefined') {
        audio.volume = opt.volume;
    }

    // 调用onInit回调
    isFunction(opt.onInit) && opt.onInit(audio);

    // 默认超时时间60秒
    var DEFAULT_TIMEOUT = 60000;
    var timeout = opt.timeout || DEFAULT_TIMEOUT;

    // 创建XMLHttpRequest对象
    // messageAntd.error('出发请求')
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    // 创建form参数
    var data: any = {};
    for (var a in param) {
        data[a] = param[a]
    }

    // 赋值预定义参数
    data.cuid = data.cuid || data.tok;
    data.ctp = 1;
    data.lan = data.lan || 'zh';
    data.aue = data.aue || 3;

    // 序列化参数列表
    var fd = [];
    for (var k in data) {
        fd.push(k + '=' + encodeURIComponent(data[k]));
    }

    // 用来处理blob数据
    var frd = new FileReader();
    xhr.responseType = 'blob';
    xhr.send(fd.join('&'));

    // 用timeout可以更兼容的处理兼容超时
    var timer = setTimeout(function () {
        xhr.abort();
        isFunction(opt.onTimeout) && opt.onTimeout();
    }, timeout);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            clearTimeout(timer);
            if (xhr.status == 200) {
                if (xhr.response.type === 'audio/mp3') {

                    // 在body元素下apppend音频控件
                    // document.body.appendChild(audio);
                    // messageAntd.error('请求成功')
                    audio.setAttribute('src', URL.createObjectURL(xhr.response));

                    // autoDestory设置则播放完后移除audio的dom对象
                    if (opt.autoDestory) {
                        audio.onended = function () {
                            // 

                            that.playFlag = true
                            that.voiceQueue.splice(0, 1)
                            // document.body.removeChild(b[0]);
                            // console.log(document.querySelectorAll('.audio').length)
                        }
                    }

                    isFunction(opt.onSuccess) && opt.onSuccess(audio);
                }

                // 用来处理错误
                if (xhr.response.type === 'application/json') {
                    getAccessToken()
                    that.playFlag = true
                    frd.onload = function () {
                        var text = frd.result;
                        isFunction(opt.onError) && opt.onError(text);
                    };
                    frd.readAsText(xhr.response);
                }
            } else {
                getAccessToken()
                that.playFlag = true
            }
        }
    }

    // 判断是否是函数
    function isFunction(obj: any) {
        if (Object.prototype.toString.call(obj) === '[object Function]') {
            return true;
        }
        return false;
    }
}