import { message } from 'antd';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface props {
    children: any

}

export default function RequirAuthRoute(props: props) {
    //获取到locationStorage中的token
    let navigate = useNavigate();
    message.config({
        top: 100,
        duration: 1,
        maxCount: 1,
        rtl: true,
    });


    useEffect(() => {
        const phone = localStorage.getItem('phone')
        if (!phone) {
            navigate('/login')
        }
    }, [])
    //获取location
    // const { pathname} = useLocation()

    //如果存在 则渲染标签中的内容
    return props.children

}
