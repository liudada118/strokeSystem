// src/DatePicker.tsx  
import { Button, Input, Popup } from 'antd-mobile';
import React, { useState } from 'react';
import dayjs from "dayjs";
import { message } from 'antd';

const years = Array.from({ length: 10 }, (_, i) => 2023 + i); // 2023 到 2032  
const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 到 12  
const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 到 31  
interface DatePickerProps {
    onConfirm: any;
    onCancel: any;
    visible: boolean;
}
const DatePicker = (props: DatePickerProps) => {
    const { onConfirm, onCancel, visible } = props
    const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
    const [startMonth, setStartMonth] = useState<number>(dayjs().month() + 1);
    const [startDay, setStartDay] = useState<number>(new Date().getDate() - 7);
    const [startHour, setStartHour] = useState<number>(new Date().getHours());
    const [startMinute, setStartMinute] = useState<number>(new Date().getMinutes());

    const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
    const [endMonth, setEndMonth] = useState<number>(dayjs().month() + 1);
    const [endDay, setEndDay] = useState<number>(new Date().getDate());
    const [endHour, setEndHour] = useState<number>(new Date().getHours());
    const [endMinute, setEndMinute] = useState<number>(new Date().getMinutes());
    const handleConfirm = () => {
        // if (!startYear && !startMonth && !startDay && !startHour && !startMinute && !endYear && !endMonth && !endDay && !endHour && !endMinute) {
        //     return message.info('开始时间和结束时间不能为空')
        // }
        onConfirm({
            startMills: new Date(`${startYear}-${startMonth}-${startDay} ${startHour}:${startMinute}`).getTime(),
            endMills: new Date(`${endYear}-${endMonth}-${endDay} ${endHour}:${endMinute}`).getTime(),
        })
    };
    const [value, setValue] = useState('')
    const [visibleValue, setVisibleValue] = useState(false)


    return (
        <Popup
            visible={visible}
            onMaskClick={() => onCancel(false)}
            bodyStyle={{
                borderRadius: "8px 8px 0 0",
                padding: "10px",
                paddingBottom: '30px',
                height: ' 25rem'
            }}
        >
            <div style={{ border: "none" }} className="flex justify-between items-center border-none text-[#000] px-4 pb-2 border-b">
                <button onClick={() => onCancel(false)}>
                    取消
                </button>
                <span className="text-lg font-medium">自定义时间</span>
                <button
                    style={{ color: "#0072EF", fontStyle: '600' }}
                    color="primary"
                    onClick={() => {
                        handleConfirm()
                    }}
                >
                    确定
                </button>

            </div>

            <div className="date-picker">
                <h2 className='text-[#32373E] font-medium text-lg ml-5 mt-4' >自定义时间区间</h2>
                <div className='flex mt-4 w-full justify-between'>
                    <Input className='bg-[red] rounded-6xl ml-5'
                        placeholder=' 请输入结束时间'
                        disabled
                        value={value}
                        clearable
                        style={{
                            background: '#F5F8FA',
                            marginLeft: "5px",
                            borderRadius: "2rem",
                            height: "2.6rem",
                            width: "44%"

                        }}
                        onChange={val => {
                            setValue(val)
                        }}
                    />     <Input className='bg-[red] rounded-6xl ml-5'
                        disabled
                        placeholder=' 请输入结束时间'
                        value={value}
                        clearable
                        style={{
                            background: '#F5F8FA',
                            marginLeft: "5px",
                            borderRadius: "2rem",
                            height: "2.6rem",
                            width: "44%"
                        }}
                        onChange={val => {
                            setValue(val)
                        }}
                    />
                </div>
                <div className="date-range">
                    <div className="date-selectors">
                        <h3 className='text-[#32373E] font-medium text-lg ml-5 mt-4'>开始时间</h3>
                        <div className='flex justify-around mt-3'>
                            <select
                                style={{ width: '100px', height: '2.6rem' }}
                                value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <select value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
                                {months.map(month => (
                                    <option key={month} value={month}>{month}月</option>
                                ))}
                            </select>
                            <select value={startDay} onChange={(e) => setStartDay(Number(e.target.value))}>
                                {days.slice(0, new Date(startYear, startMonth, 0).getDate()).map(day => (
                                    <option key={day} value={day}>{day}日</option>
                                ))}
                            </select>
                            <select value={startHour} onChange={(e) => setStartHour(Number(e.target.value))}>
                                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                    <option key={hour} value={hour}>{hour}时</option>
                                ))}
                            </select>
                            <select value={startMinute} onChange={(e) => setStartMinute(Number(e.target.value))}>
                                {Array.from({ length: 60 }, (_, i) => i).map(min => (
                                    <option key={min} value={min}>{min}分</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="date-selectors mt-4">
                        <h3 className='text-[#32373E] font-medium text-lg ml-5 mt-4'>结束时间</h3>

                        <div className='flex justify-around mt-3'>
                            <select style={{
                                // width: '200px',
                                height: '2.6rem',
                                overflowY: 'auto',
                                whiteSpace: 'nowrap'
                            }} value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <select value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))}>
                                {months.map(month => (
                                    <option key={month} value={month}>{month}月</option>
                                ))}
                            </select>
                            <select value={endDay} onChange={(e) => setEndDay(Number(e.target.value))}>
                                {days.slice(0, new Date(endYear, endMonth, 0).getDate()).map(day => (
                                    <option key={day} value={day}>{day}日</option>
                                ))}
                            </select>
                            <select value={endHour} onChange={(e) => setEndHour(Number(e.target.value))}>
                                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                    <option key={hour} value={hour}>{hour}时</option>
                                ))}
                            </select>
                            <select value={endMinute} onChange={(e) => setEndMinute(Number(e.target.value))}>
                                {Array.from({ length: 60 }, (_, i) => i).map(min => (
                                    <option key={min} value={min}>{min}分</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </Popup>
    );
};

export default DatePicker;  