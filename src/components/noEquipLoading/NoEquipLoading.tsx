import { statusSelect } from "@/redux/equip/equipSlice"
// import { Loading } from "antd-mobile"
import { useSelector } from "react-redux"
import { Loading } from "../pageLoading"
import { phoneSelect, tokenSelect } from "@/redux/token/tokenSlice"

export const NoEquipLoading = (props:any) => {
    const status = useSelector(statusSelect)
    const phone = useSelector(phoneSelect)
    const token = useSelector(tokenSelect)


    console.log(status)
    if(status != 'succeeded' || !phone || !token){
        return <Loading />
    }

    return props.children

}