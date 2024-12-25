import { Input, message, Modal, Table } from 'antd'
import React, { useState } from 'react'
import add from "@/assets/image/addBlue.png"
import axios from 'axios'

import { Instancercv } from '@/api/api'

interface familySheetProps {
    personSource: any
    setPersonSource: Function
}

export default function FamilySheet(props: familySheetProps) {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [isModalPersonOpen, setIsModalPersonOpen] = useState(false)
    const [deleteObj, setDelete] = useState<any>({})
    const [nurseUser, setnurseUser] = useState<any>({})
    const [isModalDeletePersonOpen, setIsModalDeletePersonOpen] = useState(false)

    const person = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '家属名',
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
            title: '家属',
            dataIndex: 'username',
            key: 'username',
            render: (record: any) => {

                return (

                    <div className='projectName' style={{ color: '#0256FF' }} onClick={() => {

                    }}>{record} </div>

                )
            }
        }, {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text: any, record: any, index: any) => {
                console.log(record)
                return (
                    <div style={{ display: 'flex', color: '#0256FF', justifyItems: 'center' }}>
                        <div className='delete' style={{ marginRight: '1rem' }}
                            onClick={() => {

                                setDelete(record)
                                setIsModalDeletePersonOpen(true)
                            }}
                        >删除</div>
                    </div>
                )
            }
        },


    ]

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


            props.setPersonSource(res.data.data)
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
            getItemPerson(id)
        })
    }

    const handleDeletePersonOk = () => {
        deleteUserByOrganizeIdAndUsername({ user: deleteObj.username, id: localStorage.getItem('organizeId'), type: 'person' })
        setIsModalDeletePersonOpen(false)
    }

    const handleDeletePersonCancel = () => {
        setIsModalDeletePersonOpen(false)
    }

    const handlePersonOk = () => {
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
                    nickName: nurseUser.name,
                    password: 123,
                    organizeId: localStorage.getItem('organizeId'),
                    roleId: 4
                },
            }).then((res) => {
                getItemPerson(deleteObj.id)
                if (res.data.code == 500) {
                    message.error('该家属已绑定过其他的项目')
                }
            }).catch((e) => {
                message.error('服务器异常')
            })
            setIsModalPersonOpen(false)
            setnurseUser({})
        } else {
            message.error('用户名长度需要大于5')
        }
    }
    const handlePersonCancel = () => {
        setIsModalPersonOpen(false)
    }
    return (
        <>
            <Modal title="添加新家属" open={isModalPersonOpen} onOk={handlePersonOk} onCancel={handlePersonCancel}>
                <div style={{ padding: '0.5rem 3rem' }}>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 手机号:</div>
                        <Input value={nurseUser.user} style={{ flex: 1 }} onChange={(e) => {
                            // setProjectAddress(e.target.value)
                            let obj = { ...nurseUser }
                            obj.user = e.target.value
                            setnurseUser(obj)
                        }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 姓名:</div>
                        <Input value={nurseUser.name} style={{ flex: 1 }} onChange={(e) => {
                            // setProjectAddress(e.target.value)
                            let obj = { ...nurseUser }
                            obj.name = e.target.value
                            setnurseUser(obj)
                        }} /></div>

                </div>
            </Modal>
            <Modal title="删除" open={isModalDeletePersonOpen} onOk={handleDeletePersonOk} onCancel={handleDeletePersonCancel}>
                确定要删除家属“{deleteObj.username}”不再推送吗?
            </Modal>
            <div className="projectContent"><div className="projectTitle">家属管理
                <div style={{ color: '#0256ff', display: 'flex', alignItems: 'center' }} onClick={() => {
                    setIsModalPersonOpen(true)
                    setDelete({ id: localStorage.getItem('organizeId') })
                }}> <img src={add} style={{ width: '1rem' }} alt="" /> 新建家属</div></div>
                <Table dataSource={props.personSource} onRow={(record: any) => {
                    return {
                        onClick: (e: any) => {
                            setDelete(record)
                        }
                    }
                }} columns={person} /></div>
        </>

    )
}
