import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.scss";
import { Button, Input, message, Modal, TimePicker } from "antd";
import dayjs from "dayjs";
import greyNotice from "@/assets/image/greyNotice.png";
import { Instancercv } from "@/api/api";
import { TimePickerProps } from "antd/lib";
import sheetDelete from "@/assets/images/shanchu.png";
import { useSelector, useDispatch } from "react-redux";
import { organizeIdSelect } from "@/redux/premission/premission";
import { useLocation, useParams } from "react-router-dom";
import { DataContext } from "@/pages/equipDetail";
import NurseRecord from "../../equipDetail/NurseRecord";
import Recording from "@/pages/equipDetail/nurseprocess/recording";
import { instance } from "../../../api/api";
import { nurseDataList } from "../../../redux/Nurse/Nurse";
import { useGetWindowSize } from '@/hooks/hook'
import Title from "@/components/title/Title";
import NurseTitle from '../../equipDetail/nurseprocess/nursingOpen/NurseTitle'
import lanse from '../../../assets/images/蓝色.png'
import { useNavigate } from 'react-router-dom'
interface nurseProps {
  type: string;
}

/**
 *
 * @param str
 * @returns
 */
export const templateToData = (str: string) => {
  const arr: any = [];
  const splitArr = str.replace("{", "").replace("}", "").split(",") || '';
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
interface tableProps {
  data: Array<any>;
  templateId?: number;
  getNurseTemplate?: Function;
  type: string;
  sensorName?: string;
  childData?: string;
  currentTime?: number;
  saveNurseTemplate?: any;
  name?: any
}
export default function NurseTable(props: tableProps) {
  console.log(props.data, dayjs(-21420000).format('HH:mm'), "previewItem.template..2222222222222.....");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [checkedList, setCheckedList] = useState(false);
  const nurseOpne = useSelector((state: any) => state.nurse.open)
  const windowSize = useGetWindowSize()
  const navigate = useNavigate()
  const title = [
    {
      key: "completionTime",
      titleValue: "时间",
      width: "6rem",
      type: "按时时间自动排序",
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

  const {
    data,
    templateId,
    getNurseTemplate,
    type,
    sensorName,
    saveNurseTemplate,
    currentTime,
    name
  } = props;
  const setting = window.location.href.split("/")[4] || "";
  /**
   * 计算图表上面的状态
   * @param curStatus
   * @param lastStatus
   * @returns
   */
  const calUpConnect = (curStatus: string, lastStatus: string): string => {
    // if(curStatus)
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
    // const itemHour = dayjs(item.templateTime).format('HH:mm')
    // const templateTime = dayjs('1970-01-01 ' + itemHour).valueOf()
    if (type == "project") {
      Instancercv({
        method: "post",
        url: "/nursing/delNursingTempItem",
        headers: {
          "content-type": "multipart/form-data",
          token: token,
        },
        params: {
          templateId: String(templateId),
          templateTime: String(params.key),
        },
      }).then((res) => {
        message.info("删除成功");
        console.log(res);
        getNurseTemplate && getNurseTemplate();
      });
    } else {
      //   const res = data.filter((item) => item.key != params.key)
      //   getNurseTemplate(res)
    }
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
    const templateData = (props.data || []).map((item: any) => {
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
          const timeItem = (props.data || []).find((tItem) => {
            const startTime = tItem.time;
            const selectedTime = dayjs(+item.templateTime).format("HH:mm");
            if (selectedTime === startTime) return true;
          });
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
  const shuju = useSelector((state: any) => state.nurse.dataList);

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
  useEffect(() => {
    if (type === "project" || type === "person") {
      const list: any = (props.data || []).map((item: any) => {
        return {
          ...item,
          completionTime: +item.key,
          templateTime: +item.key,
          templateTitle: item.title,
          status: item.status === "todo" ? false : true,
          isTemp: true,
        };
      });
      setDataLIst(list);
    }
  }, [data]);
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
        time: dayjs(+item.key).format('HH:mm'),
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
        },
      }).then((res) => {
        console.log(res, '................................res.data.data');
        message.success("保存成功");
        saveNurseTemplate();
      });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleModal, setTitleModal] = useState('')
  const [dele, setSele] = useState('')
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (titleModal == '保存模版') {
      saveTemplate()
    } else if (titleModal == '删除模版') {
      deleteNurse(dele);
    } else if (titleModal == '清除模版') {
      Nuesempty()
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const Nuesempty = () => {
    setDataLIst([])
  }
  const addNurse = () => {
    navigate('/userInfo_NursingOpen', { state: 'addnurse' })
  }
  return (
    <>

      {
        !windowSize ? <>
          < div className={`${nurseOpne === false ? '' : 'basis-1/3 bg-[#fff] py-[18px] px-[15px'}]`
          }>
            {
              nurseOpne == '' ? '' : <>
                <div className='text-[1.3rem] font-semibold ml-[1rem] mb-[10px]'><span style={{ width: "80%" }}>{nurseOpne === false ? '' : `预览${name}护理项目`}</span> <span onClick={() => {
                  setIsModalOpen(true)
                  setTitleModal('清除模版')
                }} className=' text-[0.8rem] w-[20%] pl-[3rem] text-[#0072EF]'>{nurseOpne === false ? '' : '清空'}</span></div>
                <div className='flex items-center w-[18rem] ml-[1rem] mb-[20px] bg-[#F5F8FA]'><img className='w-[0.8rem] h-[0.8rem] mr-[5px]' src={greyNotice} alt="" /><span className='text-xs text-[#929EAB]'>{nurseOpne === false ? '' : '当前内容仅作为效果预览，不可作为实际页面使用'}</span></div>
              </>
            }
            <div className="flex">
              <div className="grow" style={{ overflow: "hidden", textAlign: "center", }}>
                <div className="bg-[#F5F8FA] flex ">
                  {title.map((a) => {
                    if (type == "user" && a.key == "delete") {
                      return <></>;
                    }
                    if (a.type === "按时时间自动排序") {
                      return <div style={{ lineHeight: "2.3rem", paddingLeft: "1rem" }}> <span className="text-xs ">{a.titleValue}</span><span className="text-[0.5rem] text-[#929EAB]">{a.type}</span></div>
                    }
                    if (a.key === "templateTitle") {
                      return <div style={{ lineHeight: "2.3rem", paddingLeft: "1rem" }}>护理内容</div>
                    }
                    if (a.key === "status") {
                      return <div className="cursor-pointer" style={{ lineHeight: "2.3rem", paddingLeft: "6rem" }}>状态</div>
                    }
                    if (a.key === "delete") {
                      return <div style={{ lineHeight: "2.3rem", paddingLeft: "3.3rem" }}>删除</div>
                    }
                    return (
                      <div
                        onClick={(a: any) => updateDelet(a)}
                        className={`${a.width
                          ? `w-[${a.width}] cursor-pointer  `
                          : "grow "
                          } text-xs py-[10px] `}
                      >
                        {/* {a.titleValue} */}
                      </div>
                    );
                  })}
                </div>
                <div style={{ overflowY: "scroll", height: nurseOpne == false ? '35rem' : "30rem", }}>
                  {listData
                    .sort((a: any, b: any) => {
                      return Number(a.completionTime) - Number(b.completionTime);
                    })
                    .map((item: any, index: number) => {
                      return (
                        <div

                          key={"listData" + index}
                          className={` ${type !== "project" && type !== "person" ? "" : "isTemp"
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
                              const titleInfo = title.filter((a) => a.key == key)[0];

                              if (key == "completionTime") {
                                const color = item.status ? "#0072EF" : "#E6EBF0";
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
                                    className="flex"
                                  >
                                    <span className="w-[3.2rem] pl-[1rem]">
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
                                      disabled={setting === "setting" ? true : false}
                                      onClick={() => toBeCompleted(item)}
                                      // className={`${titleInfo.width
                                      //   ? `w-[${titleInfo.width}] text-center`
                                      //   : "grow text-left"
                                      //   } text-[${timeTextColor}]`}

                                      color="default"
                                      variant="filled"
                                      className="yyyyyyyds text-[#929EAB] bg-[#E6EBF0]"
                                    >
                                      待完成
                                    </Button>
                                  );
                                }
                                return (
                                  <Button
                                    disabled={setting === "setting" ? true : false}
                                    // className={`${titleInfo.width
                                    //   ? `w-[${titleInfo.width}] text-center`
                                    //   : "grow text-left"
                                    //   } text-[${timeTextColor}]`}
                                    // type="primary"
                                    className="text-[#929EAB] bg-[#E6EBF0]"
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
                                      setIsModalOpen(true);
                                      setTitleModal('删除模版')
                                      setSele(item)
                                    }}
                                    className="w-[7rem]  cursor-pointer yyyyyyyds"
                                  // style={{ borderBottom: "1px solid #D8D8D8", }}
                                  >
                                    <img
                                      className="w-[1rem] ml-[2.6rem] bg-[#0072EF]"
                                      src={sheetDelete}
                                      alt=""
                                    />
                                    <span className="text-xs mr-[0.2rem] text-[#0072EF]">删除</span>
                                  </div>
                                );
                              }
                              return (
                                <div
                                  // className={`${titleInfo.width
                                  //   ? `w-[${titleInfo.width}] text-center`
                                  //   : "grow "
                                  //   } text-[${nurseTextColor}] text-sm flex flex-col flex-1`}
                                  className="w-[10.3rem] yyyyyyyds"
                                  style={{ textAlign: "left", lineHeight: "1.5rem" }}
                                >
                                  <span className={`font-bold w-[10.3rem] ${nurseOpne === false ? '' : "NurseTableImgBox"} `}>
                                    {/* <img className='w-[0.8rem] h-[0.8rem] mt-[0.33rem] mr-3' src={shijian1} alt="" /> */}
                                    <span className="pl-[2.2rem]  w-[10rem]">{item[key]}</span>
                                  </span>
                                  <span className="pl-[2rem]  w-[10rem]">{item.notes}</span>
                                  <img className="pl-[2rem]  w-[10rem] " src={item.uploadImage} alt="" />
                                </div>
                              );
                            }
                          })}
                        </div>
                      );
                    })}
                </div>
                {props.type === "project" && (
                  <Button type='primary' style={{ width: "24rem", height: "2rem", position: "absolute", right: "1.5rem", bottom: '3.6rem', }} onClick={() => {
                    setIsModalOpen(true)
                    setTitleModal('保存模版')
                  }}>保存模版</Button>
                )}
              </div>
              {
                <Modal height={'266px'} title={titleModal} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
          </div >
        </> : <>
          <div className="bg-[#F5F8FA]">
            <Title ></Title>
            <NurseTitle title='添加护理任务' titleRight='应用'></NurseTitle>
            <div className="w-[96%] mx-[2%] bg-[#fff] mt-[1rem] " style={{ borderRadius: "0.9rem" }}>
              <div className="flex pt-[1.8rem] pl-[1.3rem] mb-2"><img style={{ width: "4px", height: "1rem", marginRight: "0.3rem", marginTop: "0.5rem" }} src={lanse} alt="" /><span className="text-[1.3rem]">老陈的护理计划</span></div>
              <div className='flex items-center w-[85%] h-[2rem] ml-[1rem] mb-[1rem] bg-[#F5F8FA]'><img className='w-[1rem] h-[1rem] mr-[5px] ml-2' src={greyNotice} alt="" /><span className='text-[1rem] text-[#929EAB]'>当前内容仅作为效果预览，不可作为实际页面使用</span></div>
              <div className="">
                <div className="grow" style={{ overflow: "hidden", textAlign: "center", background: "#fff" }}>
                  <div className="bg-[] flex px-[1rem]">
                    {title.map((a) => {
                      if (type == "user" && a.key == "delete") {
                        return <></>;
                      }
                      if (a.type === "按时时间自动排序") {
                        return <div style={{ lineHeight: "3.3rem", background: "#F5F8FA", width: "35%", }}> <span className="text-[1.2rem] rounded-md">{a.titleValue}</span><span className="text-[0.8rem] text-[#929EAB]">{a.type}</span></div>
                      }
                      if (a.key === "templateTitle") {
                        return <div style={{ lineHeight: "3.3rem", background: "#F5F8FA", width: "15%" }}>护理内容</div>
                      }
                      if (a.key === "status") {
                        return <div className="cursor-pointer" style={{ lineHeight: "3.3rem", background: "#F5F8FA", width: "25%" }}>状态</div>
                      }
                      if (a.key === "delete") {
                        return <div style={{ lineHeight: "3.3rem", background: "#F5F8FA", width: "25%", borderRadius: "0 3px 3px 0" }}>删除</div>
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
                  <div style={{ overflowY: "scroll", height: nurseOpne == false ? '27rem' : "30rem", }}>
                    {listData
                      .sort((a: any, b: any) => {
                        return Number(a.completionTime) - Number(b.completionTime);
                      })
                      .map((item: any, index: number) => {
                        return (
                          <div

                            key={"listData" + index}
                            className={` ${type !== "project" && type !== "person" ? "" : "isTemp"
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
                                const titleInfo = title.filter((a) => a.key == key)[0];

                                if (key == "completionTime") {
                                  const color = item.status ? "#0072EF" : "#E6EBF0";
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
                                      className="flex"
                                    >
                                      <span className="w-[3.2rem] pl-[1rem]">
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
                                        disabled={setting === "setting" ? true : false}
                                        onClick={() => toBeCompleted(item)}
                                        // className={`${titleInfo.width
                                        //   ? `w-[${titleInfo.width}] text-center`
                                        //   : "grow text-left"
                                        //   } text-[${timeTextColor}]`}

                                        color="default"
                                        variant="filled"
                                        className="yyyyyyyds text-[#929EAB] bg-[#E6EBF0]"
                                      >
                                        待完成
                                      </Button>
                                    );
                                  }
                                  return (
                                    <Button
                                      disabled={setting === "setting" ? true : false}
                                      // className={`${titleInfo.width
                                      //   ? `w-[${titleInfo.width}] text-center`
                                      //   : "grow text-left"
                                      //   } text-[${timeTextColor}]`}
                                      // type="primary"
                                      className="text-[#929EAB] bg-[#E6EBF0]"
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
                                        setIsModalOpen(true);
                                        setTitleModal('删除模版')
                                        setSele(item)
                                      }}
                                      className="w-[7rem]  cursor-pointer yyyyyyyds"
                                    // style={{ borderBottom: "1px solid #D8D8D8", }}
                                    >
                                      <img
                                        className="w-[1rem] ml-[2.6rem] bg-[#0072EF]"
                                        src={sheetDelete}
                                        alt=""
                                      />
                                      <span className="text-xs mr-[0.2rem] text-[#0072EF]">删除</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div
                                    // className={`${titleInfo.width
                                    //   ? `w-[${titleInfo.width}] text-center`
                                    //   : "grow "
                                    //   } text-[${nurseTextColor}] text-sm flex flex-col flex-1`}
                                    className="w-[10.3rem] yyyyyyyds"
                                    style={{ textAlign: "left", lineHeight: "1.5rem" }}
                                  >
                                    <span className={`font-bold w-[10.3rem] ${nurseOpne === false ? '' : "NurseTableImgBox"} `}>
                                      {/* <img className='w-[0.8rem] h-[0.8rem] mt-[0.33rem] mr-3' src={shijian1} alt="" /> */}
                                      <span className="pl-[2.2rem]  w-[10rem]">{item[key]}</span>
                                    </span>
                                    <span className="pl-[2rem]  w-[10rem]">{item.notes}</span>
                                    <img className="pl-[2rem]  w-[10rem] " src={item.uploadImage} alt="" />
                                  </div>
                                );
                              }
                            })}
                          </div>
                        );
                      })}
                  </div>
                  {props.type === "project" && (
                    <Button type='primary' style={{ width: "24rem", height: "2rem", position: "absolute", right: "1.5rem", bottom: '3.6rem', }} onClick={() => {
                      setIsModalOpen(true)
                      setTitleModal('保存模版')
                    }}>保存模版</Button>
                  )}
                </div>
                <Button onClick={() => addNurse()} className="w-[94%] h-[4rem] mx-[3%] mb-4" type='primary'>新建护理任务</Button>
                {
                  <Modal height={'266px'} title={titleModal} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
      }
    </>

  );

}

// export  function NurseSetting(props: any) {
//   const phone = localStorage.getItem('phone')
//   const token = localStorage.getItem('token')
//   const organizeId = useSelector(organizeIdSelect)
//   const [templateId, setTemplateId] = useState(0)
//   const [nurseTemplate, setNurseTemplate] = useState<any>([])
//   const [personTemplate, setPersonTemplate] = useState<any>([])
//   const param = useParams()
//   console.log(param, 'previewItem.template..222222.....')
//   const location = useLocation()
//   const sensorName = param.id || location.state?.sensorName
//   const setting = window.location.href.split('/')[4] || ''

//   const format = 'HH:mm';
//   const { type, onClick } = props
//   useEffect(() => {
//     // if (!type) {
//     getNurseTemplate()
//     // }
//   }, [])

//   /**
//    * 新建护理模板的护理项目
//    */
//   const addNurseProject = () => {
//     if (!templateTime && !templateTitle) {
//       return message.info('请输入时间和项目名称')
//     }
//     // if (!templateTitle) {
//     //   return message.info('请输入项目名称')
//     // }
//     console.log('add')
//     Instancercv({
//       method: "post",
//       url: "/nursing/addNursingTemplItem",
//       headers: {
//         "content-type": "multipart/form-data",
//         "token": token
//       },
//       params: {
//         templateId: templateId,
//         templateTime: templateTime,
//         templateContent: templateTitle
//       }
//     }).then((res) => {
//       console.log(res.data.msg)
//       if (res.data.msg.includes("success")) {
//         // const template = res.data.data
//         // const data = templateObjToData(template)
//         // setNurseTemplate(data)
//         getNurseTemplate()
//         message.success('添加成功')
//       }

//     })
//   }

//   /**
//    * 新建个人页护理模板的护理项目
//    */

//   const addUserNurseProject = () => {
//     const res = [...personTemplate,
//     {
//       key: templateTime,
//       status: 'todo',
//       title: templateTitle,
//       time: dayjs(new Date(new Date().toLocaleDateString()).getTime() + Number(templateTime)).format('HH:mm'),
//     }
//     ]
//     setPersonTemplate(res)

//   }

//   // 添加护理模板里面的内容
//   const addProject = () => {
//     if (!templateTitle) {
//       return message.info('请输入你要添加的项目名称')
//     }
//     if (!templateTime) {
//       return message.info('请输入项目时间')
//     }
//     // 个人页面
//     if (type == 'person') {
//       addUserNurseProject()
//     } else {
//       addNurseProject()
//     }
//   }

//   /**
//    * 获取护理模板
//    */
//   const getNurseTemplate = () => {
//     Instancercv({
//       method: "get",
//       url: "/nursing/getNurseTemplateData",
//       headers: {
//         "content-type": "multipart/form-data",
//         "token": token
//       },
//       params: {
//         organizeId: organizeId,
//         type: 1
//       }
//     }).then((res) => {

//       setTempplateArr(res.data.data)
//       const template = res.data.data[0]

//       if (template && !templateId && template.id) {
//         getNurseTemplateToId(res.data.data, template.id)
//       } else {
//         getNurseTemplateToId(res.data.data, templateId)
//       }
//       // if (template) {
//       //   // setTemplateId(template.id)
//       //   console.log(template.template)
//       //   const data = templateToData(template.template)
//       //   // console.log(data)
//       //   setNurseTemplate(data)
//       //   setTempplateArr(res.data.data)
//       // }
//     })
//   }

//   const templateObjToData = (obj: any) => {
//     const arr: any = []
//     Object.keys(obj).forEach((key, index) => {
//       const value = obj[key].replace(new RegExp('"', 'g'), '')
//       arr.push({
//         title: value,
//         time: dayjs(new Date(new Date().toLocaleDateString()).getTime() + Number(key)).format('HH:mm'),
//         key: key,
//         status: 'todo'
//       })
//     })
//     return arr
//   }

//   // 通过id获取护理模板
//   const getNurseTemplateToId = (arr: any, id: any) => {

//     const template: any = arr.find((item: any) => item.id == id)
//     setTemplateId(id)
//     const data = templateToData(template.template)
//     if (type == 'person') {
//       setPersonTemplate(data)
//     } else {
//       setNurseTemplate(data)
//     }

//   }

//   const [templateTime, setTemplateTime] = useState(0)
//   const [templateTitle, setTemplateTitle] = useState('')
//   const [templateNameTitle, setTemplateNameTitle] = useState('')
//   const [templateArr, setTempplateArr] = useState([])
//   const [selectTemplate, setSelectTemplate] = useState()

//   const onChange: TimePickerProps['onChange'] = (time, timeString) => {
//     if (typeof timeString == 'string') {

//       setTemplateTime(new Date(`1970-01-01 ${timeString}`).getTime())
//     }
//   };

//   const userTemplate = () => {
//     getNurseTemplate()
//   }

//   const addTemplate = () => {
//     if (!templateNameTitle) {
//       return message.info('请输入模板名称')
//     }
//     Instancercv({
//       method: "post",
//       url: "/nursing/addNursingTempl",
//       headers: {
//         "content-type": "multipart/form-data",
//         "token": token
//       },
//       params: {
//         templateName: templateNameTitle,
//         template: '{}',
//         organizeId: organizeId
//       }
//     }).then((res) => {
//       console.log(res.data.msg)
//       if (res.data.msg.includes("success")) {
//         message.success('添加成功')
//         getNurseTemplate()
//         setTemplateNameTitle('')
//       }

//     })
//   }

//   const context = useContext(DataContext)
//   const { getPersonTemplate } = context

//   const saveTemplate = () => {

//     if (type == 'person') {
//       Instancercv({
//         method: "post",
//         url: "/nursing/updateNursingConfig",
//         headers: {
//           "content-type": "application/json",
//           "token": token
//         },
//         data: {
//           deviceId: sensorName,
//           config: JSON.stringify(personTemplate),
//         },
//       }).then((res) => {
//         message.success('添加成功')
//         getPersonTemplate()
//       })
//     }
//   }
//   const [titleName, setTitleName] = useState(
//     [
//       {
//         id: "0",
//         title: "自理老人"
//       },
//       {
//         id: "1",
//         title: "半自理老人"
//       },
//       {
//         id: "2",
//         title: "完全失能老人"
//       },
//       {
//         id: "3",
//         title: "自定义模版"
//       }
//     ]
//   )
//   return (
//     <div className=' w-full'>
//       {/* 管理员新建模板 */}
//       {/* <div>
//         {
//           titleName.map((item: any, index: any) => {
//             return <div key={index} className=''>
//               {item.title}
//             </div>
//           })
//         }
//       </div> */}

//       {/* <div className='basis-2/3 mr-[10px] py-[18px] px-[30px] bg-[#fff] relative'>
//         {
//           setting === 'setting' ?
//             <>
//               <div className='text-lg font-semibold  relative'>
//                 新建护理模板
//               </div>
//               <div className='flex items-center mt-[20px] mb-[20px]'>
//                 <div className='text-sm font-semibold mr-[2.2rem]'>模板名称:</div>
//                 <Input className='grow w-[unset]'
//                   allowClear
//                   onChange={(e) => {
//                     console.log(e.target.value)
//                     setTemplateNameTitle(e.target.value)
//                   }} />
//               </div>
//               <Button className='mb-8' onClick={addTemplate}>新建模板</Button>

//               <div className='text-lg font-semibold  relative'>
//                 模板列表
//               </div>
//               <div className='flex items-center mt-[20px] mb-[20px]'>
//                 {
//                   templateArr.map((item: any) => {
//                     return (<div onClick={() => {
//                       setTemplateId(item.id)
//                       getNurseTemplateToId(templateArr, item.id)
//                     }} style={{ backgroundColor: templateId == item.id ? 'blue' : '' }}>
//                       {item.templateName}
//                     </div>)
//                   })
//                 }
//               </div>
//             </>
//             : <></>
//         }
//         {

//         }

//         <div className='text-lg font-semibold  relative'>创建个人护理模板
//           {type ? <div className='text-[#0072EF] absolute right-[0px] bottom-[0px] text-sm' onClick={userTemplate}>应用模板</div> : ''}
//         </div>

//         {
//           type ?
//             <div className='flex items-center mt-[20px] mb-[20px]'>
//               <div className='text-sm font-semibold mr-[2.2rem]'>模板列表:</div>
//               <div>
//                 {
//                   <div className='flex items-center mt-[20px] mb-[20px]'>
//                     {
//                       templateArr.map((item: any) => {
//                         return (<div onClick={() => {
//                           setTemplateId(item.id)
//                           getNurseTemplateToId(templateArr, item.id)
//                         }} style={{ backgroundColor: templateId == item.id ? 'blue' : '' }}>
//                           {item.templateName}
//                         </div>)
//                       })
//                     }
//                   </div>
//                 }</div>
//             </div> : <></>
//         }

//         <div className='flex items-center mt-[20px] mb-[20px]'>
//           <div className='text-sm font-semibold mr-[2.2rem]'>项目名称:</div>
//           <Input className='grow w-[unset]' onChange={(e) => {
//             console.log(e.target.value)
//             setTemplateTitle(e.target.value)
//           }} />
//         </div>
//         <div className='flex items-center '>
//           <div className='text-sm font-semibold mr-[2.2rem]'>项目时间:</div>
//           <TimePicker onChange={onChange} placeholder='请输入时间' format={format} />
//         </div>
//         <div className='absolute bottom-[30px] right-[30px]'>
//           {
//             setting === 'setting' ? <Button className='mr-[20px]' onClick={saveTemplate}>保存为模板</Button> : <Button className='mr-[20px]' onClick={saveTemplate}>保存为当前版本</Button>
//           }

//           <Button type="primary" onClick={addProject}>添加</Button>
//         </div>
//       </div> */}

//       <div className='basis-1/3 bg-[#fff] py-[18px] px-[15px]'>
//         <div className='text-[1.3rem] font-semibold ml-[1rem] mb-[10px]'>预览老陈护理项目 <span className='text-[#929EAB] text-[0.8rem] ml-[9rem]'>清空模版</span></div>
//         <div className='flex items-center ml-[1rem] mb-[20px]'><img className='w-[0.8rem] h-[0.8rem] mr-[5px]' src={greyNotice} alt="" /><span className='text-xs text-[#929EAB]'>当前内容仅作为效果预览，不可作为实际页面使用</span></div>

//         {type == 'person' ?
//           // 个人设置
//           <NurseTable type={type} sensorName={sensorName} getNurseTemplate={setPersonTemplate} templateId={templateId} data={personTemplate || []} />
//           :
//           // 管理员设置
//           <NurseTable type={'project'} sensorName={sensorName} getNurseTemplate={getNurseTemplate} templateId={templateId} data={nurseTemplate || []} />
//         }

//         {/* <NurseTable type={type} getNurseTemplate={getNurseTemplate} templateId={templateId} data={nurseTemplate} /> */}

//       </div>
//     </div >
//   )
// }
