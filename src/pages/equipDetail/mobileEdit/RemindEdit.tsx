// import {  } from "a"
import { useState } from "react"
import { RenderListItem } from "../EditingUser"
import { FormType } from "@/components/CommonFormModal"
import { Picker,List } from "antd-mobile"

/**
 * 
 * @returns 提醒修改
 */
export function RemindEdit() {

    const [formValue, setFormValue] = useState({
        timeRangeA: '12:10 - 10:10',
        timeIntervalA: '30min',
        timeRangeB: '12:10 - 10:10',
        timeIntervalB: '30min',
        timeRangeC: '12:10 - 10:10',
        timeRangeD: '12:10 - 10:10',
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
        <>
            <List className="w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden">
                {/* {renderListItem(FormType.SWITCH, 'switchB', '离床提醒')} */}
                <RenderListItem type={FormType.SWITCH} objKey="switchB" label="离床提醒" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
                <RenderListItem type={FormType.TIME_RANGE} objKey="timeRangeB" label="监测时间段" title="设置监测时间段" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
                <RenderListItem type={FormType.TIME_INTERVAL} objKey="timeIntervalB" label="提醒时间" title="设置提醒时间" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
                {/* {formValue.switchB && renderListItem(FormType.TIME_RANGE, 'timeRangeB', '监测时间段', '设置监测时间段')} */}
                {/* {formValue.switchB && renderListItem(FormType.TIME_INTERVAL, 'timeIntervalB', '提醒时间', '设置提醒时间')} */}
            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden'>
                <RenderListItem type={FormType.SWITCH} objKey="switchC" label="坐起提醒" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
                <RenderListItem type={FormType.TIME_RANGE} objKey="timeRangeC" label="监测时间段" title="设置监测时间段" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />

                {/* {renderListItem(FormType.SWITCH, 'switchC', '坐起提醒')} */}
                {/* {formValue.switchC && renderListItem(FormType.TIME_RANGE, 'timeRangeC', '监测时间段', '设置监测时间段')} */}
            </List>
            <List className='w-[92%] mx-auto mt-[10px] rounded-[10px] overflow-hidden'>
                <RenderListItem type={FormType.SWITCH} objKey="switchD" label="坠床提醒" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
                <RenderListItem type={FormType.TIME_RANGE} objKey="timeRangeD" label="监测时间段" title="设置监测时间段" formValue={formValue} setFormValue={setFormValue} setPickerInfo={setPickerInfo} />
                {/* {renderListItem(FormType.SWITCH, 'switchD', '坠床提醒')}
                {formValue.switchD && renderListItem(FormType.TIME_RANGE, 'timeRangeD', '监测时间段', '设置监测时间段')} */}

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
                    setFormValue({
                        ...formValue,
                        [pickerInfo.key]: result
                    })
                }}
            />
        </>

    )
}
