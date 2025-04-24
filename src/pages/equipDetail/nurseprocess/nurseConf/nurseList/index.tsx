
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import shijian1 from '@/assets/images/shijian.png'
import { Empty } from 'antd';
import nurseItemSelect from '../../../../../assets/image/nurseSelectItemDelete.png'
import "./index.scss";

export default function PCNurseList(props: any) {
    const { extParams = {} } = props
    const columsList = [
        {
            title: "时间",
            dataIndex: "time",
            tip: "按时间自动排序",
        },
        {
            title: "护理任务",
            dataIndex: "title",
        },
        {
            title: "状态",
            dataIndex: "status",
        },
        {
            title: "删除",
            dataIndex: "del",
        },
    ];
    console.log(extParams, '.......11111......extParamsextParams');

    return (
        <div className="nurse_scroll">
            <div className="pc_nurse_list">
                <div className={`list_item ${extParams.className}`}>
                    <p className="flex items-end">时间
                        {/* <span className="text-[0.5rem] pb-[0.1rem] pl-[0.1rem] " style={{ fontWeight: "normal" }}>按时间自动排序</span> */}
                    </p>
                    <div className="content">
                        <p>护理任务</p>
                        <p className={`${props.operType === "add" ? 'is-radius' : ''}`}>状态</p>
                        {
                            props.operType === "add" &&
                            <p>删除</p>
                        }
                    </div>
                </div>
                {(props ? props.list || [] : []).length > 0 ? (props ? props.list || [] : [])
                    .sort((a: any, b: any) => {
                        return Number(a.key) - Number(b.key);
                    })
                    .map((item: any, index: number) => {
                        return (
                            <div key={"list_" + index} className={`list_item flex is_line ${extParams.className}`}>
                                <p className="flex ">
                                    <span>{item.time === "Invalid Date" ? '01:22' : item.time}</span>
                                    <span className={`${index === props.list.length - 1 ? '' : 'is_line'} index_box h-full`}>
                                        <i>{index + 1}</i>
                                    </span>
                                </p>
                                <div className="content">
                                    <p style={{ display: 'flex', }}>
                                        <span><img className='w-[1rem] h-[1rem] mr-3' src={shijian1} alt="" /></span>
                                        <span>
                                            {item.title}
                                        </span>
                                    </p>
                                    <p className="">
                                        <span style={{ color: props.operType === "init" ? "#ffff" : "#929EAB" }} onClick={() => {
                                            props.gotoFinshNurse && props.gotoFinshNurse(item)
                                        }}>
                                            {item.status || item.status === "todo"
                                                ? "待完成"
                                                : "已完成"}
                                        </span>
                                    </p>
                                    {props.operType === "add" && (
                                        <p style={{ color: "#1777ff" }} className="flex" onClick={() => props.delTemp({ ...item, index })}>
                                            <img src={nurseItemSelect} alt="" className="w-[1rem] h-[1rem]" />
                                            删除
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    }) : ''}
                {
                    props && (props.list || []).length === 0 && <div className="empty_nurse_box h-[10rem]">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无护理计划，请添加" />
                    </div>
                }
            </div>
        </div>
    );
}
