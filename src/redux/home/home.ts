import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  homeSelectValue: '',
  homeSelectType: 'patientName',
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeSelectValue(state, action) {
      // const { value, type } = action.payload
      state.homeSelectValue = action.payload;
      // state.homeSelectType = type;
    },
    setHomeSelectType(state, action) {
      state.homeSelectType = action.payload;
    },
  },
});
export const { setHomeSelectValue, setHomeSelectType } =
  homeSlice.actions;
export const mqttSelect = (state: any) => state.mqtt.client;

export default homeSlice.reducer;
