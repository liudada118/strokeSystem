import React, { useState, useEffect } from 'react'
import ImgUpload from '@/components/imgUpload/ImgUpload'
import { Button, Drawer, Form, Input, message, TimePicker, TimePickerProps } from 'antd'
import dayjs from "dayjs";
import { instance, Instancercv } from "@/api/api";
interface proprsType {
    careList: any,
    sensorName: any
    nurseConfig: string
    recordOpen: boolean
    onClose: () => void
    Time?: any
    type?: string
    handleChildData?: any
    currentCare?: any
}
function Recording(props: proprsType) {
    const { sensorName, recordOpen, onClose, type, handleChildData, currentCare } = props
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
    console.log();

    const handleRecordForm = (values: any) => {


        if (values) {
            const time = dayjs(values.completionTime).valueOf()
            values.completionTime = time
            console.log(values, time, props, '................................................................values');
            const timeString = dayjs(props.currentCare?.timeWithCurrentDate).format("HH:mm");
            const fullDateTime = dayjs().format("YYYY-MM-DD") + " " + timeString; // 拼接当天日期
            const dateTime = dayjs(fullDateTime, "YYYY-MM-DD HH:mm:ss").valueOf(); // 转换为 dayjs 对象

            const dataList = type === '新增一次' ?
                {
                    did: sensorName,
                    timeMillis: time,
                    templateTime: new Date().getTime(),
                    data: JSON.stringify(values),
                } :
                {
                    did: sensorName,
                    timeMillis: new Date().getTime(),
                    templateTime: props.currentCare.templateTime,
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
    const setImgVal = (url: string) => {
        form.setFieldsValue({ uploadImage: url })
        setImg(url)
    }
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
                <Form form={form} onFinish={handleRecordForm}
                    initialValues={{
                        nurseProject: props.currentCare?.templateTitle,
                        completionTime: dayjs(new Date().getTime())
                    }}
                >

                    <Form.Item name="nurseProject" label="护理项目:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }} wrapperCol={{ style: { width: "calc(100%-100px)" } }}
                        rules={[{ required: true, message: '请输入护理项目!' }]}
                    >
                        <Input disabled={props.type === '去完成'} placeholder="请输入所有添加护理项目名称" style={{ borderRadius: "0" }} />
                    </Form.Item>
                    <Form.Item name="completionTime" label="完成时间:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }}
                        rules={[
                            { required: true, message: '请选择完成时间!' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const selectedTime = dayjs(value);
                                    const isSame = props.careList.find((item: any) => {
                                        const startTime = dayjs(item.time, 'HH:mm');
                                        if (selectedTime.isSame(startTime)) {
                                            return true
                                        }
                                    })

                                    if (isSame) {
                                        return Promise.reject(new Error('护理时间重复，请重新选择！'));
                                    }
                                    return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        <TimePicker disabled={props.type === '去完成'} popupClassName="time_picker_box" placeholder='请输入时间' format={format} />
                    </Form.Item>
                    <Form.Item name="uploadImage" label="上传图片:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }}
                        rules={[{ required: true, message: '请上传图片!' }]}
                    >
                        <ImgUpload finish={(val: string) => setImgVal(val)} img={img} />
                    </Form.Item>
                    <Form.Item name="notes" label="填写备注:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }} wrapperCol={{ style: { width: "calc(100%-100px)", backgroundColor: "#F5F8FA" } }}>
                        <Input maxLength={20} placeholder="请输入20字内备注内容" />
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

