import { fetchDatarcv } from "@/api/api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface premissionState {
    roleId: string
    headImg: string
    status: string
    error: any
}

const initialState: premissionState = {
    roleId: '',
    headImg: '',
    status: 'idle',
    error: null,
}

const roleIdToPermission:any = {
    1: 'superManage',
    2: 'manage',
    3: 'careMan',
    4: 'familyMan'
}



export function isManage(str : string){
    const manageArr = ['superManage' , 'manage']
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
            state.status = 'idle'
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
            if(res.code == 500){
                
            }else{
                const image = res.commonConfig.image
                const roleId = res.data.roleId
                state.headImg = image
                state.roleId = roleIdToPermission[roleId]
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

export default premissionSlice.reducer

export const { loginOut } = premissionSlice.actions

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