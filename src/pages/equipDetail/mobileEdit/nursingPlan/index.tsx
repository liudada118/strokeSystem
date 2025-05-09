import React, { useEffect, useState } from "react";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CommonNavBar from "../../../../components/CommonNavBar";
import { Instancercv, instance } from "@/api/api";
import greyNotice from "@/assets/image/greyNotice.png";
import NurseList from "./nurseList/index";
import NurseConfEdit from "./nurseEdit/index";
import { Button, message, Modal, Radio } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import mobileNurse from "@/assets/image/mobileNurseBig.png";
import dayjs from "dayjs";
import { PersonalContentInfo } from "@/pages/equipDetail/EditingUser";
import loog from '../../../../assets/images/logo.png'
import jiaHao from '../../../../assets/images/image copy 2.png'
import { getNurseConfist } from "@/utils/getNursingConfig"
import handleSettingPop from '@/utils/handleSettingPop'
import "./index.css";
const { confirm } = Modal;
export default function NursingPlan() {
  const param = useParams();
  const location = useLocation();
  const sensorName = param.id || location.state.sensorName;
  const [nurseList, setNurseList] = useState([]) as any;
  const [operType, setOperType] = useState("init");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();
  // // 定义处理函数
  // const handleResize = () => {
  //   const html = document.getElementsByTagName("html");
  //   html[0].style.fontSize = '14px'
  // };


  // // const visibilitychange = () => {
  // //   if (document.hidden) { // 当页面被切换至后台时
  // //     console.log("页面已经切换到了后台");

  // //   } else { // 当页面重新显示在前台时
  // //     const html = document.getElementsByTagName("html");
  // //     html[0].style.fontSize = '14px'

  // //     // 这里可以添加相关处理逻辑
  // //   }
  // // }
  // useEffect(() => {
  //   handleResize();
  //   visibilitychange()
  //   // 添加事件监听器
  //   window.addEventListener('resize', handleResize);
  //   window.addEventListener('visibilitychange', visibilitychange);
  //   // 组件卸载时移除监听器
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     window.removeEventListener('visibilitychange', visibilitychange)
  //   };
  // }, [handleResize, visibilitychange]);
  const handleVisibilityChange = () => {
    const html = document.getElementsByTagName("html")[0];
    console.log("页面状态变化：", document.hidden);

    if (!document.hidden) {
      // 当页面重新显示在前台时
      html.style.fontSize = '14px';
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
  const editNurseConf = () => {
    // setOperType("add");
    console.log('addNurseConf.........');
    navigate(`/add_user_nurse_conf`, { state: { sensorName } });
  };
  const addNurseConf = () => {
    setIsEdit(true);
  };

  const addNurseTask = (param: any) => {
    setNurseList([...nurseList, param]);
    setIsEdit(false);
  };
  const useDefaultTemp = (param: any) => {
    setNurseList(param);
    setIsEdit(false);
  };
  const [sensorNameUser, setSensorName] = useState('')

  const getPersonTemplate = () => {
    console.log('addNurseConf.........');
    Instancercv({
      method: "get",
      url: "/nursing/getNursingConfig",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: sensorName,
      },
    }).then((res: any) => {
      if (res.data.code === 0) {
        let nursingConfig = getNurseConfist(res)
        const list = Array.isArray(nursingConfig) ? nursingConfig : []

        localStorage.setItem('tempList', JSON.stringify(list))
        setNurseList(list);
      }
    });
  };
  useEffect(() => {
    getPersonTemplate();
    Instancercv({
      method: "get",
      url: "/device/selectSinglePatient",
      headers: {
        "content-type": "multipart/form-data",
        "token": localStorage.getItem("token"),
      },
      params: {
        sensorName: sensorName,
        phoneNum: localStorage.getItem('phone')
      }
    }).then((res: any) => {
      setSensorName(res.data.data.patientName)
    })
  }, []);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const waitFontSize = () => {
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (fontSize > 16) setReady(true);
      else setTimeout(waitFontSize, 16);
    };
    waitFontSize();
  }, []);
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)
  const [selectValue, setSelectValue] = useState(1)

  const handleChangePasswordOk = async () => {
    setIsModalChangePasswordOpen(false)

  }
  const handleChangePasswordCancel = () => {
    setIsModalChangePasswordOpen(false)
  }


  return (
    <>
      <div className="nurse_header_logo">
        <img onClick={() => handleSettingPop()} style={{ width: "2rem", height: "2rem", marginLeft: "1rem" }} src={loog} alt="" />
        <p style={{ fontWeight: "600", fontSize: "1rem", marginLeft: "1rem" }}>JQ HEALTHCARE</p>
      </div>
      <CommonNavBar
        style={{ position: "inherit" }}
        title={'护理计划'}
        onBack={() => {
          navigate(`/equipInfo/${sensorName}`)
          localStorage.removeItem('sensorName')
        }}
      />
      <div
        className={`${nurseList.length === 0 ? "nurse_box_empty" : ""} nurse_box`}
        style={{
          marginTop: nurseList.length === 0 ? "1rem" : '0',
        }}
      >
        {(nurseList.length || isDelete) > 0 ? (
          <>
            <div className="title">
              <p>
                <span className="text-[1rem]">{sensorNameUser}的护理计划</span>
                <span
                  className="mr-[1rem] cursor-pointer"
                  style={{ marginLeft: "auto", color: "#1677ff", display: "flex", alignItems: "center", fontSize: "1rem" }}
                  onClick={() => editNurseConf()}
                >
                  <img style={{ width: "30%", height: "30%" }} src={jiaHao} alt="" /> 修改
                </span>
              </p>
            </div>
            <NurseList list={nurseList} />
            {
              <Modal style={{ height: "4rem" }} okText='应用' cancelText='取消' visible open={isModalChangePasswordOpen} onOk={handleChangePasswordOk} onCancel={handleChangePasswordCancel}>

                <div style={{ textAlign: "center", height: "4rem" }}>
                  <p style={{ paddingBottom: "1rem" }} >确认应用护理计划？</p>
                  <Radio.Group
                    style={{ marginBottom: "1rem" }}
                    name="radiogroup"
                    defaultValue={1}
                    options={[
                      { value: 1, label: '立即生效' },
                      { value: 2, label: '次日生效' },
                    ]}
                    onChange={(e: any) => setSelectValue(e.target.value)}
                  />
                </div>
              </Modal>
            }
          </>
        ) : (
          <>
            <PersonalContentInfo title={"护理配置"} img={mobileNurse} />
            <Button
              type="primary"
              onClick={() => {

                navigate(`/edit_user_nurse`, { state: { sensorName, isEmpty: true } });
              }}
              style={{}}
              className="mx-[1rem] h-[3rem]"
            >
              创建护理计划
            </Button>
          </>
        )}
      </div >
    </>
  );
}
