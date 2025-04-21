import React, { useState } from 'react'
import { Select } from "antd";
import { TextArea, Picker, Popup, Input } from "antd-mobile";
import xaingjing from '@/assets/image/xaingjing.png'
import { RightOutline } from 'antd-mobile-icons'
import nullImg from "@/assets/image/null.png";
import { compressionFile } from "@/utils/imgCompressUtil";
import axios from "axios";
import instance, { Instancercv, netUrl } from "@/api/api";
import { message } from "antd";
import "./nurseAdd";
import dayjs from 'dayjs';
import Item from 'antd/es/list/Item';
function NurseAdd(props: any) {
    const { type, sensorName, onClose } = props
    const [notes, setNotes] = useState<any>('')
    const [uploadImage, setUploadImage] = useState<any>([])
    const [nurseProject, setNurseProject] = useState<any>(props.currentNurse?.title || '')
    const [timeVisible, setTimeVisible] = useState<any>(false)
    const [completionTime, setCompletionTime] = useState<any>(props.currentNurse?.completionTime || new Date().getTime()) as any
    const getCloumn = (number: number) => {
        const list = [...Array(23)].map((_: any, index: number) => {
            const item = index + 1
            return {
                label: item < 10 ? '0' + item : item,
                value: item
            }
        })
        return list
    }
    const handleRecordForm = (values: any) => {
        if (type === '新增一次') {
            if (!(nurseProject && completionTime && uploadImage)) return message.info('请填写必填项')
        }
        if (values) {
            const values = {
                nurseProject,
                completionTime,
                uploadImage: JSON.stringify(uploadImage),
                notes
            }
            console.log(values.nurseProject, '....................valuesvalues');

            if (values.nurseProject.length > 10) return message.info('护理项目不能超过10个字符')
            if (values.notes.length > 20) return message.info('备注不能超过20个字符')
            const dataList = type === '新增一次' ?

                {
                    did: sensorName,
                    timeMillis: completionTime,
                    templateTime: new Date().getTime(),
                    data: JSON.stringify(values),
                } :
                {
                    did: sensorName,
                    timeMillis: new Date().getTime(),
                    templateTime: props.currentNurse.templateTime,
                    data: JSON.stringify(values),
                }
            instance({
                method: "post",
                url: "/sleep/nurse/addDayNurse",
                headers: {
                    "content-type": "application/json",
                    "token": localStorage.getItem('token')
                },
                data: dataList
            }).then((res) => {

                if (res.data.msg == 'insert success') {
                    message.info('添加成功')
                    onClose(true)
                }

            })
        }
    }
    return (
        <Popup
            style={{
                borderRadius: "1rem",
                height: "70%",
                overflow: 'hidden'
            }}
            visible={props.visible}
            onMaskClick={() => {
                onClose(false);
            }}
            onClose={() => {
                onClose(false);
            }}
            bodyStyle={{ height: "70vh" }}
        >
            <div className="w-full h-[100%] overflow-hidden">
                <div className="w-full h-[100%] overflow-hidden">
                    <div className="mx-[1.48rem] pt-4 flex  justify-between">
                        <div className="text-[#3D3D3D] text-base" onClick={() => {
                            onClose(false);
                        }}>
                            取消
                        </div>
                        <div style={{ fontWeight: "500", fontSize: "1.2rem" }}>
                            用药提醒
                        </div>
                        <div className="text-[#0072EF] text-base" onClick={handleRecordForm}>
                            保存
                        </div>
                    </div>
                    <div className='overflow-auto px-[1.48rem]' style={{ height: `calc(100% - 4rem)`, }}>
                        <div className="mt-[2rem] h-[4.5rem] rounded-[0.4rem] bg-[#F5F8FA] flex items-center mb-[0.75rem]">
                            <div className="text-[#32373E] text-[1.25rem] ml-[1rem] ">
                                护理项目：
                            </div>
                            <div className="text-[#32373E] text-[1.25rem] m-[0rem] flex items-center">
                                <Input type="text" disabled={props.type === '记录护理项目'} onChange={(e: any) => {
                                    // if (e.target.value.length > 10) {
                                    //     return message.info('请输入10个字内备注内容')
                                    // }
                                    setNurseProject(e)

                                }} value={nurseProject} placeholder='请输入护理项目' />
                            </div>
                        </div>
                        <div className="mt-[2rem] h-[4.5rem] rounded-[0.4rem] bg-[#F5F8FA] flex items-center justify-between mb-[0.75rem]">
                            <div className="text-[#32373E] text-[1.25rem] ml-[1rem] ">
                                完成时间
                            </div>
                            <div className="text-[#32373E] text-[1.25rem] m-[1rem] flex items-center"
                                onClick={() => {
                                    if (props.type === '记录护理项目') {
                                        return
                                    }
                                    setTimeVisible(true)
                                }}
                            >
                                <div className="text-[#32373E] text-[1.25rem] mr-[1rem]" style={{ color: props.type === '记录护理项目' ? '#c6cbd2' : '#32373E' }}>
                                    {dayjs(completionTime).format("HH:mm")}
                                </div>
                                < RightOutline />
                            </div>
                            {timeVisible && <Picker
                                columns={[
                                    getCloumn(23),
                                    getCloumn(59),
                                ]}
                                visible={timeVisible}
                                onClose={() => {
                                    setTimeVisible(false)
                                }}
                                title={'完成时间'}
                                value={[]}
                                onConfirm={v => {
                                    if (!v) return
                                    const hour = v[0] && +v[0] < 10 ? '0' + v[0] : v[0]
                                    const min = v[1] && +v[1] < 10 ? '0' + v[1] : v[1]
                                    const result = `${hour}:${min}`
                                    const time = new Date(dayjs().format("YYYY-MM-DD") + ' ' + `${result}`).getTime()
                                    console.log(time, new Date().getTime(), '.......................newDategetTime');

                                    if (time > new Date().getTime()) return message.info('时间不能大于当前时间')
                                    setCompletionTime(time)
                                }}
                                className='mobile_picker_box_add_nurse'
                            />}
                        </div>
                        <div className="mt-[2rem] rounded-[0.4rem] bg-[#F5F8FA] mb-[0.75rem] pb-[0.5rem]">
                            <div className="text-[#32373E] text-[1.25rem] py-[0.8rem] ml-[1rem] ">

                                上传照片
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', height: "auto", width: "auto", padding: "0 0 0.5rem 1rem" }}>
                                {
                                    uploadImage.map((item: any) => {
                                        return <img key={item} src={item} alt="" style={{ width: "6rem", height: "6rem", margin: "0 0.5rem 0.5rem 0" }} />
                                    })
                                }
                                <div
                                    className="img"
                                    style={{
                                        position: "relative",
                                        background: `url(${nullImg})  center center / cover no-repeat`,
                                        cursor: "pointer",
                                        height: "6rem",
                                        width: "6rem",
                                    }}
                                >
                                    <input
                                        type="file"
                                        name="img"
                                        style={{
                                            opacity: 0,
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            left: '0',
                                        }}
                                        id="img"
                                        onChange={(e) => {
                                            if (e.target.files) {
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
                                                            setUploadImage([
                                                                ...uploadImage,
                                                                img
                                                            ])
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
                            </div>
                        </div>
                        <div>
                            <div className="text-[#32373E] text-[1.25rem] ml-[1rem] my-[1rem] ">
                                填写备注：
                            </div>
                            <div className="bg-[#F5F8FA] h-[5rem] rounded-[0.4rem]">
                                <TextArea
                                    style={{ width: "auto", height: "100%", background: "#F5F8FA", borderRadius: "0.4rem", marginLeft: "1rem", paddingTop: "1rem" }}
                                    placeholder='请输入20个字内备注内容'
                                    value={notes}
                                    onChange={(val: any) => {

                                        setNotes(val)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>


    )
}

export default NurseAdd
