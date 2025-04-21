import React, { useState, useEffect } from 'react'
import ImgUpload from '@/components/imgUpload/ImgUpload'
import { Button, Drawer, Form, Input, message, TimePicker, TimePickerProps } from 'antd'
import dayjs, { Dayjs } from "dayjs";
import tuc from 'dayjs/plugin/utc'
import { instance, Instancercv, netUrl } from "@/api/api";
import nullImg from "@/assets/image/null.png";
import axios from 'axios';
import { compressionFile } from '@/utils/imgCompressUtil';
dayjs.extend(tuc)
interface proprsType {
    nurseConfigList: any,
    sensorName: any
    recordOpen: boolean
    onClose: (val: any) => void
    Time?: any
    type?: string
    currentNurse?: any
}
function Recording(props: proprsType) {
    const { sensorName, onClose, type } = props
    const [recordOpen1, setRecordOpen] = useState<boolean>(props.recordOpen)
    const [img, setImg] = useState<any>('')

    const [uploadImage, setUploadImage] = useState<any>([])
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
            values.uploadImage = JSON.stringify(uploadImage)
            console.log(time, 'time........time............')
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
                    templateTime: props.currentNurse.templateTime,
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
                    message.info('添加成功')
                    onClose(true)
                }

            })
        }
    }
    const setImgVal = (url: string) => {
        form.setFieldsValue({ uploadImage: url })
        setImg(url)
    }
    return (
        <div>
            <Drawer
                width='26rem'
                className='nurseDrawer'
                // maskClosable={false}
                title={<span className='text-2xl ' style={{ textAlign: "center" }}>{type === '新增一次' ? '新增一次' : '记录护理项目'}</span>}
                onClose={() => {
                    form.resetFields()
                    setRecordOpen(false)
                    onClose(false)
                }}
                open={recordOpen1}>
                <Form form={form} onFinish={handleRecordForm}
                    initialValues={{
                        nurseProject: props.currentNurse?.title,
                        completionTime: dayjs(new Date().getTime())
                    }}
                >
                    <Form.Item name="nurseProject" label="护理项目:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }} wrapperCol={{ style: { width: "calc(100%-100px)" } }}
                        rules={[{ required: true, message: '请输入护理项目!' }]}
                    >
                        <Input disabled={props.type === '记录护理项目'} placeholder="请输入所有添加护理项目名称" style={{ borderRadius: "0" }} />
                    </Form.Item>
                    <Form.Item name="completionTime" label="完成时间:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }}
                        rules={[
                            { required: true, message: '请选择完成时间!' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const selectedTime: any = dayjs(value).utc().format('HH:mm');
                                    try {
                                        const isDuplicate = (Array.isArray(props.nurseConfigList) ? props.nurseConfigList : []).find((item: any) => {
                                            const startTime = dayjs(item.time, 'HH:mm').utc().format('HH:mm');
                                            return startTime === selectedTime;
                                        });
                                        if (isDuplicate) {
                                            return Promise.reject(new Error('护理时间重复，请重新选择！'));
                                        }
                                    } catch (err) {
                                        console.log(err, props, 'isDuplicate....111....isDuplicate')
                                    }
                                    return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        <TimePicker disabled={props.type === '记录护理项目'} popupClassName="time_picker_box" placeholder='请输入时间' format={format} />
                    </Form.Item>
                    <Form.Item name="uploadImage" label="上传图片:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }}
                        rules={[{ required: true, message: '请上传图片!' }]}
                    >
                        <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                uploadImage.map((item: any) => {
                                    return <img key={item} src={item} alt="" style={{ width: "6rem", height: "6rem", margin: "0 0.5rem 0.5rem 0" }} />
                                })
                            }
                        </span>
                        <div
                            className="img"
                            style={{
                                position: "relative",
                                background: `url(${nullImg})  center center / cover no-repeat`,
                                cursor: "pointer",
                                height: "6rem",
                                width: "6rem",
                            }}
                        >
                            <input
                                type="file"
                                name="img"
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    left: '0',
                                }}
                                id="img"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        let res = compressionFile(e.target.files[0]);
                                        res.then((e) => {
                                            console.log(e, "compressionFile");
                                            const token = localStorage.getItem("token");
                                            axios({
                                                method: "post",
                                                url: netUrl + "/file/fileUpload",
                                                headers: {
                                                    "content-type": "multipart/form-data",
                                                    token: token,
                                                },
                                                data: {
                                                    file: e,
                                                },
                                            })
                                                .then((res) => {
                                                    const img = res.data.data.src;
                                                    message.success("上传成功");
                                                    setUploadImage([
                                                        ...uploadImage,
                                                        img
                                                    ])
                                                    setImgVal(img)
                                                })
                                                .catch((err) => {
                                                    // message.error(err.error)
                                                    // setSpinning(false);
                                                });
                                        });
                                    }
                                }}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item name="notes" label="填写备注:" labelCol={{ style: { fontWeight: "600", fontSize: "0.8rem", marginRight: "1rem" } }} wrapperCol={{ style: { width: "calc(100%-100px)", backgroundColor: "#F5F8FA" } }}>
                        <Input maxLength={20} placeholder="请输入20字内备注内容" />
                    </Form.Item>
                    <Form.Item className='flex justify-around w-full'>
                        <Button color="primary" variant="outlined" className='w-[8rem] h-[2.4rem] mr-[10px] text-sm' onClick={() => {
                            form.resetFields()
                            onClose(false)
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

