import React, { Fragment, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Button, Modal, Form, Input, Radio, TimePicker, Upload, Spin, message, Select, InputNumber } from 'antd'
import photo from "../assets/images/photo.png";
import nullImg from '@/assets/image/null.png'
import { compressionFile } from "@/utils/imgCompressUtil";
import { Instancercv, netUrl } from "@/api/api";
import axios from "axios";

import useWindowSize from '@/hooks/useWindowSize'
import './index.scss'

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
    SELECT = 'SELECT',
    SOS_ALARM_SWITCH = "SOS_ALARM_SWITCH",
    PHONE = 'PHONE',
    ADDRESS = 'ADDRESS',
    SICKNESS = 'SICKNESS',
    INPUT_NUMBER = 'INPUT_NUMBER'
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
    imgChange?: Function;
    sensorName?: string;
    updateName?: Boolean
}
const CommonFormModal: (props: CommonFormModalProps) => React.JSX.Element = (props) => {
    const { open, close, formList, title, onFinish, imgChange, sensorName, updateName } = props
    const [timeStart, setTimeStart] = useState<number>(0)
    const [timeEnd, setTimeEnd] = useState<number>(0)
    const [spinning, setSpinning] = React.useState<boolean>(false);


    const [year, setYear] = useState(2023);
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);
    const isPhone = useWindowSize().isMobile
    const checkFutureDate = (yearValue: any, monthValue: any, dayValue: any) => {
        const selectedDate = new Date(yearValue, monthValue - 1, dayValue);
        const today = new Date();
        console.log(selectedDate, today, '...............................selectedDateselectedDateselectedDate');

        if (selectedDate > today) {
            return message.info('所选日期不能大于当前日期'); // 提示用户  
        }
    };
    const handleFinish = (values: any) => {
        if (updateName) {
            if (!(values.patientName && values.roomNum && values.sex && values.telephone && values.address)) {
                return message.info('请完善信息')
            }
            let age = values.age
            const today = new Date();
            if (!isPhone) {
                age = new Date().getTime() - new Date(`${year} ${month}`).getTime()
                age = new Date(age);
                age = age.getFullYear() - 1970
            }
            console.log(age, '.......age..........selectedDateselectedDateselectedDate');
            const selectedDate = new Date(year, month - 1, day);
            if (today < selectedDate) {
                return message.info('所选日期不能大于当前日期');
            }


            axios({
                method: "post",
                url: netUrl + "/device/update",

                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token": localStorage.getItem('token')
                },
                params: {
                    deviceId: sensorName,
                    "headImg": values.headImg,
                    "patientName": values.patientName,
                    "age": age === 0 && -1 ? 1 : age, // '2025-3-1'
                    "roomNum": values.roomNum,
                    "sex": values.sex,
                    "telephone": values.telephone,
                    "address": values.address,
                    "medicalHistory": values.medicalHistory,
                },
            }).then((res) => {
                if (res.data.msg == 'update success') {
                    // getuserInfo()
                    message.success('修改成功')
                }
            });
        }


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
    const [initialValues, setInitialValues] = useState<any>({})
    const secodnRateColumns = secondArr.map(item => ({
        label: `${item}次`,
        value: `${item}次`
    }))
    useEffect(() => {
        const initialValues = {} as any
        formList.forEach((item) => {
            initialValues[item.key] = item.value
            // TODO
            if (item.key === 'xxxxxxx') {
                const userAge = (item.value as string)?.split('-') || []
                setYear(+userAge[0] || 2025)
                setMonth(+userAge[1] || 1)
                setDay(+userAge[2] || 1)
            }
        })
        setInitialValues(initialValues)
    }, [formList])

    const renderFormItem = (list: CommonFormItem[] | ComplexForm[],) => {
        return (
            <Fragment>
                <Spin className="spin" spinning={spinning} fullscreen />
                {list.map((item) => {

                    switch (item.type) {
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
                        case 'TIME_SINGLE_TIME':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center'>
                                    <TimePicker placeholder='' onChange={onChangeTimeStart} needConfirm={false} defaultValue={dayjs((item.value as string)?.split('-')[0], 'HH:mm')} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                                </Form.Item>
                            )

                        case 'INPUTNUMBER':
                            return <></>
                        case 'INPUT':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key}>
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
                            const valueTime = (item.value as string)?.split('-')
                            const start = dayjs(valueTime[0], 'HH:mm')
                            const end = dayjs(valueTime[1], 'HH:mm')
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center'>
                                    <TimePicker placeholder='' onChange={onChangeTimeStart} needConfirm={false} defaultValue={start} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                                    <span className='bg-[#b4c0ca] w-[0.8rem] h-[1px] my-0 mx-[4px]' />
                                    <TimePicker placeholder='' onChange={onChangeTimeEnd} needConfirm={false} defaultValue={end} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                                </Form.Item>
                            )

                        case 'INPUT_NUMBER':
                            return (
                                <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center input_number_reset'>
                                    {/* <InputNumber min={1900} max={2025} controls={true} style={{ marginRight: '10px' }} />年
                                    <InputNumber min={1} max={12} defaultValue={1} style={{ margin: '0 10px' }} controls />月
                                    <InputNumber min={1} max={30} defaultValue={1} style={{ margin: '0 10px' }} controls />日 */}
                                    <div className="date-input-item">
                                        <InputNumber
                                            value={year}
                                            onChange={(e) => {
                                                setYear(e as number)
                                                checkFutureDate(e, month, day);
                                            }}
                                            min={1900}
                                            max={2100}
                                            controls={false}
                                            disabled

                                        />
                                        <div className="btn-box">
                                            <span onClick={() => setYear((prevMonth) => Math.min(2025, prevMonth + 1))}>▲</span>
                                            <span onClick={() => setYear((prevMonth) => Math.max(1900, prevMonth - 1))}>▼</span>
                                            {/* <span onClick={() => setYear(year + 1)}>▲</span>
                                            <span onClick={() => setYear(year - 1)}>▼</span> */}
                                        </div>
                                    </div>
                                    年
                                    <div className="date-input-item">
                                        <InputNumber
                                            value={month}
                                            onChange={(e) => {
                                                setMonth(e as number)
                                                checkFutureDate(year, e, day)
                                            }}
                                            min={1}
                                            max={12}
                                            controls={false}
                                            disabled
                                        />
                                        <div className="btn-box">
                                            <span onClick={() => {
                                                console.log("Increasing month from", month);
                                                setMonth((prevMonth) => Math.min(12, prevMonth + 1));
                                            }}>▲</span>
                                            <span onClick={() => {
                                                console.log("Decreasing month from", month);
                                                setMonth((prevMonth) => Math.max(1, prevMonth - 1));
                                            }}>▼</span>
                                        </div>
                                    </div>
                                    月
                                    <div className="date-input-item">
                                        <InputNumber
                                            value={day}
                                            onChange={(e) => {
                                                setDay(e as number)
                                                checkFutureDate(year, month, e)
                                            }}
                                            min={1}
                                            max={31} // 可以根据月份变化调整  
                                            controls={false}
                                            disabled

                                        />
                                        <div className="btn-box">
                                            <span onClick={() => setDay((prevMonth) => Math.min(31, prevMonth + 1))}>▲</span>
                                            <span onClick={() => setDay((prevMonth) => Math.max(1, prevMonth - 1))}>▼</span>

                                        </div>
                                    </div>
                                    日
                                </Form.Item>
                            )
                        // case 'TIME_RANGE':
                        //     // console.log(item.value?.split('-')[0], 'item')
                        //     return (
                        //         <Form.Item label={item.label} name={item.key} key={item.key} className='flex items-center'>
                        //             <TimePicker placeholder='' onChange={onChangeTimeStart} needConfirm={false} defaultValue={dayjs((item.value as string)?.split('-')[0], 'HH:mm')} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                        //             <span className='bg-[#b4c0ca] w-[0.8rem] h-[1px] my-0 mx-[4px]' />
                        //             <TimePicker placeholder='' onChange={onChangeTimeEnd} needConfirm={false} defaultValue={dayjs((item.value as string)?.split('-')[1], 'HH:mm')} className='rounded-[1rem] w-[38%]' format='HH:mm' />
                        //         </Form.Item>
                        //     )
                        case 'SOS_ALARM_SWITCH':
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
            zIndex={100000000}
            title={title}
            centered
            open={open}
            footer={() => null}
            onOk={() => close()}
            onCancel={() => close()}
            width={500}
        >
            <Form onFinish={handleFinish} initialValues={initialValues} className='pt-[25px] px-[15px]'>
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