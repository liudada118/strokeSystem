import { useGetWindowSize } from "@/hooks/hook";
import React, { useEffect, useRef, useState } from "react";
import NurseModal, { noticeObj } from "./nurseModal/NurseModal";
import { Button, Drawer, message, Tooltip, Modal } from "antd";
import { useSelector } from "react-redux";
import { mqttSelect } from "@/redux/mqtt/mqttSlice";
import { useNavigate, useParams } from "react-router-dom";
import { instance, Instancercv } from "@/api/api";

import okWhite from "@/assets/image/okWhite.png";
import guidePng from "@/assets/image/guide.png";
import notice from "@/assets/image/notice.png";
import ask from "@/assets/image/ask.png";
import imgadd from "@/assets/image/imgadd.png";
import returnPng from "@/assets/image/return.png";
import right from "@/assets/icon/right.png";
import back from "@/assets/icon/back.png";
import left from "@/assets/icon/left.png";
import unRight from "@/assets/icon/unRight.png";
import unBack from "@/assets/icon/unBack.png";
import unLeft from "@/assets/icon/unLeft.png";
import no from "@/assets/icon/no.png";

import { tokenSelect } from "@/redux/token/tokenSlice";
import { strToObj } from "@/utils/formatCloud";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import dayjs from "dayjs";
import NurseGuide from "./nurseGuide/NurseGuide";
import "./index.scss";

import Heatmap from "@/components/heatmap/Heatmap";
import HeatmapR from "@/components/heatmap/HeatmapModal";
import HeatmapR1 from "@/components/heatmap/HeatmapModal copy";
import HeatmapH from "@/components/heatmap/HeatmapRef";
import { compressionFile } from "@/utils/imgCompressUtil";
import RealNurse from "./realNurse/RealNurse";
import { valueToSleep } from "../Monitor/realReport";
import {
  minDataParam,
  returnCloudHeatmapData,
  returnMinData,
  returnRealtimeData,
} from "../heatmapUtil";
import NurseTitleProgress, {
  TurnOver,
  UploadSleep,
} from "./NurseTitleProgress";
import NurseTitle from "./NurseStepTitle";
import NurseBottom from "./NurseStepBottom";
import { Popup } from "antd-mobile";
import { turnbodyFlagSelect } from "@/redux/premission/premission";
import useWindowSize from "../../../hooks/useWindowSize";
interface nurseProcessProps {
  isModalOpenSend: boolean;
  setIsModalOpenSend: Function;
  getNurse: Function;
}

const nurseNoticeList = [
  "避免进食后立即翻身:避免进食后30分钟内翻身，以防呕吐或不适。",
  "避免压迫区域过度按摩。",
  "保持舒适:	护理过程中要观察老人神情，避免老人不适。",
  "翻身动作规范:	翻身时，要注意保持正确的姿势，避免拖、拉、推、拽等动作，以降低剪切力。",
  "调整头部位置:避免颈部弯曲或歪斜，可利用卷轴做选当支托，使头颈成一直线。",
  "注意体位限制:如心脏病患者可能需要抬高头部。",
  "整理床褥:	翻身后应整理床褥，维持床单平整。",
];

const sleepType = [
  { name: "左侧", img: right, unImg: unRight },
  { name: "仰卧", img: back, unImg: unBack },
  { name: "右侧", img: left, unImg: unLeft },
];

const posArrText = ["仰卧", "左侧躺", "右侧躺"];

let overMessage: any = [];
let matrixArr: Array<any> = [];
let posArr: Array<any> = [];
let pointsArr: Array<string> = [];
let timeArr: Array<number> = [];
let rateArr: Array<number> = [],
  heartArr: Array<number> = [];
let rateNurseArr: Array<number> = [],
  heartNurseArr: Array<number> = [];
let startMatrix: any = new Array(1024).fill(0);
const nurseTitle = [
  "第一步：为护理对象翻身",
  "第二步：查看护理效果",
  "第三步：上传睡姿记录",
  "第四步：选择护理项目",
];
let nowPos: any, afterPos: any;
let startPosture: any;

export default function NurseProcesst(props: nurseProcessProps) {
  const { isModalOpenSend, setIsModalOpenSend, getNurse } = props;

  const param = useParams();
  const sensorName = param.id || "";
  const client = useSelector(mqttSelect);
  const token = useSelector(tokenSelect);
  const equipInfo = useSelector((state) =>
    selectEquipBySensorname(state, sensorName)
  );
  let navigate = useNavigate();
  // console.log(equipInfo)
  const { type, roomNum, nurseStart, nurseEnd, nursePeriod } = equipInfo;

  const [index, setIndex] = useState(1);
  const isMobile = useGetWindowSize();
  const [newPos, setNewPos] = useState<any>(0);
  const [nextPos, setNextPos] = useState<any>(0);
  const [open, setOpen] = useState(true);
  const [nurseFinish, setNurseFinish] = useState(false);
  const [guide, setGuide] = useState(false);
  const [img, setImg] = useState("");
  const [sleepTypenur, setSleepType] = useState<any>(0);
  const [onBedTime, setOnBedTime] = useState(0);
  const [remark, setRemark] = useState<any>();
  const windowSize = useWindowSize();
  const turnOverRef = useRef<any>(null);

  const nurseStepArr = [
    {
      title: "第一步：为护理对象翻身",
      content: (
        <TurnOver
          open={open}
          type={type}
          sensorName={sensorName}
          nextPos={nextPos}
          newPos={newPos}
          ref={turnOverRef}
        />
      ),
    },
    {
      title: "第二步：上传睡姿记录",
      content: (
        <UploadSleep
          img={img}
          setImg={setImg}
          changeData={changeData}
          setSleepType={setSleepType}
          sleepTypenur={sleepTypenur}
        />
      ),
    },
  ];

  const [obj, setObj] = useState<any>({}) || [];
  function changeData(param: any) {
    setObj({ ...obj, ...param });
  }

  const onClose = () => {
    changePos();
  };

  // mqtt 事件
  const mqttEvent: any = {
    // 分钟数据
    minute({ jsonObj, sensorName }: minDataParam) {
      const { wsPointData, circleArr, timer, resSleep } = returnMinData({
        jsonObj,
        sensorName,
      });
      startMatrix = wsPointData;
      if (turnOverRef.current)
        turnOverRef.current.renderHeatmapData({ wsPointData, circleArr });
    },
    // 实时数据
    realtime({ jsonObj, sensorName }: minDataParam) {
      const { heart, rate, stroke, bodyMove, onBedTime } = returnRealtimeData({
        jsonObj,
        sensorName,
      });
      if (!jsonObj.realtimeOnbedState) {
      }

      setOnBedTime(onBedTime);
    },
  };

  // 开始mqtt
  useEffect(() => {
    if (client) {
      client.on("message", (topic: any, payload: any) => {
        const jsonObj = JSON.parse(payload);
        if (sensorName === jsonObj.deviceName) {
          if (mqttEvent[jsonObj.type])
            mqttEvent[jsonObj.type]({ jsonObj, sensorName });
        }
      });
    }
  }, [client]);

  /**
   * 获取初始矩阵信息
   */
  const getFirstMaritx = () => {
    instance({
      method: "post",
      url: "/sleep/nurse/getMatrixListByName",
      params: {
        deviceName: sensorName,
        scheduleTimePeriod: nursePeriod,
        startTimeMillis:
          new Date(new Date().toLocaleDateString()).getTime() + nurseStart,
        endTimeMills:
          new Date(new Date().toLocaleDateString()).getTime() + nurseEnd,
      },
    })
      .then((res) => {
        const { wsPointData, timer, resSleep, circleArr } =
          returnCloudHeatmapData({ res: res.data, sensorName, equipInfo });
        nowPos = resSleep;
        startMatrix = [...wsPointData];
        if (turnOverRef.current)
          turnOverRef.current.renderHeatmapData({ wsPointData, circleArr });
        console.log("获取初始矩阵成功");
      })
      .catch((err) => {
        console.log(err, "获取初始矩阵失败");
        // message.error('服务器错误3')
      });
  };

  // 获取初始矩阵
  useEffect(() => {
    getFirstMaritx();
  }, [sensorName]);

  // 获取将要翻身的睡姿
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    instance({
      method: "get",
      url: "/sleep/nurse/getRecords",
      params: {
        deviceName: sensorName,
        startTime: new Date(new Date().toLocaleDateString()).getTime(),
        endTime:
          new Date(new Date().toLocaleDateString()).getTime() +
          (24 * 60 - 1) * 60 * 1000,
        pageNum: 1,
        pageSize: 99,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        token: token,
      },
    })
      .then((res) => {
        const record = res.data.page.records; //.map((item :any )=> item.posture)
        if (record.length) {
          afterPos = record.map((item: any) => {
            const obj: any = {};
            obj.posture = item.posture;
            obj.startPosture = item.startPosture;
            return obj;
          });
        } else {
          afterPos = [];
        }
      })
      .catch((err) => [console.log(err)]);
  }, []);

  /**
   *
   */
  interface initDataParam {
    pressureInjurePoints: any;
    posture: any;
    matrixList: any;
    realtimeOnbedState: any;
  }

  /**
   * 初始化睡姿配置
   */
  const changePos = () => {
    // console.log(nowPos)
    if (typeof nowPos == "number" && Array.isArray(afterPos)) {
      setOpen(false);
      if (afterPos.length) {
        if (afterPos.length == 1) {
          if (afterPos[0].posture == 0) {
            if (afterPos[0].startPosture == 1) {
              setNextPos(2);
            } else if (afterPos[0].startPosture == 2) {
              setNextPos(1);
            } else if (
              afterPos[0].startPosture != 1 &&
              afterPos[0].startPosture != 2
            ) {
              setNextPos(1);
            }
            setNewPos(0);
          } else if (afterPos[0].posture == 1) {
            setNewPos(1);
            setNextPos(0);
          } else if (afterPos[0].posture == 2) {
            setNewPos(2);
            setNextPos(0);
          }
        } else {
          if (afterPos[0].posture == 0) {
            if (afterPos[1].posture == 1) {
              setNextPos(2);
            } else if (afterPos[1].posture != 1) {
              setNextPos(1);
            }
            setNewPos(0);
          } else if (afterPos[0].posture == 1) {
            setNewPos(1);
            setNextPos(0);
          } else if (afterPos[0].posture == 2) {
            setNewPos(2);
            setNextPos(0);
          }
        }

        console.log(afterPos);
      } else {
        if (nowPos == 0) {
          setNewPos(0);
          setNextPos(1);
        } else if (nowPos == 1) {
          setNewPos(1);
          setNextPos(0);
        } else {
          setNewPos(2);
          setNextPos(0);
        }
      }
      // changeIndex()
      matrixArr[0] = [...startMatrix];
      timeArr[0] = new Date().getTime();
    } else {
      message.info("正在获取睡姿");
    }
  };

  /**
   * 提交报告
   */
  const submitReport = () => {
    const phone = localStorage.getItem("phone");
    console.log("submitReport");
    const yyds = {
      deviceName: sensorName,
      extra: obj.sleepPosImg || "extraData",
      chargeMan: phone?.slice(-4),
      flipbodyTime: new Date().getTime(),
      posture: valueToSleep(sleepTypenur),
      onbedTime: Math.floor(onBedTime),
    };
    instance({
      method: "post",
      url: "/sleep/nurse/addNursingLog",
      headers: {
        // "content-type": "application/json",
        token: token,
      },
      params: {
        deviceName: sensorName,
        extra: obj.sleepPosImg || "extraData", //({ img: img, content: content }),
        chargeMan: phone?.slice(-4),
        flipbodyTime: new Date().getTime(),
        posture: valueToSleep(sleepTypenur),
        onbedTime: Math.floor(onBedTime),
      },
    }).then((res) => {
      message.success("护理成功");
      initNurseData();
      getNurse();
    });
  };

  /**
   * 初始化护理参数
   */
  const initNurseData = () => {
    setObj({});
  };

  const finishClose = () => {
    setNurseFinish(false);
  };

  const turnType = useSelector(turnbodyFlagSelect);

  console.log(
    isModalOpenSend,
    turnType,
    isMobile,
    "......isModalOpenSend........."
  );
  return (
    <>
      {turnType == 2 && isMobile ? (
        <NurseModal open={isModalOpenSend}>
          {index == 0 ? (
            <>
              <h2 className="noticeTitle">注意事项</h2>
              {noticeObj.map((a: any, indexs) => {
                return (
                  <div key={indexs}>
                    <h3 style={{ fontWeight: "bold" }}>
                      {indexs + 1}.{a.title}
                    </h3>
                    <div>{a.info}</div>
                  </div>
                );
              })}
              <Button
                onClick={() => {
                  console.log(nowPos, Array.isArray(afterPos));
                  changePos();
                }}
                className="noticeButton"
              >
                确认
              </Button>
            </>
          ) : (
            <div className={`nurseConent ${guide ? "scrool" : ""}`}>
              <Drawer
                title="注意事项"
                placement={"bottom"}
                // closable={false}
                onClose={onClose}
                open={open && isModalOpenSend && index == 1}
                key={"bottom"}
                className="noticeDrawer"
              >
                <div
                  className="pfBold"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <ol
                    style={{
                      paddingLeft: "1.12rem",
                      lineHeight: "2rem",
                      flex: 1,
                    }}
                  >
                    {nurseNoticeList.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ol>
                  <div
                    className="nurseButton"
                    onClick={() => {
                      // changePos()
                      onClose();
                    }}
                  >
                    我已知晓，开始护理
                  </div>
                </div>
              </Drawer>

              <Drawer
                title=""
                placement={"bottom"}
                closable={true}
                onClose={finishClose}
                open={nurseFinish}
                key={"bottom"}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        margin: "1rem 0",
                      }}
                    >
                      <div
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          marginRight: "0.3rem",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(270deg, #006CFD 6%, #009FFF 95%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={okWhite}
                        />
                      </div>{" "}
                      护理完成
                    </div>
                    {/* <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#006ADF' }}
              onClick={() => {
                seeReport()
              }}
            >点击查看护理报告</div> */}
                  </div>
                  <div
                    className="nurseButton"
                    onClick={() => {
                      setIsModalOpenSend(false);
                      finishClose();
                    }}
                  >
                    回到首页
                  </div>
                </div>
              </Drawer>

              <div className={`nurseTitleContent ${guide ? "scrool" : ""}`}>
                <NurseTitle
                  guide={guide}
                  setIndex={setIndex}
                  setOpen={setOpen}
                  setIsModalOpenSend={setIsModalOpenSend}
                  setGuide={setGuide}
                  index={index}
                  nurseStepArr={nurseStepArr}
                />
              </div>
              {guide ? <NurseGuide /> : <>{nurseStepArr[index - 1].content}</>}
              <NurseBottom
                setNurseFinish={setNurseFinish}
                submitReport={submitReport}
                guide={guide}
                index={index}
                setIndex={setIndex}
                setGuide={setGuide}
                total={nurseStepArr.length}
              />
            </div>
          )}
        </NurseModal>
      ) : (
        <OneClickCare
          submitReport={submitReport}
          isModalOpenSend={isModalOpenSend}
          setIsModalOpenSend={setIsModalOpenSend}
          setSleepType={setSleepType}
          sleepTypenur={sleepTypenur}
        />
      )}
    </>
  );
}

interface oneClickCareParam {
  isModalOpenSend: boolean;
  setIsModalOpenSend: Function;
  setSleepType: Function;
  sleepTypenur: number;
  submitReport: Function;
}
const OneClickCare = (props: oneClickCareParam) => {
  const {
    isModalOpenSend,
    setIsModalOpenSend,
    setSleepType,
    sleepTypenur,
    submitReport,
  } = props;
  console.log(isModalOpenSend, ".......isModalOpenSend.......");
  const sleepPose = [
    {
      value: "右侧",
      img: <img src={left} alt="" />,
      unimg: <img src={unLeft} alt="" />,
    },
    {
      value: "仰卧",
      img: <img src={back} alt="" />,
      unimg: <img src={unBack} alt="" />,
    },
    {
      value: "左侧",
      img: <img src={left} alt="" className="scale-x-[-1]" />,
      unimg: <img src={unLeft} alt="" className="scale-x-[-1]" />,
    },
  ];

  // const [choosedSleep, setChoosedSleep] = useState<number>(sleepTypenur)
  const windowSize = useWindowSize();
  const handleChooseSleep = (item: any, value: number) => {
    // setChoosedSleep(value)
    setSleepType(value);
  };
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  const handleCancel = () => {
    // setIsModalOpen(false);
    setIsModalOpenSend(false);
  };

  console.log(windowSize, "windowSize..1111....");

  return windowSize.isMobile ? (
    <Popup
      visible={isModalOpenSend}
      onMaskClick={() => {
        setIsModalOpenSend(false);
      }}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        minHeight: "40vh",
      }}
    >
      <div className="flex justify-between items-center pt-[10px] px-[20px]">
        <span
          className="text-base text-[#3D3D3D]"
          onClick={() => {
            setIsModalOpenSend(false);
            // setChoosedSleep('')
            setSleepType(-1);
          }}
        >
          取消
        </span>
        <span className="text-lg font-medium">选择睡姿</span>
        <span
          className="text-base text-[#0072EF]"
          onClick={() => {
            console.log("submitReport");
            setIsModalOpenSend(false);
            submitReport();
            setSleepType(-1);
            // setChoosedSleep('')
          }}
        >
          提交
        </span>
      </div>
      <div className="flex justify-center items-center mt-[40px] pt-[10px] w-full">
        {sleepPose.map((item, index) => (
          <div
            key={item.value}
            className="basis-1/3 flex flex-col items-center"
          >
            <div
              className={`w-[70%] ${
                sleepTypenur === index
                  ? "bg-gradient-to-b from-[#009FFF] to-[#006CFD] shadow-md shadow-[#1D79EA]"
                  : "bg-[#F6F7FD]"
              } mb-[10px] rounded-[6px]`}
              onClick={() => handleChooseSleep(item, index)}
            >
              {sleepTypenur === index ? item.unimg : item.img}
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </Popup>
  ) : (
    <Modal
      title="选择睡姿"
      open={isModalOpenSend}
      onOk={() => {
        console.log("submitReport");
        setIsModalOpenSend(false);
        submitReport();
        setSleepType(-1);
      }}
      onCancel={() => {
        setIsModalOpenSend(false);
        setSleepType(-1);
      }}
    >
      <div className="flex justify-center items-center mt-[40px] pt-[10px] w-full">
        {sleepPose.map((item, index) => (
          <div
            key={item.value}
            className="basis-1/3 flex flex-col items-center"
          >
            <div
              className={`w-[70%] ${
                sleepTypenur === index
                  ? "bg-gradient-to-b from-[#009FFF] to-[#006CFD] shadow-md shadow-[#1D79EA]"
                  : "bg-[#F6F7FD]"
              } mb-[10px] rounded-[6px]`}
              onClick={() => handleChooseSleep(item, index)}
            >
              {sleepTypenur === index ? item.unimg : item.img}
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};
