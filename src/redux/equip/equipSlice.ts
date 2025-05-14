import { fetchData, fetchDatarcv, netUrl } from '../../api/api'
import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
// import { equip } from '@/pages/home/Home'
import { voiceArr } from '@/utils/voice'
import { equip } from '@/pages/home'
import { changeOnerEquipInfo, findAlarmSwitch, findAlarmToCatch, neatEquips, returnRealAlarm } from './equipUtil'
interface equipState {
    equips: Array<any>
    equipPc: Array<Array<equip>>,
    equipsPlay: Array<any>,
    equipPcPlay: Array<Array<equip>>,
    status: any
    error: any
    alarmArr: any
    riskArr: any
    switchArr: any
    realAlarmArr: any
    newVoiceExample: any
    equipConstant: any

}

const initialState: equipState = {
    equips: [],
    equipPc: [],
    equipsPlay: [],
    equipPcPlay: [],
    alarmArr: [],
    riskArr: [],
    switchArr: [],
    realAlarmArr: [],
    newVoiceExample: null,
    status: 'idle',
    error: null,
    equipConstant: [],
   
}

const equipSlice = createSlice({
    name: 'equip',
    initialState,
    reducers: {
        alarmConfirm(state, action) {
            const alarmArr = [...state.alarmArr]
            state.alarmArr = alarmArr.filter((a) => a.sensorName != action.payload)
        },
      
        initData(state, action) {
            // console.log(action.payload)
            const { equips, equipPc, riskArr, switchArr, realAlarmArr, newVoiceExample, equipConstant, equipsPlay, equipPcPlay } = action.payload

            if (equips) state.equips = equips
            if (equipPc) state.equipPc = equipPc
            if (riskArr) state.riskArr = riskArr
            if (switchArr) state.switchArr = switchArr
            if (realAlarmArr) state.realAlarmArr = realAlarmArr
            if (newVoiceExample) state.newVoiceExample = newVoiceExample
            if (equipConstant) state.equipConstant = equipConstant
            if (equipsPlay) state.equipsPlay = equipsPlay
            if (equipPcPlay) state.equipPcPlay = equipPcPlay
            // console.log(action.payload)
            // console.log({...state , ...action.payload})
            // state = {...state , ...action.payload}

        },
        changeEquip(state, action) {
            const { equips, equipPc } = action.payload
            if (equips) state.equips = equips
            if (equipPc) state.equipPc = equipPc
        },
        changeDisplayEquip(state, action) {
            const { equips, equipPc } = action.payload
            if (equips) {
                state.equipsPlay = equips
            }
            if (equipPc) {
                state.equipPcPlay = equipPc
            }
        },
        equipLoginOut(state, action) {
            state.equips = []
            state.equipPc = []
            state.equipsPlay = []
            state.equipPcPlay = []
            state.alarmArr = []
            state.riskArr = []
            state.switchArr = []
            state.realAlarmArr = []
            state.newVoiceExample = null
            state.status = 'idle'
            state.error = null
            state.equipConstant = []
        },
        changeEquipInfo(state, action){
            try {
                const equip = JSON.parse(JSON.stringify(state.equips))
                const { res, equipPc } = changeOnerEquipInfo({ equips: equip, changeInfo: action.payload })
    
                state.equips = res
                state.equipPc = equipPc
                state.equipConstant = res
            } catch (error) {
                console.log(error, '2131212124121...................44444444...............yyyyds')
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchEquips.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchEquips.fulfilled, (state, action) => {
            state.status = 'succeeded'
            


            const equipArr = action.payload.data.records
            const cloudAlarmArr = action.payload.allAlarm

            const { equip, newEquip, riskArr: riskObj, alarmSwitchTypeObj, cloudCatchAlarmArr } = neatEquips({ equipArr: equipArr })
            const alarmConformTimeArr = findAlarmToCatch({ equips: equip, cloudAlarmArr: cloudAlarmArr })
            const switchArr = findAlarmSwitch({ equip: equip, cloudCatchAlarmArr })
            const realAlarmArr = returnRealAlarm({ cache: alarmConformTimeArr, switchArr: switchArr, alarmSwitchTypeObj, riskArr: riskObj })
            // const newVoiceExample = new voiceArr()

            const equipConstant = JSON.parse(JSON.stringify(equip))

            // storeApi.dispatch(initData({
            //     equips: equip,
            //     equipPc: newEquip,
            //     equipsPlay: equip,
            //     equipPcPlay: newEquip,
            //     equipConstant: equipConstant,
            //     riskArr: riskObj,
            //     switchArr: switchArr,
            //     realAlarmArr: realAlarmArr,
            //     newVoiceExample: newVoiceExample
            // }))


            // const equipArr = action.payload.data.records
            // const cloudAlarmArr = action.payload.allAlarm
            // const { equip, newEquip, riskArr, alarmSwitchTypeObj } = neatEquips({ equipArr: equipArr })
            // const alarmConformTimeArr = findAlarmToCatch({ equips: equip, cloudAlarmArr: cloudAlarmArr })
            // const switchArr = findAlarmSwitch({ equip: equip })
            // const realAlarmArr = returnRealAlarm({ cache: alarmConformTimeArr, switchArr: switchArr, alarmSwitchTypeObj, riskArr })

            state.equips = equip
            state.equipPc = newEquip
            state.equipsPlay = equip
            state.equipPcPlay = newEquip
            state.equipConstant = equipConstant
            state.riskArr = riskObj
            state.switchArr = switchArr
            state.realAlarmArr = realAlarmArr
            // state.newVoiceExample = new voiceArr()




        })

        builder.addCase(fetchEquips.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })

        builder.addCase(deleteAlarm.fulfilled, (state, action) => {
            const realAlarmArr = [...state.realAlarmArr]
            console.log(action.payload[0])
            state.realAlarmArr = realAlarmArr.filter((a) => a.sensorName != action.payload[0])
        })

        builder.addCase(changePersonalEquipUserInfo.fulfilled, (state, action) => {
            const equip = JSON.parse(JSON.stringify(state.equips))
            const { res, equipPc } = changeOnerEquipInfo({ equips: equip, changeInfo: action.payload[1] })

            // 实时的数据  跟  静态服务器数据都得更新
            state.equips = res
            state.equipPc = equipPc
            state.equipConstant = res
        })

        builder.addCase(changeEquipAllInfo.fulfilled, (state, action) => {
            console.log(state, state.equips, action.payload)
            const equip = JSON.parse(JSON.stringify(state.equips))
            console.log(equip)
            const { res, equipPc } = changeOnerEquipInfo({ equips: equip, changeInfo: action.payload[0] })

            state.equips = res
            state.equipPc = equipPc
            state.equipConstant = res
        })

        builder.addCase(addEquip.fulfilled , (state, action) => {

        })

    }
})

export const equipSelect = (state: any) => state.equip.equips
export const equipConstantSelect = (state: any) => state.equip.equipConstant
export const alarmSelect = (state: any) => state.equip.realAlarmArr
export const equipPcSelect = (state: any) => state.equip.equipPc
export const statusSelect = (state: any) => state.equip.status
export const selectEquipBySensorname = (state: any, sensorname: any) =>  state.equip.equipConstant.find((equip: any) => equip.sensorName == sensorname)
export const selectRealEquipBySensorname = (state: any, sensorname: any) =>  state.equip.equips.find((equip: any) => equip.sensorName == sensorname)

export const newVoiceExampleSelect = (state: any) => state.equip.newVoiceExample

export const equipPlaySelect = (state: any) => state.equip.equipsPlay
export const equipPcPlaySelect = (state: any) => state.equip.equipPcPlay


export default equipSlice.reducer


/**
 * 请求设备列表
 */
export const fetchEquips = createAsyncThunk('equip/fetchEquips', async (_, { getState }) => {
    const state: any = getState()
    const phone = state.token.phone
    const token = state.token.token
    const realOption = {
        method: 'get',
        url: "/device/selectDeviceWithPatient",
        params: {
            phoneNum: phone,
            pageSize: 999,
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
    }
    const response = await fetchDatarcv(realOption)
   
    
    return response.data
})

export const { initData, changeDisplayEquip, equipLoginOut,changeEquipInfo } = equipSlice.actions


/**
 * 确认告警
 */
export const deleteAlarm = createAsyncThunk('alarm/delete', async (options: any, { getState }) => {
    // const response = await client.post('/fakeApi/posts', initialPost)
    const state: any = getState()
    const token = state.token.token
    const realOption = {
        method: 'post',
        url: `/sleep/log/clearAlarmLogCache`,
        params: {
            deviceName: `${options.sensorName}`,
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
    }



    const response = await fetchData(realOption)
    return Promise.all([options.sensorName, fetchData(realOption)])
})

/**
 * 修改设备使用者信息
 */
type bedType = 'large' | 'small'
interface userParam {
    deviceId: string
    phone: string
    age: number
    chargeMan: number
    roomNum: number
    patientName: number
    type: bedType
}
export const changePersonalEquipUserInfo = createAsyncThunk('equip/changeUserInfo', async (options: userParam, { getState }) => {
    const state: any = getState()
    const token = state.token.token
    const realOption = {
        method: 'post',
        url: `/device/update`,
        params: {
            ...options
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
    }
    // const response = await fetchDatarcv(realOption)
    return await Promise.all([fetchDatarcv(realOption), options])
    // return response.data
})

/**
 * 修改设备告警信息
 */
interface alarmParam {
    deviceName: string
   
    strokeAlarm?: number
    sosAlarm?: number
    injuryAlarm?: number
    breathAlarm?: number


    fallbedAlarm?: number
    fallbedStart?: number
    fallbedEnd?: number

    leaveBedAlarm?: number
    leaveBedStart?: number
    leaveBedEnd?: number
    leaveBedPeriod?: number

    situpStart?: number
    situpEnd?: number
    situpAlarm?: number
}
export const changePersonalEquipAlarmInfo = createAsyncThunk('equip/changeAlarmInfo', async (options: alarmParam, { getState }) => {
    try {

        const state: any = getState()
        const token = state.token.token
        const phone = state.token.phone
        const realOption = {
            method: 'post',
            url: `/device/updateAlarmConfig`,
            params: {
                ...options,
                userName: phone
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
        }
        const response = await fetchDatarcv(realOption)
        return response.data
    } catch (error) {
        console.log(error, '000000.................44444444...............yyyyds....yyyyds')
    }
})

/**
 * 修改设备护理信息
 */
interface NurseParam {
    deviceId: string
    nursePeriod: number
    nurseStart: number
    nurseEnd: number
}
export const changePersonalEquipNurseInfo = createAsyncThunk('equip/changeNurseInfo', async (options: NurseParam, { getState }) => {
    const state: any = getState()
    const token = state.token.token
    const realOption = {
        method: 'post',
        url: `/device/updateNursingScheduleConfig`,
        params: {
            ...options
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
    }
    const response = await fetchDatarcv(realOption)
    return response.data
})

/**
 * 修改设备离床参数
 */

interface leaveParam {
    deviceId: string
    leaveBedParam: number
}

export const changePersonalEquipLeaveBedInfo = createAsyncThunk('equip/changeLeaveBedInfo', async (options: leaveParam, { getState }) => {
    const state: any = getState()
    const token = state.token.token
    
    const realOption = {
        method: 'post',
        url: `/device/updateLeaveBedParam`,
        params: {
            ...options
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
    }
    const response = await fetchDatarcv(realOption)
    return response.data
})

interface equipAllInfo {
    nurseParam?: NurseParam
    leaveParam?: leaveParam
    alarmParam?: alarmParam
    userParam?: userParam
}

interface objToOptionParam {
    obj: any
    url: string
    token: string
    phone?: string
}

const objToOption = ({ obj, url, token, phone }: objToOptionParam) => {
    // if (isRcv) {
    const realOption = {
        method: 'post',
        url: url,
        params: { ...obj },
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
    }

    return realOption
}

interface fetchObjsParams {
    options: equipAllInfo
    token: string
    phone: string
    equipRealOption: any
}

const fetchObjs = ({ options, token, phone, equipRealOption }: fetchObjsParams) => {
    const fetchTypeToOption: any = {
        nurseParam: {
            url: '/device/updateNursingScheduleConfig',
        },
        leaveParam: {
            url: `/device/updateLeaveBedParam`,
        },
        alarmParam: {
            url: `/device/updateAlarmConfig`,
        },
        userParam: {
            url: `/device/update`
        }
    }

    const keyArr = Object.keys(options)
    const valueArr = Object.values(options)
    const asyncArr = [equipRealOption]
    for (let i = 0; i < keyArr.length; i++) {
        const option = objToOption({ obj: valueArr[i], token, url: fetchTypeToOption[keyArr[i]].url })
        console.log(option)
        asyncArr.push(fetchDatarcv(option))
    }
    return Promise.all(asyncArr)
}
export const changeEquipAllInfo = createAsyncThunk('equip/changeAllinfo', async (options: equipAllInfo, { getState }) => {
    const state: any = getState()
    const token = state.token.token
    const phone = state.token.phone
    console.log(options, 'options')
    const valueArr = Object.values(options)
    const equipRealOption = valueArr.reduce((pre, cur) => Object.assign(pre, cur), {})
    return fetchObjs({ options: options, token, phone, equipRealOption })
    // Promise.all([])
    // // if(Object.keys(options)){
    // const arr = Object.values(options)
    // const asyncArr = []
    // // const 
    // for (let i = 0; i < arr.length; i++) {
    //     asyncArr.push(fetchDatarcv(arr[i]))
    // }
    // return await Promise.all(asyncArr)
    // }
})
/**
 * 添加设备
 */
export const addEquip = createAsyncThunk('equip/add', async (options: equipAllInfo, { getState }) => {
    const state: any = getState()
    const token = state.token.token
    const phone = state.token.phone

    const realOption = {
        method: "post",
        url: "/device/addBindManual",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
        params: {
            phone: phone,
            deviceId: options,
        },
    }

    const response = await fetchDatarcv(realOption)
    
    // if()
    return response.data
})