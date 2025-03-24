import React, { useState } from 'react'
import nullImg from '../../assets/image/null.png'
import { compressionFile } from '@/utils/imgCompressUtil'
import { Instancercv, netUrl } from '@/api/api'
import { useSelector } from 'react-redux'
import { tokenSelect } from '@/redux/token/tokenSlice'
import { message, Spin } from 'antd'
import './index.scss'
import axios from 'axios'
interface imgUploadParam {
    img?: any
    finish: Function
}

export default function ImgUpload(props: imgUploadParam) {

    const token = useSelector(tokenSelect)
    const { img, finish } = props
    console.log(img, 'img......')
    const [spinning, setSpinning] = React.useState<boolean>(false);
    const fileUpload = (e: any) => {
        axios({
            method: "post",
            url: netUrl + "/file/fileUpload",
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
            const imgUrl = res.data.data.src
            finish(imgUrl)
        });
    }

    const imgChange = async (e: any) => {

        console.log(e)
        setSpinning(true);
        if (e.target.files) {
            let res = await compressionFile(e.target.files[0])
            fileUpload(res)
        }else{
            message.error('获取文件失败')
        }
    }

    return (
        <>
            <Spin className="spin" spinning={spinning} fullscreen />
            <div className="imgContent"> <div className="img" style={{
                background: `url(${img ? img : nullImg
                    })  center center / cover no-repeat`,
            }}></div>
                <input type="file" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0 }} id="img" onChange={imgChange} />
            </div>
        </>
    )
}
