import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
        open: false,
        dataList:[]
}

const mqttSlice = createSlice({
    name: 'nurse',
    initialState,
    reducers: {
     nurseOpen(state,action){
        state.open = action.payload
     },
     nurseDataList(state,action){
        state.dataList = action.payload
     }
    }
})
export const {nurseOpen ,nurseDataList} = mqttSlice.actions
export const mqttSelect = (state: any) => state.mqtt.client

export default mqttSlice.reducer