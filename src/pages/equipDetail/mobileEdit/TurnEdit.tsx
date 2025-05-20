import { List, Picker } from "antd-mobile"
import { useEffect, useState } from "react"
import { RenderListItem } from "../EditingUser"
import { FormType } from "@/components/CommonFormModal"
import { useSelector, useDispatch } from "react-redux"
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

    const handleVisibilityChange = () => {
        const html = document.getElementsByTagName("html")[0];
        console.log("页面状态变化：", document.hidden);
        if (!document.hidden) {
            // 当页面重新显示在前台时
            html.style.fontSize = '14px';
            // window.location.reload(); // 刷新页面
        }
    };

    useEffect(() => {
        handleVisibilityChange(); // 初始化时执行一次
        // 添加事件监听器
        window.addEventListener('resize', handleVisibilityChange);
        window.addEventListener('visibilitychange', handleVisibilityChange);
        // 组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleVisibilityChange);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const sensorName = location.state.sensorName
    const token = useSelector(tokenSelect)
    const equipInfo = useSelector((state) => selectEquipBySensorname(state, sensorName))

    console.log(equipInfo)

    const [formValue, setFormValue] = useState({
        timeRangeA: '6次',
        timeIntervalA: '2小时',
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
            label: '设置翻身次数',
            title: '设置翻身次数'
        },
        {
            type: FormType.TIME_INTERVAL_V2,
            objKey: "timeIntervalA",
            label: '设置翻身间隔',
            title: '设置翻身间隔'
        },
    ]

    const submitCloud = (newValue: any) => {
        setFormValue(newValue)

        const obj = {
            flipbodyCount: parseInt(newValue.timeRangeA),
            flipbodyTime: parseInt(newValue.timeIntervalA) * 60
        }

        // 开关关闭后  设置次数为0
        if (!newValue.switchA) {
            obj.flipbodyCount = 0
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
                config: JSON.stringify(obj),
            },
        }).then((res) => {
            // message.success('修改成功')
        }).catch((err) => {
            message.error('修改失败')
        })

    }


    /**
     * 请求护理配置
     */
    useEffect(() => {
        Instancercv({
            method: "get",
            url: "/nursing/getNursingConfig",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                deviceId: sensorName
            }
        }).then((res) => {
            console.log(res.data, 'typetype.............999')
            const flipbodyConfig = JSON.parse(res.data.flipbodyConfig)
            console.log(flipbodyConfig)
            const { flipbodyCount, flipbodyTime } = flipbodyConfig
            if (flipbodyCount) {
                setFormValue({
                    timeRangeA: `${flipbodyCount}次`,
                    timeIntervalA: `${flipbodyTime / 60}小时`,
                    switchA: true,
                })
            } else {
                setFormValue({
                    timeRangeA: `${0}次`,
                    timeIntervalA: `${flipbodyTime / 60}小时`,
                    switchA: false,
                })
            }
        })
    }, [])

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