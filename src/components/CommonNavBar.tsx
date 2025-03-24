import React from "react";
import {NavBar} from "antd-mobile";

interface NavProps {
    title: string;
    onBack: () => void;
}
const CommonNavBar: (props: NavProps) => React.JSX.Element = (props) => {
    const { title, onBack } = props
    return (

        <NavBar className='fixed z-[99] w-full h-[3rem] bg-[#fff] text-base font-semibold top-0' onBack={() => onBack()}>{title}</NavBar>
    )
}

export default CommonNavBar;