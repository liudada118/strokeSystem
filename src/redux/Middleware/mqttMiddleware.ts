
import mqtt from 'mqtt/dist/mqtt';
import { HOST, PORT } from './constant';
import { createTimer, mqttConnect } from '../mqtt/mqttSlice';
// import { alarmJudge, ALARMTYPE } from './alarmUtil';
import { findAlarmSwitch, findAlarmToCatch, initEquipPc, neatEquips, returnRealAlarm, alarmJudge, ALARMTYPE } from '../equip/equipUtil';
import { voiceArr } from '@/utils/voice';
import { initData } from '../equip/equipSlice';
// import { equip } from '@/pages/home/Home';

// 只在mqtt运行中改变
let riskArr: any = {},

    /***
     * 这些缓存还可能在服务器端做修改   所以在服务器更新的时候需要更新缓存
     * 由于mqtt 执行的message 函数 比setInterval执行的频率要高  不更新很容易覆盖 
     * */
    arr: any = [],
    resData: Array<any> = [],
    equipsPlayArr: Array<any> = []

interface onBed {
    stack: Array<number>,
    state: number
}
const onBedStackPush = ({ stack, state }: onBed) => {
    if (stack.length < 20) {
        stack.push(state)
    } else {
        stack.shift()
        stack.push(state)
    }
}


const MqttMiddleware = (storeApi: any) => (next: any) => (action: any) => {
    const state: any = storeApi.getState()
    const token = state.token.token
    const phone = state.token.phone
    const mqttClient = state.mqtt.client

    next(action)
    if (token && phone && action.type == "equip/fetchEquips/fulfilled") {


        let { equips, switchArr: alarm, realAlarmArr: sosArrOver, riskArr: riskArrs, equipsPlay } = storeApi.getState().equip

        riskArr = JSON.parse(JSON.stringify(riskArrs))
        arr = JSON.parse(JSON.stringify(sosArrOver))
        resData = JSON.parse(JSON.stringify(equips)) //[...equips]
        equipsPlayArr = JSON.parse(JSON.stringify(equipsPlay))


        const newVoiceExample = new voiceArr()

        storeApi.dispatch(initData({
            newVoiceExample: newVoiceExample
        }))
        const options = {
            keepalive: 30,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 5 * 1000,
            rejectUnauthorized: false,
            clientId: phone + new Date().getTime(),

        };

        const client = mqtt.connect(`wss://${HOST}:${PORT}/mqtt`, options);

        window.client = client

        client.on('connect', function () {

            // storeApi.dispatch(mqttConnectionState(client));
            storeApi.dispatch(mqttConnect((client)))
            client.subscribe(`${phone}`);
        });

        client.on('message', ((topic: any, payload: any) => {
            const device = message({ payload, storeApi });
            // console.log(device);
            // console.log('messagemessagemessage')

        }));

        client.on("error", (error: any) => {
            console.log("error");
        });
        client.on("reconnect", () => {
            // console.log("Reconnecting...");
        });
        client.on("offline", (errr: any) => {
            // console.log("Offline");
            // if(Andriod as any) Andriod.reloadwebview()
            console.log('mqttOffline')
            const u = window.navigator.userAgent
            if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
                eval(`Android.reloadWebView();`)
            }
        });
        client.on("close", function () { });
        client.on("disconnect", function (packet: any) { });

        let timer = setInterval(() => {

            resData.forEach((equip, index) => {
                if (equip.onBedStack) {
                    onBedStackPush({ stack: equip.onBedStack, state: equip.onBedState })
                } else {
                    equip.onBedStack = []
                    onBedStackPush({ stack: equip.onBedStack, state: equip.onBedState })
                }
                if (equip.onBedStack.length == 20 && equip.onBedStack.every((a: any) => { return typeof a != 'number' || a == 100 })) {
                    equip.onBed = 100
                }
            })

            const equip = JSON.parse(JSON.stringify(resData))
            const equipPc = initEquipPc(equip)



            // console.log(state)
            let equipDisPlay = JSON.parse(JSON.stringify(equipsPlayArr))

            // if (equipDisPlay.length != resData.length) {
            //     console.log(equipDisPlay , resData)
            for (let i = 0; i < equipDisPlay.length; i++) {
                equipDisPlay[i] = JSON.parse(JSON.stringify(resData.find((equipItem: any) => equipItem.sensorName == equipDisPlay[i].sensorName)))
            }
            // }

            const equipsPlayRes = equipDisPlay
            const equipPcPlayRes = initEquipPc(equipsPlayRes)


            storeApi.dispatch(initData({
                realAlarmArr: JSON.parse(JSON.stringify(arr)),
                riskArr: JSON.parse(JSON.stringify(riskArr)),
                equips: equip,
                equipPc: equipPc,
                equipsPlay: equipsPlayRes,
                equipPcPlay: equipPcPlayRes,
            }))
            newVoiceExample.playVoice()

        }, 2000);

        storeApi.dispatch((createTimer(timer)))



    }

    // 请求成功后将  缓存报警数组  同步
    if (token && phone && action.type == "alarm/delete/fulfilled") {
        const { realAlarmArr } = storeApi.getState().equip
        arr = JSON.parse(JSON.stringify(realAlarmArr))
    }

    // 用户退出时   清空本地缓存
    if (action.type == 'mqtt/mqttLoginout') {
        console.log('out')
        riskArr = {}
        arr = []
        resData = []
        equipsPlayArr = []
    }
}

function message({ payload, storeApi, data }: any) {
    let { equips, switchArr: alarm, realAlarmArr: sosArrOver, riskArr: riskArrs, newVoiceExample, equipsPlay } = storeApi.getState().equip

    if (!Object.keys(riskArr).length) riskArr = JSON.parse(JSON.stringify(riskArrs))
    if (!arr.length) arr = JSON.parse(JSON.stringify(sosArrOver))
    if (!resData.length) resData = JSON.parse(JSON.stringify(equips)) //[...equips]
    equipsPlayArr = JSON.parse(JSON.stringify(equipsPlay))
    const jsonObj = JSON.parse(payload);

    if (jsonObj.type === 'alarm') {
        // let message = [...overMessage]
        if (jsonObj.alarmMsg.includes('offline')) {
            // console.log('offline')
            resData.forEach((item, index) => {
                if (item.sensorName == jsonObj.deviceName) {
                    item.onBedState = 100


                }
            })
            // setEquips(resData)
        }



    } else {

        if (jsonObj.type === 'minute') {
            resData.forEach((item, index) => {
                if (item.sensorName == jsonObj.deviceName) {
                    item.pressureInjury = jsonObj.timer ? jsonObj.timer : 0
                    item.strokeValue = jsonObj.stroke
                }
            })
        } else if (jsonObj.type === 'realtime') {

            // console.log(window.navigator.userAgent)
            // console.log(first)

            resData.forEach((item, index) => {
                if (item.sensorName == jsonObj.deviceName) {
                    let rateValue = 16 - 4 * (Math.random())

                    item.onBed = item.leavebedParam ? jsonObj.realtimeLeaveBedParam < item.leavebedParam ? 0 : jsonObj.realtimeOnbedState > 0 ? jsonObj.realtimeOnbedState : 1 : jsonObj.realtimeOnbedState
                    item.onBedState = jsonObj.realtimeOnbedState
                    item.breath = jsonObj.realtimeBreathRate
                    item.heartRate = jsonObj.heartRateRandom
                    item.sos = jsonObj.realtimeSosState
                    // console.log(jsonObj, 'jsonObj.......')
                    // item.nurse = jsonObj.realtimeOnbedState
                    if (item.sensorName == 'KgvDXUvdEs9M9AEQDcVc' || item.sensorName == 'iJ3X0JSttyoiRPafpIka') {

                        //   rate: (16 - 4 * (Math.random())).toFixed(0),
                        // heart: (rateValue + 45 + 4 * (Math.random())).toFixed(0),
                        item.breath = (16 - 4 * (Math.random())).toFixed(0)
                        item.heartRate = (rateValue * 5 + 4 * (Math.random())).toFixed(0)
                        item.pressureInjury = 33
                        if (item.sensorName == 'iJ3X0JSttyoiRPafpIka') {
                            item.heartRate = null
                        }
                        // item.onBed = 3
                    }

                    if (item.type != 'large') {
                        item.pressureInjury = 'unknow'
                    }


                    if (item.onBed == 0) {
                        item.outbedTime = (new Date().getTime() - jsonObj.onOutOffBedTimeMillis) / 1000

                    } else {
                        item.onbedTime = (new Date().getTime() - jsonObj.onOutOffBedTimeMillis) / 1000
                    }

                    // 护理弹框规则

                    const onbed = alarmJudge.onBedJudge({ item, getFlag: true, alarm })
                    const dropbed = alarmJudge.dropBedJudge({ item, getFlag: true, alarm })
                    const sitBed = alarmJudge.situpJudge({ item, getFlag: true, alarm })
                    const sos = alarmJudge.sosJudge({ item, getFlag: true, alarm })
                    const nurse = alarmJudge.nurseJudge({ item, getFlag: true, alarm })


                    const alarmRules = [
                        // {
                        //   flag: sos,
                        //   type: ALARMTYPE.sos.type, //'sos',
                        //   voiceText: ALARMTYPE.sos.text,//'求救'
                        // },
                        // {
                        //   flag: injury,
                        //   type: 'injury',
                        //   voiceText: '护理超时'
                        // },
                        {
                            flag: sos,
                            type: ALARMTYPE.sos.type,// 'sos',
                            voiceText: ALARMTYPE.sos.text,// '坐起提醒'
                        },
                        {
                            flag: onbed,
                            type: ALARMTYPE.onBed.type,// 'onbed',
                            voiceText: ALARMTYPE.onBed.text,// '离床提醒'
                        },
                        {
                            flag: dropbed,
                            type: ALARMTYPE.dropBed.type,// 'dropbed',
                            voiceText: ALARMTYPE.dropBed.text,// '坠床风险'
                        },
                        {
                            flag: sitBed,
                            type: ALARMTYPE.sitBed.type,// 'sitBed',
                            voiceText: ALARMTYPE.sitBed.text,// '坐起提醒'
                        },
                        
                        {
                            flag: nurse,
                            type: ALARMTYPE.nurse.type,// 'sitBed',
                            voiceText: ALARMTYPE.nurse.text,// '坐起提醒'
                        }
                    ]




                    alarmRules.forEach((alarmRule: any) => {
                        /***
                         * 如果满足规则  并且这个专属的风险sensorname缓存数组里面没有这个风险报警  
                         * 如果显示风险数组里面没有这个设备这个类型的报警  
                         * 那么显示数组添加这个设备和这个报警的类型、声音队列保存这个播放语音、这个专属的风险sensorname缓存数组添加这个设备
                         * 
                         * */

                        // let arr = [...sosArrOver]
                        if (alarmRule.type == 'sos') {
                            if (alarmRule.flag) {
                                arr = arr.filter((a: any) => {
                                    return a.sensorName != item.sensorName
                                })

                                arr.push({
                                    sensorName: item.sensorName,
                                    name: item.patientName,
                                    roomNum: item.roomNum,
                                    type: alarmRule.type,
                                    time: new Date().getTime()
                                })

                                // console.log(first)

                                newVoiceExample.voicePush(`${item.roomNum}号床${alarmRule.voiceText}`, `${item.roomNum}号床${alarmRule.voiceText}`)
                            }
                        }

                        else {


                            if (alarmRule.flag && !riskArr[alarmRule.type].includes(item.sensorName)) {
                                // 如果显示风险数组里面没有这个设备这个类型的报警,那么将之前这个设备的所有报警都删除，添加这个报警
                                if (!arr.length || (arr.length && !arr.filter((alarmRule: any, index: any) => {
                                    return alarmRule.sensorName == item.sensorName && alarmRule.type == item.type
                                }).length)) {
                                    // 如果这个设备有新的报警，那么把除了这个报警之前的所有报警删除
                                    alarmRules.forEach(a => {
                                        if (a.type != item.type) {
                                            if (riskArr[a.type as string].includes(item.sensorName)) {
                                                riskArr[a.type].splice(riskArr[a.type].indexOf(item.sensorName), 1)
                                            }
                                        }
                                    })

                                    arr = arr.filter((a: any) => {
                                        return a.sensorName != item.sensorName
                                    })

                                    arr.push({
                                        sensorName: item.sensorName,
                                        name: item.patientName,
                                        roomNum: item.roomNum,
                                        type: alarmRule.type,
                                        time: new Date().getTime()
                                    })

                                    // console.log(first)

                                    newVoiceExample.voicePush(`${item.roomNum}号床${alarmRule.voiceText}`, `${item.roomNum}号床${alarmRule.voiceText}`)
                                    // sosArrOver = arr
                                    // setSosArr(arr)
                                    riskArr[alarmRule.type].push(item.sensorName)
                                }
                            }

                            /**
                             * 如果报警条件不满足了，那么在风险数组里面删除这个报警
                             */
                            // console.log(alarmRule.type , riskArr[alarmRule.type] ,item.sensorName)
                            if (!alarmRule.flag && riskArr[alarmRule.type] && riskArr[alarmRule.type].length && riskArr[alarmRule.type].includes(item.sensorName)) {
                                riskArr[alarmRule.type].splice(riskArr[alarmRule.type].indexOf(item.sensorName), 1)
                            }
                        }

                        // console.log(arr)
                        /**
                        * 如果报警条件不满足了，那么在点击数组里面删除这个报警
                        */
                        // if (!alarmRule.flag && clickArr[alarmRule.type] && clickArr[alarmRule.type].includes(item.sensorName)) {
                        //     clickArr[alarmRule.type].splice(clickArr[alarmRule.type].indexOf(item.sensorName), 1)
                        // }
                    })

                }

            })

        }


    }
}

export default MqttMiddleware;