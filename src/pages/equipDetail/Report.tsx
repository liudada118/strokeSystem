import React, {Fragment} from "react";
import {useNavigate} from "react-router-dom";
import CommonNavBar from '../../components/CommonNavBar'
import avatar from "../../assets/images/avatar.png";

const personalInfo = [{
    label: '年龄',
    value: 14
},{
    label: '性别',
    value: '男'
},{
    label: '年龄',
    value: 14
},{
    label: '年龄',
    value: 14
},{
    label: '年龄',
    value: 14
}]
const Report: React.FC = () => {

    const navigate = useNavigate();
    return (
        <Fragment>
            <CommonNavBar title='翻身报告' onBack={() => navigate('/')}/>
            <div className='md:pt-[4rem]'>
                <div className='flex w-[96%] bg-[#fff] mx-auto px-[10px] py-[20px] rounded-[6px]'>
                    <img src={avatar} alt="" className='w-[94px] h-[129px] mr-[1.2rem] rounded-[6px]'/>
                    <div className='grow'>
                        <div className='flex justify-between items-center mb-[10px]'>
                            <span className='text-[17px] font-medium'>陈大省</span>
                            <span className='mr-[10px] text-[#888888] text-[12px]'>护理员编号</span>
                        </div>
                        <div>
                            {personalInfo.map(item => (
                                <div key={item.label} className='text-sm w-[45%]'>
                                    <span className='text-[#929EAB]'>{`${item.label}:`}</span>
                                    <span className='ml-[10px]'>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}

export default Report