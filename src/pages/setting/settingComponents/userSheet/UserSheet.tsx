import { Input, message, Modal, Table } from 'antd'
import React, { useState } from 'react'
import add from "@/assets/image/addBlue.png"
import axios from 'axios'
import { Instancercv } from '@/api/api'

interface userSheetProps {
    manageSource: any
    setManageSource: Function
}

export default function UserSheet(props: userSheetProps) {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [deleteObj, setDelete] = useState<any>({})
    const [isModalNurseOpen, setIsModalNurseOpen] = useState(false)
    const [nurseUser, setnurseUser] = useState<any>({})
    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)
    const [isModalDeviceUserOpen, setIsModalDeviceUserOpen] = useState(false)
    const [personSource, setPersonSource] = useState([])
    const [manUseruser, setManUseruser] = useState('')
    const [projectManageSource, setProjectManageSource] = useState<Array<any>>([])
    const [manPassword, setmanPassword] = useState('')

    const syncManAndUser = (obj: any) => {
        Instancercv({
            method: "post",
            url: "/device/syncUserConfig",

            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
            data: {
                superManager: obj.man,
                nurseUser: obj.user,
            }
        }).then((res) => {

            if (res.data.msg == "success") {
                message.success('同步成功')
            }
        })
    }

    const handleNurseOk = () => {
        if (nurseUser.user.length > 5) {
            Instancercv({
                method: "post",
                url: "/organize/addOrganizeManager",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token": token
                },
                params: {
                    userName: nurseUser.user,
                    password: nurseUser.password,
                    nickName: nurseUser.name,
                    organizeId: localStorage.getItem('organizeId'),
                    roleId: 3
                },
            }).then((res) => {
                getItemManage(deleteObj.id)
                if (res.data.code == 500) {
                    message.error('该用户已绑定过其他的项目')
                }
            }).catch((e) => {
                message.error('服务器异常')
            })


            setIsModalNurseOpen(false)
        } else {
            message.error('用户的长度需要大于5')
        }

    }

    const getItemManage = (id: any) => {
        Instancercv({
            method: "get",
            url: "/organize/getManagerListByOrganizeId",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: id,
                roleIds: `${[3]}`
            }
        }).then((res) => {


            let data = [...res.data.data]
            data = data.map((a: any, index: any) => {
                a.id = index + 1
                return a
            })


            props.setManageSource(res.data.data)
        })
    }

    const getProjectManage = ({ id, user }: any) => {
        Instancercv({
            method: "get",
            url: "/organize/getManagerListByOrganizeId",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: id,
                roleIds: `${[2]}`
            }
        }).then((res) => {


            let data = [...res.data.data]
            data = data.map((a: any, index: any) => {
                a.id = index + 2

                a.user = a.username


                a.level = '管理员'


                return a
            })
            console.log(deleteObj)
            let data1 = [{
                id: 1,
                user: user,
                level: '超级管理员'
            }]

            const res1 = [...data1, ...data]
            setProjectManageSource(res1)

            // setManageSource(res.data.data)
        })
    }

    const handleNurseCancel = () => {
        setIsModalNurseOpen(false)
    }

    const getItemPerson = (id: any) => {
        Instancercv({
            method: "get",
            url: "/organize/getManagerListByOrganizeId",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: id,
                roleIds: `${[4]}`
            }
        }).then((res) => {


            let data = [...res.data.data]
            data = data.map((a: any, index: any) => {
                a.id = index + 1
                return a
            })


            setPersonSource(res.data.data)
        })
    }

    const deleteUserByOrganizeIdAndUsername = ({ user, id, type }: any) => {
        Instancercv({
            method: "get",
            url: "/organize/deleteUserByOrganizeIdAndUsername",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                username: user,
                organizeId: id
            }
        }).then((res) => {

            if (type == 'device') {
                getItemManage(id)
                getProjectManage({ id, user: manUseruser })
            } else if (type == 'person') {
                getItemPerson(id)
            }

        })
    }


    const handleDeviceUserCancel = () => {
        setIsModalDeviceUserOpen(false)
    }

    const handleDeviceUserOk = () => {
        deleteUserByOrganizeIdAndUsername({ user: deleteObj.username, id: localStorage.getItem('organizeId'), type: 'device' })
        setIsModalDeviceUserOpen(false)
    }

    const handleChangePasswordOk = () => {
        console.log(deleteObj)
        setIsModalChangePasswordOpen(false)

        Instancercv({
            method: "post",
            url: "/login/updatePwdWithAdmin",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                username: deleteObj.username ? deleteObj.username : deleteObj.user,
                newPwd: manPassword
            }
        }).then(res => {
            if (res.data.code == 0) {
                message.success('更新成功')
            }
        })

    }
    const handleChangePasswordCancel = () => {
        setIsModalChangePasswordOpen(false)
    }

    const manage = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '护工',
            dataIndex: 'nickname',
            key: 'nickname',
            render: (record: any) => {

                return (

                    <div className='projectName' style={{ color: '#0256FF' }} onClick={() => {

                    }}>{record} </div>

                )
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text: any, record: any, index: any) => {
                console.log(record)
                return (
                    <div style={{ display: 'flex', color: '#0256FF', justifyItems: 'center' }}>
                        <div className='edit' style={{ marginRight: '1rem' }} onClick={() => {

                            setIsModalChangePasswordOpen(true)
                        }}>重置密码 </div>
                        <div className='delete' style={{ marginRight: '1rem' }}
                            onClick={() => {

                                setDelete(record)
                                setIsModalDeviceUserOpen(true)
                            }}
                        >删除</div>
                        <div onClick={() => {
                            syncManAndUser({
                                man: phone,
                                user: record.username
                            })
                        }}>同步提醒</div>
                    </div>
                )
            }
        },

    ]
    return (
        <>

            <Modal title="请输入新的密码" open={isModalChangePasswordOpen} onOk={handleChangePasswordOk} onCancel={handleChangePasswordCancel}>
                <Input onChange={(e) => {
                    setmanPassword(e.target.value)
                }} />
            </Modal>
            <Modal title="删除" open={isModalDeviceUserOpen} onOk={handleDeviceUserOk} onCancel={handleDeviceUserCancel}>
                确定要删除护工“{deleteObj.username}”以及下面所属的设备吗?
            </Modal>
            <Modal title="添加新护工" open={isModalNurseOpen} onOk={handleNurseOk} onCancel={handleNurseCancel}>
                <div style={{ padding: '0.5rem 3rem' }}>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 用户名:</div>
                        <Input value={nurseUser.user} style={{ flex: 1 }} onChange={(e) => {
                            // setProjectAddress(e.target.value)
                            let obj = { ...nurseUser }
                            obj.user = e.target.value
                            setnurseUser(obj)
                        }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 密码:</div>
                        <Input value={nurseUser.password} style={{ flex: 1 }} onChange={(e) => {
                            // setProjectAddress(e.target.value)

                            let obj = { ...nurseUser }
                            obj.password = e.target.value
                            setnurseUser(obj)
                        }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 护工名:</div>
                        <Input value={nurseUser.name} style={{ flex: 1 }} onChange={(e) => {

                            let obj = { ...nurseUser }
                            obj.name = e.target.value
                            setnurseUser(obj)
                            // setProjectAddress(e.target.value)
                        }} /></div>
                </div>
            </Modal>
            <div className="projectContent">

                <div className="projectTitle">护工管理
                    <div style={{ color: '#0256ff', display: 'flex', alignItems: 'center' }} onClick={() => {
                        setIsModalNurseOpen(true)
                        setDelete({ id: localStorage.getItem('organizeId') })
                    }}> <img src={add} style={{ width: '1rem' }} alt="" /> 新建护工</div></div>
                <Table dataSource={props.manageSource} onRow={(record: any) => {
                    return {
                        onClick: (e: any) => {
                            setDelete(record)
                        }
                    }
                }} columns={manage} /></div></>
    )
}
