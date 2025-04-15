import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Dropdown,
  Space,
  message,
} from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import shan from "../../../../../assets/images/shanjiao.png";
import { Picker, Popup } from "antd-mobile";
import NurseList from "../nurseList/index";
import { Instancercv } from "@/api/api";
import {
  AppstoreOutlined,
  LeftOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./index.scss";
import dayjs from "dayjs";

export default function NurseConfEdit(props: any) {
  const items = [
    {
      key: "1",
      label: "自理老人护理模版",
      value: "意识清醒，行动自如，需生活辅助",
    },
    {
      key: "2",
      label: "半自理老人护理模版",
      value: "部分活动受限，需助行/如厕协助",
    },
    {
      key: "3",
      label: "失能老人护理模版",
      value: "卧床为主，需全护理",
    },
  ];
  const [isUseDefault, setIsUseDefault] = useState(1);
  const [isShowChooseTemp, setIsShowChooseTemp] = useState(true);
  const [defaultTempInfo, setDefaultTempInfo] = useState(items[0]);
  const [tempList, setTempList] = useState([]);
  const [nurseName, setNurseName] = useState('');
  const navigate = useNavigate();
  const onFinish = (value: any) => {
    if (!nurseName) return message.warning("请填写护理名称！");
    if (!value.hours || !value.minutes) return message.warning("请填写护理时间！");
    const hoursVal = parseFloat(value.hours);
    const minutesVal = parseFloat(value.minutes);
    const hoursFormat = hoursVal < 10 ? `0${hoursVal}` : hoursVal;
    const minutesFormat = minutesVal < 10 ? `0${minutesVal}` : minutesVal;
    const templateTime = new Date(
      `1970-01-01 ${hoursFormat}:${minutesFormat}`
    ).getTime();
    const isHasTemp = props.nurseList.find((item: any) => {
      return +item.key === +templateTime;
    });
    if (isHasTemp) return message.warning("该护理时间已存在请重新选择！");
    props.setNurseTask({
      key: templateTime.toString(),
      status: "todo",
      time: `${hoursFormat}:${minutesFormat}`,
      title: nurseName,
    });
  };
  const onFinishFailed = (value: any) => {
    console.log("Failed:", value);
  };

  const getPersonTemplate = (type?: any) => {
    Instancercv({
      method: "get",
      url: "/nursing/getNursingConfig",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: props.sensorName,
        // 这个type展示献先写死 到时候要换成 这个里面的 iditems
        type: 'common'
      },
    }).then((res: any) => {
      if (res.data.code === 0) {
        let nursingConfig = []
        if (res.data.templateEffectiveFlag == 2) {
            nursingConfig = JSON.parse(res.data.nursingConfig || '[]')
        } else {
            nursingConfig = JSON.parse(res.data.oldTemplate || '[]')
        }
        if (nursingConfig.length > 0) {
          setTempList(nursingConfig);
        }
      }
    });
  };

  const handleDropdownClick = async (e: any) => {
    const info: any = items.find((item) => item.key === e.key);
    setDefaultTempInfo(info);
    getPersonTemplate(+info.key);
  };

  return (
    <>
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
        {props.nurseList.length === 0 && !props.isDelete && (
          <Form.Item
            label=""
            name="use"
            rules={[
              { required: false, message: "Please input your username!" },
            ]}
          >
            <span>应用护理模版：</span>
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
          <span>护理名称：</span>
          <Input placeholder="请输入所添加的护理任务的名称" className="h-10 bg-[#F5F8FA]" onChange={(e) => {
            setNurseName(e.target.value)
          }} />
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
              <Select
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
              </Select>
            </Form.Item>
            <span className="split"> : </span>
            <Form.Item
              label=""
              name="minutes"
              rules={[{ required: false, message: "请选择!" }]}
            >
              <Select
                showSearch
                placeholder="分"
                optionFilterProp="children"
                className="h-10"
              >
                {[...Array(59)].map((_, index) => (
                  <Select.Option key={index} value={(index + 1).toString()}>
                    {index + 1}分钟
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <Button type="primary" htmlType="submit" style={{ width: '100%', height: '3rem' }}>
          {props.nurseList.length === 0 ? "添加护理任务" : "保存护理任务"}
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
            <div className="w-full h-[2rem] mt-[1.35rem] flex items-center ">
              <div
                onClick={() => setIsShowChooseTemp(false)}
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
            <NurseList list={tempList}></NurseList>
            <Button
              onClick={() => {
                // yyyyds();
              }}
              type="primary"
              style={{
                width: "100%",
                padding: "0 2%",
                height: "4rem",
                marginTop: "1rem",
              }}
            >
              选择模版
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
}
