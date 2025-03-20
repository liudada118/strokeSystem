import React, { useState, useEffect } from 'react'
import ImgUpload from '@/components/imgUpload/ImgUpload'
import { Button, Drawer, Form, Input, message, TimePicker, TimePickerProps } from 'antd'
import dayjs from "dayjs";
import { instance, Instancercv } from "@/api/api";
interface proprsType {
    sensorName: any
    nurseConfig: string
    recordOpen: boolean
    onClose: () => void
    Time?: any
    type?: string
    handleChildData?: any
    nursePersonTemplate1?: any
}
function Recording(props: proprsType) {
    console.log(props, 'props....111222........')
    const { sensorName, recordOpen, onClose, nursePersonTemplate1, type, handleChildData } = props
    const [recordOpen1, setRecordOpen] = useState<boolean>(props.recordOpen)
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [dataSource, setDataSource] = useState<any>([])
    const [img, setImg] = useState<any>('')
    const [nurseConfig, setNurseConfig] = useState<any>([{}])
    const [nurseConfigCopy, setNueseConfigCopy] = useState([{}])
    const [templateTime, setTemplateTime] = useState("")
    const [form] = Form.useForm();
    const token = localStorage.getItem('token')
    const format = 'HH:mm';
    /**
     * 添加护理报告
     */
    const handleRecordForm = (values: any) => {

        if (values) {
            const time = dayjs(values.completionTime).valueOf()
            values.completionTime = time
            console.log(values, time, '....................completionTime');

            const dataList = type === '新增一次' ?
                {
                    did: sensorName,
                    timeMillis: time,
                    data: JSON.stringify(values),
                } :
                {
                    did: sensorName,
                    timeMillis: time,
                    templateTime: nursePersonTemplate1,
                    data: JSON.stringify(values),
                }
            instance({
                method: "post",
                url: "/sleep/nurse/addDayNurse",
                headers: {
                    "content-type": "application/json",
                    "token": token
                },
                data: dataList
            }).then((res) => {

                if (res.data.msg == 'insert success') {
                    handleChildData('新增一次', time)
                    console.log('000000000000');
                    message.info('添加成功')
                    onClose()
                }

            })
        }
    }
    const onTimeChange: TimePickerProps['onChange'] = (time, timeString) => {
        console.log(time, timeString);
        if (typeof timeString == 'string') {
            const h = parseInt(timeString.split(':')[0])
            const m = parseInt(timeString.split(':')[1])
            setTemplateTime(`${h * 60 * 60 * 1000 + m * 60 * 1000}`)
        }
    };
    /**
     * 添加护理报告
     */
    // const addNurseReport = () => {
    //     instance({
    //         method: "post",
    //         url: "/sleep/nurse/addDayNurse",
    //         headers: {
    //             "content-type": "application/json",
    //             "token": token
    //         },
    //         data: {
    //             did: sensorName,
    //             timeMillis: new Date().getTime(),
    //             data: JSON.stringify(nurseConfig),
    //         },
    //     }).then((res) => {
    //         console.log(res, '................................................................res');
    //         message.success('添加成功')
    //         onClose()
    //     })
    // }
    return (
        <div>
            <Drawer
                width='26rem'
                className='nurseDrawer'
                maskClosable={false}
                title={<span className='text-2xl ' style={{ textAlign: "center" }}>{type === '新增一次' ? '新增一次' : '记录护理项目'}</span>}
                onClose={() => {
                    form.resetFields()
                    setCheckedList([])
                    setRecordOpen(false)
                    onClose()
                }}
                open={recordOpen1}>
                <Form form={form} onFinish={handleRecordForm}>
                    <Form.Item name="nurseProject" label="护理项目:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }} wrapperCol={{ style: { width: "calc(100%-100px)" } }}>
                        <Input placeholder="请输入所有添加护理项目名称" style={{ borderRadius: "0" }} />
                    </Form.Item>
                    <Form.Item name="completionTime" label="完成时间:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }}>
                        <TimePicker onChange={onTimeChange} defaultValue={dayjs('12:08', format)} format={format} style={{ borderRadius: "0" }} />
                    </Form.Item>
                    <Form.Item name="uploadImage" label="上传图片:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }}>
                        <ImgUpload finish={setImg} img={img} />
                    </Form.Item>
                    <Form.Item name="notes" label="填写备注:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }} wrapperCol={{ style: { width: "calc(100%-100px)", backgroundColor: "#F5F8FA" } }}>
                        <Input placeholder="请输入20字内备注内容" />
                    </Form.Item>
                    <Form.Item className='flex justify-around w-full'>
                        <Button color="primary" variant="outlined" className='w-[8rem] h-[2.4rem] mr-[10px] text-sm' onClick={() => {
                            form.resetFields()
                            setCheckedList([])
                            onClose()
                        }}>
                            取消
                        </Button>
                        <Button type="primary" onClick={() => {
                            form.submit()
                        }} className='w-[8rem] h-[2.4rem] text-sm'>
                            保存
                        </Button>
                    </Form.Item>
                </Form>

            </Drawer>
        </div>
    )
}
export default Recording

