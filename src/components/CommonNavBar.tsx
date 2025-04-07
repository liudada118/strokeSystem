import React from "react";
import { NavBar } from "antd-mobile";
import img from '../assets/images/arrow_blue.png'
interface NavProps {
    title: string;
    onBack: () => void;
    style?: any
}
const CommonNavBar: (props: NavProps) => React.JSX.Element = (props) => {
    const { title, onBack } = props
    return (

        <>
            {/* <img src={img} style={{ width: "20px", height: "20px" }} alt="" /> */}
            <NavBar className='fixed z-[99] w-full h-[3rem] bg-[#fff] text-base font-semibold top-0' onBack={() => onBack()} style={{...props.style}}>{title}</NavBar>
        </>
    )
}

export default CommonNavBar;