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
import { useSelector, useDispatch } from "react-redux";
import { organizeIdSelect } from "@/redux/premission/premission";
import shan from "../../../../assets/images/shanjiao.png";
import { Instancercv, instance } from "@/api/api";
import NursingStencil from "./nursingStencil";
import NurseTable from "../../../setting/nurseSetting/NurseSetting";
import dayjs from "dayjs";
import { templateToData } from "../../../setting/nurseSetting/NurseSetting";
import { nurseIsOpenAdd } from '@/redux/Nurse/Nurse'
import yuanquan from '../../../../assets/images/yuanquan.png'
import { useGetWindowSize } from '@/hooks/hook'
import Title from "@/components/title/Title";
import dianyuanquan from '../../../../assets/images/yanquan.png'
import { Picker, Popup } from "antd-mobile";
import NurseTitle from './NurseTitle'
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
  const { nursePersonTemplate } = props;
  const windowSize = useGetWindowSize()
  const [projectName, setProjectName] = useState<DefaultOptionType[]>([]); // 修改为数组类型
  const [hours, setHours] = useState<string>("1点"); // 小时
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
  const yyyyyyy = useSelector((state: any) => state.nurse.sensorName)
  //是否隐藏单选按钮
  const { state } = useLocation()


  console.log(state, '.........  statestatestatestate');

  const navigator = useNavigate()
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
      key: "49",
      label: "自理老人护理模版",
      value: "意识清醒，行动自如，需生活辅助"
    },
    {
      key: "47",
      label: "半自理老人护理模版",
      value: "部分活动受限，需助行/如厕协助"
    },
    {
      key: "3",
      label: "失能老人护理模版",
      value: "卧床为主，需全护理"
    },

  ];
  const handleDropdownClick = (e: any) => {
    const tit: any = items.find((item) => item.key === e.key);

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
      setStaticTemp(nursingConfig || [])
    })
  }
  const [dataLIst, setDateList] = useState([]);
  const handleSelect = (value: any) => {
    setDateList(value);
  };
  const sensorName: any = windowSize ? window.location.href.split("/")[6] : yyyyyyy;
  const [nursePersonTemplateTtitle, setNursePersonTemplateTitle] = useState([])
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
        // type: templateId,
      },
    }).then((res: any) => {
      console.log(res, '.............resresresresres');

      //注意这个东西要揭开
      // const nursingConfig = JSON.parse(res.data.nursingConfig);
      // console.log(nursingConfig, "...111111...nursingConfig");
      // setNursePersonTemplateTitle(nursingConfig)
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
        organizeId: 'common',
      },
    }).then((res) => {
      const options: any = (res.data.data || []).map((item: any) => {
        return {
          value: item.id,
          label: item.templateName,
          template: item.template,
          type: item.type,
          organizeId: item.organizeId,
        };
      });
      setTemplateId(options[0].value || '');
      setProjectName(options);
    });
  };

  const [personTemplate, setPersonTemplate] = useState<any>([]);
  const [nurseTemplate, setNurseTemplate] = useState<any>([]);
  // 通过id获取护理模板
  const getNurseTemplateToId = (arr: any, id: any) => {
    const template: any = arr.find((item: any) => item.id == id) || '';
    setTemplateId(id);
    const data = templateToData(template.template);
    if ((type as any) == "person") {
      setPersonTemplate(data);
    } else {
      setNurseTemplate(data);
    }
  };
  const addTempNurse = () => {
    console.log();

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
        if (!useSelect) {
          navigator('/userInfo_NurseTable')
        }

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
  useEffect(() => {
    getNurseTemplate();

    Instancercv({
      method: "get",
      url: "/device/selectSinglePatient",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        sensorName: 'KgvDXUvdEs9M9AEQDcVc',
        phoneNum: localStorage.getItem('phone')
      }
    }).then((res: any) => {
      setName(res.data.data.patientName)
    })
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
  const [group, setGroup] = useState(1)
  const [visible1, setVisible1] = useState(false)

  return (
    <>
      {useSelect ? (
        <div className="w-full h-[43rem] flex justify-between">
          <div className="w-[43rem] h-[35rem] bg-[#fff]">
            <div className="w-[40rem] h-[30rem] ml-[2.7rem] mt-[2rem] ">
              <h3 className="text-[#000] text-[1.3rem] font-semibold text-[PingFang SC] mb-[1.2rem]">
                创建{name}的护理项
              </h3>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle flex pr-[0.7rem]  text-[#000] font-bold">应用护理模版 : </div>
                {/* <Select
                  defaultValue={templateId} // 默认值
                  style={{ width: "23rem", height: "2.48rem" }}
                  placeholder="请输入所添加的护理项目名称"
                  onChange={handleChange}
                  options={projectName} // 使用符合要求的数组
                /> */}
                <Radio.Group
                  name="radiogroup"
                  defaultValue={1}
                  onChange={(e) => {
                    setGroup(e.target.value);
                    if (e.target.value === 2) {
                      setIsModalOpen(true)
                    }
                    getNurseTemplateToId(projectName, templateId);
                  }}
                  value={group}
                  options={[
                    { value: 1, label: '否' },
                    { value: 2, label: '是' },

                  ]}
                />
              </div>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle text-[#000] font-bold">护理名称 : </div>
                <p className="pl-[0.6rem]">
                  <Input
                    style={{ height: "2.7rem", width: "23rem", }}
                    placeholder="请输入模版名称"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  />
                </p>
              </div>
              <div className="NursingOpenVal">
                <div className="NursingOpenTitle   text-[#000] font-bold">护理时间 : </div>
                <Select
                  showSearch
                  style={{
                    width: "8.1rem",
                    height: "2.48rem",
                    marginRight: "0.7rem",
                    paddingLeft: "0.6rem"
                  }}
                  placeholder="点"
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
                </Select> :
                <Select
                  showSearch
                  style={{ width: "8.1rem", height: "2.48rem", marginLeft: "0.7rem" }}
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
              <Button
                onClick={() => addTempNurse()}
                className="w-[27.5rem] h-[2.7rem]"
                type="primary"
              >
                新建护理项目
              </Button>
            </div>
          </div>
          <div className="w-[27rem] h-[43rem] bg-[#fff]">
            <NurseTable
              name={name}
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
              </Button>
            ]}
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
                      fontSize: "1.2rem",
                    }}
                  >
                    {title}
                    <img
                      style={{ width: "0.5rem", height: "0.5rem" }}
                      src={shan}
                      alt=""
                    />
                  </Button>
                </Dropdown>
              </Space>
              <p className="flex items-center pl-[0.9rem] mt-[0.4rem] bbg-[#F5F8FA]"><img className="w-[0.75rem] h-[0.75rem]" src={yuanquan} alt="" />特点:{
                type == 1 ? '意识清醒，行动自如，需生活辅助' : type == 2 ? '部分活动受限，需助行/如厕协助' : '卧床为主，需全护理'
              }</p>
              <NursingStencil
                stylee='2'
                sensorName={sensorName}
                nursePersonTemplate={previewList || staticTemp}
                statue={2}
                title={"00000"}
                type={type}
              ></NursingStencil>
            </div>
          </Modal>
        </div>
      ) : <div className="w-[100%] bg-[#F5F8FA]" style={{ height: "calc(100%-40px)" }}>
        <div className="w-[100%] h-[20%]">
          <Title ></Title>
          <NurseTitle title={state === 'addnurse' ? '新建护理任务' : '创建护理计划'}></NurseTitle>
        </div>
        <div className="w-[96%] h-[90%] bg-[#FFFFFF] mx-[2%] mt-[0.5rem] rounded-lg" style={{ height: "80%", paddingTop: state == 'addnurse' ? '2.2rem' : '0.5rem' }}>
          {
            state ? '' : <div className="flex w-[100%] px-3  pt-6 items-center mb-[1.5rem] ">
              <div className="flex  mr-[3%]  items-center"><img style={{ width: "6px", height: "6px" }} src={dianyuanquan} alt="" /><span className="pl-[0.5rem] pr-[0.5rem] text-[1.2rem] font-medium">应用护理模版 : </span></div>
              <Radio.Group
                name="radiogroup"
                defaultValue={1}
                onChange={(e) => {
                  setGroup(e.target.value);
                  if (e.target.value === 2) {
                    setVisible1(true)
                  }
                  getNurseTemplateToId(projectName, templateId);
                }}
                value={group}
                options={[
                  { value: 1, label: '否' },
                  { value: 2, label: '是' },

                ]}
              />
            </div>
          }

          <div className="flex px-3 items-center " style={{ marginTop: state === 'addnurse' ? '0.4rem' : '', marginBottom: state === 'addnurse' ? '2rem' : "1.5rem" }}>
            <div className="flex w-[28%] mr-[3%] items-center text-[#000] font-bold"><img style={{ width: "6px", height: "6px" }} src={dianyuanquan} alt="" /><p className="text-[1.2rem] pl-[0.6rem] font-medium">护理名称 :</p> </div>

            <Input
              style={{ height: "3rem", width: "80%", background: "#F5F8FA", border: "none", marginLeft: '2%' }}
              placeholder="请输入所添加护理项目名称"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />

          </div>
          <div className="flex px-3 items-center mb-[1.5rem]" style={{ marginTop: state === 'addnurse' ? '2rem' : '1.5rem' }}>
            <div className="flex w-[28%] mr-[3%] items-center text-[#000] font-bold"><img style={{ width: "6px", height: "6px" }} src={dianyuanquan} alt="" /><p className="text-[1.2rem] pl-[0.6rem] font-medium">护理时间 :</p> </div>
            <Select
              showSearch
              style={{
                width: "38%",
                height: "3rem",
                marginRight: "0.7rem",
                paddingLeft: "0.6rem"
              }}
              placeholder="点"
              optionFilterProp="children"
              value={hours}
              onChange={(value) => setHours(value as string)}
            >

              {[...Array(23)].map((item, index) => (
                <Select.Option key={index} value={index.toString()}>
                  {index + 1}点
                </Select.Option>
              ))}
            </Select> :
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
            style={{ height: "3.5rem", marginTop: state === 'addnurse' ? '1rem' : "1.5rem" }}
            onClick={() => addTempNurse()}
            className="w-[96%] mx-[2%]  flex"
            type="primary"

          >
            {
              state ? '保存护理项目' : '新建护理项目'
            }

          </Button>

        </div>
        {
          visible1 ? <Popup
            style={{
              borderRadius: "1rem",
              height: "79vh"
            }}
            visible={visible1}
            onMaskClick={() => {
              setVisible1(false)
            }}
            onClose={() => {
              setVisible1(false)
            }}
            bodyStyle={{ height: '70vh' }}
          >
            <div className="w-full ">
              <div className="w-full h-[3rem] mt-[1.35rem] flex items-center ">
                <div onClick={() => setVisible1(false)} className="pl-[1.3rem]">
                  <LeftOutlined />
                </div>
                <div>
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
                          marginLeft: "58%"
                        }}
                      >
                        {title}
                        <img
                          style={{ width: "0.5rem", height: "0.5rem" }}
                          src={shan}
                          alt=""
                        />
                      </Button>
                    </Dropdown>
                  </Space>
                </div>
              </div>
              <NursingStencil
                stylee='2'
                sensorName={sensorName}
                nursePersonTemplate={previewList || staticTemp}
                statue={2}
                title={"00000"}
                type={type}
              ></NursingStencil>
            </div>


          </Popup> : ""
        }

      </div>


      }
    </>
  );
}

export default NursingOpen;
