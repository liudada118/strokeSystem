import { fetchDatarcv } from "@/api/api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface premissionState {
    roleId: string
    headImg: string
    organizeId: string
    turnbodyFlag: number
    status: string
    error: any
}

const initialState: premissionState = {
    roleId: '',
    headImg: '',
    organizeId: '',
    turnbodyFlag: 1,
    status: 'idle',
    error: null,
}

const roleIdToPermission: any = {
    1: 'superManage',
    2: 'manage',
    3: 'careMan',
    4: 'familyMan'
}



export function isManage(str: string) {
    const manageArr = ['superManage', 'manage']
    return manageArr.includes(str)
}

const premissionSlice = createSlice({
    name: 'premission',
    initialState,
    reducers: {
        loginOut(state, action) {
            state.error = null
            state.headImg = ''
            state.roleId = ''
            state.organizeId = ''
            state.turnbodyFlag = 0
            state.status = 'idle'
        },
        changeTurnFlag(state , action){
            state.turnbodyFlag = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchPermission.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchPermission.fulfilled, (state, action) => {
            state.status = 'succeeded'
            console.log(action.payload, 'succeeded')
            const res = action.payload
            if (res.code == 500) {

            } else {
                const image = res.commonConfig.image
                const turnbodyFlag = res.commonConfig.turnbodyFlag
                const roleId = res.data.roleId
                const organizeId = res.data.organizeId
                state.headImg = image
                state.roleId = roleIdToPermission[roleId]
                state.organizeId = organizeId
                state.turnbodyFlag = turnbodyFlag
            }

        })

        builder.addCase(fetchPermission.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
    }
})

export const roleIdSelect = (state: any) => state.premission.roleId
export const headImgSelect = (state: any) => state.premission.headImg
export const organizeIdSelect = (state: any) => state.premission.organizeId
export const turnbodyFlagSelect = (state: any) => state.premission.turnbodyFlag

export default premissionSlice.reducer

export const { loginOut,changeTurnFlag } = premissionSlice.actions

export const fetchPermission = createAsyncThunk('premission/fetch', async (_, { getState }) => {
    const state: any = getState()
    const phone = state.token.phone
    const token = state.token.token
    const realOption = {
        method: "get",
        url: "/organize/getUserAuthority",
        headers: {
            "content-type": "multipart/form-data",
            "token": token
        },
        params: {
            username: phone,
        }
    }
    const response = await fetchDatarcv(realOption)
    return response.data
})