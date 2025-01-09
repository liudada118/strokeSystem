import { List, Picker } from "antd-mobile"
import { useState } from "react"
import { RenderListItem } from "../EditingUser"
import { FormType } from "@/components/CommonFormModal"
import { useSelector } from "react-redux"
import { selectEquipBySensorname } from "@/redux/equip/equipSlice"
import { useLocation, useParams } from "react-router-dom"
import { Instancercv, netUrl } from "@/api/api"
import { tokenSelect } from "@/redux/token/tokenSlice"
import { message } from "antd"
import axios from "axios"

/**
 * 
 * @returns 翻身设置
 */
export function TurnEdit() {

    // const param = useParams()
    const location = useLocation()
    // const 

    const sensorName = location.state.sensorName
    const token = useSelector(tokenSelect)
    const equipInfo = useSelector((state) => selectEquipBySensorname(state, sensorName))

    console.log(equipInfo)

    const [formValue, setFormValue] = useState({
        timeRangeA: '6次',
        timeIntervalA: '30min',
        switchA: true,
    })

    const [pickerInfo, setPickerInfo] = useState<any>({
        visible: false,
        title: '',
        columns: [],
        key: '',
        value: ''
    })

    const turnArr = [
        {
            type: FormType.SWITCH,
            objKey: "switchA",
            label: '翻身设置'
        },
        {
            type: FormType.SECONDRATE,
            objKey: "timeRangeA",
            label: '翻身次数',
            title: '设置翻身次数'
        },
        {
            type: FormType.TIME_INTERVAL,
            objKey: "timeIntervalA",
            label: '翻身间隔',
            title: '设置翻身间隔'
        },
    ]

    const submitCloud = (newValue: any) => {
        setFormValue(newValue)
        console.log(newValue)
        const obj = {
            flipbodyCount : parseInt(newValue.timeRangeA),
            flipbodyTime : parseInt(newValue.timeIntervalA)
        }
        axios({
            method: "post",
            url: netUrl + "/nursing/updateFlipConfig",
            headers: {
                "content-type": "application/json",
                "token": token
            },
            data: {
                deviceId: sensorName,
                flipbodyConfig: JSON.stringify(obj),
            },
        }).then((res) => {
            // message.success('修改成功')
        }).catch((err) => {
            message.error('修改失败')
        })

    }


    return (
        <>
            <List className="w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden">
                {
                    turnArr.map((offBedItem) => {
                        return (
                            <RenderListItem type={offBedItem.type} objKey={offBedItem.objKey} label={offBedItem.label} title={offBedItem.title} formValue={formValue} setFormValue={submitCloud} setPickerInfo={setPickerInfo} />
                        )
                    })
                }
            </List>
            <Picker
                columns={pickerInfo.columns}
                visible={pickerInfo.visible}
                onClose={() => {
                    setPickerInfo({
                        visible: false,
                        title: '',
                        columns: [],
                        key: '',
                        value: ''
                    })
                }}
                title={pickerInfo.title}
                value={pickerInfo.value}
                onConfirm={v => {
                    const result = v.length > 1 ? `${v[0]}:${v[1]} - ${v[2]}:${v[3]}` : v[0]
                    submitCloud({
                        ...formValue,
                        [pickerInfo.key]: result
                    })
                }}
            /></>
    )
}