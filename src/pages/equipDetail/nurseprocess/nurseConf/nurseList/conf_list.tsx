import React, { useEffect, useState } from "react";
import { Empty, message, Image } from "antd";
import "./conf_list.scss";
import dayjs from "dayjs";
import instance from "@/api/api";
import { ImageViewer } from "antd-mobile";
import { showDataLIst } from '@/redux/Nurse/Nurse'
import { useDispatch } from "react-redux";
import useWindowSize from '@/hooks/useWindowSize'

export default function PCNurseList(props: any) {
    const { sensorName } = props;
    const [listData, setDataList] = useState<any>([]);
    const windowSize = useWindowSize()
    const isMobile = windowSize.isMobile;


    const dispatch = useDispatch();
    const getDataList = async () => {
        let res = null;
        if (props?.type == 'daEeport') {
            const currentDate = new Date();
            const yesterday = new Date(currentDate);
            yesterday.setDate(currentDate.getDate() - 1);
            const startOfYesterday = new Date(yesterday);
            startOfYesterday.setHours(0, 0, 0, 0);
            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setHours(23, 59, 59, 999);
            const timestampStart = startOfYesterday.getTime();
            const timestampEnd = endOfYesterday.getTime();
            res = await instance({
                url: `/sleep/nurse/getDayNurseData?did=${props.sensorName}&startTimeMillis=${timestampStart}&endTimeMillis=${timestampEnd}`,
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                    'token': localStorage.getItem('token')
                },
                // params: {
                //     did: props.sensorName,
                //     startTimeMillis: '1745337832000',
                //     endTimeMillis: '1745424232000'
                // }
            })
        } else {
            // 获取当前日期
            const currentDate = dayjs();
            // 设置开始时间为当天的 00:00
            const startTime = currentDate.startOf("day");
            // 设置结束时间为当天的 23:59
            const endTime = currentDate.endOf("day");
            // 获取开始和结束时间戳
            const startTimeMillis: any = startTime.valueOf();
            const endTimeMillis: any = endTime.valueOf();
            let templateData = (Array.isArray(props?.list) ? props?.list : []).map(
                (item: any) => {
                    const timestamp = dayjs().format("YYYY-MM-DD") + " " + item.time; // 拼接当天日期
                    const unixTimestamp = dayjs(timestamp, "YYYY-MM-DD HH:mm").valueOf(); // 转换成时间戳
                    return {
                        [unixTimestamp]: item.title,
                    };
                }
            );
            templateData = templateData.filter((item: any) => Object.keys(item).length > 0)
            res = await instance({
                method: "post",
                url: "/sleep/nurse/getDayNurseDataTempl",
                headers: {
                    "content-type": "application/json",
                    token: localStorage.getItem("token"),
                },
                data: {
                    did: sensorName,
                    startTimeMillis,
                    endTimeMillis,
                    templateData,
                },
            })
        }
        if (res && res.data.msg === "success") {
            dispatch(showDataLIst(true))
            const list: any = res.data.data.map((item: any, index: number) => {
                let dataList = JSON.parse(item.data || "{}");
                const timeItem = Array.isArray(props?.list)
                    ? props?.list.find((tItem: any) => {
                        const startTime = tItem.time;
                        const selectedTime = dayjs(+item.templateTime).format("HH:mm");
                        if (selectedTime === startTime) return true;
                    })
                    : [];

                if (timeItem) {
                    dataList = {
                        key: timeItem.key,
                        isTemp: true, // 标识是否是模版数据
                        ...dataList,
                        completionTime: +item.templateTime,
                    };
                }
                delete item.data;
                try {
                    dataList.uploadImage = JSON.parse(dataList.uploadImage);
                } catch (err) {
                    dataList.uploadImage = dataList.uploadImage
                        ? [dataList.uploadImage]
                        : [];
                }
                try {
                    if (!Array.isArray(dataList.uploadImage)) {
                        dataList.uploadImage = dataList.uploadImage.includes("http")
                            ? [dataList.uploadImage]
                            : [];
                    }
                } catch (err) { }
                return {
                    ...item,
                    ...dataList,
                    title: item.templateTitle || dataList.nurseProject,
                    status: props.type == 'daEeport' ? true : item.status
                };
            });

            setDataList(list);
            props.getTempList && props.getTempList(list);
        }

    };
    useEffect(() => {
        if (props?.type !== 'daEeport') {
            props?.list.length > 0 && getDataList();
        }
    }, [props.list]);
    useEffect(() => {
        if (props?.type === 'daEeport') {
            getDataList();
        }
    }, []);
    const [visible, setVisible] = useState(false);
    const [imgData, setImgData] = useState<any>([]);
    const [i, setIndex] = useState(0)
    return (
        <div className="nurse_scroll1">
            <div className="pc_nurse_conf_list">
                <div className={`${isMobile ? 'list_item' : 'list_itemPc'}`}>
                    < p style={{ fontSize: isMobile ? '1.2rem' : "0.8rem" }}>时间</p>
                    <p style={{ fontSize: isMobile ? '1.2rem' : "0.8rem" }}>护理任务</p>
                    <p style={{ fontSize: isMobile ? '1.2rem' : "0.8rem", color: '#000' }}>状态</p>
                </div>
                {listData.length > 0
                    ? listData
                        .sort((a: any, b: any) => {
                            return Number(a.completionTime) - Number(b.completionTime);
                        })
                        .map((item: any, index: number) => {
                            return (
                                <div
                                    key={"list_" + index}
                                    className={` ${isMobile ? 'list_item' : 'list_itemPc'} is_line ${item.status ? "finsh" : ""
                                        }`}
                                >
                                    <p style={{ fontSize: isMobile ? '1.2rem' : "0.8rem" }}>
                                        <span>{dayjs(item.completionTime).format("HH:mm")}</span>
                                        <span
                                            className={`${index === listData.length - 1 ? "" : "is_line"
                                                } index_box h-full`}
                                        >
                                            <i>{index + 1}</i>
                                        </span>
                                    </p>
                                    <p style={{ fontSize: isMobile ? '1.2rem' : "0.8rem" }}>
                                        <span
                                            style={{ color: !item.status ? "#929EAB" : "#32373E", fontSize: isMobile ? '1.1rem' : "" }}
                                        >
                                            {item.title}
                                        </span>
                                        <span>{item.notes}</span>
                                        <span
                                            onClick={() => {
                                                if (isMobile) {
                                                    setImgData(item.uploadImage);
                                                    // setVisible(true);
                                                }
                                            }}
                                            className={`${!isMobile ? 'pc_nurse_conf_list_img' : ''}`}
                                        >
                                            {item.uploadImage.map((item: any, index: number) => {
                                                return isMobile ? <img onClick={() => {
                                                    setIndex(i => i + index)
                                                    // setImgData(item.uploadImage);
                                                    setVisible(true);
                                                }} key={item} src={item} alt="" /> : <Image
                                                    src={item}
                                                />
                                            })}
                                        </span>
                                    </p>
                                    <p style={{ alignItems: props.type == 'daEeport' ? 'normal' : 'center' }}>
                                        <span
                                            style={{
                                                color:
                                                    props.operType === "init" ? "#ffff" : "#929EAB",
                                                cursor: !item.status ? "pointer" : "",
                                            }}
                                            onClick={() => {
                                                !item.status && props.gotoFinshNurse && props.gotoFinshNurse(item);
                                            }}
                                        >
                                            {item.status ? "已完成" : "待完成"}
                                        </span>
                                    </p>
                                </div>
                            );
                        })
                    : ""}
                {(imgData || []).length > 1 ? (
                    <ImageViewer.Multi
                        key={i}
                        images={imgData}
                        visible={visible}
                        defaultIndex={i}
                        onClose={() => {
                            setVisible(false);
                            setIndex(0)
                        }}
                    />
                ) : (
                    <ImageViewer
                        image={imgData}
                        visible={visible}
                        onClose={() => {
                            setVisible(false);
                        }}
                    />
                )}
                {listData.length === 0 && (
                    <div className={`${props?.type === 'daEeport' ? 'empty_nurse_box_daEeport' : 'empty_nurse_box h-[10rem]'}`}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={`${props?.type === 'daEeport' ? '暂无报告' : "暂无护理计划，请添加"}`}
                        />
                    </div>
                )}
            </div>
        </div >
    );
}
