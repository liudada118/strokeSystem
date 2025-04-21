import { applyMiddleware, combineReducers, configureStore, createStore } from "@reduxjs/toolkit";
import tokenSlice from "./token/tokenSlice";
import equipSlice from "./equip/equipSlice";
import MqttMiddleware from "./Middleware/mqttMiddleware";
import mqttSlice from "./mqtt/mqttSlice";
import premissionSlice from './premission/premission'
import nurseSlice from './Nurse/Nurse'

const store = configureStore({
    reducer: {
        token: tokenSlice,
        equip: equipSlice,
        mqtt: mqttSlice,
        premission: premissionSlice,
        nurse:nurseSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(MqttMiddleware)
});
// const reducer =  combineReducers({
//     token : tokenSlice,
//     equip : equipSlice,
//     mqtt : mqttSlice
// })




// const store = createStore(reducer , applyMiddleware(MqttMiddleware))


export default store;
