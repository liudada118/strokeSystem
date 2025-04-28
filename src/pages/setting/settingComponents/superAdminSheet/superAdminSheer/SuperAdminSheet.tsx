import { Instancercv } from '@/api/api'
import { Input, Modal, Table } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
// import { instance, netUrl } from '../../../../assets/util'

interface superAdminUserNameProps {
    strokeSource: any
}

export default function SuperAdminSheet(props: superAdminUserNameProps) {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [navIndex, setNavIndex] = useState(0)
    const [strokeSource, setStrokeSource] = useState([])
    const [projectManItem, setProjectManItem] = useState('')
    const [deleteManObj, setManDelete] = useState<any>({})
    const [manId, setManId] = useState(0)
    const [manUseruser, setManUseruser] = useState('')
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [projectAddress, setProjectAddress] = useState('')
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
    const [manageSource, setManageSource] = useState([])
    const [deviceSource, setDeviceSource] = useState<Array<any>>([{}])
    const [projectManageSource, setProjectManageSource] = useState<Array<any>>([])
    const [deleteObj, setDelete] = useState<any>({})
    const [nav, setNav] = useState(
        [
            {
                title: <div onClick={() => {
                    setNavIndex(0)
                    setNav([nav[0]])
                }}>项目管理</div>,
            },

        ])

    const project: any = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '项目名称',
            dataIndex: 'organizeName',
            key: 'organizeName',
            render: (record: any) => {

                return (

                    <div className='projectName' style={{ color: '#0256FF' }} onClick={() => {

                    }}>{record} </div>

                )
            }
        },
        {
            title: '项目管理员',
            dataIndex: 'projecMan',
            key: 'projecMan',
            render: (record: any) => {

                return (

                    <div className='projectMan' style={{ color: '#0256FF' }} onClick={() => {

                    }}>查看</div>

                )
            }
        },
        {
            title: '项目地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            render: (record: any) => {

                return (
                    <div style={{ display: 'flex', color: '#0256FF', justifyItems: 'center' }}>
                        <div className='edit' style={{ marginRight: '1rem' }} onClick={() => {
                            console.log(record)
                        }}>编辑 </div>
                        <div className='delete'>删除11111</div>
                    </div>
                )
            }
        },

    ]



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


            setManageSource(res.data.data)
        })
    }

    const getItemDevice = (id: any) => {
        Instancercv({
            method: "get",
            url: "/organize/getDeviceListByOrganizeId",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: id,
            }
        }).then((res) => {
      
            let data = res.data.data
            data.map((a: any, index: any) => {
                a.id = index + 1
                return a
            })
            setDeviceSource(res.data.data)
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

    const handleChangeOk = () => {
        Instancercv({
            method: "post",
            url: "/organize/updateOrganization",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: manId,
                organizeName: projectName,
                address: projectAddress
            }
        }).then(() => {
            getProjectList()
            setIsChangeModalOpen(false)
        })
    }

    const handleChangeCancel = () => {
        setIsChangeModalOpen(false)
    }

    const handleDeleteOk = () => {
        Instancercv({
            method: "post",
            url: "/organize/deleteOrganization",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
            params: {
                organizeId: manId,
            },
        }).then(() => {
            setIsModalDeleteOpen(false)
            getProjectList()
        })
    }

    const handleDeleteCancel = () => {
        setIsModalDeleteOpen(false)
    }



    return (
        <>
            <Modal title="修改项目" open={isChangeModalOpen} onOk={handleChangeOk} onCancel={handleChangeCancel}>
                <div style={{ padding: '0.5rem 3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 项目名称:</div> <Input value={projectName} style={{ flex: 1 }} onChange={(e) => {
                        setProjectName(e.target.value)
                    }} /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 项目地址:</div> <Input value={projectAddress} style={{ flex: 1 }} onChange={(e) => {
                        setProjectAddress(e.target.value)
                    }} /></div>
                </div>
            </Modal>

            <Modal title="删除项目" open={isModalDeleteOpen} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
                是否要删除<span style={{ fontWeight: 'bold' }}>{deleteManObj.organizeName}</span> 项目
            </Modal>

            <Table dataSource={props.strokeSource} onRow={(record: any) => {
                return {
                    onClick: (e: any) => {

                        setManDelete(record)
                        setManId(record.id)
                        setManUseruser(record.userName)
                        console.log(record)
                        if (e.target.className === 'edit') {
                            // console.log('edit')
                            console.log(record, 'edit')
                            setIsChangeModalOpen(true)
                            console.log(record)

                            setProjectName(record.organizeName)
                            setProjectAddress(record.address)
                        }
                        if (e.target.className === 'delete') {

                            // setIsModalAdminDeleteDeviceOpen(true)
                            setIsModalDeleteOpen(true)
                        }

                        if (e.target.className === 'projectName') {
                            // console.log('edit')
                            // setCurrent('projectItem')
                            // setProjectItem(record.organizeName)
                            setNavIndex(1)
                            setProjectManItem('projectName')
                            getItemManage(record.id)
                            getItemDevice(record.id)

                            const res = [...nav]
                            res[1] = ({
                                title: <div onClick={() => {
                                    setNavIndex(1)
                                }}>{record.organizeName}</div>,
                            })
                            setNav([res[0], res[1]])
                            console.log(record, 'projectName')

                        }
                        if (e.target.className === 'projectMan') {

                            setProjectManItem('projectMan')
                            console.log('projectMan')
                            setNavIndex(1)
                            getProjectManage({ id: record.id, user: record.userName })
                            const res = [...nav]
                            res[1] = ({
                                title: <div onClick={() => {
                                    setNavIndex(1)
                                }}>项目管理员</div>,
                            })
                            setNav([res[0], res[1]])
                            console.log(deleteObj, 'deleteObj')

                        }
                    }
                }
            }} columns={project} />
        </>
    )
}
