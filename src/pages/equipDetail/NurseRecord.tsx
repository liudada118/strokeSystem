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
import { DataContext } from ".";
import { TimePickerProps } from "antd/lib";
import ImgUpload from "@/components/imgUpload/ImgUpload";
import Recording from "./nurseprocess/recording";
import MobileAddNurse from "./nurseprocess/nursingOpen/nurseAdd";
import PCNurseConfList from "./nurseprocess/nurseConf/nurseList/conf_list";
import { getNurseConfist } from "@/utils/getNursingConfig"
import jiaHao from '@/assets/images/image copy 2.png'


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
    // const { isMaxScreen } = useWindowSize();
    // const [form] = Form.useForm();
    const nurseRef = useRef<any>(null);
    // const location = useLocation();
    // const navigate = useNavigate();
    // const [dataSource, setDataSource] = useState<any>([])
    const [mobileAddNurseOpen, setMobileAddNurseOpen] = useState<boolean>(false)
    const [recordOpen, setRecordOpen] = useState<boolean>(false)
    const [operNurseTitle, setOperNurseTitle] = useState<string>('新增一次')
    const [currentNurse, setCurrentNurse] = useState<any>({})
    // const [checkedList, setCheckedList] = useState<string[]>([]);
    // const [recordExpand, setRecordExpand] = useState<any>({})

    const token = useSelector(tokenSelect)
    const param = useParams()
    const sensorName = param.id

    const [nurseConfigList, setNurseConfigList] = useState<any>([{}])

    const [tempList, setTempList] = useState<any>([])

    // const nurseTableColumns = [{
    //     title: '序号',
    //     dataIndex: 'number',
    //     key: 'number',
    //     width: isMobile ? 50 : isMaxScreen ? 80 : 68,
    //     render: (text: string) => <span className='text-[#929EAB] text-sm'>{text}</span>
    // }, {
    //     title: '内容',
    //     dataIndex: 'content',
    //     key: 'content',
    //     render: (record: any) => {

    //         return (
    //             <div className='flex flex-col'>
    //                 <span className='text-[#3D3D3D] text-sm font-medium'>{formMap[record.id]}</span>
    //                 {record.type === 'TEXT' ? (

    //                     <Typography.Paragraph
    //                         className='text-[#929EAB] text-sm'
    //                         ellipsis={{
    //                             rows: 1,
    //                             expandable: 'collapsible',
    //                             symbol: (expanded) => {
    //                                 return expanded ? <img src={expand_img} alt="" className='rotate-180' /> :
    //                                     <img src={expand_img} alt="" />

    //                             },
    //                             expanded: recordExpand[record.id]?.expanded,
    //                             onExpand: (_, info) => setRecordExpand({
    //                                 ...recordExpand,
    //                                 [record.id]: {
    //                                     ...recordExpand[record.id],
    //                                     expanded: recordExpand[record.id]?.expanded,
    //                                 }
    //                             }),
    //                         }}
    //                     >
    //                         {record.value}
    //                     </Typography.Paragraph>
    //                 ) :
    //                     (

    //                         <Image.PreviewGroup
    //                             items={[
    //                                 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    //                                 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
    //                                 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    //                             ]}
    //                         >
    //                             <Image
    //                                 width='3rem'
    //                                 src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
    //                             />
    //                         </Image.PreviewGroup>
    //                     )}
    //             </div>
    //         )
    //     }
    // }, {
    //     title: '时间',
    //     dataIndex: 'time',
    //     key: 'time',
    //     render: (text: string) => <span className='text-sm text-[#929EAB]'>{text}</span>
    // }]
    // useEffect(() => {
    //     const element = document.getElementById('nurseTable')
    //     console.log(location.state, 'location.state')
    //     if (location.state?.length) {
    //         element?.scrollIntoView({ behavior: 'smooth' });
    //         setDataSource([...dataSource, ...location.state])
    //     }
    // }, []);
    // const normFile = (e: any) => {
    //     if (Array.isArray(e)) {
    //         return e;
    //     }
    //     return e?.fileList;
    // };


    // const plainOptions = ['1.助餐', '2.助浴', '3.更换床单', '4.更换药物', '5.敷药', '6.记录压疮位置与大小']
    // const checkAll = plainOptions.length === checkedList.length;
    // const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

    // const onChange = (list: string[]) => {
    //     setCheckedList(list);
    // };

    // const onCheckAllChange = (e: any) => {
    //     setCheckedList(e.target.checked ? plainOptions : []);
    // };

    // const handleRecordForm = (values: any) => {
    //     const _values = { ...values, integrated: checkedList }
    //     setRecordOpen(false)
    //     const _dataSource = []
    //     let _number = dataSource.length + 1
    //     for (let i in _values) {
    //         if (_values[i]?.length > 0) {

    //             _dataSource.push({
    //                 number: _number++,
    //                 content: {
    //                     id: i,
    //                     value: i === 'integrated' ? _values[i].join(' ') : _values[i],
    //                     type: i === 'state_picture' ? 'IMAGE' : 'TEXT',
    //                 },
    //                 time: dayjs().format('HH:mm')
    //             })
    //         }
    //     }
    //     form.resetFields()
    //     setCheckedList([])
    //     setDataSource([...dataSource, ..._dataSource])
    // }

    const getNurseConfigfist = () => {
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
            let nursingConfig = getNurseConfist(res);
            setNurseConfigList(nursingConfig)
        })
    }

    /**
     * 请求护理配置
     */
    useEffect(() => {
        getNurseConfigfist()
    }, [])

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
    //             data: JSON.stringify(nurseConfigList),
    //         },
    //     }).then((res) => {
    //         message.success('添加成功')
    //     })
    // }

    /**
     * 请求护理列表
     */


    // const [templateId, setTemplateId] = useState(0)
    // const [nursePersonTemplate, setNursePersonTemplate] = useState<any>([])

    // const context = useContext(DataContext)
    // console.log(context, 'context.............')
    // const { nursePersonTemplate, setNursePersonTemplate, getPersonTemplate } = context

    // useEffect(() => {
    //     getPersonTemplate()
    // }, [])

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
    //         if (template) {
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
    //         const nursingConfig = JSON.parse(res.data.nursingConfig || '{}')
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
    const addOpen = () => {
        if (isMobile) {
            setMobileAddNurseOpen(true)
            return
        }
        setRecordOpen(true)
    }
    // 请求数据护理模版
    // const [childData, setChildData] = useState<string>('');

    // const handleChildData = (data: string, val: any) => {
    //     setChildData(data);
    // };
    const [recordOpenNurseOpne, setRecordOpenNurseOpne] = useState()
    const nurseOpne = useSelector((state: any) => state.nurse.opne)
    const isDataList = useSelector((state: any) => state.nurse.isDataList)
    const roleId: any = localStorage.getItem('roleId')
    useEffect(() => {
        setRecordOpenNurseOpne(nurseOpne)
    }, [])

    return (
        <div className='w-[calc(30%-10px)] h-[full] md:w-full' style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {!isMobile && (
                <span className='flex items-center justify-between mb-[10px]'>
                    <span className='text-lg text-[#32373E] font-semibold'>护理</span>
                    <span className='cursor-pointer text-[#0072EF] text-sm font-medium'
                        onClick={() => {
                            console.log(isDataList, '.............................isDataListisDataList');

                            if (tempList.length === 0) {
                                if (roleId !== 1 || roleId !== 2 || roleId !== 0) {
                                    message.info(`${roleId == (1 || 2 || 0) ? '请先添加护理计划！' : "请先联系管理员添加护理计划！"}`)
                                    return
                                }
                            }
                            setOperNurseTitle('新增一次')
                            addOpen()
                        }}>新增一次</span>
                    {
                        recordOpen && <Recording type={operNurseTitle} recordOpen={recordOpen}
                            onClose={(is_suc: any) => {
                                setRecordOpen(false)
                                is_suc && getNurseConfigfist()
                            }}
                            currentNurse={currentNurse}
                            nurseConfigList={nurseConfigList || []}
                            sensorName={param.id}
                        ></Recording>
                    }
                </span>
            )}
            {
                mobileAddNurseOpen && <MobileAddNurse
                    visible={mobileAddNurseOpen}
                    type={operNurseTitle}
                    onClose={(is_suc: any) => {
                        setMobileAddNurseOpen(false)
                        is_suc && getNurseConfigfist()
                    }}
                    currentNurse={currentNurse}
                    nurseConfigList={nurseConfigList || []}
                    sensorName={param.id}
                />
            }
            <div ref={nurseRef} className='bg-[#fff] py-[15px] flex-1 md:w-[94%] md:rounded-[10px] md:my-[10px] md:mx-auto'
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
                <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0072EF' }}>
                    <CommonTitle name='护理项目' type={isMobile ? 'rect' : 'square'} style={{ marginBottom: 0 }} />
                    {isMobile && <span
                        style={{ display: 'flex', alignItems: 'center' }}
                        onClick={() => {
                            if (tempList.length === 0) {
                                if (roleId !== 1 || roleId !== 2 || roleId !== 0) {
                                    message.info(`${roleId == (1 || 2 || 0) ? '请先添加护理计划！' : "请先联系管理员添加护理计划！"}`)
                                    return
                                }
                            }
                            setMobileAddNurseOpen(true)
                            setOperNurseTitle('新增一次')
                        }}
                    >
                        <img style={{ width: "1.5rem", height: "1.5rem" }} src={jiaHao} alt="" />新增一次
                    </span>}
                </div>
                <div className="flex-1" style={{ overflow: 'auto', padding: '0 1rem' }}>
                    <PCNurseConfList list={nurseConfigList || []} sensorName={sensorName} getTempList={(list: any) => setTempList(list)} gotoFinshNurse={(item: any) => {
                        setCurrentNurse(item)
                        setOperNurseTitle('记录护理项目')
                        addOpen()
                    }} />
                </div>
                {/* {isMobile && (
                    <Button className='w-full h-[5vh] mb-[0.5rem] text-base' type='primary' onClick={() => navigate('/record', { state: { sensorName } })}>记录护理项目</Button>
                )}
                <Table rowClassName='nurseTableRow' id='nurseTable' rowKey="number" columns={nurseTableColumns} dataSource={dataSource} pagination={false} /> */}
                {/* <NurseTable type='user' currentTime={currentTime} childData={childData} sensorName={sensorName} getNurseTemplate={getPersonTemplate} templateId={templateId} data={nursePersonTemplate || []} /> */}
            </div>
        </div>
    )
}

export default NurseRecord;