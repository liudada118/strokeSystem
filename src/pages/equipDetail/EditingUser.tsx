import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  List,
  Picker,
  DatePicker,
  ImageUploader,
  ImageUploadItem,
  restoreMotion,
} from "antd-mobile";
import { compressionFile } from "@/utils/imgCompressUtil";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import nullImg from "@/assets/image/null.png";
import { userModal } from "./UserInfoCard";
import avatar from "../../assets/images/avatar.png";
import { FormType } from "../../components/CommonFormModal";
import CommonNavBar from "../../components/CommonNavBar";
import dayjs from "dayjs";
import plus from "../../assets/images/plus.png";
import './mobileEdit/nursingPlan/index.scss'
import './mobileEdit/nursingPlan/nurseList/index.scss'
import '@/pages/equipDetail/mobileEdit/nursingPlan/nurseList/index.scss'

import mobileRemind from "@/assets/image/mobileRemindBig.png";
import mobileEquiptype from "@/assets/image/mobileEquiptypeBig.png";
import mobileNurse from "@/assets/image/mobileNurseBig.png";
import mobilePush from "@/assets/image/mobilePushBig.png";
import mobileTurn from "@/assets/image/mobileTurnBig.png";
import { message, Switch } from "antd";
import { TurnEdit } from "./mobileEdit/TurnEdit";
import NursingPlan from "./mobileEdit/nursingPlan/index";
import { RemindEdit } from "./mobileEdit/RemindEdit";
import DayReportEdit from "./mobileEdit/DayReportEdit";
import EquipTypeEdit from "./mobileEdit/EquipTypeEdit";
import { useDispatch } from "react-redux";
import { nurseSensorName } from "../../redux/Nurse/Nurse";
import axios from "axios";
import { Instancercv, netUrl } from "@/api/api";
const EditingUser: React.FC = () => {
  const param = useParams();
  console.log(param);
  const location = useLocation();
  const dispatch = useDispatch();
  const sensorName = param.id || location.state.sensorName;
  const type = location.state.type;
  useEffect(() => {
    dispatch(nurseSensorName(sensorName));
  }, []);
  // const typeToComponent : any = {
  //     personal : <PersonalInfo />,
  //     remind :
  // }

  if (type == "personal") {
    return <PersonalInfo />;
  }

  return <PersonalOtherInfo type={type} />;
};

// 个人信息修改页面
const PersonalInfo = (props: any) => {
  const location = useLocation();
  const { sensorName, type, userModal } = location.state || props;
  const [userInfo, setUserInfo] = useState<any>({});
  const [headImg, setHeadImg] = useState<any>("");

  useEffect(() => {
    const listData = {} as any;
    userModal.forEach((item: any, index: any) => {
      listData[item.key] = item.value;
    });
  }, []);
  const navigate = useNavigate();
  const [editingInputInfo, setEditingInputInfo] = useState<any>({
    show: false,
    key: "",
    label: "",
    value: "",
  });

  const [pickerInfo, setPickerInfo] = useState<any>({
    visible: false,
    data: [[]],
  });

  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      key: "1",
      url: userInfo.headImg,
      thumbnailUrl: userInfo.headImg,
      extra: "",
    },
  ]);
  const [dateVisible, setDateVisible] = useState<boolean>(false);
  const labelRenderer = useCallback((type: string, data: number) => {
    switch (type) {
      case "year":
        return data + "年";
      case "month":
        return data + "月";
      case "day":
        return data + "日";
      case "hour":
        return data + "时";
      case "minute":
        return data + "分";
      case "second":
        return data + "秒";
      default:
        return data;
    }
  }, []);

  const handlePickerClick = (data: any) => {
    const _data = data?.children?.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    setPickerInfo({
      visible: true,
      data: [_data],
    });
  };
  const handleUpload = (file: File) => {
    let res = compressionFile(file);
    res.then((e) => {
      console.log(e, "compressionFile");
      const token = localStorage.getItem("token");
      axios({
        method: "post",
        url: netUrl + "/file/fileUpload",
        headers: {
          "content-type": "multipart/form-data",
          token: token,
        },
        data: {
          file: e,
        },
      })
        .then((res) => {
          const img = res.data.data.src;
          message.success("上传成功");

          modifyUserInfo({ headImg: img });
        })
        .catch((err) => {
          message.error(err.error);
        });
    });
    return {
      url: URL.createObjectURL(file),
    };
  };

  const renderUploaderAvatar = () => {
    return (
      //   <ImageUploader
      //     multiple={true}
      //     maxCount={1}
      //     value={fileList}
      //     onChange={setFileList}
      //     upload={handleUpload as any}
      //   >
      <div style={{ height: "5rem", width: "5rem", position: 'relative' }}>
        <div
          className="img"
          style={{
            position: "absolute",
            background: `url(${userInfo.headImg ? userInfo.headImg : nullImg
              })  center center / cover no-repeat`,
            cursor: "pointer",
            height: "5rem",
            width: "5rem",
          }}
        ></div>
        <input
          type="file"
          name="img"
          style={{
            opacity: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
          }}
          id="img"
          onChange={(e) => {
            // setSpinning(true);
            if (e.target.files) {
              // res.then((e) => {})
              // setImgFile(e.target.files[0])
              let res = compressionFile(e.target.files[0]);
              res.then((e) => {
                console.log(e, "compressionFile");
                const token = localStorage.getItem("token");
                axios({
                  method: "post",
                  url: netUrl + "/file/fileUpload",
                  headers: {
                    "content-type": "multipart/form-data",
                    token: token,
                  },
                  data: {
                    file: e,
                  },
                })
                  .then((res) => {
                    const img = res.data.data.src;
                    message.success("上传成功");
                    modifyUserInfo({ headImg: img })
                  })
                  .catch((err) => {
                    // message.error(err.error)
                    // setSpinning(false);
                  });
              });
            }
          }}
        />
      </div>

      //     <div className="flex flex-col items-center justify-center w-[78px] h-[78px] my-[0.4rem] rounded-[6px] border border-[#D8D8D8] ml-[10px]">
      //       <img src={plus} alt="" className="mb-[4px]" />
      //       <span className="text-[#A2A2A2] text-[12px]">添加照片</span>
      //     </div>
      //   </>
    );
  };
  const renderListItem = () => {
    return userModal.map((item: any) => {
      switch (item.mobileType) {
        case FormType.INPUT:
          return (
            <List.Item
              className="text-base"
              key={item.label}
              extra={userInfo[item.key]}
              onClick={() => {
                setEditingInputInfo({
                  show: true,
                  key: item.key,
                  label: item.mobileLabel,
                });
              }}
            >
              {item.mobileLabel}
            </List.Item>
          );
        case FormType.RADIO:
          return (
            <List.Item
              className="text-base"
              key={item.label}
              extra={userInfo[item.key] === 1 ? "男" : "女"}
              onClick={() => {
                handlePickerClick(item);
              }}
            >
              {item.mobileLabel}
            </List.Item>
          );
        case FormType.DATE_SELECT:
          return (
            <List.Item
              className="text-base"
              key={item.label}
              extra={userInfo[item.key]}
              onClick={() => setDateVisible(true)}
            >
              {item.mobileLabel}
            </List.Item>
          );
        case FormType.PHONE:
          return (
            <List.Item
              className="text-base"
              key={item.label}
              extra={userInfo[item.key]}
              onClick={() => setDateVisible(true)}
            >
              {item.mobileLabel}
            </List.Item>
          );
        default:
          return null;
      }
    });
  };

  const getuserInfo = () => {
    if (sensorName) {
      Instancercv({
        method: "get",
        url: "/device/selectSinglePatient",
        headers: {
          "content-type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
        params: {
          sensorName,
          phoneNum: localStorage.getItem("phone"),
        },
      }).then((res: any) => {
        if (res && res.data.code == 0) {
          const info = res.data?.data || {};
          setUserInfo({
            headImg: info.headImg,
            patientName: info.patientName,
            age: info.age,
            roomNum: info.roomNum,
            sex: info.sex,
            telephone: info.telephone,
            address: info.address,
            medicalHistory: info.medicalHistory,
          });
          setFileList([
            {
              key: "1",
              url: info.headImg,
              thumbnailUrl: info.headImg,
              extra: "",
            },
          ]);
        }
      });
    }
  };
  useEffect(() => {
    if (sensorName) {
      getuserInfo();
    }
  }, [sensorName]);

  const modifyUserInfo = (params: any) => {
    axios({
      method: "post",
      url: netUrl + "/device/update",

      headers: {
        "content-type": "application/x-www-form-urlencoded",
        token: localStorage.getItem("token"),
      },
      params: {
        deviceId: sensorName,
        ...userInfo,
        ...params,
      },
    }).then((res) => {
      if (res.data.msg == "update success") {
        getuserInfo();
      }
    });
  };

  if (editingInputInfo.show) {
    const handleCancel = () => {
      setEditingInputInfo({
        show: false,
        key: "",
        label: "",
        value: "",
      });
    };
    const handleConfirm = () => {
      setUserInfo({
        ...userInfo,
        [editingInputInfo.key]: editingInputInfo.value,
      });
      modifyUserInfo({
        [editingInputInfo.key]: editingInputInfo.value,
      });
      setEditingInputInfo({
        show: false,
        key: "",
        label: "",
        value: "",
      });
    };

    return (
      <Fragment>
        <div className="flex justify-between items-center mb-[12px] py-[8px] px-[15px] bg-[#fff] ">
          <span className="!text-sm" onClick={() => handleCancel()}>
            取消
          </span>
          <span className="text-lg font-medium">{`设置${editingInputInfo.label}`}</span>
          <Button
            className="flex items-center justify-center !text-sm h-[1.6rem]"
            color="primary"
            onClick={() => handleConfirm()}
          >
            完成
          </Button>
        </div>
        <Input
          style={{ background: "#fff" }}
          className="h-[7vh] pl-[15px] text-base"
          placeholder="请输入内容"
          defaultValue={userInfo[editingInputInfo.key]}
          value={editingInputInfo.value}
          onChange={(val) => {
            setEditingInputInfo({
              ...editingInputInfo,
              value: val,
            });
          }}
        />
      </Fragment>
    );
  }
  return (
    <div className="bg-[#fff] h-[100vh]">
      <CommonNavBar title="个人信息" onBack={() => navigate(-1)} />
      <div className="md:pt-[4rem]">
        <List className="px-[15px]">
          <List.Item className="text-base" extra={renderUploaderAvatar()}>
            头像
          </List.Item>
          {renderListItem()}
        </List>
      </div>
      <DatePicker
        visible={dateVisible}
        onClose={() => {
          setDateVisible(false);
        }}
        min={new Date("1900/01/01")}
        max={new Date()}
        precision="day"
        title="选择年龄"
        renderLabel={labelRenderer}
        onConfirm={(val) => {
          const birthDay = dayjs(val);
          const currentDay = dayjs(new Date());
          setUserInfo({
            ...userInfo,
            age: currentDay.diff(birthDay, "year"),
          });
          modifyUserInfo({ age: currentDay.diff(birthDay, "year") });
        }}
      />
      <Picker
        columns={pickerInfo.data}
        visible={pickerInfo.visible}
        onClose={() =>
          setPickerInfo({
            visible: false,
            data: [[]],
          })
        }
        title="选择性别"
        value={[userInfo.sex]}
        onConfirm={(v) => {
          console.log(v, pickerInfo, "2222222");
          setUserInfo({
            ...userInfo,
            sex: v[0],
          });
          modifyUserInfo({ sex: v[0] });
        }}
      />
    </div>
  );
};
interface otherInfoParam {
  type: string;
}
export const personalOtherInfoObj: any = {
  remind: {
    img: mobileRemind,
    title: "提醒设置",
    component: <RemindEdit />,
  },
  turn: {
    img: mobileTurn,
    title: "翻身设置",
    component: <TurnEdit />,
  },
  nurse: {
    img: mobileNurse,
    title: "护理设置",
    component: <NursingPlan />,
  },
  pushReport: {
    img: mobilePush,
    title: "推送日报设置",
    component: <DayReportEdit />,
  },
  equipType: {
    img: mobileEquiptype,
    title: "设备类型",
    component: <EquipTypeEdit />,
  },
};
const PersonalOtherInfo = (props: otherInfoParam) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = props || location.state.type;

  return (
    <div
      className="bg-[#f4f5f6] pt-[4rem] flex"
      style={{
        height: "100%",
        flexDirection: "column",
        paddingTop: `${type !== "nurse" ? "4rem" : "0"}`,
      }}
    >
      {
        type !== "nurse" && (
          <>
            <CommonNavBar
              title={personalOtherInfoObj[type].title}
              onBack={() => {
                navigate(-1);
              }}
            />
            <PersonalContentInfo
              title={personalOtherInfoObj[type].title}
              img={personalOtherInfoObj[type].img}
            />
          </>
        )
      }
      {personalOtherInfoObj[type].component}
    </div >
  );
};
interface personalInfoParam {
  title: string;
  img: string;
}
export const PersonalContentInfo = (props: personalInfoParam) => {
  const { title, img } = props;
  return (
    <div className="w-[92%] mx-auto bg-[#fff] flex flex-col items-center pt-[36px] pb-[13px] rounded-[10px] mb-[20px]">
      <img src={img} className="w-[44px] mb-[6px]" alt="" />
      <div className="text-lg text-[#3D3D3D] ">{title}</div>
      {title === "推送日报设置" ? (
        ""
      ) : title === "设备类型设置" ? (
        ""
      ) : (
        <div className="text-sm w-[60%] text-[#6C7784] text-center">

        </div>
      )}
    </div>
  );
};

const hourArr = [...Array(61)];

const timeIntervalColumns = [
  hourArr.map((item, index) => ({
    label: index === 0 ? "实时提醒" : `${index}分钟后提醒`,
    value: index === 0 ? index : `${index}分钟后提醒`,
  })),
];

const secondArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const secodnRateColumns = [
  secondArr.map((item) => ({
    label: `${item}次`,
    value: `${item}次`,
  })),
];

interface renderListParam {
  type: FormType;
  objKey: string;
  label: string;
  title?: string;
  formValue: any;
  listType?: string;
  setFormValue: Function;
  setPickerInfo: Function;
  // submitCloud : Function
}

export const RenderListItem = ({
  type,
  objKey: key,
  label,
  title = "",
  formValue,
  setFormValue,
  setPickerInfo,
  listType,
}: renderListParam) => {
  console.log(
    type,
    // objKey: key,
    label,
    (title = ""),
    formValue,
    setFormValue,
    setPickerInfo,
    "..........................setFormValuesetFormValuesetFormValue"
  );
  const createTimeNumber: (
    val: number
  ) => { label: string; value: string }[] = (number) => {
    return new Array(number).fill(0).map((item, index) => {
      if (index < 9) {
        return {
          label: `0${index}`,
          value: `0${index}`,
        };
      }
      return {
        label: `${index}`,
        value: `${index}`,
      };
    });
  };
  const timeHour = createTimeNumber(24);
  const timeMinutes = createTimeNumber(60);
  const timeRangeColumns = [timeHour, timeMinutes, timeHour, timeMinutes];
  const roleId: any = localStorage.getItem('roleId')

  const handleClickListItem = (type: FormType, title: string, key: string) => {
    if (type === FormType.TIME_RANGE) {
      setPickerInfo({
        title,
        columns: timeRangeColumns,
        visible: true,
        key,
      });
    } else if (type === FormType.SECONDRATE) {
      setPickerInfo({
        title,
        columns: secodnRateColumns,
        visible: true,
        key,
      });
    } else {
      setPickerInfo({
        title,
        columns: timeIntervalColumns,
        visible: true,
        key,
      });
    }
  };
  switch (type) {
    case FormType.SWITCH:
      return (
        <List.Item
          key={key}
          extra={
            <>
              {
                !(roleId == 1 || roleId == 2 || roleId == 0) ? '' : <Switch
                  checked={formValue[key] as boolean}
                  onChange={() => {
                    setFormValue({ ...formValue, [key]: !formValue[key] });
                  }}
                />
              }
            </>
          }
        >
          {label}
        </List.Item>
      );
    case FormType.SECONDRATE:
    case FormType.TIME_RANGE:
    case FormType.TIME_INTERVAL:
      return (
        <List.Item
          key={key}
          extra={
            listType === "offBed" && formValue[key] === 0
              ? "实时提醒"
              : formValue[key]
          }
          onClick={() => {
            if (roleId !== "1" && roleId !== "2" && roleId !== "0") {
              message.error("您没有权限修改");
            } else {
              handleClickListItem(type, title, key);
            }
          }}
        >
          {label}
        </List.Item>
      );
    default:
      return null;
  }
};
export default EditingUser;
