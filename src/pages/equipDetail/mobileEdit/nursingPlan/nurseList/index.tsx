import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import shijian1 from '@/assets/images/shijian.png'

import { Picker, Popup, Empty } from "antd-mobile";
// import "./index.css";
import './index.scss'

export default function NurseList(props: any) {
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

  return (
    <div className={'nurse_scroll'}>
      <div className={'nurse_list'}>
        <div className="list_item">
          {columsList.map((item, index) => {
            if (props.operType !== "add" && item.title === "删除") return "";
            return <p key={"title_" + index}>{item.title}</p>;
          })}
        </div>
        {props.list
          .sort((a: any, b: any) => {
            return Number(a.key) - Number(b.key);
          })
          .map((item: any, index: number) => {
            return (
              <div key={"list_" + index} className="list_item is_line">
                <p style={{ display: "flex" }}>
                  <span>{item.time}</span>
                  <span>{index + 1}</span>
                </p>
                <p className="flex items-center">
                  <img className='w-[1rem] h-[1rem] mt-[0.3rem] mr-3' src={shijian1} alt="" />{item.title}</p>
                <p>
                  <span style={{ color: props.operType === "init" ? "#ffff" : "#929EAB" }}>
                    {item.status || item.status === "todo"
                      ? "待完成"
                      : "已完成"}
                  </span>
                </p>
                {props.operType === "add" && (
                  <p onClick={() => props.delTemp(item)}>删除</p>
                )}
              </div>
            );
          })}

        {
          props.list.length === 0 && <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description='暂无护理计划，请添加'
          />
        }
      </div>
    </div>
  );
}
