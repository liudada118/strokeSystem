import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    client: null,
    timer: null,
    radioChecked:'0',
    
}

const mqttSlice = createSlice({
    name: 'mqtt',
    initialState,
    reducers: {
        mqttConnect(state, action) {
            state.client = action.payload
        },
        createTimer(state, action) {
            state.timer = action.payload
        },
        mqttLoginout(state, action) {
            state?.client?.end()
            clearInterval(state.timer)
            
            state.client = null
            state.timer = null
        },
      
    }
})
export const { mqttConnect, createTimer ,mqttLoginout} = mqttSlice.actions
export const mqttSelect = (state: any) => state.mqtt.client

export default mqttSlice.reducer