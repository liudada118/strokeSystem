import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
        open: false,
        dataList:[],
        nurseOpen: false,
        sensorName:''
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
     },
     nurseIsOpenAdd(state,action){
        console.log(action.payload, '..openNurse1111111....')
      state.nurseOpen = action.payload
   },
   nurseSensorName(state,action){
      state.sensorName = action.payload
   }
    }
})
export const {nurseOpen ,nurseDataList,nurseIsOpenAdd,nurseSensorName} = mqttSlice.actions
export const mqttSelect = (state: any) => state.mqtt.client

export default mqttSlice.reducer