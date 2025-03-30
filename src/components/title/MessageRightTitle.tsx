import { DatePicker, Dropdown, Input, Menu, Select, Space } from "antd";
import { useState } from "react";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs'
import { DownOutlined } from "@ant-design/icons";
import fang from '../../assets/images/容器@2x.png'
import './index.scss'
import { useGetWindowSize } from '../../hooks/hook'
const { RangePicker } = DatePicker;
interface messageParam {
    titleChangeGetMessage: Function,

}
const timeArr = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 86400000]

export const MessageRightTitle = (props: messageParam) => {
    const { titleChangeGetMessage } = props
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
    // 时间选择器
    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        const startMills = dayjs(dateStrings[0]).format('YYYY-MM-DD HH:mm:ss');
        const endMills = dayjs(dateStrings[1]).format('YYYY-MM-DD HH:mm:ss');
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
    return (
        <>
            {
                !windowSize ? <div className="messageTitlediv2">
                    <><Space style={{ width: "50rem", height: "39px", marginLeft: "10px" }} direction="vertical" size={12}>
                        <RangePicker
                            placeholder={['开始时间', '结束时间']}
                            onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                            style={{ width: "18rem", height: "39px", marginLeft: "10px" }}
                            showTime />
                    </Space><div className="messageTitlediv2_you">
                            <Select
                                className="MessageYiDOngTitlesearchSelect"
                                defaultValue={selectType}
                                style={{ width: 80, height: "1.5rem", border: 'none', }}
                                onChange={(e) => { setSelectType(e) }}
                                options={homeSelect}
                            />
                            <Input className="messageTitlediv2_you_inp"
                                allowClear
                                value={patientNameRoomNum}

                                onChange={(e) => {

                                    setpatientName(e.target.value)
                                    titleChangeGetMessage({
                                        patientName: selectType === 'patientName' ? patientNameRoomNum : "",
                                        roomNum: selectType === 'roomNum' ? patientNameRoomNum : ""
                                    })
                                }
                                }
                                placeholder="请输入姓名/床号" />
                            <img style={{ width: "1rem", height: "1rem", marginRight: "20px" }} src={fang} alt="" />
                        </div></>
                </div> : <div className="homeTitle  messageTitledivTitle" style={{ display: "flex", justifyContent: 'normal', fontWeight: "900", fontSize: "1rem" }}>JQHEALTHCARE</div>
            }
        </>
    )
}






