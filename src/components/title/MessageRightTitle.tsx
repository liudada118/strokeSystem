import { DatePicker, Dropdown, Input, Menu, Select, Space, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs'
import { DownOutlined } from "@ant-design/icons";
import fang from '../../assets/images/容器@2x.png'
import './index.scss'
import { useGetWindowSize } from '../../hooks/hook'
import useDebounce from '../../utils/publicInput'
import logg from '@/assets/image/loog.png'
import duration from 'dayjs/plugin/duration'; // 需安装 duration 插件
const { RangePicker } = DatePicker;
dayjs.extend(duration); // 启用 duration 插件
interface messageParam {
    titleChangeGetMessage: Function,
    titleKey?: string
}
const timeArr = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 86400000]

export const MessageRightTitle = (props: messageParam) => {
    const { titleChangeGetMessage, titleKey } = props
    const [timeArr, setTimeArr] = useState<any>([new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 86400000])
    // 搜索框
    const [patientNameRoomNum, setpatientName] = useState<any>('')
    const storedData = localStorage.getItem('dataList');
    const dataList = storedData ? JSON.parse(storedData) : [];
    const windowSize = useGetWindowSize()
    //去重
    function unique(list: any) {
        if (!Array.isArray(list)) {
            console.log('type error!')
            return
        }
        var array = [];
        for (var i = 0; i < list.length; i++) {
            if (array.indexOf(list[i]) === -1) {
                array.push(list[i])
            }
        }
        return array;
    }
    const patientName: any = []
    const roomNum: any = []
    dataList.forEach((item: any) => {
        patientName.push(item.patientName)
        roomNum.push(item.roomNum)
    })
    const [startMills, setStartMills] = useState<any>(0)
    const [endMills, setEndMills] = useState<any>(0)
    // 时间选择器
    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        const startMills = dayjs(dateStrings[0]).format('YYYY-MM-DD HH:mm:ss');
        const endMills = dayjs(dateStrings[1]).format('YYYY-MM-DD HH:mm:ss');
        setStartMills(new Date(startMills).valueOf())
        setEndMills(new Date(endMills).valueOf())
        titleChangeGetMessage({
            startMills: dateStrings[0] ? new Date(startMills).valueOf() : timeArr[0],
            endMills: dateStrings[1] ? new Date(endMills).valueOf() : timeArr[1]
        })
    };
    const homeSelect: any = [
        { value: 'patientName', label: '姓名' },
        { value: 'roomNum', label: '床号' },
    ]
    const [selectType, setSelectType] = useState('patientName');
    const [timeoutId, setTimeoutId] = useState<any>(null);
    const debouncedPatientNameRoomNum = useDebounce(patientNameRoomNum, 1000);
    const handleInputChange = (value: any) => {
        setpatientName(value);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        if (selectType === 'patientName') {
            const newTimeoutId = setTimeout(() => {
                titleChangeGetMessage({
                    patientName: value,
                    pageNum: 1,
                    pageSize: 10,
                    startMills: startMills !== 0 ? startMills : timeArr[0],
                    endMills: endMills !== 0 ? endMills : timeArr[1],
                });
            }, 300);
            setTimeoutId(newTimeoutId);
        } else if (selectType === 'roomNum') {
            const newTimeoutId = setTimeout(() => {
                titleChangeGetMessage({

                    pageNum: 1,
                    pageSize: 10,
                    roomNum: value,
                    startMills: startMills !== 0 ? startMills : timeArr[0],
                    endMills: endMills !== 0 ? endMills : timeArr[1],
                });
            }, 300);
            setTimeoutId(newTimeoutId);
        }
    };
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);
    const [loog, setLoog] = useState('JQHEALTHCARE')


    const disabledDate = (current: any) => {
        const now = dayjs();
        return current && current > now.endOf('day');
    };
    // 动态禁用时间（禁用未来时间）
    const disabledTime = (current: any, type: any) => {
        const now = dayjs();
        if (!current) return {};

        // 获取当前时间的小时和分钟
        const currentHour = now.hour();
        const currentMinute = now.minute();

        // 当选择开始时间时（仅对 RangePicker 有效）
        if (type === 'start') {
            return {
                disabledHours: () => {
                    const hours = [];
                    for (let i = 0; i < 24; i++) {
                        if (i > currentHour) hours.push(i);
                    }
                    return hours;
                },
                disabledMinutes: (selectedHour: any) => {
                    if (selectedHour === currentHour) {
                        return Array.from({ length: 60 }).map((_, i) => i > currentMinute ? i : -1);
                    }
                    return [];
                }
            };
        }

        // 当选择结束时间时（需配合开始时间逻辑）
        if (type === 'end') {
            const start = current.clone().startOf('day');
            return {
                disabledHours: () => {
                    const hours = [];
                    for (let i = 0; i < 24; i++) {
                        if (i < start.hour()) hours.push(i);
                    }
                    return hours;
                },
                disabledMinutes: (selectedHour: any) => {
                    if (selectedHour === start.hour()) {
                        return Array.from({ length: 60 }).map((_, i) => i < start.minute() ? i : -1);
                    }
                    return [];
                }
            };
        }

        return {};
    };
    return (
        <>
            {
                !windowSize ?
                    <div className="messageTitlediv2">
                        <><Space style={{ width: "50rem", height: "2.07rem", marginLeft: "0.7rem" }} direction="vertical" size={12}>
                            <ConfigProvider locale={zhCN}>
                                <RangePicker

                                    disabledDate={disabledDate}
                                    disabledTime={disabledTime}
                                    format="YYYY-MM-DD HH:mm"       // 控制显示格式
                                    showSecond={false}   // 隐藏秒
                                    placeholder={['开始时间', '结束时间']}
                                    showNow={true}
                                    onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                                    style={{ width: "20rem", height: "2.07rem", marginLeft: "0.7rem" }}
                                    showTime />
                            </ConfigProvider>
                        </Space>
                            <div className="messageTitlediv2_you">
                                <Select
                                    className="MessageYiDOngTitlesearchSelect"
                                    defaultValue={selectType}
                                    style={{ width: 80, height: "1.5rem", border: 'none important', }}
                                    onChange={(e) => { setSelectType(e) }}
                                    options={homeSelect}
                                />
                                <Input className="messageTitlediv2_you_inp"
                                    allowClear
                                    value={patientNameRoomNum}
                                    // onBlur={((e: any) => {
                                    //     setpatientName(e.target.value)
                                    //     titleChangeGetMessage({
                                    //         patientName: selectType === 'patientName' ? patientNameRoomNum : "",
                                    //         roomNum: selectType === 'roomNum' ? patientNameRoomNum : ""
                                    //     })
                                    // })}
                                    onChange={(e: any) => handleInputChange(e.target.value)}
                                    placeholder="请输入姓名/床号" />
                                {/* <img style={{ width: "1rem", height: "1rem", marginRight: "20px" }} src={fang} alt="" /> */}
                            </div></>
                    </div>
                    :
                    <div className="homeTitle  messageTitledivTitle" style={{ display: "flex", justifyContent: 'normal', fontWeight: "900", }}>
                        {loog}
                    </div>
            }
        </>
    )
}






