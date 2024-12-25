import { List } from "antd-mobile"
import { useState } from "react"
import { RenderListItem } from "../EditingUser"
import { FormType } from "@/components/CommonFormModal"

/**
 * 
 * @returns 翻身设置
 */
export function TurnEdit() {
    const [formValue, setFormValue] = useState({
        timeRangeA: '12:10 - 10:10',
        timeIntervalA: '30min',
        timeRangeB: '12:10 - 10:10',
        timeIntervalB: '30min',
        timeRangeC: '12:10 - 10:10',
        timeRangeD: '12:10 - 10:10',
        switchA: true,
        switchB: true,
        switchC: false,
        switchD: false,
    })

    const [pickerInfo, setPickerInfo] = useState<any>({
        visible: false,
        title: '',
        columns: [],
        key: '',
        value: ''
    })

    return ( 
        <List  className="w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden">
            {/* {renderListItem(FormType.TIME_RANGE, 'timeRangeA', '设置时间段', '设置时间段')}
            {renderListItem(FormType.TIME_INTERVAL, 'timeIntervalA', '翻身间隔', '设置翻身间隔')} */}
            <RenderListItem type={FormType.SWITCH} objKey="switchA" label="翻身设置" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
            <RenderListItem type={FormType.TIME_RANGE} objKey="timeRangeB" label="监测时间段" title="设置监测时间段" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
            <RenderListItem type={FormType.TIME_INTERVAL} objKey="timeIntervalB" label="提醒时间" title="设置提醒时间" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />

        </List>
    )
}