import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select, message, Radio } from "antd";
import "./NursingOpen.scss";
import {
  AppstoreOutlined,
  LeftOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
// import type { MenuProps } from 'antd';
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { getQueryParams } from "@/utils/getQueryParam";
import { useSelector, useDispatch } from "react-redux";
import { organizeIdSelect } from "@/redux/premission/premission";
import shan from "../../../../assets/images/shanjiao.png";
import { Instancercv, instance } from "@/api/api";
import NursingStencil from "./nursingStencil";
import dayjs from "dayjs";
import { getNurseConfist } from "@/utils/getNursingConfig"

import { setNurseListData } from "@/redux/Nurse/Nurse";
import yuanquan from "../../../../assets/images/yuanquan.png";
import { useGetWindowSize } from "@/hooks/hook";
import Title from "@/components/title/Title";
import dianyuanquan from "../../../../assets/images/yanquan.png";
import { Picker, Popup } from "antd-mobile";
import NurseTitle from "./NurseTitle";
import { useNavigate, useLocation } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];
type DefaultOptionType = {
  value: string | number;
  label: string;
};
interface propsType {
  sensorName?: any;
  type?: number;
  data?: any;
  nursePersonTemplate?: any;
  statue?: number;
  title?: string;
  setIsOpen?: any;
  setIsModifyNurse?: any;
  saveNurseTemplate?: any;
}
// 修改函数名为大写开头，符合 React 组件命名规范
function NursingOpen(props: propsType) {
  const isPhone = useGetWindowSize();
  const items = [
    {
      key: "1",
      label: "自理老人照护方案",
      value: "意识清醒，行动自如，需生活辅助",
    },
    {
      key: "2",
      label: "半自理老人照护方案",
      value: "部分活动受限，需助行/如厕协助",
    },
    {
      key: "3",
      label: "完全失能老人照护方案",
      value: "卧床为主，需全护理",
    },
  ];
  const [projectName, setProjectName] = useState<DefaultOptionType[]>([]); // 修改为数组类型
  const [hours, setHours] = useState<string>("小时"); // 小时
  const [minutes, setMinutes] = useState<string>("分钟"); // 分钟
  const [template, setTemplate] = useState<string>(""); // 模版
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("自理老人护理模版");
  const [type, setType] = useState(1);
  const [defaultTempInfo, setDefaultTempInfo] = useState(items[0]);
  const token = localStorage.getItem("token");
  const [previewList, setPreviewList] = useState([]) as any;
  const [rightNurseList, setRightNurseList] = useState([]) as any;
  const dispatch = useDispatch();
  const yyyyyyy = useSelector((state: any) => state.nurse.sensorName);


  //是否隐藏单选按钮
  const { state } = useLocation();

  const navigator = useNavigate();
  const [templateId, setTemplateId] = useState(null) as any;
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDropdownClick = async (e: any) => {
    const tit: any = items.find((item) => item.key === e.key);
    const nurseList = await getPersonTemplate(Number(e.key));
    setPreviewList(nurseList);
    setType(Number(e.key));
    setTitle(tit?.label); // 更新标题为点击的菜单项
    setDefaultTempInfo(tit);
  };
  const sensorName: any = window.location.href.split("/")[6] || getQueryParams("sensorName");
  const getPersonTemplate = async (type?: any) => {
    const res: any = await Instancercv({
      method: "get",
      url: "/nursing/getNursingConfig",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: sensorName,
        type: type
      },
    });
    if (res?.data?.code === 0) {
      let nursingConfig = getNurseConfist(res)
      //   if (res.data.templateEffectiveFlag == 1) {
      //     list = JSON.parse(res.data.nursingConfig || '[]')
      //   } else {
      //     list = JSON.parse(res.data.oldTemplate || '[]')
      //   }
      // setPreviewList(nursingConfig)
      return nursingConfig || [];
    } else {
      return [];
    }
  };
  const addTempNurse = () => {
    const hoursVal = parseFloat(hours);
    const minutesVal = parseFloat(minutes);
    const hoursFormat = hoursVal < 10 ? `0${hoursVal}` : hoursVal;
    const minutesFormat = minutesVal < 10 ? `0${minutesVal}` : minutesVal;
    const today = dayjs().format("YYYY-MM-DD");
    const templateTime = new Date(
      `1970-01-01 ${hoursFormat}:${minutesFormat}`
    ).getTime();
    if (!templateTime) return message.error("请选择时间");
    if (!template) return message.error("请填写护理项目模版");
    const isHasTemp = Array.isArray(rightNurseList) ? (rightNurseList || []).find((item: any) => {
      return +item.key === +templateTime;
    }) : false
    if (isHasTemp) return message.info("该护理时间已存在请重新选择");
    setRightNurseList([
      ...rightNurseList,
      {
        key: templateTime.toString(),
        status: "todo",
        time: `${hoursFormat}:${minutesFormat}`,
        title: template,
      },
    ]);
    if (isPhone) {
      dispatch(
        setNurseListData([
          ...rightNurseList,
          {
            key: templateTime.toString(),
            status: "todo",
            time: `${hoursFormat}:${minutesFormat}`,
            title: template,
          },
        ])
      );
      navigator(`/userInfo_NurseTable?sensorName=${sensorName}&type=project`)
    }
    setHours('小时')
    setMinutes('分钟')
    setTemplate('')
  };
  // 之前有模版的添加
  // const addTempNurse = () => {
  //   const hoursVal = parseFloat(hours);
  //   const minutesVal = parseFloat(minutes);
  //   const hoursFormat = hoursVal < 10 ? `0${hoursVal}` : hoursVal;
  //   const minutesFormat = minutesVal < 10 ? `0${minutesVal}` : minutesVal;
  //   const today = dayjs().format("YYYY-MM-DD");
  //   const templateTime = new Date(
  //     `1970-01-01 ${hoursFormat}:${minutesFormat}`
  //   ).getTime();
  //   if (!templateTime) return message.error("请选择时间");
  //   if (!template) return message.error("请填写护理项目模版");
  //   Instancercv({
  //     method: "post",
  //     url: "/nursing/addNursingTemplItem",
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       token: token,
  //     },
  //     params: {
  //       // TODO 目前去掉了模版，没有模版templateId，这个直接获取到的是个人下面的护理项目，后端接口需要去掉template，或者换个添加接口
  //       templateId: sensorName,
  //       templateTime: templateTime,
  //       templateContent: template,
  //     },
  //   }).then(async (res) => {
  //     console.log(res, "添加项目。。。。。");
  //     if (res.data.msg.includes("success")) {
  //       const nurseList = await getPersonTemplate(1);
  //       setRightNurseList(nurseList);
  //       message.success("添加成功");
  //       if (!useSelect) {
  //         navigator("/userInfo_NurseTable");
  //       }
  //     } else {
  //       message.error(res.data.msg);
  //     }
  //   });
  // };

  /**
   *
   * @param str
   * @returns
   */
  const templateToData = (str: string) => {
    const arr: any = [];
    const splitArr = str?.replace("{", "").replace("}", "").split(",");
    console.log(splitArr);
    splitArr?.forEach((splitItem, index) => {
      if (!splitItem.includes(":")) {
        return;
      }
      const key = splitItem.split(":")[0];
      let value = splitItem.split(":")[1];
      value = value.replace(new RegExp('"', "g"), "");
      console.log(key, value, new Date().toLocaleDateString(), key);
      arr.push({
        title: value,
        time: dayjs(
          new Date(new Date().toLocaleDateString()).getTime() + Number(key)
        ).format("HH:mm"),
        key: key,
        status: "todo",
      });
    });
    return arr;
  };
  const [name, setName] = useState([]);
  const nurseName = window.location.href.split('/')[6]


  useEffect(() => {
    async function getCurrentTemplate() {
      let nurseList = await getPersonTemplate();
      nurseList = Array.isArray(nurseList) ? nurseList : []

      setRightNurseList(nurseList);
    }
    getCurrentTemplate();

    Instancercv({
      method: "get",
      url: "/device/selectSinglePatient",
      headers: {
        "content-type": "multipart/form-data",
        token: token,
      },
      params: {
        sensorName: nurseName,
        phoneNum: localStorage.getItem("phone"),
      },
    }).then((res: any) => {


      setName(res?.data?.data?.patientName || '');
    });
  }, []);

  const useSelect = useSelector((state: any) => state.nurse.nurseOpen);
  const [group, setGroup] = useState(1);
  const [visible1, setVisible1] = useState(false);

  return (
    <>
      {useSelect ? (
        <div className="w-full h-[full] flex justify-between mb-[1rem]">
          <div className="flex-1 h-[full] bg-[#fff] mr-[0.8rem]">
            <div className="w-[40rem] h-[full] ml-[2.7rem] mt-[2rem] ">
              <h3 className="text-[#000] text-[1.3rem] font-semibold text-[PingFang SC] mb-[1.2rem]">
                创建{name}的护理项
              </h3>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle flex pr-[0.7rem]  text-[#000] font-bold">
                  应用护理模版：{" "}
                </div>
                <div className="use_nurse_template">
                  {[
                    { value: 1, label: "否" },
                    { value: 2, label: "是" },
                  ].map((item, index) => {
                    return (
                      <p
                        className={group === item.value ? "active" : ""}
                        onClick={async (e) => {
                          setGroup(item.value);
                          if (item.value === 2) {
                            setIsModalOpen(true);
                            const nurseList = await getPersonTemplate(1);
                            setPreviewList(nurseList);
                          }
                        }}
                        key={index + "_radio"}
                      >
                        <span></span>
                        <span>{item.label}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle text-[#000] font-bold">
                  护理任务 :{" "}
                </div>
                <p className="pl-[0.6rem]">
                  <Input
                    maxLength={20}
                    style={{ height: "2.7rem", width: "23rem" }}
                    placeholder="请输入护理任务，只能输入20个字符"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  />
                </p>
              </div>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle   text-[#000] font-bold">
                  护理时间 :{" "}
                </div>
                <Select
                  showSearch
                  style={{
                    width: "8.1rem",
                    height: "2.48rem",
                    marginRight: "0.7rem",
                    paddingLeft: "0.6rem",
                  }}
                  placeholder="点"
                  optionFilterProp="children"
                  value={hours}
                  onChange={(value) => setHours(value as string)}
                >
                  <Select.Option value={'时'} disabled>
                    <div className="flex justify-center">
                      时
                    </div>
                  </Select.Option>
                  {[...Array(24)].map((_, index) => (
                    <Select.Option key={index} value={(index).toString().padStart(2, '0')}>
                      {/* {
                        index === 0 ? <div className="flex justify-center mb-3">时</div> : ""
                      } */}
                      <div className="flex justify-center ">
                        {index.toString().padStart(2, '0')}
                      </div>
                    </Select.Option>
                  ))}
                </Select>{" "}
                :
                <Select
                  showSearch
                  style={{
                    width: "8.1rem",
                    height: "2.48rem",
                    marginLeft: "0.7rem",
                  }}
                  placeholder="分钟"
                  optionFilterProp="children"
                  value={minutes}
                  onChange={(value) => setMinutes(value as string)}
                >
                  {/* 动态生成分钟选项 */}
                  <Select.Option value={'分'} disabled>
                    <div className="flex justify-center">
                      分
                    </div>
                  </Select.Option>
                  {[...Array(60)].map((_, index) => (
                    <Select.Option key={index} value={(index).toString()}>
                      {/* {
                        index === 0 ? <div className="flex justify-center mb-3">分</div> : ""
                      } */}
                      <div className="flex justify-center">
                        {index.toString().padStart(2, '0')}
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <Button
                onClick={() => addTempNurse()}
                className="w-[27.5rem] h-[2.7rem]"
                type="primary"
              >
                新建护理项目
              </Button>
            </div>
          </div>
          <div className="w-[27rem] h-[full] bg-[#fff]">
            {/* <NurseTable
              name={name}
              templateId={templateId}
              data={rightNurseList || []}
              sensorName={sensorName}
              type="project"
              getNurseTemplate={async () => {
                const nurseList = await getPersonTemplate();
                setRightNurseList(Array.isArray(nurseList) ? nurseList : []);
              }}
              deleteNurse={(params: any) => {
                const delList = rightNurseList.filter((item: any) => {
                  return item.key !== params.key;
                });
                setRightNurseList(Array.isArray(delList) ? delList : []);
              }}
              saveNurseTemplate={props.saveNurseTemplate}
            ></NurseTable> */}
          </div>
          <Modal
            width={"40.45rem"}
            okText="选择此模版"
            cancelText="取消"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            className="ModalNursingOpen"
            footer={[
              // 自定义页脚，只包含确认按钮
              <Button key="ok" type="primary" style={{ width: "6.8rem", height: "2rem", marginTop: "1.2rem" }} onClick={handleOk}>
                选择此模版
              </Button>,
            ]}
            maskClosable={false}
          >
            <div className="h-[32rem] w-[37rem] bg-[#ffff]">
              <Space direction="vertical">
                <Dropdown
                  menu={{ items, onClick: handleDropdownClick }}
                  placement="bottom"
                >
                  <Button
                    style={{
                      border: "none",
                      fontFamily: " PingFang SC",
                      fontWeight: "600",
                      fontSize: "1.05rem",
                    }}
                  >
                    {defaultTempInfo.label}
                    <img
                      style={{ width: "0.75rem", height: "0.75rem", }}
                      src={shan}
                      alt=""
                    />
                  </Button>
                </Dropdown>
              </Space>
              <div className="flex w-[20rem] items-center ml-[0.9rem]  mt-[0.4rem] bg-[#F5F8FA]">
                <img
                  className="w-[1rem] h-[1rem] mr-[0.5rem]"
                  src={yuanquan}
                  alt=""
                />
                <span className="text-[1rem]"> 特点：{defaultTempInfo.value}</span>
              </div>
              <NursingStencil
                stylee="2"
                sensorName={sensorName}
                nursePersonTemplate={previewList}
                statue={2}
                title={"00000"}
                type={type}
              ></NursingStencil>
            </div>
          </Modal>
        </div>
      ) : (
        <div
          className="w-[100%] bg-[#F5F8FA]"
          style={{ height: "calc(100%-40px)" }}
        >
          <div className="w-[100%] h-[20%]">
            <Title></Title>
            <NurseTitle
              title={state === "addnurse" ? "新建护理任务" : "创建护理计划"}
            ></NurseTitle>
          </div>
          <div
            className="w-[96%] h-[90%] bg-[#FFFFFF] mx-[2%] mt-[0.5rem] rounded-lg"
            style={{
              height: "80%",
              paddingTop: state == "addnurse" ? "2.2rem" : "0.5rem",
            }}
          >
            {state ? (
              ""
            ) : (
              <div className="flex w-[100%] px-3  pt-6 items-center mb-[1.5rem] ">
                <div className="flex  mr-[3%]  items-center">
                  <img
                    style={{ width: "6px", height: "6px" }}
                    src={dianyuanquan}
                    alt=""
                  />
                  <span className="pl-[0.5rem] pr-[0.5rem] text-[1.2rem] font-medium">
                    应用护理模版 :{" "}
                  </span>
                </div>

                <div className="use_nurse_template">
                  {[
                    { value: 1, label: "否" },
                    { value: 2, label: "是" },
                  ].map((item, index) => {
                    return (
                      <p
                        className={group === item.value ? "active" : ""}
                        onClick={async (e) => {
                          setGroup(item.value);
                          if (item.value === 2) {
                            setVisible1(true);
                            const nurseList = await getPersonTemplate(1);
                            setPreviewList(nurseList);
                          }
                        }}
                        key={index + "_radio"}
                      >
                        <span></span>
                        <span>{item.label}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
            <div
              className="flex px-3 items-center "
              style={{
                marginTop: state === "addnurse" ? "0.4rem" : "",
                marginBottom: state === "addnurse" ? "2rem" : "1.5rem",
              }}
            >
              <div className="flex w-[28%] mr-[3%] items-center text-[#000] font-bold">
                <img
                  style={{ width: "6px", height: "6px" }}
                  src={dianyuanquan}
                  alt=""
                />
                <p className="text-[1.2rem] pl-[0.6rem] font-medium">
                  护理任务 :
                </p>{" "}
              </div>
              <Input
                style={{
                  height: "3rem",
                  width: "80%",
                  background: "#F5F8FA",
                  border: "none",
                  marginLeft: "2%",
                }}
                placeholder="请输入所添加护理项目名称"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
            </div>
            <div
              className="flex px-3 items-center mb-[1.5rem]"
              style={{ marginTop: state === "addnurse" ? "2rem" : "1.5rem" }}
            >
              <div className="flex w-[28%] mr-[3%] items-center text-[#000] font-bold">
                <img
                  style={{ width: "6px", height: "6px" }}
                  src={dianyuanquan}
                  alt=""
                />
                <p className="text-[1.2rem] pl-[0.6rem] font-medium">
                  护理时间 :
                </p>{" "}
              </div>
              <Select
                showSearch
                style={{
                  width: "38%",
                  height: "3rem",
                  marginRight: "0.7rem",
                  paddingLeft: "0.6rem",
                }}
                placeholder="请选择"
                optionFilterProp="children"
                value={hours}
                onChange={(value) => setHours(value as string)}
              >
                {[...Array(24)].map((item, index) => (
                  <Select.Option key={index} value={index.toString().padStart(2, '0')}>
                    {index.toString().padStart(2, '0')}点
                  </Select.Option>
                ))}
              </Select>{" "}
              :
              <Select
                showSearch
                style={{ width: "38%", height: "3rem", marginLeft: "0.5rem" }}
                placeholder="分钟"
                optionFilterProp="children"
                value={minutes}
                onChange={(value) => setMinutes(value as string)}
              >
                {[...Array(59)].map((_, index) => (
                  <Select.Option key={index} value={index.toString()}>
                    {index + 1}分钟
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Button
              style={{
                height: "3.5rem",
                marginTop: state === "addnurse" ? "1rem" : "1.5rem",
              }}
              onClick={() => addTempNurse()}
              className="w-[96%] mx-[2%]  flex"
              type="primary"
            >
              {state ? "保存护理项目" : "新建护理项目"}
            </Button>
          </div>
          {visible1 ? (
            <Popup
              style={{
                borderRadius: "1rem",
                height: "79vh",
              }}
              visible={visible1}
              onMaskClick={() => {
                setVisible1(false);
              }}
              onClose={() => {
                setVisible1(false);
              }}
              bodyStyle={{ height: "70vh" }}
            >
              <div className="w-full ">
                <div className="w-full h-[3rem] mt-[1.35rem] flex items-center ">
                  <div
                    onClick={() => setVisible1(false)}
                    className="pl-[1.3rem]"
                  >
                    <LeftOutlined />
                  </div>

                  <Space direction="vertical">
                    <Dropdown
                      menu={{ items, onClick: handleDropdownClick }}
                      placement="bottom"
                    >
                      <Button
                        style={{
                          border: "none",
                          fontFamily: " PingFang SC",
                          fontWeight: "600",
                          fontSize: "1.2rem",
                          transform: "translateY(-0.2rem)",
                        }}
                      >
                        {defaultTempInfo.label}
                        <img
                          style={{ width: "0.5rem", height: "0.5rem" }}
                          src={shan}
                          alt=""
                        />
                      </Button>
                    </Dropdown>
                  </Space>
                </div>
                <NursingStencil
                  stylee="2"
                  sensorName={sensorName}
                  nursePersonTemplate={rightNurseList}
                  statue={2}
                  title={"00000"}
                  type={type}
                ></NursingStencil>
              </div>
            </Popup>
          ) : (
            ""
          )}
        </div >
      )
      }
    </>
  );
}

export default NursingOpen;
