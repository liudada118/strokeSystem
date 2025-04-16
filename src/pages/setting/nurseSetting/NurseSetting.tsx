import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.scss";
import { Button, message, Modal, Radio } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import greyNotice from "@/assets/image/greyNotice.png";
import { Instancercv } from "@/api/api";
import sheetDelete from "@/assets/images/shanchu.png";
import { useSelector, useDispatch } from "react-redux";
import Recording from "@/pages/equipDetail/nurseprocess/recording";
import { instance } from "../../../api/api";
import { useGetWindowSize } from "@/hooks/hook";
import Title from "@/components/title/Title";
import NurseTitle from "../../equipDetail/nurseprocess/nursingOpen/NurseTitle";
import lanse from "../../../assets/images/蓝色.png";
import { useNavigate } from "react-router-dom";
import { getQueryParams } from "@/utils/getQueryParam";
import { log } from "node:console";
const { confirm } = Modal;
/**
 *
 * @param str
 * @returns
 */
export const templateToData = (str: string) => {
  const arr: any = [];
  const splitArr = str.replace("{", "").replace("}", "").split(",") || "";
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
interface tableProps {
  data: Array<any>;
  templateId?: number;
  getNurseTemplate?: Function;
  type: string;
  sensorName?: string;
  childData?: string;
  currentTime?: number;
  saveNurseTemplate?: any;
  name?: any;
  deleteNurse?: any;
}
export default function NurseTable(props: tableProps) {
  const token = localStorage.getItem("token");
  const nurseOpne = useSelector((state: any) => state.nurse.open);
  const nurseIsOpenAdd = useSelector((state: any) => state.nurse.nurseOpen);
  const isPhone = useGetWindowSize();
  const navigate = useNavigate();
  console.log(props.data, nurseIsOpenAdd, '................. NurseTableNurseTableNurseTable');

  const title = [
    {
      key: "completionTime",
      titleValue: "时间",
      width: "6rem",
      type: "按时间自动排序",
    },
    {
      key: "templateTitle",
      titleValue: "护理内容",
    },
    {
      key: "status",
      titleValue: "状态",
      width: "4rem",
    },
    {
      key: "delete",
      titleValue: "删除",
      width: "4rem",
    },
    // {
    //   key: 'update',
    //   titleValue: '修改/删除',
    //   width: '4rem'
    // },
  ];

  let {
    data,
    getNurseTemplate,
    type,
    sensorName,
    saveNurseTemplate,
    currentTime,
    name,
  } = props;
  if (isPhone) {
    type = getQueryParams("type");
  }
  console.log(isPhone, type, "isPhone....................");
  const setting = window.location.href.split("/")[4] || "";
  /**
   * 计算图表上面的状态
   * @param curStatus
   * @param lastStatus
   * @returns
   */
  const calUpConnect = (curStatus: string, lastStatus: string): string => {
    if (!lastStatus) {
      return "";
    } else {
      if (curStatus == "todo") {
        return "#E6EBF0";
      } else {
        return "#0072EF";
      }
    }
  };

  /**
   * 计算图表下面的状态
   * @param curStatus
   * @param lastStatus
   * @returns
   */
  const calDownConnect = (nextStatus: string): string => {
    // if(curStatus)
    if (!nextStatus) {
      return "";
    } else {
      if (nextStatus == "todo") {
        return "#E6EBF0";
      } else {
        return "#0072EF";
      }
    }
  };

  /**
   * 删除模板中的项目
   * @param time
   */
  const deleteNurse = (params: any) => {
    // 去掉模版的删除
    props.deleteNurse && props.deleteNurse(params);
    return;
    // 这是之前有模版的时候的删除
    Instancercv({
      method: "post",
      url: "/nursing/delNursingTempItem",
      headers: {
        "content-type": "multipart/form-data",
        token: token,
      },
      params: {
        // TODO 目前去掉了模版，没有模版templateId，这个直接获取到的是个人下面的护理项目，后端接口需要去掉template，或者换个接口
        // templateId: String(templateId),
        templateTime: String(params.key),
      },
    }).then((res) => {
      message.info("删除成功");
      getNurseTemplate && getNurseTemplate();
    });
  };
  const [isFals, setIsfals] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [currentCare, setCurrentCare] = useState({});

  // 待完成
  const toBeCompleted = (item: any) => {
    setCurrentCare(item);
    setIsfals(true);
  };
  const [listData, setDataLIst] = useState<any>([]);

  // 请求数据护理模版
  const [childDataLIst, setChildData] = useState<string>("");

  function getDataList() {
    // 获取当前日期
    const currentDate = dayjs();
    // 设置开始时间为当天的 00:00
    const startTime = currentDate.startOf("day");
    // 设置结束时间为当天的 23:59
    const endTime = currentDate.endOf("day");
    // 获取开始和结束时间戳
    const startTimeMillis: any = startTime.valueOf();
    const endTimeMillis: any = endTime.valueOf();
    console.log(props?.data, '..........props?.data');
    const templateData = (Array.isArray(props?.data) ? props?.data : []).map((item: any) => {
      const timestamp = dayjs().format("YYYY-MM-DD") + " " + item.time; // 拼接当天日期
      const unixTimestamp = dayjs(timestamp, "YYYY-MM-DD HH:mm").valueOf(); // 转换成时间戳
      return {
        [unixTimestamp]: item.title,
      };
    });
    instance({
      method: "post",
      url: "/sleep/nurse/getDayNurseDataTempl",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      data: {
        did: sensorName,
        startTimeMillis,
        endTimeMillis,
        templateData,
      },
    }).then((res: any) => {
      if (res && res.data.msg === "success") {
        const list: any = res.data.data.map((item: any, index: number) => {
          let dataList = JSON.parse(item.data || "{}");
          const timeItem = Array.isArray(props?.data) ? props?.data.find((tItem) => {
            const startTime = tItem.time;
            const selectedTime = dayjs(+item.templateTime).format("HH:mm");
            if (selectedTime === startTime) return true;
          }) : []

          if (timeItem) {
            dataList = {
              key: timeItem.key,
              isTemp: true, // 标识是否是模版数据
              ...dataList,
              completionTime: +item.templateTime,
            };
          }
          delete item.data;
          return {
            ...item,
            ...dataList,
            templateTitle: item.templateTitle || dataList.nurseProject,
          };
        });
        setDataLIst(list);
      }
    });
  }

  useEffect(() => {
    if (sensorName) {
      getDataList();
    }
  }, [currentTime]);
  useEffect(() => {
    // type !== "project"  不展示图片信息
    if (sensorName && type !== "project") {
      getDataList();
    }
  }, [data, sensorName]);

  const nurseListData = useSelector((state: any) => state.nurse.nurseListData);
  console.log(nurseListData, "isPhone....333333333333");
  useEffect(() => {
    console.log(type, "isPhone....22222222");
    if (type === "project") {
      const nurseData = isPhone ? nurseListData : props.data;
      const list: any = Array.isArray(nurseData) ? (nurseData || []).map((item: any) => {
        return {
          ...item,
          completionTime: +item.key,
          templateTime: +item.key,
          templateTitle: item.title,
          status: item.status === "todo" ? false : true,
          isTemp: true,
        };
      }) : [];
      setDataLIst(list);
    }
  }, [data, nurseListData]);
  const handleChildData = (data: string, val: any) => {
    setChildData(data);
  };
  const updateDelet = (val: any) => { };
  const saveTemplate = () => {
    const list = listData.map((item: any) => {
      return {
        key: item.key,
        title: item.templateTitle,
        status: "todo",
        time: dayjs(+item.key).format("HH:mm"),
      };
    });
    if (type == "project") {
      Instancercv({
        method: "post",
        url: "/nursing/updateNursingConfig",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        data: {
          deviceId: sensorName,
          config: JSON.stringify(list),
          templateEffectiveFlag: selectValue,
          templateUpdatetime: new Date().getTime()
        },
      }).then((res) => {
        message.success("保存成功");
        saveNurseTemplate();
      });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [deleteItem, setDeleteItem] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (titleModal == "保存模版") {
      saveTemplate();
    } else if (titleModal == "删除模版") {
      deleteNurse(deleteItem);
    } else if (titleModal == "清除模版") {
      Nuesempty();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const Nuesempty = () => {
    setDataLIst([]);
  };
  const addNurse = () => {
    navigate(`/userInfo_NursingOpen?sensorName=${sensorName}`, {
      state: "addnurse",
    });
  };
  const id = window.location.href.split("/")[5];
  console.log(id, ".....................idiiiiiiiii");
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)
  const [selectValue, setSelectValue] = useState(1)
  console.log(selectValue, '.......selectValue');

  const handleChangePasswordOk = async () => {
    saveTemplate()
    setIsModalChangePasswordOpen(false)
  }
  const handleChangePasswordCancel = () => {
    setIsModalChangePasswordOpen(false)
  }
  return (
    <>
      {!isPhone ? (
        <>
          <div
            className={`${nurseOpne === false
              ? ""
              : "bg-[#fff] py-[18px] mx-[15px] h-[full]"
              }`}
            style={{
              height: `${nurseOpne === false ? "38.2rem" : "100%"}`,
              // height: `${nurseOpne === false ? "auto" : "100%"}`,
              position: "relative",
            }}
          >
            {nurseOpne == "" ? (
              ""
            ) : (
              <>
                <div
                  className="flex text-[1.3rem] font-semibold mb-[10px]"
                  style={{
                    width: `${nurseOpne === false ? "auto" : "calc(100% - 15px)"
                      }`,
                  }}
                >
                  <span className="flex-1" style={{ width: "80%" }}>
                    {nurseOpne === false ? "" : `预览${name}护理项目`}
                  </span>{" "}
                  <span
                    onClick={() => {
                      setIsModalOpen(true);
                      setTitleModal("清除模版");
                    }}
                    className={`${nurseOpne === false ? "" : "w-[3.5rem]"
                      } text-center text-[1rem] text-[#0072EF] pt-[0.4rem]`}
                  >
                    {nurseOpne === false ? "" : "清空"}
                  </span>
                </div>
                <div
                  className="flex  bg-[#F5F8FA] items-center mb-[20px] pl-[0.5rem]"
                  style={{
                    width: `${nurseOpne === false ? "auto" : "calc(100% - 6.5rem)"
                      }`,
                  }}
                >
                  <img
                    className="w-[15px] h-[15px]  bg-[#F5F8FA] mr-[5px]"
                    src={greyNotice}
                    alt=""
                  />
                  <span className="flex-shrink-0  text-xs text-[#929EAB] pr-[5px] py-[3px]">
                    {nurseOpne === false
                      ? ""
                      : "当前内容仅作为效果预览，不可作为实际页面使用"}
                  </span>
                </div>
              </>
            )}
            <div
              className="flex"
              style={{
                overflowY: "auto",
                height:
                  nurseIsOpenAdd === true ? "100%" : "calc(100%)",
              }}
            >
              <div
                className="grow"
                style={{ overflow: "hidden", textAlign: "center" }}
              >
                <div className="bg-[#F5F8FA] flex  " style={{ borderRadius: "0.3rem", fontSize: "0.75rem" }}>
                  {title.map((a) => {
                    if (type == "user" && a.key == "delete") {
                      return <></>;
                    }
                    if (a.type === "按时间自动排序") {
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            // flexDirection: "column",
                            // width: "6.2rem",
                            width: nurseIsOpenAdd === true ? "7.5rem" : "6.4rem",
                            lineHeight: "1.7rem",
                            paddingLeft: "1rem",
                            paddingBottom: '5px',

                          }}
                          className="flex-shrink-0"
                        >
                          {" "}
                          <span className="text-xs ">
                            {a.titleValue}

                          </span>
                          <span className="text-[12px] text-[#929EAB]" style={{ lineHeight: '12px' }}>
                            {/* {a.type} */}
                            {/* {
                              nurseIsOpenAdd === true ? a.type : ''
                            } */}
                          </span>
                        </div>
                      );
                    }
                    if (a.key === "templateTitle") {
                      return (
                        <div
                          style={{
                            lineHeight: "1.7rem",
                            // width: "3rem"
                            textAlign: "left",
                            flex: 1,
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          护理内容
                        </div>
                      );
                    }
                    if (a.key === "status") {
                      return (
                        <div
                          className="cursor-pointer flex-shrink-0"
                          style={{
                            lineHeight: "30px",
                            //  width: "4rem", 
                            textAlign: "center", display: "flex",
                            alignItems: "center",
                            width: nurseIsOpenAdd === true ? "2.8rem" : "2.8rem",
                          }}
                        >
                          状态
                        </div>
                      );
                    }
                    if (a.key === "delete") {
                      return (
                        <div
                          style={{
                            lineHeight: "2.3rem",
                            // paddingLeft: "3.3rem",
                            width: '4rem'
                          }}
                        >
                          删除
                        </div>
                      );
                    }
                    return (
                      <div
                        onClick={(a: any) => updateDelet(a)}
                        className={`${a.width ? `w-[${a.width}] cursor-pointer  ` : "grow "
                          } text-xs py-[10px] `}
                      >
                        {/* {a.titleValue} */}
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    overflowY: "auto",
                    height: "95%",
                  }}
                // style={{
                //   overflowY: "auto",
                // }}
                >
                  {listData
                    .sort((a: any, b: any) => {
                      return (
                        Number(a.completionTime) - Number(b.completionTime)
                      );
                    })
                    .map((item: any, index: number) => {
                      return (
                        <div
                          key={"listData" + index}
                          className={` ${type !== "project" && type !== "person"
                            ? ""
                            : "isTemp"
                            } ${item.status ? "finsh" : "todo"
                            } flex py-[13px] relative items-start care_box`}
                        >
                          {title.map((keys) => {
                            const key = keys.key;
                            const timeTextColor =
                              item.status == "todo" ? "#929EAB" : "#6C7784";
                            const nurseTextColor =
                              item.status == "todo" ? "#929EAB" : "#32373E";
                            if (key == "key") {
                              return;
                            } else {
                              const titleInfo = title.filter(
                                (a) => a.key == key
                              )[0];

                              if (key == "completionTime") {
                                const color = item.status
                                  ? "#0072EF"
                                  : "#E6EBF0";
                                const upConnect = calUpConnect(
                                  item.status,
                                  data[index - 1]?.status
                                );
                                const downConnect = calDownConnect(
                                  data[index + 1]?.status
                                );
                                return (
                                  <div
                                    className="flex"
                                    style={{ width: "6.2rem" }}
                                  >
                                    <span className={`w-[3.2rem] pl-[1rem]`}>
                                      {dayjs(item[keys.key]).format("HH:mm")}
                                    </span>
                                    <div
                                      className={`ml-[0.66rem] w-[1.3rem] text-xs h-[1.3rem] rounded-[50%] bg-[${color}] text-[#fff]  flex justify-center items-center`}
                                    >
                                      {/* <div className={`w-[3px] h-[60%] bg-[${upConnect}] absolute bottom-[80%] z-0`} style={{ backgroundColor: upConnect }}></div> */}
                                      <div
                                        className={` w-[1.3rem] text-xs h-[1.3rem] rounded-[50%] bg-[${color}] text-[#fff] flex justify-center items-center z-10`}
                                        style={{ backgroundColor: color }}
                                      >
                                        {index + 1}
                                      </div>
                                      {/* <div className={`w-[3px] h-[60%] bg-[${downConnect}] absolute top-[80%] z-0`} style={{ backgroundColor: downConnect }}></div> */}
                                    </div>
                                  </div>
                                );
                              } else if (key == "status") {
                                if (!item[key]) {
                                  return (
                                    <Button
                                      disabled={
                                        setting === "setting" ? true : false
                                      }
                                      onClick={() => toBeCompleted(item)}
                                      // className={`${titleInfo.width
                                      //   ? `w-[${titleInfo.width}] text-center`
                                      //   : "grow text-left"
                                      //   } text-[${timeTextColor}]`}

                                      color="default"
                                      variant="filled"
                                      className="yyyyyyyds text-[#929EAB] bg-[#E6EBF0] w-[4rem] text-[0.76rem]"
                                      style={{ padding: "0 5px", width: "4rem" }}
                                    >
                                      待完成
                                    </Button>
                                  );
                                }
                                return (
                                  <Button
                                    disabled={
                                      setting === "setting" ? true : false
                                    }
                                    // className={`${titleInfo.width
                                    //   ? `w-[${titleInfo.width}] text-center`
                                    //   : "grow text-left"
                                    //   } text-[${timeTextColor}]`}
                                    // type="primary"
                                    style={{
                                      border: "none",
                                      background: "none",
                                      padding: "0 5px",
                                      width: "4rem",
                                    }}
                                    className="text-[#929EAB] bg-[#E6EBF0] w-[4rem]"
                                  >
                                    已完成
                                  </Button>
                                );
                              } else if (key == "delete" && type == "user") {
                                return <></>;
                              } else if (key == "delete" && type != "user") {
                                return (
                                  <div
                                    key={item.key}
                                    onClick={() => {
                                      //   setIsModalOpen(true);
                                      //   setTitleModal('删除模版')
                                      //   setDeleteItem(item)
                                      confirm({
                                        title: "删除模版",
                                        icon: <ExclamationCircleOutlined />,
                                        content: "确认删除模版?",
                                        okText: "确认",
                                        cancelText: "取消",
                                        onOk() {
                                          console.log("删除模版ok");
                                          deleteNurse(item);
                                          // 写删除项目接口
                                        },
                                        onCancel() {
                                          console.log("取消删除模版");
                                          // 取消删除不执行任何逻辑
                                        },
                                      });
                                    }}
                                    className="w-[60px]  cursor-pointer yyyyyyyds"
                                    // style={{ borderBottom: "1px solid #D8D8D8", }}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      width: '4rem'
                                    }}
                                  >
                                    <img
                                      className="w-[0.75rem] first-line:bg-[#0072EF] "
                                      src={sheetDelete}
                                      alt=""
                                    />
                                    <span className="text-xs  text-[#0072EF]">
                                      删除
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  // className={`${titleInfo.width
                                  //   ? `w-[${titleInfo.width}] text-center`
                                  //   : "grow "
                                  //   } text-[${nurseTextColor}] text-sm flex flex-col flex-1`}
                                  className="yyyyyyyds"
                                  style={{
                                    textAlign: "left",
                                    lineHeight: "1.5rem",
                                    flex: 1,
                                    paddingLeft: nurseOpne === true ? '0.8rem' : "0.2rem"
                                  }}
                                >
                                  <span
                                    className={`font-bold flex w-[full] ${nurseOpne === false
                                      ? ""
                                      : "NurseTableImgBox"
                                      } `}
                                    style={{ alignItems: "center" }}
                                  >
                                    {/* <img className='w-[0.8rem] h-[0.8rem] mt-[0.33rem] mr-3' src={shijian1} alt="" /> */}
                                    <span className="w-[full]">
                                      {item[key]}
                                    </span>
                                  </span>
                                  <span className="w-[full]">
                                    {item.notes}
                                  </span>
                                  <img
                                    className="w-[full] "
                                    src={item.uploadImage}
                                    alt=""
                                  />
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
                    })}
                </div>
                {props.type === "project" && (
                  <Button
                    type="primary"
                    style={{
                      width: "24rem",
                      height: "2.7rem",
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      bottom: "1rem",
                    }}
                    onClick={() => {
                      setIsModalChangePasswordOpen(true)
                      //   setIsModalOpen(true);
                      //   setTitleModal("保存模版");
                      // confirm({
                      //   title: "应用护理计划",
                      //   // icon: <ExclamationCircleOutlined />,
                      //   content: "确认应用护理计划?",
                      //   okText: "确认",
                      //   cancelText: "取消",
                      //   onOk() {
                      //     console.log("确认保存模版ok");
                      //     saveTemplate();
                      //   },
                      //   onCancel() {
                      //     console.log("取消保存模版");
                      //   },
                      // });
                    }}
                  >
                    保存模版
                  </Button>
                )}
                {
                  <Modal title="应用护理计划" open={isModalChangePasswordOpen} onOk={handleChangePasswordOk} onCancel={handleChangePasswordCancel}>
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
              </div>
              {
                <Modal
                  height={"266px"}
                  title={titleModal}
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p style={{ textAlign: "center" }}>确认{titleModal}?</p>
                </Modal>
              }
              {isFals ? (
                <Recording
                  careList={[...listData, ...(data || [])]}
                  recordOpen={isFals}
                  type="去完成"
                  currentCare={currentCare}
                  onClose={() => {
                    getDataList();
                    setIsfals(false);
                  }}
                  sensorName={sensorName}
                  handleChildData={handleChildData}
                  nurseConfig={""}
                ></Recording>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* // 修改样式 */}
          <div
            className="bg-[#F5F8FA] "
            style={{ width: id === "1" ? "100%" : "" }}
          >
            {
              //  <Title></Title>
              //  <NurseTitle title="设置护理计划"></NurseTitle>
            }
            <div
              // 修改样式

              className={`w-[96%] mx-[${id === "1" ? "" : "2%"
                }] bg-[#fff] mt-[1rem] `}
              // 修改样式
              style={{
                borderRadius: "0.9rem",
                width: id === "1" ? "100%" : "",
              }}
            >
              {id === "1" ? (
                <></>
              ) : (
                <>
                  <div className="flex pt-[1.8rem] pl-[1.3rem] mb-2">
                    <img
                      style={{
                        width: "4px",
                        height: "1rem",
                        marginRight: "0.3rem",
                        marginTop: "0.5rem",
                      }}
                      src={lanse}
                      alt=""
                    />
                    <span className="text-[1.3rem]">老陈的护理计划</span>
                    <span
                      className="mr-[1rem] cursor-pointer"
                      style={{ marginLeft: "auto", color: "#1677ff" }}
                      onClick={() => addNurse()}
                    >
                      添加
                    </span>
                  </div>
                  <div className="flex items-center w-[85%] h-[2rem] ml-[1rem] mb-[1rem] bg-[#F5F8FA]">
                    <img
                      className="w-[1rem] h-[1rem] mr-[5px] ml-2"
                      src={greyNotice}
                      alt=""
                    />

                    <span className="text-[1rem] text-[#929EAB]">
                      当前内容仅作为效果预览，不可作为实际页面使用
                    </span>
                  </div>
                </>
              )}

              <div className="">
                <div
                  className="grow"
                  style={{
                    overflow: "hidden",
                    textAlign: "center",
                    background: "#fff",
                  }}
                >
                  <div
                    className={`bg-[] flex px-[${id === "1" ? "" : "1rem"}`}
                    style={{}}
                  >
                    {title.map((a) => {
                      if (type == "user" && a.key == "delete") {
                        return <></>;
                      }
                      if (a.key === "completionTime") {
                        return (
                          <div
                            style={{
                              display: "flex",
                              lineHeight: "3.3rem",
                              background: "#F5F8FA",
                              paddingLeft: '0.5rem',
                              //修改样式
                              width: "",
                            }}
                            className={`w-[${id === '1' ? '36%' : '6rem'}] flex-shrink-0`}
                          >
                            {/* {" "} */}
                            <span className="text-[1.2rem] rounded-md">
                              {a.titleValue}
                            </span>
                            <span
                              className="text-[0.8rem] text-[#929EAB]"
                            >
                              {a.type}
                            </span>
                          </div>
                        );
                      }
                      if (a.key === "templateTitle") {
                        return (
                          <div
                            style={{
                              lineHeight: "3.3rem",
                              background: "#F5F8FA",
                              textAlign: 'left',
                              paddingLeft: '0.5rem',
                            }}
                            className="flex-1"
                          >
                            护理内容
                          </div>
                        );
                      }
                      if (a.key === "status") {
                        return (
                          <div
                            className="cursor-pointer flex-shrink-0"
                            style={{
                              lineHeight: "3.3rem",
                              background: "#F5F8FA",
                              width: "6rem",
                            }}
                          >
                            状态
                          </div>
                        );
                      }
                      if (a.key === "delete") {
                        return id === "1" ? null : (
                          <div
                            style={{
                              lineHeight: "3.3rem",
                              background: "#F5F8FA",
                              width: "25%",
                              borderRadius: "0 3px 3px 0",
                            }}
                          >
                            删除
                          </div>
                        );
                      }

                      return (
                        <div
                          onClick={(a: any) => updateDelet(a)}
                          className={`h-[40px] ${a.width
                            ? `w-[${a.width}] cursor-pointer  `
                            : "grow "
                            } text-xs py-[10px] `}
                        >
                          {/* {a.titleValue} */}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      overflowY: "scroll",
                      height: nurseOpne == false ? "27rem" : "30rem",
                    }}
                  >
                    {listData
                      .sort((a: any, b: any) => {
                        return (
                          Number(a.completionTime) - Number(b.completionTime)
                        );
                      })
                      .map((item: any, index: number) => {
                        return (
                          <div
                            key={"listData" + index}
                            className={` ${type !== "project" && type !== "person"
                              ? ""
                              : "isTemp"
                              } ${item.status ? "finsh" : "todo"
                              } flex py-[13px] relative items-start care_box`}
                          >
                            {title.map((keys) => {
                              const key = keys.key;
                              const timeTextColor =
                                item.status == "todo" ? "#929EAB" : "#6C7784";
                              const nurseTextColor =
                                item.status == "todo" ? "#929EAB" : "#32373E";
                              if (key == "key") {
                                return;
                              } else {
                                const titleInfo = title.filter(
                                  (a) => a.key == key
                                )[0];

                                if (key == "completionTime") {
                                  const color = item.status
                                    ? "#0072EF"
                                    : "#E6EBF0";
                                  const upConnect = calUpConnect(
                                    item.status,
                                    data[index - 1]?.status
                                  );
                                  const downConnect = calDownConnect(
                                    data[index + 1]?.status
                                  );
                                  return (
                                    //   .isTemp.care_box {
                                    //     display: flex;
                                    //     align-items: center;
                                    //     &:not(:last-child):before {
                                    //         top: 32px;
                                    //     }
                                    // }
                                    <div
                                      // className={`w-[5rem] shrink-0 text-xs ${titleInfo.width
                                      //   ? `w-[${titleInfo.width}]`
                                      //   : "grow text-left"
                                      //   } flex justify-center items-center text-[${timeTextColor}]`}
                                      className="flex  flex-shrink-0"
                                      style={{ width: "6rem" }}
                                    >
                                      {/* 修改样式 */}
                                      <span
                                        className={`w-[${id === "1" ? "36%" : "3.2rem"
                                          }] pl-[${id === "1rem" ? "" : "1rem"}]`}
                                      >
                                        {dayjs(item[keys.key]).format("HH:mm")}
                                      </span>
                                      <div
                                        className={`ml-[0.66rem] w-[1.5rem] text-xs h-[1.5rem] rounded-[50%] bg-[${color}] text-[#fff]  flex justify-center items-center`}
                                      >
                                        {/* <div className={`w-[3px] h-[60%] bg-[${upConnect}] absolute bottom-[80%] z-0`} style={{ backgroundColor: upConnect }}></div> */}
                                        <div
                                          className={` w-[1.5rem] text-xs h-[1.5rem] rounded-[50%] bg-[${color}] text-[#fff] flex justify-center items-center z-10`}
                                          style={{ backgroundColor: color }}
                                        >
                                          {index + 1}
                                        </div>
                                        {/* <div className={`w-[3px] h-[60%] bg-[${downConnect}] absolute top-[80%] z-0`} style={{ backgroundColor: downConnect }}></div> */}
                                      </div>
                                    </div>
                                  );
                                } else if (key == "status") {
                                  if (!item[key]) {
                                    return (
                                      <Button
                                        disabled={
                                          setting === "setting" ? true : false
                                        }
                                        onClick={() => toBeCompleted(item)}
                                        // className={`${titleInfo.width
                                        //   ? `w-[${titleInfo.width}] text-center`
                                        //   : "grow text-left"
                                        //   } text-[${timeTextColor}]`}

                                        color="default"
                                        variant="filled"
                                        className="w-[6rem] text-[#929EAB] bg-[#E6EBF0]"
                                        style={{
                                          width: id === "1" ? "20%" : "",
                                        }}
                                      >
                                        待完成
                                      </Button>
                                    );
                                  }
                                  return (
                                    <Button
                                      disabled={
                                        setting === "setting" ? true : false
                                      }
                                      // className={`${titleInfo.width
                                      //   ? `w-[${titleInfo.width}] text-center`
                                      //   : "grow text-left"
                                      //   } text-[${timeTextColor}]`}
                                      // type="primary"
                                      className="w-[6rem] text-[#929EAB] bg-[#E6EBF0]  flex-shrink-0"
                                    >
                                      已完成
                                    </Button>
                                  );
                                } else if (key == "delete" && type == "user") {
                                  return <></>;
                                } else if (key == "delete" && type != "user") {
                                  return id === "1" ? null : (
                                    <div
                                      key={item.key}
                                      onClick={() => {
                                        // setIsModalOpen(true);
                                        // setTitleModal("删除模版");
                                        setDeleteItem(item);
                                      }}
                                      className="w-[7rem]  cursor-pointer yyyyyyyds flex-shrink-0"
                                    // style={{ borderBottom: "1px solid #D8D8D8", }}
                                    >
                                      <img
                                        className="w-[1rem] ml-[2.6rem] bg-[#0072EF]"
                                        src={sheetDelete}
                                        alt=""
                                      />
                                      <span className="text-xs  text-[#0072EF]">
                                        删除
                                      </span>
                                    </div>
                                  );
                                }
                                return (
                                  <div
                                    // className={`${titleInfo.width
                                    //   ? `w-[${titleInfo.width}] text-center`
                                    //   : "grow "
                                    //   } text-[${nurseTextColor}] text-sm flex flex-col flex-1`}
                                    className={`flex-1`}
                                    style={{
                                      textAlign: "left",
                                      lineHeight: "1.5rem",
                                      textIndent: "3.4em",
                                      padding: '0 0.5rem',
                                    }}
                                  >
                                    <span
                                      className={`font-bold w-[full] ${nurseOpne === false
                                        ? ""
                                        : "NurseTableImgBox"
                                        } `}
                                      style={{
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {/* <img className='w-[0.8rem] h-[0.8rem] mt-[0.33rem] mr-3' src={shijian1} alt="" /> */}
                                      <span
                                        className={`pl-[${id === "1" ? "" : ""
                                          } ]  w-[10rem`}
                                      >
                                        {item[key]}
                                      </span>
                                    </span>
                                    <span className="pl-[2rem]  w-[10rem]">
                                      {item.notes}
                                    </span>
                                    <img
                                      className="pl-[2rem]  w-[10rem] "
                                      src={item.uploadImage}
                                      alt=""
                                    />
                                  </div>
                                );
                              }
                            })}
                          </div>
                        );
                      })}
                  </div>
                  {props.type === "project" && (
                    <Button
                      type="primary"
                      style={{
                        width: "24rem",
                        height: "2rem",
                        position: "absolute",
                        right: "1.5rem",
                        bottom: "3.6rem",
                      }}
                      onClick={() => {
                        setIsModalOpen(true);
                        setTitleModal("保存模版");
                      }}
                    >
                      保存模版
                    </Button>
                  )}
                </div>
                {id === "1" ? null : (
                  <Button
                    onClick={() => {
                      confirm({
                        title: "确认",
                        icon: <ExclamationCircleOutlined />,
                        content: "确认应用该护理计划?",
                        okText: "确认",
                        cancelText: "取消",
                        onOk() {
                          console.log("确认保存模版ok");
                          saveTemplate();
                        },
                        onCancel() {
                          console.log("取消保存模版");
                        },
                      });
                    }}
                    className="w-[94%] h-[4rem] mx-[3%] mb-4"
                    type="primary"
                  >
                    应用护理计划
                  </Button>
                )}
                {
                  <Modal
                    height={"266px"}
                    title={titleModal}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p style={{ textAlign: "center" }}>确认{titleModal}?</p>
                  </Modal>
                }
                {isFals ? (
                  <Recording
                    careList={[...listData, ...(data || [])]}
                    recordOpen={isFals}
                    type="去完成"
                    currentCare={currentCare}
                    onClose={() => {
                      getDataList();
                      setIsfals(false);
                    }}
                    sensorName={sensorName}
                    handleChildData={handleChildData}
                    nurseConfig={""}
                  ></Recording>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
