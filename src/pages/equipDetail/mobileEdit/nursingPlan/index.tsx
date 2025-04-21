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
  const [title, setTitle] = useState("护理配置");
  const [nurseList, setNurseList] = useState([]) as any;
  const [operType, setOperType] = useState("init");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();

  const editNurseConf = () => {
    setOperType("add");
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

  const getPersonTemplate = (type?: any) => {
    Instancercv({
      method: "get",
      url: "/nursing/getNursingConfig",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: sensorName,
        ...(type ? { type } : {}),
      },
    }).then((res: any) => {
      if (res.data.code === 0) {
        let nursingConfig = getNurseConfist(res)
        // if (res.data.templateEffectiveFlag == 1) {
        //   nursingConfig = JSON.parse(res.data.nursingConfig || '[]')
        // } else {
        //   nursingConfig = JSON.parse(res.data.oldTemplate || '[]')
        // }
        if (nursingConfig.length > 0) {
          setTitle("护理计划");
        }
        setNurseList(Array.isArray(nursingConfig) ? nursingConfig : []);
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
      console.log(res.data.data.patientName, '......................qweqweqwe');
    })
  }, []);
  console.log(sensorNameUser, '....................sensorNameUsersensorNameUsersensorNameUser');

  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)
  const [selectValue, setSelectValue] = useState(1)

  const handleChangePasswordOk = async () => {

    saveTemplate()
    setIsModalChangePasswordOpen(false)

  }
  const handleChangePasswordCancel = () => {
    setIsModalChangePasswordOpen(false)
  }
  const saveTemplate = () => {
    const list = nurseList.map((item: any) => {
      return {
        key: item.key,
        title: item.templateTitle || item.title,
        status: "todo",
        time: dayjs(+item.key).format("HH:mm"),
      };
    });

    Instancercv({
      method: "post",
      url: "/nursing/updateNursingConfig",
      headers: {
        "content-type": "application/json",
        token: localStorage.getItem("token"),
      },
      data: {
        deviceId: sensorName,
        config: JSON.stringify(list),
      },
    }).then((res) => {
      // message.success("保存成功");
      setOperType("init");
      getPersonTemplate();
    });
    // confirm({
    //   title: "",
    //   icon: <ExclamationCircleOutlined />,
    //   content: "确认应用该护理计划?",
    //   okText: "确认",
    //   cancelText: "取消",
    //   onOk() {
    //   },
    //   onCancel() {
    //     console.log("取消删除模版");
    //     // 取消删除不执行任何逻辑
    //   },
    // });
  };
  const delTemp = (params: any) => {
    confirm({
      title: "删除模版",
      icon: <ExclamationCircleOutlined />,
      content: "确认删除模版?",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        const delList = nurseList.filter((item: any) => {
          return +item.key !== +params.key;
        });
        setNurseList(delList);
        setIsDelete(true)
      },
    });
  };



  return (
    <>
      <div className="nurse_header_logo">
        <img onClick={() => handleSettingPop()} style={{ width: "2rem", height: "2rem", marginLeft: "1rem" }} src={loog} alt="" />
        <p style={{ fontWeight: "600", fontSize: "1rem", marginLeft: "1rem" }}>JQ HEALTHCARE</p>
      </div>
      <CommonNavBar
        style={{ position: "inherit" }}
        title={
          nurseList.length === 0 && !isDelete
            ? "护理配置"
            : operType === "init"
              ? "护理计划"
              : operType === "add" && !isEdit
                ? "设置护理计划"
                : operType === "add" && isEdit
                  ? "创建护理计划"
                  : "护理配置"
        }
        onBack={() => navigate(-1)}
      />
      <div
        className={`${nurseList.length === 0 && !isDelete && !isEdit ? "nurse_box_empty" : ""
          } nurse_box`}
      >
        {isEdit ? (
          <NurseConfEdit
            nurseList={nurseList}
            sensorName={sensorName}
            setNurseTask={addNurseTask}
            useDefaultTemp={useDefaultTemp}
            isDelete={isDelete}
          />
        ) : (operType === "init" || operType === "add") &&
          (nurseList.length || isDelete) > 0 ? (
          <>
            <div className="title">
              <p>
                <span className="text-[1rem]">{sensorNameUser}的护理计划</span>
                {operType === "init" && (
                  <span
                    className="mr-[1rem] cursor-pointer"
                    style={{ marginLeft: "auto", color: "#1677ff", display: "flex", alignItems: "center", fontSize: "1rem" }}
                    onClick={() => editNurseConf()}
                  >
                    <img style={{ width: "30%", height: "30%" }} src={jiaHao} alt="" /> 修改
                  </span>
                )}
                {operType === "add" && (
                  <span
                    className="mr-[1rem] cursor-pointer"
                    style={{ marginLeft: "auto", color: "#1677ff", display: "flex", alignItems: "center", fontSize: "1rem" }}
                    onClick={() => addNurseConf()}
                  >
                    <img style={{ width: "40%", height: "40%" }} src={jiaHao} alt="" />
                    添加
                  </span>
                )}
              </p>
              {operType === "add" && (
                <div className="tip flex items-center h-[2rem]   mt-[0.5rem]">
                  <img
                    className="w-[1rem] bg-[#F5F8FA] h-[1rem] mr-[5px] ml-2"
                    src={greyNotice}
                    alt=""
                  />
                  <span className="text-[1rem] bg-[#F5F8FA] text-[#929EAB]">
                    当前内容仅作为效果预览，不可作为实际页面使用
                  </span>
                </div>
              )}
            </div>
            <NurseList list={nurseList} operType={operType} delTemp={delTemp} />
            {operType === "add" && (
              <div className="bg-[#f4f5f6] w-[full]">
                <Button
                  type="primary"
                  onClick={() => setIsModalChangePasswordOpen(true)}
                  className="mt-[1rem] w-[full]"
                  style={{ width: "100%" }}
                >
                  应用护理计划
                </Button>
              </div>
            )}
            {/* saveTemplate */}
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
        )

          : (
            <>
              <PersonalContentInfo title={"护理配置"} img={mobileNurse} />
              <Button
                type="primary"
                onClick={() => {
                  setOperType("add");
                  setIsEdit(true);
                }}
                style={{}}
                className="mx-[1rem] h-[4rem]"
              >
                创建护理计划
              </Button>
            </>
          )}
      </div >
    </>
  );
}
