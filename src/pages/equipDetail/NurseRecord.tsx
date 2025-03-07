import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Checkbox, Drawer, Form, Image, Input, Radio, Table, Upload, Typography, message, TimePicker } from "antd";
import CommonTitle from "../../components/CommonTitle";
import photo from "../../assets/images/photo.png";
import expand_img from '../../assets/images/expand.png'
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from './message.module.scss'
import useWindowSize from "../../hooks/useWindowSize";
import { instance, Instancercv } from "@/api/api";
import { useSelector } from "react-redux";
import { tokenSelect } from "@/redux/token/tokenSlice";
import { PreViewConfig } from "./mobileEdit/NurseEdit";
import { NurseTable, templateToData } from "../setting/nurseSetting/NurseSetting";
import { DataContext } from ".";
import { TimePickerProps } from "antd/lib";
import ImgUpload from "@/components/imgUpload/ImgUpload";

const formMap: { [key: string]: string } = {
    state_picture: '记录皮肤状况',
    buffet: '助餐',
    integrated: '其他护理',
    statement: '老人今日情况'
}
interface NurseRecordProps {
    isMobile?: boolean;
}
const NurseRecord: (props: NurseRecordProps) => React.JSX.Element = (props) => {

    const { isMobile = false } = props;
    const { isMaxScreen } = useWindowSize();
    const [form] = Form.useForm();
    const nurseRef = useRef<any>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<any>([])
    const [recordOpen, setRecordOpen] = useState<boolean>(false)
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [recordExpand, setRecordExpand] = useState<any>({})

    const token = useSelector(tokenSelect)
    const param = useParams()
    const sensorName = param.id

    const [nurseConfig, setNurseConfig] = useState<any>([{}])
    const [nurseConfigCopy, setNueseConfigCopy] = useState([{}])

    const nurseTableColumns = [{
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        width: isMobile ? 50 : isMaxScreen ? 80 : 68,
        render: (text: string) => <span className='text-[#929EAB] text-sm'>{text}</span>
    }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        render: (record: any) => {

            return (
                <div className='flex flex-col'>
                    <span className='text-[#3D3D3D] text-sm font-medium'>{formMap[record.id]}</span>
                    {record.type === 'TEXT' ? (

                        <Typography.Paragraph
                            className='text-[#929EAB] text-sm'
                            ellipsis={{
                                rows: 1,
                                expandable: 'collapsible',
                                symbol: (expanded) => {
                                    return expanded ? <img src={expand_img} alt="" className='rotate-180' /> :
                                        <img src={expand_img} alt="" />

                                },
                                expanded: recordExpand[record.id]?.expanded,
                                onExpand: (_, info) => setRecordExpand({
                                    ...recordExpand,
                                    [record.id]: {
                                        ...recordExpand[record.id],
                                        expanded: recordExpand[record.id]?.expanded,
                                    }
                                }),
                            }}
                        >
                            {record.value}
                        </Typography.Paragraph>
                    ) :
                        (

                            <Image.PreviewGroup
                                items={[
                                    'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
                                    'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
                                    'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
                                ]}
                            >
                                <Image
                                    width='3rem'
                                    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                                />
                            </Image.PreviewGroup>
                        )}
                </div>
            )
        }
    }, {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        render: (text: string) => <span className='text-sm text-[#929EAB]'>{text}</span>
    }]
    useEffect(() => {
        const element = document.getElementById('nurseTable')
        console.log(location.state, 'location.state')
        if (location.state?.length) {
            element?.scrollIntoView({ behavior: 'smooth' });
            setDataSource([...dataSource, ...location.state])
        }
    }, []);
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };


    const plainOptions = ['1.助餐', '2.助浴', '3.更换床单', '4.更换药物', '5.敷药', '6.记录压疮位置与大小']
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

    const onChange = (list: string[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange = (e: any) => {
        setCheckedList(e.target.checked ? plainOptions : []);
    };

    const handleRecordForm = (values: any) => {
        const _values = { ...values, integrated: checkedList }
        setRecordOpen(false)
        const _dataSource = []
        let _number = dataSource.length + 1
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
        setDataSource([...dataSource, ..._dataSource])
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
            console.log(res.data, 'resssssssss')
            const nursingConfig = JSON.parse(res.data.nursingConfig)
            console.log(nursingConfig)
            setNurseConfig(nursingConfig)
            setNueseConfigCopy(nursingConfig)
        })
    }, [])

    /**
     * 添加护理报告
     */
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
        })
    }

    /**
     * 请求护理列表
     */

    useEffect(() => {
        instance({
            method: 'get',
            url: "/sleep/nurse/getDayNurseData",
            headers: {
                "content-type": "application/json",
                "token": token
            },
            params: {
                did: sensorName,
                startTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + 0,
                endTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
            }
        }).then((res) => {

        })
    }, [])

    const [templateId, setTemplateId] = useState(0)
    // const [nursePersonTemplate, setNursePersonTemplate] = useState<any>([])

    const context = useContext(DataContext)
    const { nursePersonTemplate, setNursePersonTemplate, getPersonTemplate } = context

    useEffect(() => {
        getPersonTemplate()
    }, [])

    /**
     * 获取护理模板
     */
    // const getNurseTemplate = () => {
    //     Instancercv({
    //         method: "get",
    //         url: "/nursing/getNurseTemplateData",
    //         headers: {
    //             "content-type": "multipart/form-data",
    //             "token": token
    //         },
    //     }).then((res) => {
    //         console.log(res)
    //         const template = res.data.data[0]
    //         if(template){
    //             setTemplateId(template.id)
    //             console.log(template.template)
    //             const data = templateToData(template.template)
    //             // console.log(data)
    //             setNurseTemplate(data)
    //         }

    //     })
    // }

    // const getPersonTemplate = () => {
    //     Instancercv({
    //         method: "get",
    //         url: "/nursing/getNursingConfig",
    //         headers: {
    //             "content-type": "multipart/form-data",
    //             "token": token
    //         },
    //         params: {
    //             deviceId: sensorName
    //         }
    //     }).then((res) => {
    //         const nursingConfig = JSON.parse(res.data.nursingConfig)
    //         setNursePersonTemplate(nursingConfig)
    //     })
    // }

    const format = 'HH:mm';
    const [templateTime, setTemplateTime] = useState("")
    const onTimeChange: TimePickerProps['onChange'] = (time, timeString) => {
        console.log(time, timeString);
        if (typeof timeString == 'string') {
            const h = parseInt(timeString.split(':')[0])
            const m = parseInt(timeString.split(':')[1])
            setTemplateTime(`${h * 60 * 60 * 1000 + m * 60 * 1000}`)
        }
    };
    const [img, setImg] = useState('')

    return (
        <div className='w-[calc(30%-10px)] md:w-full'>
            {!isMobile && (
                <span className='flex items-center justify-between mb-[10px]'>
                    <span className='text-lg text-[#32373E] font-semibold'>护理</span>
                    <span className='cursor-pointer text-[#0072EF] text-sm font-medium'
                        onClick={() => setRecordOpen(true)}>记录护理项目</span>

                    <Drawer
                        width='26rem'
                        className='nurseDrawer'
                        maskClosable={false}
                        title={<span className='text-2xl'>记录护理项目</span>}
                        onClose={() => {
                            form.resetFields()
                            setCheckedList([])
                            setRecordOpen(false)
                        }}
                        open={recordOpen}>
                        <Form form={form} onFinish={handleRecordForm}>
                            <div>
                                护理项目
                                <Input />
                            </div>
                            <div>
                                完成时间
                                <TimePicker onChange={onTimeChange} defaultValue={dayjs('12:08', format)} format={format} />
                            </div>
                            <div>
                                上传图片
                                <ImgUpload finish={setImg} img={img} />
                            </div>
                            <div>
                                填写备注
                                <Input />
                            </div>

                            <Form.Item className='flex justify-around w-full'>
                                <Button color="primary" variant="outlined" className='w-[8rem] h-[2.4rem] mr-[10px] text-sm' onClick={() => {
                                    form.resetFields()
                                    setCheckedList([])
                                    setRecordOpen(false)
                                }}>
                                    取消
                                </Button>
                                <Button type="primary" onClick={() => {
                                    // addNurseReport()
                                }} className='w-[8rem] h-[2.4rem] text-sm'>
                                    保存
                                </Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </span>
            )}
            <div ref={nurseRef} className='bg-[#fff] py-[25px] px-[25px] md:w-[94%] md:rounded-[10px] md:my-[10px] md:mx-auto md:py-[1rem] md:px-[1rem]'>
                <CommonTitle name='护理项目' type={isMobile ? 'rect' : 'square'} />
                {/* {isMobile && (
                    <Button className='w-full h-[5vh] mb-[0.5rem] text-base' type='primary' onClick={() => navigate('/record', { state: { sensorName } })}>记录护理项目</Button>
                )}
                <Table rowClassName='nurseTableRow' id='nurseTable' rowKey="number" columns={nurseTableColumns} dataSource={dataSource} pagination={false} /> */}
                <NurseTable type='user' getNurseTemplate={getPersonTemplate} templateId={templateId} data={nursePersonTemplate} />
            </div>
        </div>
    )
}

export default NurseRecord;