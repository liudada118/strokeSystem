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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { userModal } from "./UserInfoCard";
import avatar from "../../assets/images/avatar.png";
import { FormType } from "../../components/CommonFormModal";
import CommonNavBar from "../../components/CommonNavBar";
import dayjs from "dayjs";
import plus from "../../assets/images/plus.png";

import mobileRemind from "@/assets/image/mobileRemindBig.png";
import mobileEquiptype from "@/assets/image/mobileEquiptypeBig.png";
import mobileNurse from "@/assets/image/mobileNurseBig.png";
import mobilePush from "@/assets/image/mobilePushBig.png";
import mobileTurn from "@/assets/image/mobileTurnBig.png";
import { Switch } from "antd";
import { TurnEdit } from "./mobileEdit/TurnEdit";
import NursingPlan from "./mobileEdit/nursingPlan/index";
import { RemindEdit } from "./mobileEdit/RemindEdit";
import DayReportEdit from "./mobileEdit/DayReportEdit";
import EquipTypeEdit from "./mobileEdit/EquipTypeEdit";
import { useDispatch } from "react-redux";
import { nurseSensorName } from "../../redux/Nurse/Nurse";
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

  useEffect(() => {
    const listData = {} as any;
    userModal.forEach((item: any, index: any) => {
      listData[item.key] = item.value;
    });
    setFileList([{ url: listData.headImg || "" }]);
    setUserInfo(listData);
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
    return {
      url: URL.createObjectURL(file),
    };
  };

  const renderUploaderAvatar = () => {
    return (
      <ImageUploader
        multiple={true}
        maxCount={1}
        value={fileList}
        onChange={setFileList}
        upload={handleUpload as any}
      >
        <div className="flex flex-col items-center justify-center w-[78px] h-[78px] my-[0.4rem] rounded-[6px] border border-[#D8D8D8] ml-[10px]">
          <img src={plus} alt="" className="mb-[4px]" />
          <span className="text-[#A2A2A2] text-[12px]">添加照片</span>
        </div>
      </ImageUploader>
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
        default:
          return null;
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
    title: "设备类型设置",
    component: <EquipTypeEdit />,
  },
};

const PersonalOtherInfo = (props: otherInfoParam) => {
  const navigate = useNavigate();

  const { type } = props;
  return (
    <div
      className="bg-[#f4f5f6] pt-[4rem] flex"
      style={{ height: "100%", flexDirection: "column", paddingTop: `${type !== "nurse" ? '4rem': '0'}` }}
    >
      {type !== "nurse" && (
        <>
          <CommonNavBar
            title={personalOtherInfoObj[type].title}
            onBack={() => navigate(-1)}
          />
          <PersonalContentInfo
            title={personalOtherInfoObj[type].title}
            img={personalOtherInfoObj[type].img}
          />
        </>
      )}
      {personalOtherInfoObj[type].component}
    </div>
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
          设置老人的提醒类型与内容设置老人的提醒类型与内容
        </div>
      )}
    </div>
  );
};

const hourArr = [1, 2, 3];

const timeIntervalColumns = [
  hourArr.map((item) => ({
    label: `${item}小时`,
    value: `${item}小时`,
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
}: renderListParam) => {
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
            <Switch
              checked={formValue[key] as boolean}
              onChange={() => {
                console.log(formValue, key, {
                  ...formValue,
                  [key]: !formValue[key],
                });
                setFormValue({ ...formValue, [key]: !formValue[key] });
              }}
            />
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
          extra={formValue[key]}
          onClick={() => {
            console.log(key);
            handleClickListItem(type, title, key);
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
