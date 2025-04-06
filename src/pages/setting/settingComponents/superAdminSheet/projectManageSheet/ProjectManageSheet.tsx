import { Instancercv } from '@/api/api'
import { Table } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
// import { netUrl } from '../../../../assets/util'

export default function ProjectManageSheet() {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [projectManageSource, setProjectManageSource] = useState<Array<any>>([])
    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)
    const [isModalDeviceUserOpen, setIsModalDeviceUserOpen] = useState(false)
    const [manUseruser, setManUseruser] = useState('')
    const [deleteObj, setDelete] = useState<any>({})
    const projectManage = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '管理员账号',
            dataIndex: 'user',
            key: 'user',
        },

        {
            title: '管理员分级',
            dataIndex: 'level',
            key: 'level',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text: any, record: any, index: any) => {

                return (
                    <div style={{ display: 'flex', color: '#0256FF', justifyContent: 'center' }}>
                        <div className='edit' style={{ marginRight: '1rem' }} onClick={() => {

                            setIsModalChangePasswordOpen(true)
                            setDelete(record)
                        }}>重置密码 </div>
                        <div className='delete' style={{ marginRight: '1rem' }}
                            onClick={() => {

                                setDelete(record)
                                setIsModalDeviceUserOpen(true)
                            }}
                        >删除</div>
                        <div onClick={() => {
                            console.log(deleteObj)
                            Instancercv({
                                method: "post",
                                url: "/device/batchBindDevice",
                                headers: {
                                    "content-type": "multipart/form-data",
                                    "token": token
                                },
                                params: {
                                    superAdminUserName: manUseruser,
                                    username: record.user,
                                }
                            }).then((res) => {

                            })
                        }}>一键关联</div>
                    </div>
                )
            }
        },
    ]
    return (
        <Table dataSource={projectManageSource} onRow={(record: any) => {
            return {
                onClick: (e: any) => {
                    setDelete(record)
                }
            }
        }} columns={projectManage} />
    )
}
