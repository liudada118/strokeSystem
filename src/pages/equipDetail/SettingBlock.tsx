import React, { useContext, useEffect, useState } from "react";
import CommonFormModal, { FormType } from "../../components/CommonFormModal";
import { Button, Input, message, Modal, Popconfirm, Switch } from "antd";
import type { PopconfirmProps } from "antd";
import styles from "./message.module.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeEquipAllInfo,
  changePersonalEquipAlarmInfo,
  selectEquipBySensorname,
  statusSelect, fetchEquips,
} from "@/redux/equip/equipSlice";
import { onOverSettings } from '@/redux/Nurse/Nurse'
import { equipInfoFormatUtil, minToHourText } from "@/utils/dataToFormat";
import { phoneSelect, tokenSelect } from "@/redux/token/tokenSlice";
import { isManage, roleIdSelect } from "@/redux/premission/premission";
import CommonTitle from "@/components/CommonTitle";
import rigthLogo from "@/assets/image/rigthLogo.png";
import { DisplayEditNurseContent, PreViewConfig } from "./mobileEdit/NurseEdit";
import "./settingBlock.scss";
import { Instancercv, netUrl, instance } from "@/api/api";
import axios from "axios";
import { DataContext } from ".";
import { unbindHheDevice } from "../../api/index";
import { nurseOpen, nurseHomeOnChlick } from "../../redux/Nurse/Nurse";
import { setIsGotoNursePage } from "../../redux/Nurse/Nurse";


interface SettingBlockProps {
  onModify: (value: boolean) => void;
  userInfo: any;
  userInfoChange: boolean;
  setUserChange: Function;
  submitCloud: any;
  nurseformValue: any;
  setNurseFormValue: any;
}

const SettingBlock: (props: SettingBlockProps) => React.JSX.Element = (
  props
) => {
  const alarmFlagToValue = (flag: boolean) => {
    if (flag) {
      return 1;
    } else {
      return 0;
    }
  };
  const valueToAlarmFlag: (value: number) => boolean = (value) => {
    if (value == 1) {
      return true;
    } else {
      return false;
    }
  };
  const param = useParams();
  const location = useLocation();
  const sensorName = param.id;
  const equipInfo = useSelector((state) =>
    selectEquipBySensorname(state, sensorName)
  );

  const phone = useSelector(phoneSelect);
  const token = useSelector(tokenSelect);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  // const status = useSelector(statusSelect)
  const context = useContext(DataContext);
  const { nurseformValue, submitCloud, setNurseFormValue } = context;

  const { onModify } = props;
  // TODO:合并成一个state对象
  const [editing, setEditing] = useState<boolean>(false);

  const [timeAModalOpen, setTimeAModalOpen] = useState<boolean>(false);
  const [intervalAModalOpen, setIntervalAModalOpen] = useState<boolean>(false);
  const [intervalBModalOpen, setIntervalBModalOpen] = useState<boolean>(false);
  const [timeBModalOpen, setTimeBModalOpen] = useState<boolean>(false);
  const [timeCModalOpen, setTimeCModalOpen] = useState<boolean>(false);
  const [timeDModalOpen, setTimeDModalOpen] = useState<boolean>(false);
  const [sosOpen, setSosOpen] = useState<boolean>(false);
  const [leaveParamModalOpen, setLeaveParamModalOpen] =
    useState<boolean>(false);

  const [fals, setFalse] = useState(false);
  const [userInfo, setUserInfo] = useState({
    // nurseStart, nurseEnd, fallbedStart, fallbedEnd, leaveBedStart, leaveBedEnd, situpStart, situpEnd, type, deviceId, leavebedParam
    ...equipInfo,
  });
  const {
    nurseStart,
    nurseEnd,
    nursePeriod,
    injuryAlarm,
    fallbedStart,
    fallbedEnd,
    fallbedAlarm,
    leaveBedStart,
    leaveBedEnd,
    leaveBedPeriod,
    leaveBedAlarm,
    situpStart,
    situpEnd,
    situpAlarm,
    sosAlarm,
    sosStart,
    sosEnd,
    type,
    deviceId,
    leavebedParam,
    sosFlag,
  } = userInfo;

  /**
   * 请求护理配置
   */

  useEffect(() => {
    Instancercv({
      method: "get",
      url: "/nursing/getNursingConfig",
      headers: {
        "content-type": "multipart/form-data",
        token: token,
      },
      params: {
        deviceId: sensorName,
      },
    }).then((res) => {
      console.log(res.data, "typetype..........777");
      const flipbodyConfig = JSON.parse(res.data.flipbodyConfig);
      console.log(flipbodyConfig);
      const { flipbodyCount, flipbodyTime } = flipbodyConfig;
      if (flipbodyCount) {
        setNurseFormValue({
          timeRangeA: `${flipbodyCount}次`,
          timeIntervalA: `${flipbodyTime / 60}小时`,
          switchA: true,
        });
      } else {
        setNurseFormValue({
          timeRangeA: `${0}次`,
          timeIntervalA: `${flipbodyTime / 60}小时`,
          switchA: false,
        });
      }
    });
    // Instancercv({
    //     method: "get",
    //     url: "/device/selectSinglePatient",
    //     headers: {
    //         "content-type": "multipart/form-data",
    //         "token": token
    //     },
    //     params: {
    //         sensorName: sensorName,
    //         phoneNum: localStorage.getItem('phone')
    //     }
    // }).then((res: any) => {
    //     console.log(res.data.data, '........dadaada');
    //     setUserInfo({
    //         ...userInfo,
    //         sosStart: res.data.data.situpEnd,
    //         sosEnd: res.data.data.sosEnd
    //     })

    //     // setDataList({
    //     //     situpEnd: res.data.data.situpEnd,
    //     //     sosEnd: res.data.data.sosEnd
    //     // })

    //     // setUseNameList(res.data.data)
    // })
  }, []);
  // const [switchA, setSwitchA] = useState<boolean>(valueToAlarmFlag(injuryAlarm))
  // const [switchB, setSwitchB] = useState<boolean>(valueToAlarmFlag(leaveBedAlarm))
  // const [switchC, setSwitchC] = useState<boolean>(valueToAlarmFlag(situpAlarm))
  // const [switchD, setSwitchD] = useState<boolean>(valueToAlarmFlag(fallbedAlarm))
  const { bedTypeFormat, timePeriodInitFormat } = equipInfoFormatUtil;

  type modelUserInfo = {
    [key: string]: string;
  };

  // useEffect(() => {
  //     console.log(nursePeriod, 55555555)
  //     submitCloud(nursePeriod)
  // }, [nursePeriod])

  const [userLeaveBedParamChange, setLeaveBedParamChange] =
    useState<boolean>(false);
  const [userNurseChange, setNurseChange] = useState<boolean>(false);
  const [userAlarmParamChange, setAlarmParamChange] = useState<boolean>(false);

  const changeAlarmValueToCloud = (config: any) => {
    if (sensorName) {
      dispatch(
        changePersonalEquipAlarmInfo({ deviceName: sensorName, ...config })
      );
    } else {
      navigate("/");
    }
  };



  const changeValueToUserInfo = (values: modelUserInfo) => {
    const realValue: string = Object.values(values)[0];
    const realKey: string = Object.keys(values)[0];

    if (realKey == "timeRangeA") {
      setNurseFormValue({
        ...nurseformValue,
        timeIntervalA: realValue,
      });
    } else if (realKey == "timeIntervalA") {
      setNurseFormValue({
        ...nurseformValue,
        timeRangeA: realValue,
      });
    } else if (typeof realValue == "string") {
      const start = Number(realValue.split("-")[0]);
      const end = Number(realValue.split("-")[1]);
      const obj: any = {
        timeRangeA: {
          start: "nurseStart",
          end: "nurseEnd",
        },
        timeRangeB: {
          start: "leaveBedStart",
          end: "leaveBedEnd",
        },
        timeRangeC: {
          start: "situpStart",
          end: "situpEnd",
        },
        timeRangeD: {
          start: "fallbedStart",
          end: "fallbedEnd",
        },
        timeRangeE: {
          start: "sosStart",
          end: "sosEnd",
        },
      };
      const realObj: any = { ...userInfo };
      if (start) realObj[obj[realKey].start] = start;
      if (end) realObj[obj[realKey].end] = end;
      setUserInfo({ ...realObj });
    } else {
      const obj: any = {
        timeIntervalA: "nursePeriod",
        timeIntervalB: "leaveBedPeriod",
      };

      const realObj: any = { ...userInfo };
      realObj[obj[realKey]] = realValue;

      console.log(obj[realKey], realValue);
      setUserInfo({ ...realObj });
    }
  };

  const secondArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const timeArr = [1, 2, 3];
  const secodnRateColumns = secondArr.map((item) => ({
    id: `${item}次`,
    label: `${item}次`,
    value: `${item}次`,
  }));
  const timeRateColumns = timeArr.map((item) => ({
    id: `${item}小时`,
    label: `${item}小时`,
    value: `${item}小时`,
  }));

  const settings = [
    {
      label: "翻身设置",
      id: "turn_over_switch",
      // value: nursePeriod == 0 ? false : true,
      value: valueToAlarmFlag(injuryAlarm),

      handleSwitch: (value: boolean) => {
        setUserInfo({ ...userInfo, injuryAlarm: alarmFlagToValue(!!value) });
        setAlarmParamChange(true);
        // setSwitchA(!switchA)
        // setUserInfo({ ...userInfo, injuryAlarm: alarmFlagToValue(!valueToAlarmFlag(injuryAlarm)) })
        // if (nursePeriod == 0) {
        //     console.log(userInfo, '00000000000')
        //     setUserInfo({ ...userInfo, nursePeriod: 120 })
        // } else {
        //     setUserInfo({ ...userInfo, nursePeriod: 0 })
        // }

        // console.log(value, nurseformValue, '√......')
        // setNurseFormValue({
        //     ...nurseformValue,
        //     switchA: value,
        // })
        setNurseChange(true);
        // changeAlarmValueToCloud({ injuryAlarm: alarmFlagToValue(!switchA) })
      },
      params: [
        {
          label: "翻身间隔",
          id: "timeRangeA",
          value: nurseformValue.timeIntervalA,
          onChange: () => {
            setTimeAModalOpen(true);
          },
          modal: (
            <CommonFormModal
              title="翻身设置"
              open={timeAModalOpen}
              close={() => setTimeAModalOpen(false)}
              formList={[
                {
                  label: "设置翻身间隔",
                  key: "timeRangeA",
                  value: nurseformValue.timeIntervalA,
                  type: FormType.SELECT,
                  children: timeRateColumns,
                },
              ]}
              onFinish={(values) => {
                changeValueToUserInfo(values);
                setNurseChange(true);
              }}
            />
          ),
        },
        {
          label: "翻身次数",
          id: "timeIntervalA",
          onChange: () => {
            setIntervalAModalOpen(true);
          },
          value: nurseformValue.timeRangeA,
          modal: (
            <CommonFormModal
              title="翻身设置"
              open={intervalAModalOpen}
              close={() => setIntervalAModalOpen(false)}
              formList={[
                {
                  label: "设置翻身次数",
                  key: "timeIntervalA",
                  value: nurseformValue.timeRangeA,
                  type: FormType.SELECT,
                  children: secodnRateColumns,
                },
              ]}
              onFinish={(values) => {
                // setTimeIntervalA(values.timeIntervalA)
                changeValueToUserInfo(values);
                setNurseChange(true);
              }}
            />
          ),
        },
      ],
    },
    {
      label: "离床提醒设置",
      id: "turn_over_switch",
      value: valueToAlarmFlag(leaveBedAlarm),
      handleSwitch: () => {
        // setSwitchB(!switchB)
        setUserInfo({
          ...userInfo,
          leaveBedAlarm: alarmFlagToValue(!valueToAlarmFlag(leaveBedAlarm)),
        });
        setAlarmParamChange(true);
      },
      params: [
        {
          label: "监测时间段",
          id: "timeRangeB",
          value: `${timePeriodInitFormat({
            timeStamp: leaveBedStart,
            type: "start",
          })}-${timePeriodInitFormat({ timeStamp: leaveBedEnd, type: "end" })}`,
          onChange: () => {
            setTimeBModalOpen(true);
          },
          modal: (
            <CommonFormModal
              title="离床提醒设置"
              open={timeBModalOpen}
              close={() => setTimeBModalOpen(false)}
              formList={[
                {
                  label: "监测时间段",
                  key: "timeRangeB",
                  value: `${timePeriodInitFormat({
                    timeStamp: leaveBedStart,
                    type: "start",
                  })}-${timePeriodInitFormat({
                    timeStamp: leaveBedEnd,
                    type: "end",
                  })}`,
                  type: FormType.TIME_RANGE,
                },
              ]}
              onFinish={(values) => {


                // setTimeRangeB(values.timeRangeB)
                changeValueToUserInfo(values);
                setAlarmParamChange(true);
              }}
            />
          ),
        },
        {
          label: "提醒时间",
          id: "timeIntervalB",
          value: leaveBedPeriod,
          onChange: () => {
            setIntervalBModalOpen(true);
            setAlarmParamChange(true);
          },
          modal: (
            <CommonFormModal
              title="离床提醒设置"
              open={intervalBModalOpen}
              close={() => setIntervalBModalOpen(false)}
              formList={[
                {
                  label: "设置提醒时间",
                  key: "timeIntervalB",
                  value: leaveBedPeriod,
                  type: FormType.RADIO_CASCADE,
                  children: [
                    // {
                    //   id: "3min",
                    //   value: 3,
                    //   label: "3分钟",
                    // },
                    // {
                    //   id: "5min",
                    //   value: 5,
                    //   label: "5分钟",
                    // },
                    // {
                    //   id: "10min",
                    //   value: 10,
                    //   label: "10分钟",
                    // },
                    {
                      id: "实时提醒",
                      value: 0,
                      label: "实时提醒",
                    },
                    {
                      id: "定期提醒",
                      value: leaveBedPeriod === 0 ? 999999 : leaveBedPeriod,
                      label: "定期提醒"
                    },
                  ],
                },
              ]}
              onFinish={(values) => {
                console.log('999999999999', values)
                const val = values.timeIntervalB === 999999 ? 0 : values.timeIntervalB;
                // setTimeIntervalB(values.timeIntervalB)
                changeValueToUserInfo({
                  timeIntervalB: val
                });
                setAlarmParamChange(true);
              }}
            />
          ),
        },
      ],
    },
    {
      label: "坐起提醒设置",
      id: "turn_over_switch",
      value: valueToAlarmFlag(situpAlarm),
      handleSwitch: () => {
        // setSwitchC(!switchC)
        setUserInfo({
          ...userInfo,
          situpAlarm: alarmFlagToValue(!valueToAlarmFlag(situpAlarm)),
        });
        setAlarmParamChange(true);
      },
      params: [
        {
          label: "监测时间段",
          id: "timeRangeC",
          value: `${timePeriodInitFormat({
            timeStamp: situpStart,
            type: "start",
          })}-${timePeriodInitFormat({ timeStamp: situpEnd, type: "end" })}`,
          onChange: () => {
            setTimeCModalOpen(true);
          },
          modal: (
            <CommonFormModal
              title="坐起提醒设置"
              open={timeCModalOpen}
              close={() => setTimeCModalOpen(false)}
              formList={[
                {
                  label: "监测时间段",
                  key: "timeRangeC",
                  value: `${timePeriodInitFormat({
                    timeStamp: situpStart,
                    type: "start",
                  })}-${timePeriodInitFormat({
                    timeStamp: situpEnd,
                    type: "end",
                  })}`,
                  type: FormType.TIME_RANGE,
                },
              ]}
              onFinish={(values) => {
                // setTimeRangeC(values.timeRangeC)
                changeValueToUserInfo(values);
                setAlarmParamChange(true);
              }}
            />
          ),
        },
      ],
    },
    {
      label: "坠床提醒设置",
      id: "turn_over_switch",
      value: valueToAlarmFlag(fallbedAlarm),
      handleSwitch: () => {
        // setSwitchD(!switchD)
        setUserInfo({
          ...userInfo,
          fallbedAlarm: alarmFlagToValue(!valueToAlarmFlag(fallbedAlarm)),
        });
        setAlarmParamChange(true);
      },
      params: [
        {
          label: "监测时间段",
          id: "timeRangeD",
          value: `${timePeriodInitFormat({
            timeStamp: fallbedStart,
            type: "start",
          })}-${timePeriodInitFormat({ timeStamp: fallbedEnd, type: "end" })}`,
          onChange: () => {
            setTimeDModalOpen(true);
          },
          modal: (
            <CommonFormModal
              title="坠床提醒设置"
              open={timeDModalOpen}
              close={() => setTimeDModalOpen(false)}
              formList={[
                {
                  label: "监测时间段",
                  key: "timeRangeD",
                  value: `${timePeriodInitFormat({
                    timeStamp: fallbedStart,
                    type: "start",
                  })}-${timePeriodInitFormat({
                    timeStamp: fallbedEnd,
                    type: "end",
                  })}`,
                  type: FormType.TIME_RANGE,
                },
              ]}
              onFinish={(values) => {
                // setTimeRangeD(values.timeRangeD)
                changeValueToUserInfo(values);
                setAlarmParamChange(true);
              }}
            />
          ),
        },
      ],
    },
    {
      label: "SOS提醒设置",
      id: "turn_over_switch",
      value: valueToAlarmFlag(sosAlarm),
      handleSwitch: () => {
        setUserInfo({
          ...userInfo,
          sosAlarm: alarmFlagToValue(!valueToAlarmFlag(sosAlarm)),
        });
        setAlarmParamChange(true);
      },
      params: [
        {
          label: "监测时间段",
          id: "timeRangeE",
          value: `${timePeriodInitFormat({
            timeStamp: sosStart,
            type: "start",
          })}-${timePeriodInitFormat({ timeStamp: sosEnd, type: "end" })}`,
          onChange: () => {
            setSosOpen(true);
          },
          modal: (
            <CommonFormModal
              title="SOS提醒设置"
              open={sosOpen}
              close={() => setSosOpen(false)}
              formList={[
                {
                  label: "监测时间段",
                  key: "timeRangeE",
                  value: `${timePeriodInitFormat({
                    timeStamp: sosStart,
                    type: "start",
                  })}-${timePeriodInitFormat({
                    timeStamp: sosEnd,
                    type: "end",
                  })}`,
                  type: FormType.TIME_RANGE,
                },
              ]}
              onFinish={(values) => {
                console.log(
                  values,

                );
                // setTimeRangeD(values.timeRangeD)
                changeValueToUserInfo(values);
                setAlarmParamChange(true);
                // setAlarmParamchange(true)
              }}
            />
          ),
        },
      ],
    },
  ];
  const machineType = [
    {
      label: "床垫类型",
      value: bedTypeFormat(type),
    },
    {
      label: "MAC地址",
      value: deviceId,
    },

    //  暂时先注释了，后期说不定会添加 ，先别删除
    // {
    //   label: "设备校准",
    //   value: leavebedParam,
    //   params: [
    //     {
    //       label: "设备校准",
    //       value: leavebedParam,
    //       id: "leavebedParam",
    //       onChange: () => {
    //         setLeaveParamModalOpen(true);
    //       },
    //       modal: (
    //         <CommonFormModal
    //           title="设备校准"
    //           open={leaveParamModalOpen}
    //           close={() => setLeaveParamModalOpen(false)}
    //           formList={[
    //             {
    //               label: "设备校准",
    //               key: "leavebedParam",
    //               value: leavebedParam,
    //               type: FormType.INPUT,
    //             },
    //           ]}
    //           onFinish={(values) => {
    //             // setTimeRangeD(values.timeRangeD)
    //             // changeValueToUserInfo(values)
    //             setUserInfo({ ...userInfo, ...values });
    //             setLeaveBedParamChange(true);
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
  ];

  const handleClickSettingBtn = () => {
    // 更新翻身卡次数
    dispatch(onOverSettings(false))
    setEditing(true);
    onModify(true);
  };

  //overSettings
  const handleSettingCompleted = () => {

    dispatch(onOverSettings(true))
    // nurseParam?: NurseParam
    // leaveParam?: leaveParam
    // alarmParam?: alarmParam
    // userParam?: userParam
    let obj: any = {
      // deviceId: sensorName
    };
    if (props.userInfoChange) {
      obj.userParam = {
        ...props.userInfo,
        phone: phone,
        deviceId: sensorName,
      };
      // obj.phone = phone
    }
    // if (userNurseChange) {
    //     obj.nurseParam = {
    //         nurseStart, nurseEnd, nursePeriod, injuryAlarm,
    //         deviceId: sensorName
    //     }
    // }
    if (userAlarmParamChange) {
      obj.alarmParam = {
        fallbedStart,
        fallbedEnd,
        fallbedAlarm,
        leaveBedStart,
        leaveBedEnd,
        leaveBedPeriod,
        leaveBedAlarm,
        situpStart,
        situpEnd,
        situpAlarm,
        injuryAlarm,
        sosAlarm,
        sosStart,
        sosEnd,
        userName: phone,
        deviceName: sensorName,
      };
    }
    if (userLeaveBedParamChange) {
      obj.leaveParam = {
        leaveBedParam: leavebedParam,
        deviceId: sensorName,
      };
    }
    if (
      props.userInfoChange ||
      userAlarmParamChange ||
      userLeaveBedParamChange
    ) {
      console.log("dispatch");
      dispatch(changeEquipAllInfo(obj));
    }
    if (userNurseChange) {

      submitCloud({
        ...nurseformValue,
        switchA: !!injuryAlarm,
      });
    }
    setNurseChange(false);
    setAlarmParamChange(false);
    setLeaveBedParamChange(false);
    props.setUserChange(false);

    setEditing(false);
    onModify(false);
  };

  // const submitCloud = (newValue: any) => {
  //     setFormValue(newValue)
  //     console.log(newValue)
  //     const obj = {
  //         flipbodyCount : parseInt(newValue.timeRangeA),
  //         flipbodyTime : parseInt(newValue.timeIntervalA)
  //     }

  //     // 开关关闭后  设置次数为0
  //     if(!newValue.switchA){
  //         obj.flipbodyCount = 0
  //     }
  //     axios({
  //         method: "post",
  //         url: netUrl + "/nursing/updateFlipConfig",
  //         headers: {
  //             "content-type": "application/json",
  //             "token": token
  //         },
  //         data: {
  //             deviceId: sensorName,
  //             config: JSON.stringify(obj),
  //         },
  //     }).then((res) => {
  //         // message.success('修改成功')
  //     }).catch((err) => {
  //         message.error('修改失败')
  //     })

  // }

  const roleId = useSelector(roleIdSelect);
  const isManageFlag = isManage(roleId);
  const renderFooterBtn = () => {
    return isManageFlag ? (
      editing ? (
        <Button
          type="primary"
          className="w-full rounded-[2px]"
          onClick={handleSettingCompleted}
        >
          保存设置
        </Button>
      ) : (
        <span
          className="cursor-pointer text-sm text-[#0072EF] ml-[20px]"
          onClick={handleClickSettingBtn}
        >
          设置
        </span>
      )
    ) : (
      ""
    );
  };

  const [isSettingClick, setIsSettingClick] = useState(false);
  const role: any = localStorage.getItem("roleId");

  const handleAlarmSettingClick = () => {
    if (!(roleId == 1 || role == 2)) return message.info("暂无权限");
    const flag = !isSettingClick;
    setIsSettingClick(flag);
    if (flag) {

      handleClickSettingBtn();
    } else {

      handleSettingCompleted();
    }
  };

  //设备解绑
  const confirm: PopconfirmProps["onConfirm"] = async (e) => {

    let res: any = await unbindHheDevice(sensorName);
    if (res.data.code == 0) {
      message.success("解绑成功");
      dispatch(fetchEquips())
      fetchEquips()

      // navigator.
      navigate("/", {
        replace: true,
        state: {
          unbundle: true,
        },
      });
    } else {
      dispatch(fetchEquips())
      fetchEquips()
      message.error("解绑失败");
    }
  };
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.info("取消成功");
  };
  const [switchOpen, setSwitchOpen] = useState(false);
  const [switchOpenValue, setSwitchOpenValue] = useState<any>(0);
  const isOpen = () => {
    setSwitchOpen(true);
  };
  // const roleId: any = localStorage.getItem('roleId')
  const onBlurShezhi = () => {

    if (switchOpenValue.length > 4) return message.info("只能0到99数字");
    if (!/^(0|[1-9]\d?|1\d{2}|99)$/.test(switchOpenValue)) return message.info("离床参数只能是数字，0到99");
    if (switchOpenValue) {
      try {
        Instancercv({
          method: "post",
          url: "/device/updateLeaveBedParam",

          headers: {
            "content-type": "application/x-www-form-urlencoded",
            token: token,
          },
          data: {
            deviceId: sensorName,
            leaveBedParam: switchOpenValue,
          },
        }).then((res: any) => {
          // fetchEquips()
          dispatch(fetchEquips())
          message.success("修改成功");
        });
      } catch (error) {
        message.success("修改成功");
      }
    }
    setSwitchOpen(false);
  };

  return (
    <div className="overflow-scroll h-[calc(100%-11.2rem)] mt-6">
      <div className="flex justify-between ">
        <CommonTitle name={"提醒设置"} type="square" />
        {roleId == (1 || 2) ? (
          <div
            className="text-base text-sm leading-7 mr-[10px] text-[#0072EF] cursor-pointer"
            onClick={handleAlarmSettingClick}
          >
            {isSettingClick ? "保存" : "设置"}
          </div>
        ) : (
          <> </>
        )}
      </div>
      {settings.map((item) => (
        <div
          className="bg-[#fff] mb-[10px] py-[0.5rem] px-[0.8rem]"
          key={item.label}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">{item.label}</span>
            {editing && (
              <Switch
                size="small"
                checked={item.value}
                onClick={(value) => item.handleSwitch(value)}
              />
            )}
          </div>
          {item.value &&
            item.params?.map((_item, index) => (
              <div
                className={`flex items-center w-full ${index === 0 ? "mt-[10px]" : ""
                  } h-[2.6rem]`}
                key={_item.label}
              >
                <div className="text-sm text-[#32373E] w-[5rem]">
                  {_item.label}
                </div>
                <div
                  className={`flex justify-between items-center h-full text-base ${index !== item.params.length - 1 &&
                    "border-b border-b-[#DCE3E9]"
                    } p-[5px] w-[calc(100%-5rem)]`}
                >
                  <span className="text-[#6C7784]">
                    {_item.label.includes("翻身")
                      ? _item.value
                      : _item.label.includes("提醒时间")
                        ? `${_item.value === 0 ? "实时提醒" : _item.value + "分钟"
                        }`
                        : _item.value}
                  </span>
                  {editing && (
                    <span
                      className="text-sm text-[#0072EF] cursor-pointer"
                      onClick={() => _item.onChange()}
                    >
                      修改
                    </span>
                  )}
                </div>
                {_item.modal}
              </div>
            ))}
        </div>
      ))}
      {roleId === (1 || 2) ? (
        <div
          className="flex justify-between items-center"
          style={{
            background: "#ffff",
            height: "4rem",
            lineHeight: "4rem",
            marginBottom: "1rem",
          }}
        >
          <span
            className="text-base text-[#32373E] ml-[0.4rem]"
            style={{ fontWeight: "600" }}
          >
            离床参数 <span className="mr-[3rem] " style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{leavebedParam}</span>
          </span>
          {switchOpen ? (
            <Input
              maxLength={5}
              value={switchOpenValue}
              placeholder="请输入"
              onBlur={onBlurShezhi}
              onChange={(val: any) => {
                const inputValue: any = val.target.value;
                if (inputValue.length > 2) {
                  setSwitchOpenValue('')
                  return message.info("不能大于99");
                }
                if (!/^[^\u4e00-\u9fa5]{0,10}$/g.test(inputValue)) {
                  setSwitchOpenValue('')
                  return message.info("请输入数字");
                }
                setSwitchOpenValue(inputValue)
              }}
              className="input_leave_setupInput"
            ></Input>
          ) : (
            <span
              onClick={isOpen}
              className="mr-[2rem]"
              style={{ cursor: "pointer" }}
            >
              设置
            </span>
          )}
        </div>
      ) : (
        ""
      )
      }
      {/* {renderFooterBtn()} */}
      <CommonTitle name={"健康配置"} type="square" />
      {/* <div className='bg-[#fff] mb-[10px] p-[10px] px-[0.8rem] flex justify-between items-center'>
                <div>护理配置</div>
                <div><img className="w-[6.5px]" src={rigthLogo} alt="" /></div>
            </div> */}
      <SettingMoDal sensorName={sensorName} />

      {/* <div className='bg-[#fff] mb-[10px] p-[10px] px-[0.8rem] flex justify-between items-center'>
                <div>推送日报配置</div>
                <div><img className="w-[6.5px]" src={rigthLogo} alt="" /></div>
            </div> */}

      <CommonTitle name={"设备类型"} type="square" />
      <div className="bg-[#fff] mb-[10px] pt-[10px] px-[0.8rem]">
        <span className="text-base inline-block font-semibold mb-[10px]">
          设备类型
        </span>
        <div>
          {machineType.map((item) => (
            <div
              className={[
                styles.rowItem,
                "text-sm",
                item.label == "设备校准" ? "justify-between flex " : "",
              ].join(" ")}
              key={item.label}
            >
              <div>
                <span className="mr-[2rem]">{item.label}</span>
                <span>{item.value}</span>

                {item.label === "MAC地址" ? roleId === (1 || 2) ? (
                  <Popconfirm
                    title="你确定要解除绑定吗？"
                    description="解除绑定后，此信息再也没有了。"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="是"
                    cancelText="否"
                  >
                    {roleId === (1 || 2 || 0) ? (
                      <span
                        className="text-[#0072EF] ml-[1rem] "
                        style={{ cursor: "pointer" }}
                      >
                        解绑设备
                      </span>
                    )
                      : (
                        ""
                      )}
                  </Popconfirm>
                ) : (
                  <span
                    className="text-[#0072EF] ml-[1rem]"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const textarea = document.createElement("textarea");
                      textarea.value = item.value;
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textarea);
                      message.info("复制成功！");
                    }}
                  >
                    复制
                  </span>
                ) : ''}
              </div>
              {/*  暂时先注释了，后期说不定会添加 ，先别删除  */}
              {/* {item.params &&
                item.params.map((_item, index) => (


                  <>
                    {editing && (
                      <span
                        className="text-sm text-[#0072EF] cursor-pointer pr-[5px]"
                        onClick={() => _item.onChange()}
                      >
                        修改
                      </span>
                    )}
                    {_item.modal}
                  </>
                ))} */}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

const SettingMoDal = (props: any) => {
  let location = useLocation();
  const [nurseConfig, setNurseConfig] = useState([]);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const onFinish = (config: any) => {
    setNurseConfig(config);
  };
  const handleFinish = () => { };
  const close = () => {
    setOpen(false);
  };
  const [roleId, setRoleId] = useState(0);
  useEffect(() => {
    Instancercv({
      method: "get",
      url: "/organize/getUserAuthority",
      headers: {
        "content-type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
      params: {
        username: localStorage.getItem("phone"),
      },
    }).then((res) => {
      const roleId = res.data.data.roleId;
      setRoleId(roleId);
    });
  }, []);
  const navigate = useNavigate();
  const openOnCkick = () => {
    if (!(roleId == 1 || roleId == 2 || roleId == 0)) return message.info("暂无权限");
    // setOpen(true);
    dispatch(nurseOpen({ nurseOpen: true }));
    // dispatch(nurseOpen({ nurseHomeOnChlick: true })); 
    // let regex: any = /\/1\//;
    // const match = location.pathname.match(regex);
    // if (!match) {
    //   dispatch(setIsGotoNursePage());
    // } else {
    //   setOpen(true);
    // }
  };
  return (
    <>
      <div
        onClick={() => openOnCkick()}
        style={{ fontWeight: "600" }}
        className="bg-[#fff] text-[1rem]  mb-[10px] p-[10px] px-[0.8rem] flex justify-between items-center"
      >
        <div>护理配置</div>
        <div>
          <img className="w-[6.5px] cursor-pointer" src={rigthLogo} alt="" />
        </div>
      </div>
    </>
  );
};
export default SettingBlock;
