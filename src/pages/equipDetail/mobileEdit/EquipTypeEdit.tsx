import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Instancercv } from "@/api/api";
import { fetchEquips } from '@/redux/equip/equipSlice'
import { useDispatch } from 'react-redux'
export default function EquipTypeEdit(props?: any) {
  const roleId: any = localStorage.getItem("roleId");
  const isAdmin = +roleId === 1 || +roleId === 2 || + roleId === 0;
  const param = useParams();
  let navigate = useNavigate();
  const location = useLocation();
  const sensorName = param.id || location.state.sensorName;
  const equipInfo = useSelector((state) =>
    selectEquipBySensorname(state, sensorName)
  );
  const [equipTypeInfo, setEquipTypeInfo] = useState({}) as any;
  const dispale = useDispatch();
  console.log(
    equipInfo,
    sensorName,
    "........................SettingMobileSettingMobileSettingMobileSettingMobile"
  );
  const equipType: any = [
    {
      text: "床垫类型",
      query: "type",
    },
    {
      text: "MAC地址",
      query: "deviceId",
    },
    {
      text: "调试",
      query: "leavebedParam",
    },
  ];
  const handleCopy = (text: string) => {
    if (isAdmin) {
      Instancercv({
        method: "post",
        url: "/device/cancelBindManual",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          token: localStorage.getItem('token'),
        },
        data: {
          phone: localStorage.getItem("phone"),
          deviceId: sensorName,
        },
      }).then((e) => {
        message.success("解绑成功");
        dispale(fetchEquips() as any);

        navigate('/', { replace: true })
      });
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    message.info("复制成功！");
  };
  const getuserInfo = () => {
    if (sensorName) {
      Instancercv({
        method: "get",
        url: "/device/selectSinglePatient",
        headers: {
          "content-type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
        params: {
          sensorName,
          phoneNum: localStorage.getItem("phone"),
        },
      }).then((res: any) => {
        if (res && res.data.code == 0) {
          const info = res.data?.data || {};
          setEquipTypeInfo({
            type: info.type,
            deviceId: info.deviceId,
            leavebedParam: info.leavebedParam,
          });
        }
      });
    }
  };
  useEffect(() => {
    getuserInfo();
  }, []);
  return (
    <div className="w-[92%] ml-[4%]">
      <div className="bg-[#fff] px-[13px] py-[6px] rounded-[10px] text-[#6C7784]">
        {equipType.map((item: any, index: number) => {
          return (
            <div
              className={`py-[10px] flex items-center text-base ${index === equipType.length - 1 ? "" : "border-b"
                }`}
            >
              <span className="w-[7rem]">{item.text}</span>
              <div className="flex  w-full">
                <span>{equipTypeInfo[item.query]}</span>
                {item.query === "deviceId" ? (
                  <div
                    onClick={() => handleCopy(equipTypeInfo[item.query])}
                    style={{
                      position: "absolute",
                      right: "3rem",
                      color: "#1677ff",
                      cursor: "pointer",
                    }}
                  >
                    {isAdmin ? "解绑" : "复制"}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
