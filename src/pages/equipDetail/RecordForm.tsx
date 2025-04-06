import React, { useEffect, useState } from "react";
import { List, ImageUploader, ImageUploadItem } from "antd-mobile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Form, Input, message, Radio } from "antd";
import CommonTitle from "../../components/CommonTitle";
import plus from "../../assets/images/plus.png";
import dayjs from "dayjs";
import CommonNavBar from "../../components/CommonNavBar";
import { PreViewConfig } from "./mobileEdit/NurseEdit";
import { instance, Instancercv } from "@/api/api";
import { useSelector } from "react-redux";
import { tokenSelect } from "@/redux/token/tokenSlice";


const plainOptions = ['1.助餐', '2.助浴', '3.更换床单', '4.更换药物', '5.敷药', '6.记录压疮位置与大小']
const RecordForm: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [checkedList, setCheckedList] = useState<string[]>([])
    const [fileList, setFileList] = useState<ImageUploadItem[]>([])

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleRecordForm = (values: any) => {
        const _values = { ...values, integrated: checkedList, state_picture: fileList }
        console.log(_values, checkedList, 'values')
        const _dataSource = []
        let _number = 0
        for (let i in _values) {
            if (_values[i]?.length > 0) {

                _dataSource.push({
                    number: _number++,
                    content: {
                        id: i,
                        value: i === 'integrated' ? _values[i].join(' ') : _values[i],
                        type: i === 'state_picture' ? 'IMAGE' : 'TEXT',
                    },
                    time: dayjs().format('HH:mm')
                })
            }
        }
        form.resetFields()
        setCheckedList([])
        navigate('/', { state: _dataSource })
    }

    const handleUpload = (file: File) => {

        return {
            url: URL.createObjectURL(file),
        }
    }

    const token = useSelector(tokenSelect)
    const param = useParams()
    const location = useLocation()
    const sensorName = param.id || location.state.sensorName
    const [nurseConfig, setNurseConfig] = useState<any>([{}])

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
            const nursingConfig = JSON.parse(res.data.nursingConfig || '{}')
            setNurseConfig(nursingConfig)
        })
    }, [])

    const addNurseReport = () => {
        instance({
            method: "post",
            url: "/sleep/nurse/addDayNurse",
            headers: {
                "content-type": "application/json",
                "token": token
            },
            data: {
                did: sensorName,
                timeMillis: new Date().getTime(),
                data: JSON.stringify(nurseConfig),
            },
        }).then((res) => {
            message.success('添加成功')
            navigate(-1)
        })
    }

    return (
        <div className='h-[100vh]'>
            <CommonNavBar title='记录护理项目' onBack={() => navigate(-1)} />
            <div className="pt-[5rem] w-[92%] m-auto">
                <PreViewConfig display={true} nurseConfig={nurseConfig} setNurseConfig={setNurseConfig} />
                <Button type="primary" onClick={() => {
                    addNurseReport()
                }} className='w-full h-[3rem] mb-[1rem] text-base'>
                    提交
                </Button>
            </div>

            {/* <Form form={form} onFinish={handleRecordForm} className='md:pt-[4rem]'>

                <div className='w-[96%] mx-auto mb-[10px] rounded-[10px] p-[0.8rem] bg-[#fff]'>
                    <CommonTitle name='皮肤情况' type='rect'/>
                    <Form.Item name="state_picture" valuePropName="fileList" getValueFromEvent={normFile} className='mb-0'>
                        <ImageUploader

                            value={fileList}
                            onChange={setFileList}
                            upload={handleUpload as any}
                        >
                            <div className='flex flex-col items-center justify-center w-[78px] h-[78px] rounded-[6px] border border-[#D8D8D8] ml-[10px]'>
                                <img src={plus} alt="" className='mb-[4px]'/>
                                <span className='text-[#A2A2A2] text-[12px]'>添加照片</span>
                            </div>
                        </ImageUploader>
                    </Form.Item>
                </div>
                <div className='w-[96%] mx-auto my-[10px] rounded-[10px] p-[0.8rem] bg-[#fff]'>

                    <CommonTitle name='助餐' type='rect'/>
                    <Form.Item name='buffet' className='mb-0'>
                        <Radio.Group>
                            <Radio value="已完成" className='text-base'> 已完成 </Radio>
                            <Radio value="未完成" className='ml-[24px] text-base'> 未完成 </Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>
                <div className='w-[96%] mx-auto my-[10px] rounded-[10px] p-[0.8rem] bg-[#fff]'>

                    <CommonTitle name='其他护理' type='rect'/>
                    <Form.Item name="integrated" className='mb-0'>
                        <List>
                            {plainOptions.map(item => (
                                <List.Item className='text-base' key={item} extra={<Checkbox onChange={() => {
                                    if(checkedList.includes(item)) {
                                        setCheckedList(checkedList.filter(checked => checked !== item))
                                    } else {
                                        setCheckedList([...checkedList, item])
                                    }
                                }}/>}>
                                    {item}
                                </List.Item>
                            ))}
                        </List>
                    </Form.Item>
                </div>
                <div className='w-[96%] mx-auto my-[10px] rounded-[10px] p-[0.8rem] bg-[#fff]'>

                    <CommonTitle name='今日心情' type='rect'/>
                    <Form.Item name="statement" className='mb-0'>
                        <Input.TextArea className='bg-[#ECF0F4] border-none !h-[10vh] text-base' placeholder='请输入文字'/>
                    </Form.Item>
                </div>
                <Form.Item className='w-[96%] mx-auto'>
                    <Button type="primary" htmlType="submit" className='w-full h-[3rem] mb-[1rem] text-base'>
                        提交
                    </Button>
                </Form.Item>
            </Form> */}
        </div>
    )
}

export default RecordForm;