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
    message.config({
        top: 100,
        duration: 1.5,
        maxCount: 3,
        rtl: true,
    });
    const person: any = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: '20%',
        },
        {
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '20%',
            render: (record: any) => {

                return (

                    <div className='projectName' style={{ color: '#0256FF' }} onClick={() => {

                    }}>{record} </div>

                )
            }
        },
        {
            title: '手机号',
            dataIndex: 'username',
            key: 'username',
            width: '30%',
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
            align: 'center',
            width: '30%',
            render: (text: any, record: any, index: any) => {
                console.log(record)
                return (
                    <div style={{ display: 'flex', justifyContent: "center", color: '#0256FF', justifyItems: 'center', cursor: "pointer" }}>
                        <div className='delete'
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
            if (res.data.msg === 'delete success') {
                return message.info('删除成功')
            }
        })
    }


    const handleDeletePersonOk = () => {
        deleteUserByOrganizeIdAndUsername({ user: deleteObj.username, id: localStorage.getItem('organizeId'), type: 'person' })
        setIsModalDeletePersonOpen(false)
    }
    const handleDeletePersonCancel = () => {
        setIsModalDeletePersonOpen(false)
    }
    const phoneRegex = /^1[3-9]\d{9}$/
    const handlePersonOk = () => {
        if (!phoneRegex.test(nurseUser.user)) {
            return message.info('请输入正确的手机号，手机号错误')
        }
        if (!nurseUser.user || !nurseUser.name) {
            return message.info('用户名和手机号不能为空')
        }
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
            if (res.data.msg === 'add Manager Success') {
                return message.info('添加成功')
            } else if (res.data.code == 500) {
                return message.info('该账号已存在')
            }
        }).catch((e) => {
            message.error('服务器异常')
        })
        setIsModalPersonOpen(false)
        setnurseUser({})

    }
    const handlePersonCancel = () => {
        setIsModalPersonOpen(false)
    }
    console.log(props.personSource, deleteObj, '...............propsersonSource');
    return (
        <>
            <Modal title="添加新家属" open={isModalPersonOpen} onOk={handlePersonOk} onCancel={handlePersonCancel}>
                <div style={{ padding: '0.5rem 3rem' }}>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 手机号:</div>
                        <Input value={nurseUser.user} style={{ flex: 1 }} onChange={(e) => {
                            let obj = { ...nurseUser }
                            obj.user = e.target.value
                            setnurseUser(obj)
                            // setProjectAddress(e.target.value)
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
                <div style={{ color: '#0256ff', display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={() => {
                    setIsModalPersonOpen(true)
                    setDelete({ id: localStorage.getItem('organizeId') })
                }}> <img src={add} style={{ width: '1rem' }} alt="" /> 新建家属</div></div>
                <Table dataSource={props.personSource} onRow={(record: any) => {
                    console.log(record, '...111.........propsersonSource');
                    return {
                        onClick: (e: any) => {


                            setDelete(record)
                        }
                    }
                }} columns={person} /></div>
        </>

    )
}
