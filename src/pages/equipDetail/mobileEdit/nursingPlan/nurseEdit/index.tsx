import React, { useState, useEffect, useRef } from "react";
// import "./index.css";
import "../nurseEdit/nurseEditList.scss";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  // Dropdown,
  Space,
  message,
  Modal
} from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import shan from "../../../../../assets/images/shanjiao.png";
import { Picker, Popup, Empty, Dropdown } from "antd-mobile";
import NurseList from "../nurseList/index";
import { Instancercv } from "@/api/api";
import loog from '../../../../../assets/images/logo.png'
import {
  AppstoreOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getNurseConfist, templateToData } from "@/utils/getNursingConfig";
import CommonNavBar from "@/components/CommonNavBar";
import handleSettingPop from "@/utils/handleSettingPop";
import { DropdownRef } from 'antd-mobile/es/components/dropdown'

const { confirm } = Modal;
export default function NurseConfEdit(props: any) {
  const dropdownRef = useRef<DropdownRef>(null)
  const dropdownContainerRef = useRef<any>(null);
  const location = useLocation();
  const { isEmpty } = location.state;
  const sensorName = props.sensorName || location.state.sensorName;
  console.log(isEmpty, '......isEmpty........111...........')
  // useEffect(() => {
  //   let time: NodeJS.Timeout | null = null;
  //   if (time) {
  //     clearInterval(time);
  //     time = setInterval(() => {
  //       // 定时器逻辑
  //       window.location.reload();
  //     }, 3000);
  //   }
  //   return () => {
  //     if (time) {
  //       clearInterval(time); // 使用 clearInterval 清除定时器
  //     }
  //   };
  // }, []);
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
  const [isUseDefault, setIsUseDefault] = useState(1);
  const [isShowChooseTemp, setIsShowChooseTemp] = useState(true);
  const [defaultTempInfo, setDefaultTempInfo] = useState(items[0]);
  const [tempList, setTempList] = useState([]);
  const [nurseName, setNurseName] = useState("");
  const navigate = useNavigate();
  const onFinish = (value: any) => {
    if (!nurseName) return message.info("请填写护理名称");
    if (!value.hours || !value.minutes)
      return message.warning("请填写护理时间！");
    if (nurseName.length > 20) return message.warning("名称不能超过20个字符");
    const tempNurseList = localStorage.getItem("tempList") || "[]";
    const list = JSON.parse(tempNurseList);
    const hoursVal = parseFloat(value.hours);
    const minutesVal = parseFloat(value.minutes);
    const hoursFormat = hoursVal < 10 ? `0${hoursVal}` : hoursVal;
    const minutesFormat = minutesVal < 10 ? `0${minutesVal}` : minutesVal;
    const templateTime = new Date(
      `1970-01-01 ${hoursFormat}:${minutesFormat}`
    ).getTime();
    const isHasTemp = list.find((item: any) => {
      return +item.key === +templateTime;
    });
    if (isHasTemp) return message.warning("该护理时间已存在请重新选择！");
    if (tempNurseList) {
      localStorage.setItem("tempList", JSON.stringify([
        ...list,
        {
          key: templateTime.toString(),
          status: "todo",
          time: `${hoursFormat}:${minutesFormat}`,
          title: nurseName,
        }
      ]));
    } else {
      localStorage.setItem("tempList", JSON.stringify([
        {
          key: templateTime.toString(),
          status: "todo",
          time: `${hoursFormat}:${minutesFormat}`,
          title: nurseName,
        }
      ]));
    }
    navigate(`/add_user_nurse_conf`, { state: { sensorName } });
    // props.setNurseTask({
    //   key: templateTime.toString(),
    //   status: "todo",
    //   time: `${hoursFormat}:${minutesFormat}`,
    //   title: nurseName,
    // });
  };
  const onFinishFailed = (value: any) => {
    console.log("Failed:", value);
  };

  const getPersonTemplate = (type?: any) => {
    Instancercv({
      method: "get",
      url: "/nursing/getNurseTemplateData",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: props.sensorName,
        // 这个type展示献先写死 到时候要换成 这个里面的 iditems
        organizeId: "common",
      },
    }).then((res: any) => {
      if (res.data.code === 0) {
        const targetTemp =
          (res.data.data || []).find((item: any) => item.type === type) || {};
        try {
          const templateList = templateToData(targetTemp?.template);
          setTempList(templateList);
        } catch (error) {
          console.error("获取默认模版报错了：", error);
        }
      }
    });
  };

  const handleDropdownClick = async (e: any) => {

    const info: any = items.find((item) => item.key === e.key);
    console.log(info, e, ".........info");

    setDefaultTempInfo(info);
    getPersonTemplate(+info.key);
    dropdownRef.current?.close()
    console.log(e, info, '...............9999..........setTempListsetTempList');
  };

  useEffect(() => {

    // 定义处理函数
    const handleResize = () => {
      const html = document.getElementsByTagName("html");
      html[0].style.fontSize = '14px'
    };
    handleResize()

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (

    <div
      className="bg-[#f4f5f6] flex"
      style={{
        height: "100%",
        flexDirection: "column",
      }}
    ><div className="nurse_header_logo">
        <img onClick={() => handleSettingPop()} style={{ width: "2rem", height: "2rem", marginLeft: "1rem" }} src={loog} alt="" />
        <p style={{ fontWeight: "600", fontSize: "1rem", marginLeft: "1rem" }}>JQ HEALTHCARE</p>
      </div>
      <CommonNavBar
        style={{ position: "inherit" }}
        title={'创建护理计划'}
        onBack={() => navigate(-1)}
      />
      <Form
        name="basic"
        layout={"vertical"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="use_nurse_form"
        requiredMark={false}
      >
        {isEmpty && (
          <Form.Item
            label=""
            name="use"
            rules={[
              { required: false, message: "Please input your username!" },
            ]}
          >
            <span className="use_nurse_templatespan">应用护理模版：</span>
            <div className="use_nurse_template">
              {[
                { value: 1, label: "否" },
                { value: 2, label: "是" },
              ].map((item, index) => {
                return (
                  <p
                    className={isUseDefault === item.value ? "active" : ""}
                    onClick={async (e) => {
                      setIsUseDefault(item.value);
                      if (item.value === 2) {
                        setIsShowChooseTemp(true);
                        getPersonTemplate(1);
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
          </Form.Item>
        )}

        <Form.Item
          label=""
          name="title"
          rules={[{ required: false, message: "请填写护理名称!" }]}
        >
          <span className="">护理任务：</span>
          <Input
            placeholder="请输入所添加的护理任务的名称"
            className="h-10 bg-[#F5F8FA]"
            maxLength={20}
            onChange={(e) => {
              setNurseName(e.target.value);
            }}
          />
        </Form.Item>

        <div className="time_box">
          <span className="form_title">护理时间：</span>
          <div className="time_item h-10">
            <Form.Item
              label=""
              name="hours"
              className="h-10"
              rules={[{ required: false, message: "请选择!" }]}
            >
              {/* <Select
                showSearch
                placeholder="时"
                optionFilterProp="children"
                className="h-10"
              >
                {[...Array(24)].map((_, index) => (
                  <Select.Option key={index} value={(index + 1).toString().padStart(2, '0')}>
                    {index.toString().padStart(2, '0')}
                  </Select.Option>
                ))}
              </Select> */}
              <Select
                showSearch={false}
                placeholder="时"
                optionFilterProp="children"
                className="h-[2.5rem] flex justify-center"
                style={{ width: "9rem" }}
              // onChange={(value => setHours(value as string))}
              >
                {/* 动态生成分钟选项 */}
                <Select.Option value={"分"} disabled>
                  <div className="flex justify-center">时</div>
                </Select.Option>
                {[...Array(24)].map((_, index) => (
                  <Select.Option key={index} value={index.toString()}>
                    <div className="flex justify-center">
                      {index.toString().padStart(2, "0")}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className="split"> : </span>
            <Form.Item
              label=""
              name="minutes"
              rules={[{ required: false, message: "请选择!" }]}
            >
              <Select
                showSearch={false}
                placeholder="分"
                optionFilterProp="children"
                className="h-[2.5rem] flex justify-center"
                style={{ width: "9rem" }}
              // onChange={(value => setMinutes(value as string))}
              >
                {/* 动态生成分钟选项 */}
                <Select.Option value={"分"} disabled>
                  <div className="flex justify-center">分</div>
                </Select.Option>
                {[...Array(60)].map((_, index) => (
                  <Select.Option key={index} value={index.toString()}>
                    <div className="flex justify-center">
                      {index.toString().padStart(2, "0")}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", height: "3rem" }}
        >
          {isEmpty ? "添加护理任务" : "保存护理任务"}
        </Button>
      </Form>

      {isShowChooseTemp && (
        <Popup
          style={{
            borderRadius: "1rem",
            height: "79vh",
          }}
          visible={isUseDefault === 2}
          onMaskClick={() => {
            setIsShowChooseTemp(false);
          }}
          onClose={() => {
            setIsShowChooseTemp(false);
          }}
          bodyStyle={{ height: "70vh" }}
        >
          <div className="default-popup">
            <div className="w-full h-[2rem] mt-[1.35rem] flex items-center justify-items-center relative">
              <div
                onClick={() => setIsShowChooseTemp(false)}
                className="pl-[1.3rem] absolute top-[0.3rem] left-0"
              >
                <LeftOutlined />
              </div>

              <Space direction="vertical" style={{ margin: "0 auto" }}>
                {/* <Dropdown
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
                </Dropdown> */}
                <Dropdown ref={dropdownRef} className="nurse-temp-type-dropdown" getContainer={() => dropdownContainerRef.current}>
                  <Dropdown.Item key='bizop' title={
                    <span style={{ color: '#3D3D3D', fontWeight: '600', fontSize: '1.2rem' }}>
                      {defaultTempInfo.label}
                      {/* <img
                        style={{ width: "0.5rem", height: "0.5rem" }}
                        src={shan}
                        alt=""
                      /> */}
                    </span>}
                  >
                    <div style={{ padding: 12 }}>
                      {
                        items.map((item) => (
                          <p
                            key={item.key}
                            onClick={() => handleDropdownClick(item)}
                            style={{ padding: 12, cursor: 'pointer' }}
                          >
                            {item.label}
                          </p>
                        ))
                      }
                    </div>
                  </Dropdown.Item>
                </Dropdown>
              </Space>

              <div className="nurse-temp-type-dropdown-popup" ref={dropdownContainerRef}></div>
            </div>

            <NurseList list={tempList}></NurseList>

            <Button
              onClick={() => {
                // props.useDefaultTemp && props.useDefaultTemp(tempList);
                localStorage.setItem("tempList", JSON.stringify(tempList));
                navigate(`/add_user_nurse_conf`, { state: { sensorName } });
              }}
              type="primary"
              style={{
                width: "calc(100% - 2rem)",
                padding: "0 2%",
                height: "2.5rem",
                margin: "1rem",
              }}
            >
              选择模版
            </Button>
          </div>
        </Popup>
      )}
    </div>
  );
}
