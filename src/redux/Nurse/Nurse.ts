import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  open: false,
  dataList: [],
  nurseOpen: false,
  sensorName: "",
  nurseListData: [],
  isGotoNursePage: new Date().getTime(),
  isRestNuserpage: new Date().getTime(),
  showTabs: true, 
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
      state.isGotoNursePage = new Date().getTime();
    },
    resetNuserpage(state) {
      state.isRestNuserpage = new Date().getTime();
    },
    showTabsTabs(state, action) {
      state.showTabs = action.payload
  },
  },
});
export const { nurseOpen, nurseDataList, nurseIsOpenAdd, resetNuserpage, nurseSensorName, setNurseListData,setIsGotoNursePage,showTabsTabs } =
  mqttSlice.actions;
export const mqttSelect = (state: any) => state.mqtt.client;

export default mqttSlice.reducer;
