import React, { useState, useEffect } from "react";
import "./index.scss";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Dropdown,
  Space,
  message,
  Modal,
  Radio,
} from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import shan from "@/assets/images/shanjiao.png";
import NurseList from "../nurseList";
import { Instancercv } from "@/api/api";
import dayjs from "dayjs";
import { getNurseConfist, templateToData } from "@/utils/getNursingConfig";
import greyNotice from "@/assets/image/greyNotice.png";
import yuanquan from "@/assets/images/yuanquan.png";
import { nurseOpen } from "@/redux/Nurse/Nurse";
import { calc } from "antd/es/theme/internal";
import { setTimeout } from "timers/promises";

const { confirm } = Modal;

export default function NurseConfEdit(props: any) {
  const [delItem, setDelItem] = useState<any>({});
  const [isUseDefault, setIsUseDefault] = useState(1);
  const [isShowChooseTemp, setIsShowChooseTemp] = useState(true);
  const [nurseList, setNurseList] = useState(props.nurseList);
  const [confirmSave, setConfirmSave] = useState(false);
  const [tempList, setTempList] = useState([]);
  const [nurseName, setNurseName] = useState("");
  const [saveType, setSaveType] = useState(1);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [confirmType, setConfirmType] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    // setTimeout(function (){
    //     // 定时器逻辑
    //     console.log('111122');
    //     window.location.reload();
    //     // clearTimeout(time)
    // }, 3000) as any;
    // setTimeout(() => {
    //     // callback();
    //     console.log('Timeout callback executed.');
    //   }, 3000)
    window.location.href = window.location.href;
    console.log(1122222222);
  }, [nurseList]);

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
  const [defaultTempInfo, setDefaultTempInfo] = useState(items[0]);
  const modalContentMap = {
    empty: {
      title: "删除项目",
      content: () => {
        return (
          <div
            style={{ textAlign: "center", height: "4rem", lineHeight: "4rem" }}
          >
            确认清空该护理计划？
          </div>
        );
      },
      okBtnText: "确定",
      okFn: () => {
        setNurseList([]);
      },
    },
    delete: {
      title: "删除项目",
      content: () => {
        return (
          <div
            style={{ textAlign: "center", height: "4rem", lineHeight: "4rem" }}
          >
            确认删除该项任务？
          </div>
        );
      },
      okBtnText: "确定",
      okFn: () => {
        const delList = nurseList.filter((item: any, index: number) => {
          return index !== +delItem.index;
        });
        setNurseList(delList);
      },
    },
    use: {
      title: "默认模版",
      okBtnText: "确认",
      content: () => {
        return (
          <div
            style={{ textAlign: "center", height: "4rem", lineHeight: "4rem" }}
          >
            默认模版该计划？
          </div>
        );
      },
      okFn: () => {
        setNurseList(tempList);
      },
    },
    save: {
      title: "应用护理计划",
      okBtnText: "应用",
      content: () => {
        return (
          <div style={{ textAlign: "center", height: "4rem" }}>
            <p style={{ paddingBottom: "1rem" }}>确认应用护理计划？</p>
            <Radio.Group
              style={{ marginBottom: "1rem" }}
              name="radiogroup"
              defaultValue={1}
              options={[
                { value: 1, label: "立即生效" },
                { value: 2, label: "次日生效" },
              ]}
              onChange={(e: any) => setSaveType(e.target.value)}
            />
          </div>
        );
      },
      okFn: () => {
        saveTemplate();
      },
    },
  } as any;
  const onFinish = () => {
    if (!nurseName) return message.warning("请填写护理名称！");
    if (!hours || !minutes) return message.warning("请填写护理时间！");
    if (nurseName.length > 10) return message.warning("名称不能超过10个字符");
    const hoursVal = parseFloat(hours);
    const minutesVal = parseFloat(minutes);
    const hoursFormat = hoursVal < 10 ? `0${hoursVal}` : hoursVal;
    const minutesFormat = minutesVal < 10 ? `0${minutesVal}` : minutesVal;
    const templateTime = new Date(
      `1970-01-01 ${hoursFormat}:${minutesFormat}`
    ).getTime();
    const isHasTemp = nurseList.find((item: any) => {
      return +item.key === +templateTime;
    });
    if (isHasTemp) return message.warning("该护理时间已存在请重新选择！");
    setNurseList([
      ...nurseList,
      {
        key: templateTime.toString(),
        status: "todo",
        time: `${hoursFormat}:${minutesFormat}`,
        title: nurseName,
      },
    ]);
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
    setDefaultTempInfo(info);
    getPersonTemplate(+info.key);
  };

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
        deviceId: props.sensorName,
        config: JSON.stringify(list),
        templateEffectiveFlag: saveType,
        templateUpdatetime: new Date().getTime(),
      },
    }).then((res) => {
      dispatch(nurseOpen(false));
    });
  };

  const chooseTemp = () => {
    setIsShowChooseTemp(false);
    setConfirmSave(true);
    setConfirmType("use");
  };

  const delTemp = (params: any) => {
    setDelItem(params);
    setConfirmSave(true);
    setConfirmType("delete");
  };

  return (
    <>
      <div className="nurse_edit_box">
        <div className="nurse_edit_left">
          <h3 className="text-[#000] text-[1.3rem] font-semibold text-[PingFang SC] mb-[1.2rem]">
            创建{props.name}的护理项
          </h3>
          <div className="pc_use_nurse_form">
            <div className="form_item">
              <span className="form_title  w-[6rem]">应用护理模版：</span>
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
            </div>

            <div className="form_item">
              <span className="form_title  w-[4rem]">护理任务：</span>
              <Input
                placeholder="请输入所添加的护理任务的名称"
                className="h-[2.5rem]"
                style={{ width: "24rem" }}
                onChange={(e) => {
                  setNurseName(e.target.value);
                }}
              />
            </div>

            <div className="form_item">
              <span className="form_title w-[4rem]">护理时间：</span>
              <div className="time_item h-10">
                <div>
                  <Select
                    showSearch
                    placeholder="时"
                    optionFilterProp="children"
                    className="h-[2.5rem] flex justify-center"
                    style={{ width: "9rem" }}
                    onChange={(value) => setHours(value as string)}
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
                </div>
                <span className="split"> : </span>
                <div>
                  <Select
                    showSearch
                    placeholder="分"
                    optionFilterProp="children"
                    className="h-[2.5rem] flex justify-center"
                    style={{ width: "9rem" }}
                    onChange={(value) => setMinutes(value as string)}
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
                </div>
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "28rem", height: "2.5rem" }}
              onClick={onFinish}
            >
              添加护理任务
            </Button>
          </div>
        </div>
        <div className="nurse_edit_right">
          <div className="flex justify-between items-center font-semibold mb-[10px] px-[1rem] pt-[1rem]">
            <div className="flex-1  text-[1.3rem] ">
              {`预览${props.name}护理项目`}
            </div>
            <span
              className="text-[#929EAB] w-10"
              onClick={() => {
                setConfirmSave(true);
                setConfirmType("empty");
              }}
            >
              清空
            </span>
          </div>

          <div className="bg-[#F5F8FA] flex items-center mx-[1rem] pl-[0.5rem]">
            <img
              className="w-[15px] h-[15px]  bg-[#F5F8FA] mr-[5px]"
              src={greyNotice}
              alt=""
            />
            <div className="text-[0.8rem] flex-1 text-[#929EAB] pr-[5px] py-[3px]">
              当前内容仅作为效果预览，不可作为实际页面使用
            </div>
          </div>
          <div className="right_nurse_list">
            <NurseList
              list={nurseList}
              delTemp={delTemp}
              operType="add"
              extParams={{ className: "modify" }}
            />
          </div>
          {nurseList.length > 0 && (
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "calc(100% - 2rem)",
                margin: "0 1rem",
                height: "3rem",
              }}
              onClick={() => {
                setConfirmType("save");
                setConfirmSave(true);
              }}
            >
              保存护理计划
            </Button>
          )}
        </div>
      </div>
      {isShowChooseTemp && (
        <Modal
          style={{
            borderRadius: "1rem",
            height: "31rem",
          }}
          open={isUseDefault === 2}
          onCancel={() => {
            setIsShowChooseTemp(false);
          }}
          footer={[
            // 自定义页脚，只包含确认按钮
            <Button
              key="ok"
              type="primary"
              style={{ padding: "0 1rem", height: "2rem", marginTop: "1.2rem" }}
              onClick={chooseTemp}
            >
              选择此模版
            </Button>,
          ]}
          width={"40.45rem"}
        >
          <div className="default-popup">
            <div className="w-full items-center ">
              <Space direction="vertical">
                <Dropdown
                  menu={{ items, onClick: handleDropdownClick }}
                  placement="bottom"
                  className="nurse_edit_dropdown"
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
                      style={{ width: "0.7rem", height: "0.7rem" }}
                      src={shan}
                      alt=""
                    />
                  </Button>
                </Dropdown>
              </Space>
              <div className="flex w-[45%] items-center pl-[0.5rem] mt-[0.4rem] bg-[#F5F8FA]">
                <img
                  className="w-[1rem] h-[1rem] mr-[0.5rem]"
                  src={yuanquan}
                  alt=""
                />
                <span className="text-[0.8rem]">
                  {" "}
                  特点：{defaultTempInfo.value}
                </span>
              </div>
            </div>
            <NurseList
              list={tempList}
              extParams={{ isShowTime: true, className: "preview" }}
            ></NurseList>
          </div>
        </Modal>
      )}

      <Modal
        title={
          modalContentMap[confirmType] && modalContentMap[confirmType].title
        }
        style={{ height: "4rem" }}
        okText={
          modalContentMap[confirmType] && modalContentMap[confirmType].okBtnText
        }
        cancelText="取消"
        visible
        open={confirmSave}
        onOk={() => {
          setConfirmSave(false);
          modalContentMap[confirmType] && modalContentMap[confirmType].okFn();
        }}
        onCancel={() => setConfirmSave(false)}
      >
        {modalContentMap[confirmType] && modalContentMap[confirmType].content()}
      </Modal>
    </>
  );
}
