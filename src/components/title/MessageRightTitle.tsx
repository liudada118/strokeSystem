import { ConfigProvider, DatePicker, Input, Select } from "antd";
import { useState } from "react";
import zhCN from 'antd/locale/zh_CN';
import searchImg from "@/assets/image/search.png";
import dayjs from 'dayjs'
import { instance } from "@/api/api";
import { useSelector } from "react-redux";
import { phoneSelect, tokenSelect } from "@/redux/token/tokenSlice";
import { alarmValueToType, msgToinfoStr } from "@/utils/messageInfo";

const { RangePicker } = DatePicker;

const messageSelect = [
    { value: 'patientName', label: '姓名' },
    { value: 'roomNum', label: '床号' },
]

const alarmType = [
    {
        value: 0,
        label: '离床提醒',
    },
    {
        value: 1,
        label: '坠床提醒',
    },
    {
        value: 2,
        label: '坐起提醒',
    },
    {
        value: 3,
        label: '护理超时',
    },
    {
        value: 4,
        label: '离线提醒',
    },
    {
        value: 5,
        label: '其它提醒',
    },
]

interface messageParam {
    titleChangeGetMessage: Function
}

export const MessageRightTitle = (props: messageParam) => {
    const { titleChangeGetMessage } = props
    const phone = useSelector(phoneSelect)
    const [inputValue, setInput] = useState('')
    const [alarmValue, setAlarmValue] = useState(0)
    const [selectType, setSelectType] = useState('patientName');
    const [timeArr, setTimeArr] = useState<any>([new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 86400000])
    const onOk = (e: any) => {
        console.log(e)
    }
    const onSearch = (value: string) => {
        console.log('search:', value);
    };


    /**
     * 
     * @param value 报警类型修改
     * 请求服务器刷新数据
     */
    const onAlarmTypeChange = (value: string) => {
        setAlarmValue(Number(value))
        const param = {
            phone: phone,
            [selectType]: inputValue,
            pageSize: 10,
            types: alarmValueToType(Number(value)),
            startMills: timeArr[0],
            endMills: timeArr[1],
        }
        titleChangeGetMessage(param)
    };

    /**
     * 
     * @param e 输入框修改
     * 请求服务器刷新数据
     */
    const searchValue = (e: any) => {
        const value = e.target.value
        setInput(value)
        const param = {
            phone: phone,
            [selectType]: value,
            pageSize: 10,
            types: alarmValueToType(alarmValue),
            startMills: timeArr[0],
            endMills: timeArr[1],

        }
        titleChangeGetMessage(param)
    }


    /**
     * 
     * @param value 时间选择框修改
     * @param dateString 
     * 请求服务器刷新数据
     */
    const timeChange = (value: any, dateString: any) => {
        const stamp1 = new Date(dateString[0]).getTime()
        const stamp2 = new Date(dateString[1]).getTime()
        setTimeArr([stamp1, stamp2])
        const param = {
            phone: phone,
            [selectType]: inputValue,
            pageSize: 10,
            types: alarmValueToType(alarmValue),
            startMills: stamp1,
            endMills: stamp2,
        }
        titleChangeGetMessage(param)
    }

    return (
        <>
            <div className="searchInput">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        searchValue(e);
                    }}
                />
                <img src={searchImg} alt="" />
                <Select
                    className="searchSelect"
                    defaultValue={selectType}
                    style={{ width: 120 }}
                    onChange={(e) => { setSelectType(e) }}
                    options={messageSelect}
                />
            </div>
            <Select
                showSearch
                placeholder="Select a person"
                optionFilterProp="label"
                defaultValue={'离床提醒'}
                onChange={onAlarmTypeChange}
                onSearch={onSearch}
                // 离床提醒、坠床提醒、坐起提醒、护理超时、离线、其它
                options={alarmType}
            />
            <ConfigProvider locale={zhCN}>
                <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    onChange={timeChange}
                    onOk={onOk}
                />
            </ConfigProvider>
        </>
    )
}
