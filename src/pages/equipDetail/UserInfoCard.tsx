import React, { Fragment, memo, useEffect, useState } from "react";
import { List, Picker, Switch } from 'antd-mobile'
import { Typography } from 'antd'
import styles from './message.module.scss';
import avatar from "../../assets/images/avatar.png";
import arrow from "../../assets/images/arrow_blue.png";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonFormModal, { FormType } from "../../components/CommonFormModal";
import SettingBlock from "./SettingBlock";
import CommonNavBar from "../../components/CommonNavBar";
import { useDispatch, useSelector } from "react-redux";
import { changePersonalEquipUserInfo, equipSelect, selectEquipBySensorname } from "@/redux/equip/equipSlice";
import { equipInfoFormatUtil } from "@/utils/dataToFormat";
import nullImg from '@/assets/image/null.png'
import { phoneSelect } from "@/redux/token/tokenSlice";
import SettingMobile from "./SettingMobile";
import useWindowSize from '../../hooks/useWindowSize'
import { LeftOutlined } from '@ant-design/icons';
import { instance, Instancercv } from '@/api/api';
export const userModal = [
    {
        label: '上传头像',
        mobileLabel: '头像',
        key: 'headImg',
        value: '',
        type: FormType.UPLOAD,
        mobileType: FormType.UPLOAD,
    },
    {
        label: '输入姓名',
        mobileLabel: '姓名',
        key: 'patientName',
        value: '',
        type: FormType.INPUT,
        mobileType: FormType.INPUT,
        placeholder: '请输入姓名'
    }, {
        label: '输入年龄',
        mobileLabel: '年龄',
        key: 'age',
        value: '',
        type: FormType.INPUT,
        mobileType: FormType.DATE_SELECT,
        placeholder: '请输入年龄'
    }, {
        label: '输入床号',
        mobileLabel: '床号',
        key: 'roomNum',
        value: '',
        type: FormType.INPUT,
        mobileType: FormType.INPUT,
        placeholder: '请输入床号'
    }, {
        label: '选择性别',
        mobileLabel: '性别',
        key: 'sex',
        value: '',
        type: FormType.RADIO,
        mobileType: FormType.RADIO,
        children: [{
            id: '男',
            value: 1,
            label: '男'
        }, {
            id: '女',
            value: 0,
            label: '女'
        }]
    }]

const machineType = [{
    label: '床垫类型',
    value: '智护'
}, {
    label: 'MAC地址',
    value: '1A2C3E4D'
}, {
    label: '设备校准1111',
    value: ''
}]
const createTimeNumber: (val: number) => { label: string; value: string }[] = (number) => {
    return new Array(number).fill(0).map((item, index) => {
        if (index < 9) {
            return ({
                label: `0${index}`,
                value: `0${index}`
            })
        }
        return ({
            label: `${index}`,
            value: `${index}`
        })
    })
}
const timeHour = createTimeNumber(24)
const timeMinutes = createTimeNumber(60)
const timeRangeColumns = [timeHour, timeMinutes, timeHour, timeMinutes]
const timeIntervalColumns = [['半小时', '一小时', '一个半小时'].map(item => ({
    label: item,
    value: item
}))]

interface UserInfoCardProps {
    outer?: boolean;
    isMobile?: boolean;
    nurseformValue?: any;
    submitCloud?: any;
    setNurseFormValue?: any
}
const UserInfoCard: (props: UserInfoCardProps) => React.JSX.Element = (props) => {
    const navigate = useNavigate();
    const { outer = false, isMobile = false, nurseformValue, submitCloud, setNurseFormValue } = props;
    const { sexFormat } = equipInfoFormatUtil
    const param = useParams()
    // console.log(param)
    const location = useLocation()

    const sensorName = param.id || location.state.sensorName



    const phone = useSelector(phoneSelect)
    const equip = useSelector(equipSelect)
    const dispatch: any = useDispatch()


    const equipInfo = useSelector(state => selectEquipBySensorname(state, sensorName)) || {}

    const getuserInfo = () => {
        if (sensorName) {
            Instancercv({
                method: "get",
                url: "/device/selectSinglePatient",
                headers: {
                    "content-type": "multipart/form-data",
                    "token": localStorage.getItem('token')
                },
                params: {
                    sensorName,
                    phoneNum: localStorage.getItem('phone')
                }
            }).then((res: any) => {

                if (res && res.data.code == 0) {

                    console.log(res.data.data, '33333333333')
                    setUserInfo(res.data.data)
                }
            })
        }
    }

    useEffect(() => {
        if (sensorName) {
            getuserInfo()
        }
    }, [sensorName])

    const { roomNum, sex, age, patientName, headImg, nurseStart, nurseEnd, nursePeriod, injuryAlarm,
        fallbedStart, fallbedEnd, fallbedAlarm,
        leaveBedStart, leaveBedEnd, leaveBedPeriod, leaveBedAlarm,
        situpStart, situpEnd, situpAlarm,
        type, deviceId,
        leavebedParam, rank } = equipInfo
    const [userInfo, setUserInfo] = useState<any>({ roomNum, sex, age, patientName, headImg })
    const [img, setImg] = useState(headImg)

    const [userInfoChange, setUserInfoChange] = useState<boolean>(false)
    const indowSize = useWindowSize()
    const userModal = [
        {
            label: '头像',
            mobileLabel: '头像',
            key: 'headImg',
            value: userInfo.headImg,
            type: FormType.UPLOAD,
            mobileType: FormType.UPLOAD
        },
        {
            label: '性别',
            mobileLabel: '性别',
            key: 'sex',
            value: userInfo.sex,
            type: FormType.RADIO,
            mobileType: FormType.RADIO,
            children: [{
                id: '男',
                value: 1,
                label: '男'
            }, {
                id: '女',
                value: 0,
                label: '女'
            }]
        },
        {
            label: '姓名',
            mobileLabel: '姓名',
            key: 'patientName',
            value: userInfo.patientName,
            type: FormType.INPUT,
            mobileType: FormType.INPUT,
            placeholder: '请输入姓名',
        }, {
            label: '年龄',
            mobileLabel: '年龄',
            key: 'age',
            // TODO
            value: isMobile ? userInfo.age : userInfo.xxxxxx,
            type: isMobile ? FormType.INPUT : FormType.INPUT_NUMBER,
            mobileType: isMobile ? FormType.INPUT : FormType.INPUT_NUMBER,
            placeholder: '请输入年龄',
        }, {
            label: '床号',
            mobileLabel: '床号',
            key: 'roomNum',
            value: userInfo.roomNum,
            type: FormType.INPUT,
            mobileType: FormType.INPUT,
            placeholder: '请输入床号',
        },
        {
            label: '联系电话',
            mobileLabel: '电话',
            key: 'telephone',
            value: userInfo.telephone,
            type: FormType.INPUT,
            mobileType: FormType.INPUT,
            placeholder: '请输入电话'
        },
        {
            label: '联系地址',
            mobileLabel: '地址',
            key: 'address',
            value: userInfo.address,
            type: FormType.INPUT,
            mobileType: FormType.INPUT,
            placeholder: '请输居住地址',
        },
        {
            label: '既往病例',
            mobileLabel: '既往病例',
            key: 'medicalHistory',
            value: userInfo.medicalHistory,
            type: FormType.INPUT,
            mobileType: FormType.INPUT,
            placeholder: '请输入既往病例',
        }
    ]

    const personalInfo = [{
        label: '床号',
        id: 'roomNum',
        value: userInfo.roomNum
    }, {
        label: '性别',
        id: 'sex',
        value: sexFormat(userInfo.sex)
    }, {
        label: '年龄',
        id: 'age',
        value: userInfo.age
    }
    ]
    const changeUserInfo = (obj: any) => {
        // setUserInfo({ ...userInfo, ...obj })
        setImg(obj)
    }
    const [isModifying, setIsModifying] = useState<boolean>(isMobile)
    const [userInfoOpen, setUserInfoOpen] = useState<boolean>(false)
    const [userExtraInfo, setUserExtraInfo] = useState<any>({
        name: '老陈',
        number: '01F',
        sex: '男',
        age: '65'
    })
    const [pickerInfo, setPickerInfo] = useState<any>({
        visible: false,
        title: '',
        columns: [],
        key: '',
        value: ''
    })
    const [formValue, setFormValue] = useState<Record<string, string | boolean>>({
        timeRangeA: '12:10 - 10:10',
        timeIntervalA: '30min',
        timeRangeB: '12:10 - 10:10',
        timeIntervalB: '30min',
        timeRangeC: '12:10 - 10:10',
        timeRangeD: '12:10 - 10:10',
        switchB: true,
        switchC: false,
        switchD: false,
    })

    const handleUserInfoForm = (values: any) => {
        getuserInfo()
        setUserInfoChange(true)
        console.log(values, 'values')
        const newObj = { ...values }
        if (newObj.hasOwnProperty('headImg')) newObj.headImg = img
        Object.keys(newObj).forEach((item) => {
            if (newObj[item] == undefined) delete newObj[item]
        })
        let cloudObj = {
            ...userInfo, ...newObj
        }

        // setUserInfo(cloudObj)
        getuserInfo()
    }
    const handleClickListItem = (type: FormType, title: string, key: string) => {
        if (type === FormType.TIME_RANGE) {
            setPickerInfo({
                title,
                columns: timeRangeColumns,
                visible: true,
                key
            })
        } else {
            setPickerInfo({
                title,
                columns: timeIntervalColumns,
                visible: true,
                key
            })
        }
    }
    const renderListItem = (type: FormType, key: string, label: string, title: string = '') => {
        switch (type) {
            case FormType.SWITCH:
                return (
                    <List.Item key={key} extra={<Switch checked={formValue[key] as boolean} onChange={() => {
                        setFormValue({ ...formValue, [key]: !formValue[key] })
                    }} />}>
                        {label}
                    </List.Item>
                )
            case FormType.TIME_RANGE:
            case FormType.TIME_INTERVAL:
                return (
                    <List.Item key={key} extra={formValue[key]} onClick={() => {
                        handleClickListItem(type, title, key)
                    }}>
                        {label}
                    </List.Item>
                )
            default:
                return null
        }
    }
    const [update, setUpdate] = useState(false)
    const renderMobileSetting = () => {
        return (
            <div className={['w-[96%] mx-auto', styles.mobileSettingContent].join(' ')}>
                <List header='翻身设置'>
                    {renderListItem(FormType.TIME_RANGE, 'timeRangeA', '设置时间段', '设置时间段')}
                    {renderListItem(FormType.TIME_INTERVAL, 'timeIntervalA', '翻身间隔', '设置翻身间隔')}
                </List>
                <List header='提醒设置'>
                    {renderListItem(FormType.SWITCH, 'switchB', '离床提醒')}
                    {formValue.switchB && renderListItem(FormType.TIME_RANGE, 'timeRangeB', '监测时间段', '设置监测时间段')}
                    {formValue.switchB && renderListItem(FormType.TIME_INTERVAL, 'timeIntervalB', '提醒时间', '设置提醒时间')}
                </List>
                <List className='mt-[10px]'>
                    {renderListItem(FormType.SWITCH, 'switchC', '坐起提醒')}
                    {formValue.switchC && renderListItem(FormType.TIME_RANGE, 'timeRangeC', '监测时间段', '设置监测时间段')}
                </List>
                <List className='mt-[10px]'>
                    {renderListItem(FormType.SWITCH, 'switchD', '坠床提醒')}
                    {formValue.switchD && renderListItem(FormType.TIME_RANGE, 'timeRangeD', '监测时间段', '设置监测时间段')}
                </List>
                <List header='设备类型'>
                    {machineType.map((item, index) => (
                        <List.Item key={item.label}>
                            <span className='flex items-center text-base'>
                                <span>{item.label}</span>
                                {index === 1 ? (
                                    <Typography.Paragraph className='flex items-center h-full grow !my-0 justify-between ml-[1rem] text-base text-[#6C7784]' copyable={{
                                        icon: [<span>复制</span>]
                                    }}>{item.value}</Typography.Paragraph>
                                ) : (
                                    <span className='inline-block ml-[1rem]'>{item.value}</span>
                                )}
                            </span>
                        </List.Item>
                    ))}
                </List>

                <Picker
                    columns={pickerInfo.columns}
                    visible={pickerInfo.visible}
                    onClose={() => {
                        setPickerInfo({
                            visible: false,
                            title: '',
                            columns: [],
                            key: '',
                            value: ''
                        })
                    }}
                    title={pickerInfo.title}
                    value={pickerInfo.value}
                    onConfirm={v => {
                        const result = v.length > 1 ? `${v[0]}:${v[1]} - ${v[2]}:${v[3]}` : v[0]
                        setFormValue({
                            ...formValue,
                            [pickerInfo.key]: result
                        })
                    }}
                />
            </div>
        )
    }
    useEffect(() => {
        let data = {} as any
        userModal.forEach((item, index) => {
            data[item.key] = item.value
        })
    }, [userModal])
    const roleId: any = localStorage.getItem('roleId')
    const handleClickUserEdit = () => {
        if (isMobile) {
            navigate('/userInfo_editing', { state: { sensorName, type: 'personal', userModal } })
        } else {
            setUserInfoOpen(true)

        }
    }

    if (outer) {
        return (
            <div
                className='fixed top-[2.8rem] z-[9] w-full h-[6rem] bg-[#fff]'>
                <div className='flex items-end justify-between w-[90%] h-full py-[1.2rem] bg-[#fff] mx-auto border-b border-b-[#DCE3E9]'>
                    <img src={arrow} alt="" style={{ transform: "rotate(180deg)" }} className='w-[8px] h-[12px] mb-[10px] mr-[20px]'
                        onClick={() => navigate(`/`)} />
                    {/* <LeftOutlined className='w-[8px] h-[12px] mb-[10px] mr-[20px]'  style={{fontSize:"300px",display:'flex'}} onClick={() => navigate(`/`)} /> */}
                    <img src={userInfo.headImg || nullImg} alt="" className='w-[4rem] mr-[1.2rem] rounded-[6px]' />
                    <div className='flex flex-col justify-center grow'>
                        <span className='text-sm font-semibold h-[2.4rem]'>{userInfo.patientName}</span>
                        {/* 不要删除后期要上线，暂时注销了 */}
                        {/* <span className='flex w-full'>
                            {[{ label: 'braden', value: '低风险' }].map(item => (
                                <span key={item.label} className='text-sm text-[#6C7784]'>
                                    <span>{`${item.label}:`}</span>
                                    <span className='ml-[10px]'>{item.value}</span>
                                </span>
                            ))}
                        </span> */}
                    </div>
                    {/* <img src={arrow} alt="" className='w-[8px] h-[12px] mb-[10px]'/> */}
                    {
                        roleId == 1 && 2 ? <p style={{ fontSize: "20px" }} onClick={() => navigate(`/equipInfo/${sensorName}`)} >
                            设置
                        </p> : ""
                    }

                </div>
            </div>
        )
    }

    // 保存设置
    const setting = (value: boolean) => {
        setIsModifying(value)
        if (!value) {
            console.log('euqren')
        }
    }

    return (

        <Fragment>
            {isMobile && (
                <CommonNavBar title='个人信息及设置' onBack={() => navigate(`/report/0/${sensorName}`)} />
            )}
            <div className='md:pt-[4.5rem] h-full'>
                <div
                    className='bg-[#fff] rounded-[2px] pt-[1.2rem] pl-[1rem] pb-[1rem] md:w-[96%] md:mx-auto md:rounded-[10px]'>
                    <div className='flex items-center justify-between mb-[0.8rem]'>
                        <span className='text-base font-semibold'>个人信息</span>
                        {
                            roleId == 1 && 2 ?
                                <span className='text-[#0072EF] text-sm cursor-pointer mr-[10px]'
                                    onClick={() => {
                                        handleClickUserEdit()
                                        setUpdate(true)
                                    }}>

                                    修改
                                </span>
                                : ''
                        }

                    </div>
                    <div className='flex'>
                        <img src={userInfo.headImg ? userInfo.headImg : nullImg} alt="" className='w-[4rem] mr-[1.2rem] rounded-[6px]' />
                        <div className='flex flex-col justify-around md:justify-between'>
                            <span className='text-sm font-semibold'>{userInfo.patientName}</span>
                            <span className='flex flex-wrap w-full'>
                                {personalInfo.map(item => (
                                    <span key={item.id} className='text-sm w-[45%]'>
                                        <span className='text-[#929EAB]'>{`${item.label}:`}</span>
                                        <span className='ml-[10px]'>{item.id == 'sex' ? sexFormat(userInfo[item.id]) : userInfo[item.id]}</span>
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
                {/* 不要删除重新评估,后面开发 */}
                {/* <div
                    className='flex justify-between bg-[#fff] rounded-[2px] md:rounded-[10px] h-[2.8rem] items-center my-[10px] mx-0 md:mx-auto p-[15px] text-sm md:w-[96%]'>
                    <span className='text-sm font-semibold'>
                        <span>Braden压疮风险评估</span>
                        <span className='text-[#EC6E38] ml-[10px]'>中度风险</span>
                    </span>
                    <span className='text-[#0072EF] cursor-pointer' onClick={() => { navigate('/que', { state: { sensorName, rank } }) }}>重新评估</span>
                </div> */}
                {!isMobile && <SettingBlock userInfoChange={userInfoChange} setUserChange={setUserInfoChange} userInfo={userInfo} onModify={setting} nurseformValue={nurseformValue} setNurseFormValue={setNurseFormValue} submitCloud={submitCloud} />}
                {/* {isMobile && renderMobileSetting()} */}
                {isMobile && <SettingMobile />}
                <CommonFormModal
                    sensorName={sensorName}
                    open={userInfoOpen}
                    close={() => setUserInfoOpen(false)}
                    formList={userModal}
                    onFinish={handleUserInfoForm}
                    title='个人信息设置'
                    imgChange={changeUserInfo}
                    updateName={update}
                />
            </div>
        </Fragment>
    )
}

export default memo(UserInfoCard)