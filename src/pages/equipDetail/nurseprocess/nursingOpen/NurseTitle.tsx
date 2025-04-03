import React from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
interface propsType {
    title: string
    titleRight?: string
}
function NurseTitle(props: propsType) {
    const { title, titleRight } = props
    const navigate = useNavigate()
    const dian = () => {
        if (title === '创建护理计划') {
            navigate(-1)
        } else if (title === '添加护理任务') {
            navigate(-1)
        } else if (title === '新建护理任务') {
            navigate(-1)
        }
    }
    return (
        <div className="w-full h-[2.5rem] flex bg-[#fff] mt-[4rem]" style={{}}>
            <p onClick={() => dian()} className="w-[6%] h-[1.2rem] ml-[1rem]"><LeftOutlined /></p>
            <p className=" text-[1.3rem] font-medium text-center " style={{ fontFamily: 'PingFang SC', width: titleRight ? '80%' : '90%' }}> {title}</p>
            <p style={{ color: "#0072EF", fontSize: "1.2rem", fontWeight: "500" }}>{titleRight}</p>
            {

            }
        </div >



    )
}

export default NurseTitle
