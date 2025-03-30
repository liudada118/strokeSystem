import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
        open: false,
        dataList:[],
        nurseOpen: false,
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
   }
    }
})
export const {nurseOpen ,nurseDataList,nurseIsOpenAdd} = mqttSlice.actions
export const mqttSelect = (state: any) => state.mqtt.client

export default mqttSlice.reducer