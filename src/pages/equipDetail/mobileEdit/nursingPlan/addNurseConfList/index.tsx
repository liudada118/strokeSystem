import React, { useEffect, useState } from "react";
import { selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CommonNavBar from "../../../../../components/CommonNavBar";
import { Instancercv, instance } from "@/api/api";
import NurseList from "../nurseList/index";
// import NurseList from '@/pages/equipDetail/nurseprocess/nurseConf/nurseList/index'
import { Button, message, Modal, Radio } from "antd";
import loog from '../../../../../assets/images/logo.png'
import jiaHao from '../../../../../assets/images/image copy 2.png'
import { getNurseConfist } from "@/utils/getNursingConfig"
import handleSettingPop from '@/utils/handleSettingPop'
import greyNotice from "@/assets/image/greyNotice.png";
import "../index.css";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function AddNurseConfList() {
    const param = useParams();
    const location = useLocation();
    const sensorName = param.id || location.state.sensorName;
    const [nurseList, setNurseList] = useState([]) as any;
    const navigate = useNavigate();
    const [saveType, setSaveType] = useState(1)
    const [confirmVisible, setConfirmVisible] = useState(false)

    const [sensorNameUser, setSensorName] = useState('')
    const [delItem, setDelItem] = useState<any>({});
    const [confirmType, setConfirmType] = useState("");
    const addNurseConf = () => {
        navigate(`/edit_user_nurse`, { state: { sensorName, isEmpty: nurseList.length === 0 } });
    };
    const modalContentMap = {
        back: {
            title: "删除项目",
            content: () => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '1.5rem 0 1rem 0',
                            textAlign: 'center'
                        }}
                    >
                        该模版尚未保存
                        <span style={{ display: 'flex', textAlign: 'center', color: '#8794A1', marginTop: '0.5rem' }}>返回将不保存此次编辑的内容</span>
                    </div>
                );
            },
            okBtnText: "不保存",
            okFn: () => {
                navigate(`/userInfo_editing`, { state: { sensorName, type: 'nurse' } });
            },
        },
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
                localStorage.setItem("tempList", JSON.stringify([]));
            },
        },
        delete: {
            title: "删除项目",
            content: () => {
                return (
                    <div
                        style={{ textAlign: "center", height: "4rem", lineHeight: "4rem" }}
                    >
                        确认删除该任务？
                    </div>
                );
            },
            okBtnText: "确定",
            okFn: () => {
                const tempNurseList = localStorage.getItem("tempList") || "[]";
                const nurseList = JSON.parse(tempNurseList);
                const delList = nurseList.filter((item: any) => {
                    return +item.key !== +delItem.key;
                });
                localStorage.setItem("tempList", JSON.stringify(delList));
                setNurseList(delList)
            },
        },
        save: {
            title: "应用护理计划",
            okBtnText: "应用",
            content: () => {
                return (
                    <div style={{ textAlign: "center", height: "4rem" }}>
                        <p style={{ paddingBottom: "1rem" }} >确认应用该护理计划？</p>
                        <Radio.Group
                            style={{ marginBottom: "1rem" }}
                            name="radiogroup"
                            defaultValue={1}
                            options={[
                                { value: 1, label: '立即生效' },
                                { value: 2, label: '次日生效' },
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
                deviceId: sensorName,
                config: JSON.stringify(list),
                templateEffectiveFlag: saveType,
                templateUpdatetime: new Date().getTime(),
            },
        }).then((res) => {
            message.success("保存成功");
            localStorage.removeItem("tempList");
            navigate(`/userInfo_editing`, { state: { sensorName, type: 'nurse' } });
        });
    };
    const delTemp = (params: any) => {
        setConfirmType('delete')
        setConfirmVisible(true)
        setDelItem(params)
    };
    useEffect(() => {
        const tempList = localStorage.getItem("tempList");
        if (tempList) {
            console.log(tempList, '√≥......√≥...tempList.........')
            setNurseList(JSON.parse(tempList));
        }
        Instancercv({
            method: "get",
            url: "/device/selectSinglePatient",
            headers: {
                "content-type": "multipart/form-data",
                "token": localStorage.getItem("token"),
            },
            params: {
                sensorName: sensorName,
                phoneNum: localStorage.getItem('phone')
            }
        }).then((res: any) => {
            setSensorName(res.data.data.patientName)
        })
    }, []);


    return (
        <div
            className="bg-[#f4f5f6] flex"
            style={{
                height: "100%",
                flexDirection: "column",
            }}
        >
            <div className="nurse_header_logo">
                <img onClick={() => handleSettingPop()} style={{ width: "2rem", height: "2rem", marginLeft: "1rem" }} src={loog} alt="" />
                <p style={{ fontWeight: "600", fontSize: "1rem", marginLeft: "1rem" }}>JQ HEALTHCARE</p>
            </div>
            <CommonNavBar
                style={{ position: "inherit" }}
                title={'设置护理计划'}
                onBack={() => {
                    setConfirmType('back')
                    setConfirmVisible(true)
                }}
            />
            <div
                className={`nurse_box`}
            >
                <div className="title">
                    <p>
                        <span className="text-[1rem]">{sensorNameUser}的护理计划</span>
                        <span
                            className="mr-[1rem] cursor-pointer"
                            style={{ marginLeft: "auto", color: "#1677ff", display: "flex", alignItems: "center", fontSize: "1rem" }}
                            onClick={() => addNurseConf()}
                        >
                            <img style={{ width: "40%", height: "40%" }} src={jiaHao} alt="" />
                            添加
                        </span>
                    </p><div className="tip flex items-center h-[2rem]   mt-[0.5rem]">
                        <img
                            className="w-[1rem] bg-[#F5F8FA] h-[1rem] mr-[5px] ml-2"
                            src={greyNotice}
                            alt=""
                        />
                        <span className="text-[1rem] bg-[#F5F8FA] text-[#929EAB]">
                            当前内容仅作为效果预览，不可作为实际页面使用
                        </span>
                    </div>
                </div>
                {/* <div className="w-[94%] px-[3%]">
                    <NurseList
                        list={nurseList}
                        delTemp={delTemp}
                        operType="add"
                        extParams={{ className: "modify" }}
                    />
                </div> */}
                <NurseList list={nurseList} operType="add" delTemp={delTemp} />
                <div className="bg-[#f4f5f6] w-[full]">
                    <Button
                        type="primary"
                        onClick={() => {
                            setConfirmType('save')
                            setConfirmVisible(true)
                        }}
                        className="mt-[1rem] w-[full]"
                        style={{ width: "100%", height: "3rem", marginBottom: "0" }}
                    >
                        应用护理计划
                    </Button>
                </div>
            </div>
            <Modal style={{ height: "4rem", width: "3rem" }}
                closable={false}
                width='20rem'
                // title={
                //     modalContentMap[confirmType] && modalContentMap[confirmType].title
                // }
                // okText={
                //     modalContentMap[confirmType] && modalContentMap[confirmType].okBtnText
                // }
                // cancelText='取消'
                open={confirmVisible}
                // onOk={() => {
                //     setConfirmVisible(false);
                //     modalContentMap[confirmType] && modalContentMap[confirmType].okFn();
                // }}
                // onCancel={() => {
                //     setConfirmVisible(false)
                //     confirmType !== 'back' && navigate(`/userInfo_editing`, { state: { sensorName, type: 'nurse' } });
                // }}
                footer={null}
            >
                {modalContentMap[confirmType] && modalContentMap[confirmType].content()}
                <div className="flex justify-center mt-[0.5rem]">
                    <Button variant="solid" onClick={() => {
                        setConfirmVisible(false);
                        // ['save', 'back'].includes(confirmType) && navigate(`/userInfo_editing`, { state: { sensorName, type: 'nurse' } });
                    }}>取消</Button>
                    <Button type="primary"
                        style={{ marginLeft: "1rem" }}
                        onClick={() => {
                            setConfirmVisible(false);
                            modalContentMap[confirmType] && modalContentMap[confirmType].okFn();
                        }}>{modalContentMap[confirmType] && modalContentMap[confirmType].okBtnText}</Button>
                </div>
            </Modal>
        </div>
    );
}
