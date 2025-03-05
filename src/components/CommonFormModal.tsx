import React, { Fragment, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Button, Modal, Form, Input, Radio, TimePicker, Upload, Spin, message, Select } from 'antd'
import photo from "../assets/images/photo.png";
import nullImg from '@/assets/image/null.png'
import { compressionFile } from "@/utils/imgCompressUtil";
import { Instancercv, netUrl } from "@/api/api";
import axios from "axios";

export enum FormType {
    INPUT = 'INPUT',
    RADIO = 'RADIO',
    TIME_RANGE = 'TIME_RANGE',
    SWITCH = 'SWITCH',
    TIME_INTERVAL = 'TIME_INTERVAL',
    UPLOAD = 'UPLOAD',
    DATE_SELECT = 'DATE_SELECT',
    INPUTNUMBER = 'INPUTNUMBER',
    SECONDRATE = 'SECONDRATE',
    TIME_SINGLE_TIME = 'TIME_SINGLE_TIME',
    SELECT = 'SELECT'
}
type CommonFormItem = {
    label: string;
    key: string;
    value?: string | number;
    type: FormType;

}
type InputForm = CommonFormItem & { placeholder: string };
type ComplexForm = CommonFormItem & { children: { id: string; label: string, value: number | string }[] };
interface CommonFormModalProps {
    open: boolean;
    close: () => void;
    formList: CommonFormItem[] | InputForm[] | ComplexForm[];
    title: string;
    onFinish: (values: any) => void;
    imgChange?: Function
}
const CommonFormModal: (props: CommonFormModalProps) => React.JSX.Element = (props) => {
    const { open, close, formList, title, onFinish, imgChange } = props
    const [timeStart, setTimeStart] = useState<number>(0)
    const [timeEnd, setTimeEnd] = useState<number>(0)
    const [spinning, setSpinning] = React.useState<boolean>(false);
    console.log(onFinish, formList, 'onFinishonFinishonFinishonFinishonFinishonFinish');
    const handleFinish = (values: any) => {

        const _values = { ...values }
        formList.forEach((item) => {
            if (item.type === 'TIME_RANGE') {
                _values[item.key] = `${timeStart}-${timeEnd}`
            } else if (item.type === 'TIME_SINGLE_TIME') {
                _values[item.key] = `${timeStart}`
            }
        })
        close()
        console.log(values, formList, `${timeStart} - ${timeEnd}`, _values)
        onFinish && onFinish(_values)
    }

    const onChangeTimeEnd = (date: Dayjs, dateString: string | string[]) => {
        // console.log(dateString)
        const stamp = date.hour() * 60 * 60 * 1000 + date.minute() * 60 * 1000
        setTimeEnd(stamp)
    }
    const onChangeTimeStart = (date: Dayjs, dateString: string | string[]) => {
        const stamp = date.hour() * 60 * 60 * 1000 + date.minute() * 60 * 1000
        setTimeStart(stamp)
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleChange = () => {

    }

    const secondArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const secodnRateColumns = secondArr.map(item => ({
        label: `${item}次`,
        value: `${item}次`
    }))


    const renderFormItem = (list: CommonFormItem[] | ComplexForm[]) => {
        return (
            <Fragment>
                <Spin className="spin" spinning={spinning} fullscreen />
                {list.map((item) => {

                    switch (item.type) {
                        case 'TIME_SINGLE_TIME':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center'>
                                    <TimePicker placeholder='' onChange={onChangeTimeStart} needConfirm={false} defaultValue={dayjs((item.value as string)?.split('-')[0], 'HH:mm')} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                                </Form.Item>
                            )
                        case 'SELECT':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center'>
                                    <Select
                                        defaultValue={item.value}
                                        style={{ width: 120 }}
                                        onChange={handleChange}
                                        options={(item as ComplexForm).children}
                                    />
                                </Form.Item>
                            )
                        case 'INPUTNUMBER':
                            return <></>
                        case 'INPUT':
                            return (
                                <Form.Item label={item.label} name={item.value} key={item.value}>

                                    <Input value={item.value} placeholder={(item as InputForm).placeholder} />
                                </Form.Item>
                            )
                        case 'RADIO':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key}>
                                    <Radio.Group value={item.value} className='flex flex-wrap w-full'>
                                        {(item as ComplexForm).children.map((_item) => (
                                            <Radio className='w-[9rem] mt-[0.4rem]' key={_item.id} value={_item.value}>{_item.label}</Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            )
                        case 'TIME_RANGE':
                            // console.log(item.value?.split('-')[0], 'item')
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center'>
                                    <TimePicker placeholder='' onChange={onChangeTimeStart} needConfirm={false} defaultValue={dayjs((item.value as string)?.split('-')[0], 'HH:mm')} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                                    <span className='bg-[#b4c0ca] w-[0.8rem] h-[1px] my-0 mx-[4px]' />
                                    <TimePicker placeholder='' onChange={onChangeTimeEnd} needConfirm={false} defaultValue={dayjs((item.value as string)?.split('-')[1], 'HH:mm')} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                                </Form.Item>
                            )
                        case 'UPLOAD':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} valuePropName="fileList" getValueFromEvent={normFile}>
                                    {/* <Upload action="/upload.do" listType="picture-card" maxCount={1}> */}
                                    {/* <Input value={item.value} placeholder={(item as InputForm).placeholder} /> */}
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <div className="imgContent">
                                            <div className="img" style={{
                                                background: `url(${item.value ? item.value : nullImg
                                                    })  center center / cover no-repeat`, cursor: 'pointer'

                                            }}></div>

                                            {/* <div style={{ color: '#3662EC', fontSize: '0.9rem', marginLeft: '0.5rem', }}>修改头像</div> */}
                                            {/* <img src={showUserinfo.img} alt="" /> */}

                                            <input type="file" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0 }} id="img" onChange={(e) => {
                                                setSpinning(true);
                                                if (e.target.files) {
                                                    // res.then((e) => {})
                                                    // setImgFile(e.target.files[0])
                                                    let res = compressionFile(e.target.files[0])
                                                    res.then((e) => {
                                                        console.log(e, 'compressionFile')
                                                        const token = localStorage.getItem('token')
                                                        axios({
                                                            method: "post",
                                                            url: netUrl + "/file/fileUpload",
                                                            headers: {
                                                                "content-type": "multipart/form-data",
                                                                "token": token
                                                            },
                                                            data: {
                                                                file: e,
                                                            }
                                                        }).then((res) => {
                                                            const img = res.data.data.src
                                                            setSpinning(false);
                                                            message.success('上传成功')
                                                            imgChange && imgChange(img)
                                                            // setImg(img)
                                                        }).catch((err) => {
                                                            message.error(err.error)
                                                            setSpinning(false);
                                                        })
                                                            ;
                                                    })

                                                }
                                            }} />
                                        </div>
                                    </button>
                                    {/* </Upload> */}
                                </Form.Item>
                            );
                        default:
                            return null;
                    }
                })}
            </Fragment>
        )
    }
    return (

        <Modal
            title={title}
            centered
            open={open}
            footer={() => null}
            onOk={() => close()}
            onCancel={() => close()}
        >
            <Form onFinish={handleFinish} className='pt-[25px] px-[15px]'>
                {renderFormItem(formList)}
                <Form.Item className='flex justify-end'>
                    <Button color="primary" variant="outlined" className='mr-[10px]' onClick={() => close()}>取消</Button>
                    <Button type="primary" htmlType="submit" className='w-[6rem]'>保存</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CommonFormModal