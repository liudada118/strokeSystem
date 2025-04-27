import React from 'react'
import logo from '@/assets/images/logo.png'
import img1 from '@/assets/images/画板 2.png'
import img2 from '@/assets/images/系统介绍.png'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { NavBar } from 'antd-mobile'

function ProductIntroduction() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isFalse } = location.state || true;


    const back = () => {
        navigate('/setting')
    }

    return (
        <div className='w-full h-full ' style={{ overflow: "hidden", background: "#fff" }}>
            <NavBar className='bg-[#fff] text-[1.4rem] mt-[1rem]' style={{ fontSize: "1.4rem", borderBottom: "solid 1px #ccc" }} right onBack={back}>{!isFalse ? <div style={{ fontSize: "1.4rem", fontWeight: "800" }}>产品简介</div> : <div style={{ fontSize: "1.4rem", fontWeight: "800" }}>产品铺设、配网、绑定</div>}</NavBar>
            <div style={{ overflowY: "auto", height: "100%" }}>
                <img src={isFalse ? img1 : img2} alt="" />
            </div>
        </div>
    )
}

export default ProductIntroduction
