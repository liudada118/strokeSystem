import nurseAdd from "@/assets/image/nurseAdd.png";
import nurseItemAdd from "@/assets/image/nurseItemAdd.png";
import nurseItemDelete from "@/assets/image/nurseItemDelete.png";
import nurseItemSelect from "@/assets/image/nurseItemSelect.png";
import nurseSelectItemDelete from "@/assets/image/nurseSelectItemDelete.png";
import nurseItemImg from "@/assets/image/nurseItemImg.png";
import { Checkbox, Input, message, Radio, Space } from "antd";

import { Popup } from "antd-mobile";
import { useEffect, useState } from "react";
import "./index.scss";
import right from "@/assets/image/rigthLogo.png";
import returnblack from "@/assets/image/returnblack.png";
import axios from "axios";
import { instance, Instancercv, netUrl } from "@/api/api";
import { useSelector } from "react-redux";
import { phoneSelect, tokenSelect } from "@/redux/token/tokenSlice";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import UploadImg from "@/pages/setting/uploadImg/UploadImg";
import ImgUpload from "@/components/imgUpload/ImgUpload";
import { CheckboxProps } from "antd/lib";
import CommonTitle from "@/components/CommonTitle";
import { useGetWindowSize } from "@/hooks/hook";
import NursingStencil from "../nurseprocess/nursingOpen/nursingStencil";
import NursingOpen from "../nurseprocess/nursingOpen/nursingOpen";

const CheckboxGroup = Checkbox.Group;

export enum ConfigType {
  IMG = "IMG",
  INPUT = "INPUT",
  SINGLE = "SINGLE",
  MULE = "MULE",
}

export enum EditType {
  DELETE = "DELETE",
  DELETEITEM = "DELETEITEM",
  ADDITEM = "ADDITEM",
  EDIT = "EDIT",
  CHANGEVALUE = "CHANGEVALUE",
  CHNAGESELETEVALUE = "CHNAGESELETEVALUE",
}
const nurseItem = [
  { text: "上传照片", type: ConfigType.IMG },
  { text: "输入", type: ConfigType.INPUT },
];
const nurseItemIncludeChild = [
  { text: "单选", type: ConfigType.SINGLE },
  { text: "多选", type: ConfigType.MULE },
];

interface nurseSelectItemParam {
  value: string;
  id: number;
  // changeValue?: any
}

interface nurseConfigParam {
  title: string;
  type: ConfigType;
  arr?: Array<nurseSelectItemParam>;
  id: number;
  changeValue: any;
}

export function NurseEdit() {
  const [visible1, setVisible1] = useState(false);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [isSelectChild, setIsSelectChild] = useState(-1);
  const [title, setTitle] = useState("");
  const [singleItemArr, setSingleItemArr] = useState([
    { value: "", id: new Date().getTime() },
  ]);
  const [multipleItemArr, setMultipleItemArr] = useState([
    { value: "", id: new Date().getTime() },
  ]);
  const [nurseConfig, setNurseConfig] = useState<Array<nurseConfigParam>>([]);

  const param = useParams();
  const location = useLocation();
  const sensorName = param.id || location.state.sensorName;

  const phone = useSelector(phoneSelect);
  const token = useSelector(tokenSelect);
  const dddddd = useSelector((state: any) => state.nurse.sensorName);

  const navigate = useNavigate();
  /**
   * 保存护理项目
   */

  const saveNurseItem = () => {
    console.log("保存");
    setVisible1(false);
    setSelectIndex(-1);
    setIsSelectChild(-1);
    // 用户自定义单选或者多选框
    const config = [...nurseConfig];
    let obj: any;
    if (isSelectChild >= 0) {
      // 用户自定义单选
      if (isSelectChild == 0) {
        obj = {
          title: title,
          type: nurseItemIncludeChild[isSelectChild].type,
          arr: singleItemArr,
        };
      }
      // 用户自定义多选框
      else {
        obj = {
          title: title,
          type: nurseItemIncludeChild[isSelectChild].type,
          arr: multipleItemArr,
        };
      }
    }
    // 上传照片或者和输入框
    else {
      obj = {
        title: title,
        type: nurseItem[selectIndex].type,
      };
    }
    obj.id = new Date().getTime();
    config.push(obj);
    console.log(config);
    setNurseConfig(config);
  };

  const onFinish = (param: any) => {
    setVisible1(false);
    setNurseConfig(param);
  };

  const changeTitle = (e: any) => {
    const value = e.target.value;
    setTitle(value);
  };

  const deleteItem = ({ type, index, itemIndex, value, changeValue }: any) => {
    switch (type) {
      case EditType.DELETE: {
        const newConfig = [...nurseConfig].filter(
          (item, itemIndex) => itemIndex != index
        );
        setNurseConfig(newConfig);
        return;
      }
      case EditType.ADDITEM: {
        const newConfig = [...nurseConfig];
        newConfig[index].arr?.push({ value: "", id: new Date().getTime() });
        setNurseConfig(newConfig);
        return;
      }
      case EditType.DELETEITEM: {
        const newConfig = [...nurseConfig];
        let changeItem = newConfig[index];
        if (changeItem.arr) {
          changeItem.arr = changeItem.arr.filter(
            (item, changeIndex) => changeIndex != itemIndex
          );
        }
        newConfig[index] = changeItem;
        console.log(newConfig, changeItem, index, itemIndex);
        setNurseConfig(newConfig);
        return;
      }
      case EditType.EDIT: {
        const newConfig = [...nurseConfig];
        const changeArr = newConfig[index].arr;
        if (changeArr) {
          changeArr[itemIndex].value = value;
          newConfig[index].arr = changeArr;
          setNurseConfig(newConfig);
        }
        return;
      }
      case EditType.CHANGEVALUE: {
        const newConfig = [...nurseConfig];
        newConfig[index].changeValue = changeValue;
        setNurseConfig(newConfig);
        return;
      }
      case EditType.CHNAGESELETEVALUE: {
        return;
      }
      default:
        return null;
    }
  };

  const saveNurseConfigToCloud = () => {
    console.log(nurseConfig, "99999999");
    Instancercv({
      method: "post",
      url: "/nursing/updateNursingConfig",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      data: {
        deviceId: sensorName,
        config: JSON.stringify(nurseConfig),
      },
    }).then((res) => {
      message.success("添加成功");
    });
  };

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
      console.log(res.data, "resssssssss");
      let nursingConfig = []
      if (res.data.templateEffectiveFlag == 2) {
          nursingConfig = JSON.parse(res.data.nursingConfig || '[]')
      } else {
          nursingConfig = JSON.parse(res.data.oldTemplate || '[]')
      }
      console.log(nursingConfig);
      setNurseConfig(nursingConfig || []);
    });
  }, []);

  return (
    <div className="w-[92%] m-auto">
      <Popup
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false);
        }}
        onClose={() => {
          setVisible1(false);
        }}
        bodyStyle={{ height: "70vh" }}
      >
        <NursingOpen />
      </Popup>
      <div
        onClick={() => {
          // setNurseConfig([])
          // setVisible1(true)
          console.log("2222222222222222");
          navigate(`/userInfo_NursingOpen?sensorName=${sensorName}`);
        }}
        className="w-full m-auto mt-[15px] py-[16px] bg-[#0072EF] flex items-center justify-center text-[#fff] text-base rounded-[10px]"
      >
        创建护理计划111
        <img src={nurseAdd} className="w-[1rem] ml-[5px]" alt="" />
      </div>
      <div
        className="pt-[8rem] flex justify-around text-[#C2CDD6] text-sm"
        style={{ fontFamily: "PingFang SC" }}
      >
        暂无护理项
      </div>
      <div className="pt-[20px] w-[full] m-auto">
        <PreViewConfig
          display={false}
          nurseConfig={nurseConfig}
          setNurseConfig={setNurseConfig}
        />
      </div>
    </div>
  );
}

interface displayEditParams {
  onFinish: Function;
  // setNurseConfig: Function
  nurseConfig: any;
  setNurseConfig: Function;
}

export const DisplayEditNurseContent = (props: displayEditParams) => {
  const { nurseConfig, onFinish } = props;
  const isMobile = useGetWindowSize();
  const [title, setTitle] = useState("");
  const [isSelectChild, setIsSelectChild] = useState(-1);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [singleItemArr, setSingleItemArr] = useState([
    { value: "", id: new Date().getTime() },
  ]);
  const [multipleItemArr, setMultipleItemArr] = useState([
    { value: "", id: new Date().getTime() },
  ]);

  const saveNurseItem = () => {
    console.log("保存", nurseConfig, singleItemArr);
    setSelectIndex(-1);
    setIsSelectChild(-1);
    // 用户自定义单选或者多选框
    const config = [...nurseConfig];
    let obj: any;
    if (isSelectChild >= 0) {
      // 用户自定义单选
      if (isSelectChild == 0) {
        obj = {
          title: title,
          type: nurseItemIncludeChild[isSelectChild].type,
          arr: singleItemArr,
        };
      }
      // 用户自定义多选框
      else {
        obj = {
          title: title,
          type: nurseItemIncludeChild[isSelectChild].type,
          arr: multipleItemArr,
        };
      }
    }
    // 上传照片或者和输入框
    else {
      obj = {
        title: title,
        type: nurseItem[selectIndex].type,
      };
    }
    obj.id = new Date().getTime();
    config.push(obj);
    console.log(config);
    // setNurseConfig(config)
    onFinish(config);
  };
  const changeTitle = (e: any) => {
    const value = e.target.value;
    setTitle(value);
  };
  if (isMobile) {
    return (
      <>
        {isSelectChild < 0 ? (
          <div className="pt-[13px] px-[15px] relative">
            <div className="text-center text-lg font-bold mb-[20px]">
              添加护理项
            </div>
            <div className="ml-[6px] text-base mb-[12px]">护理项目名称</div>
            <input
              onChange={(e) => {
                changeTitle(e);
              }}
              className="bg-[#F5F8FA] w-full text-base py-[8px] rounded-[10px] pl-[20px] mb-[12px]"
              type="text"
              placeholder="输入护理项目名称"
            />
            <div className="ml-[6px] text-base mb-[12px]">选择记录方式</div>
            <div className="bg-[#F5F8FA] py-[3px] px-[20px]">
              {nurseItem.map((item, index) => {
                return (
                  <div
                    className="nurseEditItem"
                    onClick={() => setSelectIndex(index)}
                  >
                    {item.text}
                    {selectIndex == index ? (
                      <div className="w-[14px]">
                        <img
                          src={nurseItemSelect}
                          className="w-[14px]"
                          alt=""
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
              {nurseItemIncludeChild.map((item, index) => {
                return (
                  <div
                    className="nurseEditItem"
                    onClick={() => {
                      setSelectIndex(-1);
                      setIsSelectChild(index);
                    }}
                  >
                    {item.text}
                    <div className="w-[14px] flex justify-center">
                      <img src={right} className="h-[10px]" alt="" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {isSelectChild == 0 ? (
              <AddSelectItem
                index={isSelectChild}
                setIsSelectChild={setIsSelectChild}
                itemArr={singleItemArr}
                setItemArr={setSingleItemArr}
              />
            ) : (
              <AddSelectItem
                index={isSelectChild}
                setIsSelectChild={setIsSelectChild}
                itemArr={multipleItemArr}
                setItemArr={setMultipleItemArr}
              />
            )}
          </>
        )}

        {selectIndex >= 0 || isSelectChild >= 0 ? (
          <div
            onClick={() => {
              saveNurseItem();
            }}
            className="absolute bottom-[38px] left-[4%] w-full m-auto mt-[15px] py-[16px] bg-[#0072EF] flex items-center justify-center text-[#fff] text-base rounded-[10px]"
          >
            保存护理项
          </div>
        ) : (
          ""
        )}
      </>
    );
  } else {
    return (
      <>
        <div className="pt-[13px] px-[15px] relative">
          <div className="text-center text-lg font-bold mb-[20px]">
            添加护理项
          </div>
          <div className="ml-[6px] text-base mb-[12px]">护理项目名称</div>
          <input
            onChange={(e) => {
              changeTitle(e);
            }}
            className="bg-[#F5F8FA] w-full text-base py-[8px] rounded-[10px] pl-[20px] mb-[12px]"
            type="text"
            placeholder="输入护理项目名称"
          />
          <div className="ml-[6px] text-base mb-[12px]">选择记录方式</div>
          <div className="bg-[#F5F8FA] py-[3px] px-[20px]">
            {nurseItem.map((item, index) => {
              return (
                <div
                  className="nurseEditItem"
                  onClick={() => setSelectIndex(index)}
                >
                  {item.text}
                  {selectIndex == index ? (
                    <div className="w-[14px]">
                      <img src={nurseItemSelect} className="w-[14px]" alt="" />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
            {nurseItemIncludeChild.map((item, index) => {
              return (
                <div
                  className="nurseEditItem"
                  onClick={() => {
                    setSelectIndex(-1);
                    setIsSelectChild(index);
                  }}
                >
                  {item.text}
                  <div className="w-[14px] flex justify-center">
                    <img src={right} className="h-[10px]" alt="" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isSelectChild < 0 ? (
          ""
        ) : (
          <>
            {isSelectChild == 0 ? (
              <AddSelectItem
                index={isSelectChild}
                setIsSelectChild={setIsSelectChild}
                itemArr={singleItemArr}
                setItemArr={setSingleItemArr}
              />
            ) : (
              <AddSelectItem
                index={isSelectChild}
                setIsSelectChild={setIsSelectChild}
                itemArr={multipleItemArr}
                setItemArr={setMultipleItemArr}
              />
            )}
          </>
        )}

        {selectIndex >= 0 || isSelectChild >= 0 ? (
          <div
            onClick={() => {
              saveNurseItem();
            }}
            className="w-full m-auto mt-[15px] py-[16px] bg-[#0072EF] flex items-center justify-center text-[#fff] text-base rounded-[10px]"
          >
            保存护理项
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
};

interface addSelectItem {
  index: number;
  setIsSelectChild: Function;
  itemArr: any;
  setItemArr: Function;
}

/**
 *
 * @param props
 * @returns 动态表单
 */
function AddSelectItem(props: addSelectItem) {
  const { index, setIsSelectChild, itemArr, setItemArr } = props;
  const itemInputChange = (index: number, e: any) => {
    const value = e.target.value;
    console.log(value, itemArr);
    const arr: any = [...itemArr];
    arr[index].value = value;
    setItemArr(arr);
  };

  const itemAdd = () => {
    const arr = [...itemArr];
    arr.push({ value: "", id: new Date().getTime() });
    setItemArr(arr);
  };

  const itemRemove = (index: number) => {
    const arr = [...itemArr];
    arr.splice(index, 1);
    setItemArr(arr);
  };
  return (
    <div className="pt-[13px] px-[15px]">
      <div className="relative flex items-center justify-center mb-[20px]">
        <div
          onClick={() => {
            setIsSelectChild(-1);
          }}
          className="absolute left-[15px]"
        >
          <img src={returnblack} className="h-[14px]" alt="" />
        </div>{" "}
        <div className="text-center text-lg font-bold">
          {nurseItemIncludeChild[index].text}
        </div>
      </div>
      <div className="ml-[6px] text-base mb-[12px]">
        {nurseItemIncludeChild[index].text}
      </div>
      <div>
        {itemArr.map((item: any, itemIndex: any) => {
          return (
            <div className="flex items-center mb-[12px]" key={item.id}>
              <div className="mr-[10px]">{itemIndex + 1}.</div>
              <div className="w-full relative flex items-center">
                <input
                  key={item.id}
                  value={item.value}
                  onChange={(e) => {
                    itemInputChange(itemIndex, e);
                  }}
                  className="bg-[#F5F8FA] w-full text-base py-[8px] rounded-[10px] pl-[20px] "
                  type="text"
                  placeholder={`输入${nurseItemIncludeChild[index].text}选项`}
                />
                <div
                  onClick={() => {
                    itemRemove(itemIndex);
                  }}
                  className="absolute right-[10px]"
                >
                  <img src={nurseItemDelete} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        onClick={() => {
          itemAdd();
        }}
        className="flex text-lg text-[#0072EF]"
      >
        <div className="flex items-center">
          <img className="w-[20px] mr-[13px]" src={nurseItemAdd} alt="" />
        </div>
        新建选项
      </div>
    </div>
  );
}

interface preViewConfigParam {
  // deleteItem: Function
  display: boolean;
  setNurseConfig: Function;
  nurseConfig: Array<nurseConfigParam>;
}

export function PreViewConfig(props: preViewConfigParam) {
  /**
   * 当要对自定义表单做出修改的时候
   * @param param0
   * @returns
   */
  interface changeItemParams {
    type: any;
    index: number;
    itemIndex: number;
    value: string;
    changeValue: string;
  }
  /**
   * 大项就是  单选|多选|上传头像|输入
   * 小项就是  单选|多选的每个选项
   * */
  const changeItemValue = ({
    type,
    index,
    itemIndex,
    value,
    changeValue,
  }: changeItemParams) => {
    switch (type) {
      // 删除整个大项
      case EditType.DELETE: {
        const newConfig = [...nurseConfig].filter(
          (item, itemIndex) => itemIndex != index
        );
        setNurseConfig(newConfig);
        return;
      }
      // 添加一个大项
      case EditType.ADDITEM: {
        const newConfig = [...nurseConfig];
        newConfig[index].arr?.push({ value: "", id: new Date().getTime() });
        setNurseConfig(newConfig);
        return;
      }
      // 删除大项中的某个小项
      case EditType.DELETEITEM: {
        const newConfig = [...nurseConfig];
        let changeItem = newConfig[index];
        if (changeItem.arr) {
          changeItem.arr = changeItem.arr.filter(
            (item, changeIndex) => changeIndex != itemIndex
          );
        }
        newConfig[index] = changeItem;
        console.log(newConfig, changeItem, index, itemIndex);
        setNurseConfig(newConfig);
        return;
      }
      // 修改小项的信息名称
      case EditType.EDIT: {
        const newConfig = [...nurseConfig];
        const changeArr = newConfig[index].arr;
        if (changeArr) {
          changeArr[itemIndex].value = value;
          newConfig[index].arr = changeArr;
          setNurseConfig(newConfig);
        }
        return;
      }
      // 给大项赋初始值
      case EditType.CHANGEVALUE: {
        const newConfig = [...nurseConfig];
        newConfig[index].changeValue = changeValue;
        setNurseConfig(newConfig);
        return;
      }
      case EditType.CHNAGESELETEVALUE: {
        return;
      }
      default:
        return null;
    }
  };
  const { display, setNurseConfig, nurseConfig } = props;

  return (
    <div className={`${display ? "" : "bg-[#f4f5f6]"} `}>
      {nurseConfig &&
        nurseConfig.map((item, index) => {
          return (
            <RenderNurseConfig
              display={display}
              changeItemValue={changeItemValue}
              key={item.id}
              type={item.type}
              index={index}
              title={item.title}
              arr={item.arr}
            />
          );
        })}
    </div>
  );
}

interface cardParam {
  children: any;
  title: string;
  changeItemValue: Function;
  index: number;
  type: string;
  editItem?: boolean;
  setEditItem?: Function;
  display?: boolean;
}

function Card(props: cardParam) {
  const {
    children,
    title,
    changeItemValue,
    type,
    index,
    editItem,
    setEditItem,
    display,
  } = props;

  const deleteItems = () => {
    changeItemValue({ index, type: EditType.DELETE });
  };
  const isMobile = useGetWindowSize();

  // 展示表单的页面
  if (props.hasOwnProperty("display") && display) {
    if (isMobile) {
      return (
        <div className="p-[16px] pb-[15px] bg-[#fff] w-full m-auto rounded-[10px] mb-[16px]">
          <CommonTitle name={title} type="rect" />
          <div className="flex flex-col ml-[9px] mb-[20px]">{children}</div>
        </div>
      );
    } else {
      return (
        <>
          <CommonTitle name={title} type="rect" />
          <div className="flex flex-col ml-[9px] mb-[20px]">{children}</div>
        </>
      );
    }
  }
  // 编辑的表单页面
  else {
    return (
      <div className="p-[16px] bg-[#fff] w-full m-auto rounded-[10px] mb-[16px]">
        <div className="flex items-center justify-between font-bold mb-[13px] text-base">
          {title}
          <div className="flex text-base text-[#0072EF] font-normal">
            {props.hasOwnProperty("editItem") ? (
              <div
                onClick={() => {
                  console.log(editItem);
                  setEditItem && setEditItem(!editItem);
                }}
                className="mr-[15px]"
              >
                编辑
              </div>
            ) : (
              ""
            )}
            <div
              className="flex items-center"
              onClick={() => {
                deleteItems();
              }}
            >
              <img src={nurseSelectItemDelete} className="w-[20px]" alt="" />
            </div>
          </div>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    );
  }
}

function RenderNurseConfig({
  type,
  index,
  title,
  arr,
  changeItemValue,
  display,
}: any) {
  const [editItem, setEditItem] = useState(false);
  const [img, setImg] = useState(nurseItemImg);
  const [input, setInput] = useState("");
  const [radioValue, setRadioValue] = useState();
  const [checkArr, setCheckArr] = useState<any>([]);

  const imgFinish = (img: any) => {
    setImg(img);
    changeItemValue({ type: EditType.CHANGEVALUE, index, changeValue: img });
  };

  const onInput = (e: any) => {
    const value = e.target.value;
    changeItemValue({ type: EditType.CHANGEVALUE, index, changeValue: value });
  };

  const onRadioChange = (e: any) => {
    console.log(e.target.value);
    const value = e.target.value;
    setRadioValue(value);
    changeItemValue({
      type: EditType.CHANGEVALUE,
      index,
      changeValue: value,
    });
  };

  let allCheckBoxArr: any = [];

  if (arr && type == ConfigType.MULE) {
    allCheckBoxArr = arr.map((item: any) => item.value);
  }

  const checkAll = checkArr.length == allCheckBoxArr.length;

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    const arr = e.target.checked ? allCheckBoxArr : [];
    setCheckArr(arr);
    changeItemValue({
      type: EditType.CHANGEVALUE,
      index,
      changeValue: arr,
    });
  };

  const itemChange = (e: any, value: any) => {
    console.log(e.target.checked);
    const checked = e.target.checked;
    let arr = [...checkArr];
    if (checked) {
      arr.push(value);
    } else {
      arr = arr.filter((item) => item != value);
    }
    setCheckArr(arr);
    changeItemValue({
      type: EditType.CHANGEVALUE,
      index,
      changeValue: arr,
    });
  };

  switch (type) {
    case ConfigType.IMG:
      return (
        <Card
          display={display}
          changeItemValue={changeItemValue}
          type={type}
          index={index}
          title={`${index + 1}.${title}(上传图片)`}
        >
          <ImgUpload
            img={img}
            finish={(img: any) => {
              imgFinish(img);
            }}
          />
        </Card>
      );
    case ConfigType.INPUT:
      return (
        <Card
          display={display}
          changeItemValue={changeItemValue}
          type={type}
          index={index}
          title={`${index + 1}.${title}(输入)`}
        >
          <Input
            onChange={(e) => {
              onInput(e);
            }}
            className="bg-[#F5F8FA]"
            placeholder="请输入文字"
          />
        </Card>
      );
    case ConfigType.SINGLE:
      if (display) {
        return (
          <Card
            display={display}
            changeItemValue={changeItemValue}
            type={type}
            index={index}
            editItem={editItem}
            setEditItem={setEditItem}
            title={`${index + 1}.${title}(单选)`}
          >
            <Radio.Group
              onChange={onRadioChange}
              value={radioValue}
              key={index + "radioGroup"}
            >
              <Space className="w-full" direction="vertical">
                {arr
                  ? arr.map((item: nurseSelectItemParam, itemIndex: number) => {
                      return (
                        <div
                          className="relative flex"
                          key={itemIndex + "radio"}
                        >
                          <div className="flex">
                            <Radio className="pl-[5px]" value={item.value}>
                              {item.value}
                            </Radio>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </Space>
            </Radio.Group>
          </Card>
        );
      } else {
        return (
          <Card
            changeItemValue={changeItemValue}
            type={type}
            index={index}
            editItem={editItem}
            setEditItem={setEditItem}
            title={`${index + 1}.${title}(单选)`}
          >
            <Radio.Group onChange={onRadioChange} value={radioValue}>
              <Space className="w-full" direction="vertical">
                {arr
                  ? arr.map((item: nurseSelectItemParam, itemIndex: number) => {
                      return (
                        <div className="relative flex items-center justify-center">
                          <input
                            key={item.id}
                            value={item.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              changeItemValue({
                                type: EditType.EDIT,
                                value,
                                index,
                                itemIndex,
                              });
                            }}
                            className="w-full leading-5 text-base py-[8px] rounded-[10px] pl-[25px]"
                            type="text"
                            placeholder={`输入${nurseItemIncludeChild[0].text}选项`}
                          />
                          <div className="flex justify-between items-center">
                            <Radio
                              className="absolute left-[5px]"
                              value={item.value}
                            ></Radio>
                            {editItem ? (
                              <div className="flex absolute right-[5px]">
                                {itemIndex == arr.length - 1 ? (
                                  <div
                                    onClick={() => {
                                      changeItemValue({
                                        type: EditType.ADDITEM,
                                        index,
                                        itemIndex,
                                      });
                                    }}
                                    className="mr-[10px]"
                                  >
                                    <img
                                      src={nurseItemAdd}
                                      className="w-[16px]"
                                      alt=""
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                <div
                                  onClick={() => {
                                    changeItemValue({
                                      type: EditType.DELETEITEM,
                                      index,
                                      itemIndex,
                                    });
                                  }}
                                >
                                  <img
                                    src={nurseItemDelete}
                                    className="w-[16px]"
                                    alt=""
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </Space>
            </Radio.Group>
          </Card>
        );
      }

    case ConfigType.MULE:
      if (display) {
        return (
          <Card
            display={display}
            changeItemValue={changeItemValue}
            type={type}
            index={index}
            editItem={editItem}
            setEditItem={setEditItem}
            title={`${index + 1}.${title}(多选)`}
          >
            <Space direction="vertical">
              <Checkbox
                className="pl-[5px]"
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全选
              </Checkbox>
              {arr
                ? arr.map((item: nurseSelectItemParam, itemIndex: number) => {
                    return (
                      <div className="relative">
                        <div className="flex pl-[5px]">
                          <Checkbox
                            onChange={(e) => {
                              itemChange(e, item.value);
                            }}
                            className=" left-[5px]"
                            checked={checkArr.includes(item.value)}
                          >
                            {item.value}
                          </Checkbox>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </Space>
          </Card>
        );
      } else {
        return (
          <Card
            changeItemValue={changeItemValue}
            type={type}
            index={index}
            editItem={editItem}
            setEditItem={setEditItem}
            title={`${index + 1}.${title}(多选)`}
          >
            <Space direction="vertical">
              <Checkbox
                className="pl-[5px]"
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全选
              </Checkbox>
              {arr
                ? arr.map((item: nurseSelectItemParam, itemIndex: number) => {
                    return (
                      <div className="relative flex items-center justify-center">
                        <input
                          key={item.id}
                          value={item.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            changeItemValue({
                              type: EditType.EDIT,
                              value,
                              index,
                              itemIndex,
                            });
                          }}
                          className="w-full leading-5 text-base py-[8px] rounded-[10px] pl-[25px]"
                          type="text"
                          placeholder={`输入${nurseItemIncludeChild[1].text}选项`}
                        />
                        <div className="flex justify-between items-center">
                          <Checkbox
                            onChange={(e) => {
                              itemChange(e, item.value);
                            }}
                            className="absolute left-[5px]"
                            checked={checkArr.includes(item.value)}
                          ></Checkbox>
                          {editItem ? (
                            <div className="flex absolute right-[5px]">
                              {itemIndex == arr.length - 1 ? (
                                <div
                                  onClick={() => {
                                    changeItemValue({
                                      type: EditType.ADDITEM,
                                      index,
                                      itemIndex,
                                    });
                                  }}
                                  className="mr-[10px]"
                                >
                                  <img
                                    src={nurseItemAdd}
                                    className="w-[16px]"
                                    alt=""
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                              <div
                                onClick={() => {
                                  changeItemValue({
                                    type: EditType.DELETEITEM,
                                    index,
                                    itemIndex,
                                  });
                                }}
                              >
                                <img
                                  src={nurseItemDelete}
                                  className="w-[16px]"
                                  alt=""
                                />
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </Space>
          </Card>
        );
      }
    default:
      return null;
  }
}
