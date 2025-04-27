import { Breadcrumb, Input, message, Modal, Table } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
// import { compressionFile, instance, netUrl } from '../../../assets/util'
import ProjectManageSheet from './projectManageSheet/ProjectManageSheet'
import ProjectDeviceSheet from './projectDeviceSheet/ProjectDeviceSheet'
import { Instancercv } from '@/api/api'
import { compressionFile } from '@/utils/imgCompressUtil'


export default function SuperAdminSheet() {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [isModalManOpen, setIsModalManOpen] = useState(false)
    const [strokeSource, setStrokeSource] = useState([])
    const [projectName, setProjectName] = useState('')
    const [projectAddress, setProjectAddress] = useState('')
    const [projectUser, setProjectUser] = useState<any>({})
    const [navIndex, setNavIndex] = useState(0)
    const [spinning, setSpinning] = useState<boolean>(false);
    const [img, setImg] = useState('https://images.bodyta.com/327d1a0e38e64f1588731239bf534c77.png')
    const [deviceSource, setDeviceSource] = useState<Array<any>>([{}])
    const [projectManItem, setProjectManItem] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    message.config({
        top: 100,
        duration: 1.5,
        maxCount: 3,
        rtl: true,
    });
    const getProjectList = () => {
        Instancercv({
            method: "get",
            url: "/organize/getOrganizationList",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                token: token,
            }
        }).then((res) => {

            setStrokeSource(res.data.data)
        })
    }
    const [nav, setNav] = useState(
        [
            {
                title: <div onClick={() => {
                    setNavIndex(0)
                    setNav([nav[0]])
                }}>项目管理</div>,
            },

        ])

    const handleOk = () => {
        Instancercv({
            method: "post",
            url: "/organize/addOrganization",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
            params: {
                organizeName: projectName,
                address: projectAddress,
                image: img,
            },
        }).then((res) => {
            console.log(res.data.organizationId)
            Instancercv({
                method: "post",
                url: "/organize/addOrganizeManager",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token": token
                },
                params: {
                    userName: projectUser.user,
                    password: projectUser.password,
                    nickName: projectUser.name,
                    organizeId: res.data.organizationId,
                    roleId: 1
                },
            }).then((res) => {
                console.log(res.data)
                if (res.data.msg == "success") {
                    getProjectList()
                }
                if (res.data.code == 500) {
                    message.error('该用户已绑定过其他的项目')
                }
            }).catch((e) => {
                message.error('服务器异常')
            })

        })
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    return (
        <>
            <Modal title="添加新项目" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div style={{ padding: '0.5rem 3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 上传logo:</div>
                        <div style={{ flex: 1 }}>
                            <img src={img} style={{ width: '5rem', height: '5rem', borderRadius: '5px' }} alt="" />
                            <input type="file" name="img" style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 }} id="img" onChange={(e) => {

                                setSpinning(true);
                                if (e.target.files) {
                                    // res.then((e) => {})

                                    let res = compressionFile(e.target.files[0])
                                    res.then((e) => {
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
                                        });
                                    })

                                }
                            }} />
                        </div>
                        {/* <Input value={projectName} style={{ flex: 1 }} onChange={(e) => {
            setProjectName(e.target.value)
          }} /> */}


                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 项目名称:</div> <Input value={projectName} style={{ flex: 1 }} onChange={(e) => {
                        setProjectName(e.target.value)
                    }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 项目地址:</div> <Input value={projectAddress} style={{ flex: 1 }} onChange={(e) => {
                        setProjectAddress(e.target.value)
                    }} /></div>
                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 用户名:</div> <Input value={projectUser.user} style={{ flex: 1 }} onChange={(e) => {
                        // setProjectAddress(e.target.value)
                        let obj = { ...projectUser }
                        obj.user = e.target.value
                        setProjectUser(obj)
                    }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 密码:</div> <Input value={projectUser.password} style={{ flex: 1 }} onChange={(e) => {
                        // setProjectAddress(e.target.value)

                        let obj = { ...projectUser }
                        obj.password = e.target.value
                        setProjectUser(obj)
                    }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 管理员名:</div> <Input value={projectUser.name} style={{ flex: 1 }} onChange={(e) => {

                        let obj = { ...projectUser }
                        obj.name = e.target.value
                        setProjectUser(obj)
                        // setProjectAddress(e.target.value)
                    }} /></div>
                </div>
            </Modal>
            <div className="projectContent">
                <div className="projectTitle">
                    <div><Breadcrumb items={nav} /></div>   {navIndex == 0 ? <div onClick={() => {
                        setIsModalOpen(true)
                    }}>新建项目</div> :
                        projectManItem == 'projectMan' ? <div onClick={() => {
                            setIsModalManOpen(true)
                        }}>新建管理员</div> :
                            ''}
                </div>


                {navIndex == 0 ?
                    <SuperAdminSheet /> : projectManItem == 'projectMan' ?
                        <ProjectManageSheet /> :
                        <ProjectDeviceSheet deviceSource={deviceSource} />
                }

            </div>
        </>
    )
}
