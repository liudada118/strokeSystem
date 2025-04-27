import axios from 'axios';
import React, { useState } from 'react'
import { Spin, message } from 'antd';
import './index.scss'
import { Instancercv } from '@/api/api';
import { compressionFile } from '@/utils/imgCompressUtil';

interface propsImg {
    img: any
    userId?: any
    username?: any
    changeHeadImg?: any
}

// userId={userOrganizeId} username={userOrganizeName} img={headImg}

export default function UploadImg(props: propsImg) {
    message.config({
        top: 100,
        duration: 1.5,
        maxCount: 3,
        rtl: true,
    });
    const [spinning, setSpinning] = React.useState<boolean>(false);
    const [img, setImg] = useState(props.img)
    const tokenA = localStorage.getItem('token')
    const updateImg = (img: any) => {
        Instancercv({
            method: "post",
            url: "/organize/updateOrganization",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": tokenA
            },
            params: {
                organizeId: props.userId,
                organizeName: props.username,
                image: img
            },
        }).then((res) => {
            console.log(res.data.msg)
            if (res.data.msg == "success") {
                message.success('上传成功')
            }
            props.changeHeadImg(img)
        })
    }

    return (
        <>
            <Spin className="spin" spinning={spinning} fullscreen />
            {img ? <img src={img} style={{ width: '5rem', height: '5rem' }} alt="" /> : ''}
            <div className='loginOut' style={{ position: 'relative' }} onClick={() => { }}>
                <div className="loginOutButton">上传</div>
                <input type="file" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }} id="img" onChange={(e) => {

                    setSpinning(true);
                    if (e.target.files) {
                        // res.then((e) => {})

                        let res = compressionFile(e.target.files[0])
                        res.then((e) => {
                            console.log(e, 'compressionFile')
                            const token = localStorage.getItem('token')
                            Instancercv({
                                method: "post",
                                url: "/file/fileUpload",
                                headers: {
                                    "content-type": "multipart/form-data",
                                    "token": token
                                },
                                data: {
                                    file: e,
                                }
                            }).then((res) => {

                                setSpinning(false);
                                message.success('上传成功')
                                // const value = { ...userinfo }
                                // setUserInfo({
                                //     ...value,
                                //     img: res.data.data.src
                                // })
                                setImg(res.data.data.src)
                                updateImg(res.data.data.src)
                            });
                        })

                    }
                }} />
            </div>
        </>
    )
}
