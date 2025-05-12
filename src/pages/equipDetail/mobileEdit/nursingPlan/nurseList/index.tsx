import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import shijian1 from '@/assets/images/shijian.png'
import nurseSelectItemDelete from '@/assets/image/nurseSelectItemDelete.png'
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

  // useEffect(() => {

  //   // 定义处理函数
  //   const handleResize = () => {
  //     const html = document.getElementsByTagName("html");
  //     html[0].style.fontSize = '14px'
  //   };

  //   handleResize();

  //   // 添加事件监听器
  //   window.addEventListener('resize', handleResize);

  //   // 组件卸载时移除监听器
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);
  const handleVisibilityChange = () => {
    const html = document.getElementsByTagName("html")[0];
    console.log("页面状态变化：", document.hidden);

    if (!document.hidden) {
      // 当页面重新显示在前台时
      html.style.fontSize = '16px';
      // window.location.reload(); // 刷新页面
    }
  };

  useEffect(() => {
    handleVisibilityChange(); // 初始化时执行一次
    // 添加事件监听器
    window.addEventListener('resize', handleVisibilityChange);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleVisibilityChange);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  return (
    <div className={'nurse_scroll'}>
      <div className={'nurse_list'}>
        <div className="list_item">
          {columsList.map((item, index) => {
            if (props.operType !== "add" && item.title === "删除") return "";
            return <p key={"title_" + index} style={{ margin: item.title == '删除' ? '0 0.25rem' : "" }}>{item.title}</p>;
          })}
        </div>
        {props.list
          .sort((a: any, b: any) => {
            return Number(a.key) - Number(b.key);
          })
          .map((item: any, index: number) => {
            return (
              <div key={"list_" + index} className="list_item is_line">
                <p style={{ display: "flex", alignItems: "center", }}>
                  <span style={{ fontWeight: "500" }}>{item.time}</span>
                  <span>{index + 1}</span>
                </p>
                <p className="flex items-center" style={{ borderBottom: "1px #E6EBF0 solid", fontWeight: "500" }}>
                  <img className='w-[1rem] h-[1rem]  mr-2' src={shijian1} alt="" />
                  {item.title}
                </p>
                <p style={{ borderBottom: "1px #E6EBF0 solid", }}>
                  <span style={{ borderBottom: "1px silid #D1D9E1", color: props.operType === "init" ? "#ffff" : "#929EAB" }}>
                    {item.status || item.status === "todo"
                      ? "待完成"
                      : "已完成"}
                  </span>
                </p>
                {props.operType === "add" && (
                  <p className="flex items-center justify-center flex-col mx-1 box-border" style={{ borderBottom: "1px #E6EBF0 solid" }} onClick={() => props.delTemp(item)}>
                    <img style={{ width: '1rem', height: "1rem" }} src={nurseSelectItemDelete} alt="" />
                    删除
                  </p>
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
    </div >
  );
}
