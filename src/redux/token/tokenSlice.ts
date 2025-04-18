import { createSlice } from "@reduxjs/toolkit";
import { clearPhone, clearToken, PHONEKEY, setPhone, setToken, TOKENKEY } from "./userInfoUtil";

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: localStorage.getItem(TOKENKEY) || '',
        phone: localStorage.getItem(PHONEKEY) || '',
    },
    reducers: {
        reduxSetToken(state, action) {
            state.token = action.payload
            setToken(action.payload)
        },
        reduxCleanToken(state, action) {
            state.token = ''
            clearToken()
        },
        reduxSetPhone(state, action) {
            state.phone = action.payload
            setPhone(action.payload)
        },
        reduxCleanPhone(state, action) {
            state.phone = ''
            clearPhone()
        },
        tokenLoginout(state, action) {
            state.token = ''
            state.phone = ''
        }
    }
})

export const { reduxSetToken, reduxCleanToken, reduxSetPhone, reduxCleanPhone, tokenLoginout } = tokenSlice.actions

export const tokenSelect = (state: any) => state.token.token
export const phoneSelect = (state: any) => state.token.phone

export default tokenSlice.reducer
