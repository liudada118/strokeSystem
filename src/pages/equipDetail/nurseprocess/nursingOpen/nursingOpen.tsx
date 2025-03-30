import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select, message } from "antd";
import "./NursingOpen.scss";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
// import type { MenuProps } from 'antd';
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useSelector, useDispatch} from "react-redux";
import { organizeIdSelect } from "@/redux/premission/premission";
import shan from "../../../../assets/images/shanjiao.png";
import { Instancercv } from "@/api/api";
import NursingStencil from "./nursingStencil";
import NurseTable from "../../../setting/nurseSetting/NurseSetting";
import dayjs from "dayjs";
import { templateToData } from "../../../setting/nurseSetting/NurseSetting";
import { nurseIsOpenAdd } from '@/redux/Nurse/Nurse'
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
  saveNurseTemplate: any;
}
// 修改函数名为大写开头，符合 React 组件命名规范
function NursingOpen(props: propsType) {
  const { nursePersonTemplate } = props;
  console.log(props, "props................111111...........222222222");
  const [projectName, setProjectName] = useState<DefaultOptionType[]>([]); // 修改为数组类型
  const [hours, setHours] = useState<string>("1小时"); // 小时
  const [minutes, setMinutes] = useState<string>("1分钟"); // 分钟
  const [template, setTemplate] = useState<string>(""); // 模版
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("自理老人护理模版");
  const [type, setType] = useState(4);
  const token = localStorage.getItem("token");
  const organizeId = useSelector(organizeIdSelect);
  const [dataList, setDataList] = useState([]);
  const [tempplateArr, setTempplateArr] = useState([]);
  const [previewList, setPreviewList] = useState([]) as any;
  const stsNamew = window.location.href.split("/")[6] || "";
    const dispatch = useDispatch()

  const [templateId, setTemplateId] = useState(null) as any;
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setPreviewList(staticTemp)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      key: "1",
      label: "自理老人护理模版",
    },
    {
      key: "2",
      label: "半自理老人护理模版",
    },
    {
      key: "3",
      label: "失能老人护理模版",
    },
  ];
  const handleDropdownClick = (e: any) => {
    const tit: any = items.find((item) => item.key === e.key);
    console.log(e.key, "......dsdsdddddddddddd");
    getStaticTempList(Number(e.key))
    setType(Number(e.key));
    setTitle(tit?.label); // 更新标题为点击的菜单项
  };
  const [staticTemp, setStaticTemp] = useState([]);
  const getStaticTempList = (type: any) => {
    Instancercv({
        method: "get",
        url: "/nursing/getNursingConfig",
        headers: {
            "content-type": "multipart/form-data",
            "token": localStorage.getItem("token")
        },
        params: {
            deviceId: sensorName,
            type
        }
    }).then((res: any) => {
        const nursingConfig = JSON.parse(res.data.nursingConfig)
        console.log(nursingConfig, 'nursingConfig......121231232........')
        // setNursePersonTemplate(nursingConfig)
        setStaticTemp(nursingConfig||[])
    })
  }
  const [dataLIst, setDateList] = useState([]);
  const handleSelect = (value: any) => {
    setDateList(value);
  };
  const sensorName = window.location.href.split("/")[6] || "";
  //   const [nursePersonTemplate, setNursePersonTemplate] = useState([])
  const useSelectOpen = useSelector((state: any) => state.nurse.nurseOpen);
  console.log(useSelectOpen, "......useSelectOpen");

  const getPersonTemplate = () => {
    Instancercv({
      method: "get",
      url: "/nursing/getNursingConfig",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: sensorName,
        type: templateId,
      },
    }).then((res: any) => {
      const nursingConfig = JSON.parse(res.data.nursingConfig);
      console.log(nursingConfig, "...111111...nursingConfig");
      // setNursePersonTemplate(nursingConfig)
    });
  };
  /**
   * 获取护理模板
   */
  const getNurseTemplate = () => {
    Instancercv({
      method: "get",
      url: "/nursing/getNurseTemplateData",
      headers: {
        "content-type": "multipart/form-data",
        token: token,
      },
      params: {
        organizeId: organizeId,
      },
    }).then((res) => {
      const options: any = (res.data.data || []).map((item: any) => {
        console.log(item, "..............555555555555.................");
        return {
          value: item.id,
          label: item.templateName,
          template: item.template,
          type: item.type,
          organizeId: item.organizeId,
        };
      });
      setTemplateId(options[0].value);
      setProjectName(options);
    });
  };

  const [personTemplate, setPersonTemplate] = useState<any>([]);
  const [nurseTemplate, setNurseTemplate] = useState<any>([]);
  // 通过id获取护理模板
  const getNurseTemplateToId = (arr: any, id: any) => {
    const template: any = arr.find((item: any) => item.id == id);
    setTemplateId(id);
    const data = templateToData(template.template);
    if ((type as any) == "person") {
      setPersonTemplate(data);
    } else {
      setNurseTemplate(data);
    }
  };
  const addTempNurse = () => {
    const hoursVal = parseFloat(hours) + 1;
    const minutesVal = parseFloat(minutes) + 1;
    const hoursFormat = hoursVal < 10 ? `0${hoursVal}` : hoursVal;
    const minutesFormat = minutesVal < 10 ? `0${minutesVal}` : minutesVal;
    const today = dayjs().format('YYYY-MM-DD');
    const templateTime = new Date(
      `1970-01-01 ${hoursFormat}:${minutesFormat}`
    ).getTime();
    if (!templateTime) return message.error("请选择时间");
    if (!template) return message.error("请填写护理项目模版");
    Instancercv({
      method: "post",
      url: "/nursing/addNursingTemplItem",
      headers: {
        "content-type": "multipart/form-data",
        token: token,
      },
      params: {
        templateId: templateId,
        templateTime: templateTime,
        templateContent: template,
      },
    }).then((res) => {
      console.log(res.data.msg);
      if (res.data.msg.includes("success")) {
        getNurseTemplate();
        getPersonTemplate();
        message.success("添加成功");
      } else {
        message.error(res.data.msg);
      }
    });
  };
  /**
   *
   * @param str
   * @returns
   */
  const templateToData = (str: string) => {
    
    const arr: any = [];
    const splitArr = str.replace("{", "").replace("}", "").split(",");
    console.log(splitArr);
    splitArr.forEach((splitItem, index) => {
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
  useEffect(() => {
    getNurseTemplate();
  }, []);
  useEffect(() => {
    handleChange(templateId);
  }, [projectName]);
  const handleChange = (value: string) => {
    setTemplateId(value);
    let previewItem = projectName.find((item: any) => {
      if (item.value == value) {
        return item;
      }
    }) as any;
    if (!previewItem) return;
    const templateList = templateToData(previewItem.template);
    setPreviewList(templateList);
  };
  
  useEffect(() => {
    getPersonTemplate();
  }, [sensorName, templateId]);
  const useSelect = useSelector((state: any) => state.nurse.nurseOpen);
  return (
    <>
      {useSelect ? (
        <div className="w-full h-[43rem] flex justify-between">
          <div className="w-[43rem] h-[35rem] bg-[#fff]">
            <div className="w-[40rem] h-[30rem] ml-[2.7rem] mt-[2rem] ">
              <h3 className="text-[#000] text-[1.3rem] font-semibold text-[PingFang SC] mb-[1.2rem]">
                创建老陈的护理项
              </h3>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle">护理项目名称 : </div>
                <Select
                  defaultValue={templateId} // 默认值
                  style={{ width: "23rem", height: "2.48rem" }}
                  placeholder="请输入所添加的护理项目名称"
                  onChange={handleChange}
                  options={projectName} // 使用符合要求的数组
                />
              </div>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle">护理项目时间 : </div>
                <Select
                  showSearch
                  style={{
                    width: "8.1rem",
                    height: "2.48rem",
                    marginRight: "1.35rem",
                  }}
                  placeholder="小时"
                  optionFilterProp="children"
                  value={hours}
                  onChange={(value) => setHours(value as string)}
                >
                  {/* 动态生成小时选项 */}
                  {[...Array(23)].map((item, index) => (
                    <Select.Option key={index} value={index.toString()}>
                      {index + 1}点
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  showSearch
                  style={{ width: "8.1rem", height: "2.48rem" }}
                  placeholder="分钟"
                  optionFilterProp="children"
                  value={minutes}
                  onChange={(value) => setMinutes(value as string)}
                >
                  {/* 动态生成分钟选项 */}
                  {[...Array(59)].map((_, index) => (
                    <Select.Option key={index} value={index.toString()}>
                      {index + 1}分钟
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle">护理项目模版 : </div>
                <p>
                  <Input
                    style={{ height: "2.7rem", width: "14rem" }}
                    placeholder="请输入模版名称"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  />
                </p>
                <span className="ml-2 mr-2">(选填)</span>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  type="primary"
                  className="w-[5.4rem] h-[2.2rem] text-[#fff]"
                >
                  选择模版
                </Button>
              </div>
              <Button
                onClick={() => addTempNurse()}
                className="w-full h-[2.7rem]"
                type="primary"
                block
              >
                新建护理项目
              </Button>
            </div>
          </div>
          <div className="w-[27rem] h-[43rem] bg-[#fff]">
            <NurseTable
            templateId={templateId}
              data={previewList}
              sensorName={sensorName}
              type="project"
                getNurseTemplate={getNurseTemplate}
                saveNurseTemplate={props.saveNurseTemplate}
            ></NurseTable>
          </div>
          <Modal
            width={"40.45rem"}
            okText="应用此模版"
            cancelText="取消"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              // 自定义页脚，只包含确认按钮
              <Button key="ok" type="primary" onClick={handleOk}>
                应用此模版
              </Button>,
            ]}
          >
            <div className="h-[32rem] w-[39rem] bg-[#ffff]">
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
                    }}
                  >
                    {title}{" "}
                    <img
                      style={{ width: "0.5rem", height: "0.5rem" }}
                      src={shan}
                      alt=""
                    />
                  </Button>
                </Dropdown>
              </Space>
              <NursingStencil
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
        "11"
      )}
    </>
  );
}

export default NursingOpen;
