import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  open: false,
  dataList: [],
  nurseOpen: false,
  sensorName: "",
  nurseListData: [],
  isGotoNursePage: 0,
  isRestNuserpage: 0,
  showTabs: true, 
  isDataList:true
};

const mqttSlice = createSlice({
  name: "nurse",
  initialState,
  reducers: {
    nurseOpen(state, action) {
      state.open = action.payload;
    },
    nurseDataList(state, action) {
      state.dataList = action.payload;
    },
    nurseIsOpenAdd(state, action) {
      state.nurseOpen = action.payload;
    },
    nurseSensorName(state, action) {
      state.sensorName = action.payload;
    },
    setNurseListData(state, action) {
      state.nurseListData = action.payload;
    },
    setIsGotoNursePage(state) {
        console.log('cccccccccccccactiveKey..111111.....')
      state.isGotoNursePage+=1;
    },
    resetNuserpage(state) {
      state.isRestNuserpage = new Date().getTime();
    },
    showTabsTabs(state, action) {
      state.showTabs = action.payload
  },
  showDataLIst(state, action) {
    console.log(state.isDataList, action.payload,'........3333............isDataList');
    
    state.isDataList = action.payload
},
  },
});
export const { nurseOpen, nurseDataList, nurseIsOpenAdd, resetNuserpage, nurseSensorName, setNurseListData,setIsGotoNursePage,showTabsTabs,showDataLIst } =
  mqttSlice.actions;
export const mqttSelect = (state: any) => state.mqtt.client;

export default mqttSlice.reducer;
