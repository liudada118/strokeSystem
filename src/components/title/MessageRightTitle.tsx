import {  DatePicker, Dropdown, Input, Menu, Space } from "antd";
import { useState } from "react";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs'
import { DownOutlined } from "@ant-design/icons";
import fang from '../../assets/images/容器@2x.png'
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
    const [name, setName] = useState('')
    const menu = (
        <Menu z-index onClick={(e) => dingtalkCircleFilled(e)}>
            <>
                <Menu.SubMenu key={`sub1-1`} title='姓名'>
                    {dataList.map((item: any, index: number) => (
                        <Menu.Item onClick={() => SubMenu(item.patientName)} key={`name-${index}`}>{item.patientName}</Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu key={`sub2-2`} title="床号">
                    {dataList.map((item: any, index: number) => (
                        <Menu.Item onClick={() => SubMenu(item.roomNum)} key={`name1-${index}`}>{item.roomNum}</Menu.Item>
                    ))}
                </Menu.SubMenu>
            </>
        </Menu>
    );
    // 记录
    const dingtalkCircleFilled = (e: any) => {

        setName(e.keyPath[1])
    }
    const onChang = (e: any) => {
      
        setpatientName(e.target.value)
    }

    const SubMenu = (item: any) => {
        setpatientName(item)
    }
    const dian = () => {
        console.log(name, 'name')
        titleChangeGetMessage({
            patientName: name === 'sub1-1' ? patientNameRoomNum : '',
            roomNum: name === 'sub2-2' ? patientNameRoomNum : ''
        })
    }

    // 时间选择器
    const handleDateChange = (dates: any, dateStrings: [string, string]) => {

        const startMills = dayjs(dateStrings[0]).format('YYYY-MM-DD HH:mm:ss');
        const endMills = dayjs(dateStrings[1]).format('YYYY-MM-DD HH:mm:ss');
        titleChangeGetMessage({
            startMills: dateStrings[0] ? new Date(startMills).valueOf() : timeArr[0],
            endMills: dateStrings[1] ? new Date(endMills).valueOf() : timeArr[1]
        })

    };
    return (

        <div className="messageTitlediv2">
            <Space style={{ width: "296px", height: "39px", marginLeft: "10px" }} direction="vertical" size={12}>
                <RangePicker
                    placeholder={['开始时间', '结束时间']}

                    onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                    style={{ width: "296px", height: "39px", marginLeft: "10px" }}
                    showTime
                />
            </Space>

            <div className="messageTitlediv2_you">
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link " style={{ display: "flex", width: "75px", marginLeft: "10px" }} onClick={(e) => e.preventDefault()}>
                        {
                            name === 'sub2-2' ? '床号' : '姓名'
                        } <DownOutlined />
                    </a>
                </Dropdown>

                <Input className="messageTitlediv2_you_inp"
                    allowClear
                    value={patientNameRoomNum}
                    //  setpatientName(e.target.value)
                    onChange={(e) => onChang(e)}
                    placeholder="请输入姓名/床号" />
                <img onClick={dian} style={{ width: "24px", height: "24px", marginRight: "20px" }} src={fang} alt="" />
            </div>
        </div>

    )
}






