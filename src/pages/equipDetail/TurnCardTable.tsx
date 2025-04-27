import React, { useEffect, useState } from "react";
import CommonTitle from '../../components/CommonTitle'
import { Table } from "antd";
import './message.module.scss'
import { instance } from "@/api/api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { tokenSelect } from "@/redux/token/tokenSlice";
import dayjs from "dayjs";
import { posNumToposText } from "@/utils/dataToFormat";
import { selectEquipBySensorname } from '@/redux/equip/equipSlice'
interface CardItem {
    label: string;
    value: any;
    unit: string;
}

// const turnTableDatasource: {[key: string]: unknown}[] = [{
//     key: '1',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: false,
//     top: true,
//     right: false,
//     nurser: '张爱铃',
// },{
//     key: '2',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: false,
//     top: true,
//     right: false,
//     nurser: '张爱铃',
// },{
//     key: '3',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: false,
//     top: false,
//     right: true,
//     nurser: '张爱铃',
// },{
//     key: '4',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: false,
//     top: true,
//     right: false,
//     nurser: '张爱铃',
// },{
//     key: '5',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: false,
//     top: false,
//     right: true,
//     nurser: '张爱铃',
// },{
//     key: '6',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: true,
//     top: false,
//     right: false,
//     nurser: '张爱铃',
// },{
//     key: '7',
//     plan: '08:00',
//     actual_exa: '08:01',
//     left: false,
//     top: false,
//     right: true,
//     nurser: '张爱铃',
// }]
interface TurnCardTableProps {
    isMobile?: boolean;
}
const TurnCardTable: (props: TurnCardTableProps) => React.JSX.Element = (props) => {
    const { isMobile = false } = props;

    const [turnTableDatasource, setTurnTableDatasource] = useState<any>([])
    const [dataList, setDataList] = useState<any>({})

    const param = useParams()
    const sensorName = param.id
    const token = useSelector(tokenSelect)
    const [flipbodyData, setFlipbodyData] = useState([])
    const getNurse = () => {
        instance({
            method: "post",
            url: "/sleep/nurse/getMatrixListByName",
            params: {
                deviceName: sensorName,
                scheduleTimePeriod: 2 * 60 * 60 * 1000,
                startTimeMillis: new Date(new Date().toLocaleDateString()).getTime() + 0,
                endTimeMills: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000
            },
        }).then((res) => {

            const flipbodyData = res.data.flipbodyData
            const dataList: any = Object.values(res.data.flipbodyData).filter((item: any, index) => item.status >= 3).length
            setFlipbodyData(dataList)
        }).catch((err) => {
            // message.error('')
        });
    }
    console.log(flipbodyData, '.............................flipbodyDataflipbodyDataflipbodyData');

    const turnAroundCard: CardItem[] = [{
        label: '翻身次数',
        value: `${dataList.flipBodyCount}`,
        unit: '次'
    }, {
        label: '有效翻身',
        value: `${dataList.effectiveFlipBodyCount}`,
        unit: '次/分'
    }, {
        label: '翻身超时',
        value: `${dataList.flipBodyTimeoutCount}`,
        unit: '次'
    }]
    const commonClass = 'inline-block w-[20px] h-[20px] md:w-[12px] md:h-[12px] rounded-full'
    const turnTableColumns = [{
        title: '翻身计划',
        dataIndex: 'plan',
        key: 'plan',
        width: 10,
    }, {
        title: '右侧卧',
        dataIndex: 'left',
        key: 'left',
        width: 70,
        render: (text: boolean) => {
            if (text) {
                return <span className={['bg-[#6C7784]', commonClass].join(' ')} />
            } else {
                return <span className={['bg-[#fff] border border-[#D1D9E1]', commonClass].join(' ')} />
            }
        }
    }, {
        title: '仰卧',
        dataIndex: 'top',
        key: 'top',
        width: 50,
        render: (text: boolean) => {
            if (text) {
                return <span className={['bg-[#6C7784]', commonClass].join(' ')} />
            } else {
                return <span className={['bg-[#fff] border border-[#D1D9E1]', commonClass].join(' ')} />
            }
        }
    }, {
        title: '左侧卧',
        dataIndex: 'right',
        key: 'right',
        width: 70,
        render: (text: boolean) => {
            if (text) {
                return <span className={['bg-[#6C7784]', commonClass].join(' ')} />
            } else {
                return <span className={['bg-[#fff] border border-[#D1D9E1]', commonClass].join(' ')} />
            }
        }
    }, {
        title: '护理员',
        dataIndex: 'nurser',
        key: 'nurser',
        width: 80,
        render: (text: string) => <span className='whitespace-nowrap'>{text}</span>
    }]
    const columnWidth = turnTableColumns.map(item => item.width).reduce((total, item) => total + item)



    useEffect(() => {
        getNurse()
        instance({
            method: "get",
            url: "/sleep/nurse/getRecords",
            params: {
                deviceName: sensorName,
                startTime: new Date(new Date().toLocaleDateString()).getTime(),
                endTime: new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 - 1) * 60 * 1000,
                pageNum: 1,
                pageSize: 99
            },
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
        }).then((res: any) => {

            setDataList({
                flipBodyCount: res.data.flipBodyCount,
                effectiveFlipBodyCount: res.data.effectiveFlipBodyCount,
                flipBodyTimeoutCount: res.data.flipBodyTimeoutCount
            })
            const record = res.data.page.records//.map((item :any )=> item.posture)
            let obj = {
                key: '1',
                plan: '08:00',
                actual_exa: '08:01',
                left: false,
                top: true,
                right: false,
                nurser: '张爱铃',
            }
            let newArr: any = []
            record.forEach((item: any, index: any) => {
                let obj = {
                    key: index,
                    plan: dayjs(item.timeMills).format('HH:mm'),
                    actual_exa: dayjs(item.timeMillsEnd).format('HH:mm'),
                    left: posNumToposText(item.posture) == 'left',
                    top: posNumToposText(item.posture) == 'center',
                    right: posNumToposText(item.posture) == 'right',
                    nurser: item.chargeMan,
                }
                newArr.push(obj)
            })
            setTurnTableDatasource(newArr)
        }).catch((err) => [
            console.log(err)
        ])
    }, [])

    return (

        <div className='bg-[#fff] md:w-[94%] md:rounded-[10px] md:my-[10px] md:mx-auto p-[25px] md:p-[1rem]'>
            <CommonTitle name='翻身卡' type={isMobile ? 'rect' : 'square'} />
            <div className='flex px-[30px] pb-[30px] md:pb-[1rem] md:px-[1rem] w-full justify-between'>
                {turnAroundCard.map((item, index) => (
                    <div
                        key={item.label}
                        className={`flex ${index !== turnAroundCard.length - 1 && 'w-[28%]'} shrink-0 items-center justify-between`}>
                        <div className='flex flex-col'>
                            <span className='text-[#929EAB] md:text-[#3E444C] text-sm font-medium'>{item.label}</span>
                            <span>
                                <span className='text-[#32373E] font-semibold text-2xl'>{item.value}</span>
                                <span className='text-sm text-[#929EAB] md:text-[#6C7784] ml-[2px]'>{item.unit}</span>
                            </span>
                        </div>
                        {(index !== turnAroundCard.length - 1 && !isMobile) &&
                            <span className='w-[2px] h-[41%] bg-[#bfbfbf] mr-[15px]' />}
                    </div>
                ))}
            </div>
            <Table
                rowKey="key"
                rowHoverable={false}
                columns={isMobile ? turnTableColumns : turnTableColumns.map(item => ({
                    title: item.title,
                    dataIndex: item.dataIndex,
                    key: item.key,
                    render: item.render
                }))}
                dataSource={turnTableDatasource}
                pagination={false}
                rowClassName='darkRow'
                scroll={!isMobile ? { y: 385 } : { x: columnWidth }} />
        </div>
    )
}

export default TurnCardTable;