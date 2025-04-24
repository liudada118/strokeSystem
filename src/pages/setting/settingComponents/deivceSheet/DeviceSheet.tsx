import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import { instance, netUrl } from '../../../assets/util'
import { message, Modal, Select, Table } from 'antd'
import no from "../../../assets/icon/no.png";
import SeeUser from '../seeUser/SeeUser';
import { Instancercv } from '@/api/api';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
interface DeviceSheet {
    deviceSource: any
}
export default function DeviceSheet(props: DeviceSheet) {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const roleId: any = localStorage.getItem("roleId")
    const [userShow, setUserShow] = useState(false)
    const [familyShow, setFamilyShow] = useState(false)
    const [deleteDeviceObj, setDeleteDeviceObj] = useState<any>({})
    const [isModalDeviceDeleteOpen, setIsModalDeviceDeleteOpen] = useState(false)
    const [deleteObj, setDelete] = useState<any>({})
    const [deviceUser, setDeviceUser] = useState<Array<any>>([{}])
    const [deviceSource, setDeviceSource] = useState<Array<any>>([{}])
    const [deleteClick, setDeleteClick] = useState(false)
    const [isModalAssocOpen, setIsModalAssocOpen] = useState(false)
    const [bindUser, setBindUser] = useState<any>()
    const device = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'mac地址',
        dataIndex: 'mac',
        key: 'mac',
    },
    {
        title: '设备类型',
        dataIndex: 'type',
        key: 'type',
        render: (text: any, record: any, index: any) => {
            return <div>{text == 'small' ? '安护' : '智护'}</div>
        }
    },
    {
        title: '床号',
        dataIndex: 'roomNum',
        key: 'roomNum'
    },
    {
        title: '姓名',
        dataIndex: 'patientName',
        key: 'patientName'
    },
    {
        title: '关联用户',
        dataIndex: 'operate',
        key: 'operate',
        render: (text: any, record: any, index: any) => {

            return (
                <div style={{ display: 'flex', color: '#0256FF', cursor: 'pointer' }}>
                    <div className='see' style={{ marginRight: '1rem', position: 'relative', }} onClick={() => {
                        getDeviceSUser({ id: record.deviceId, roleId: 3, setUser: setDeviceOneUser })
                        setUserShow(true)
                    }}>查看
                        <SeeUser userShow={userShow} deleteEquip={(obj: any) => { deleteEquip({ ...obj, roleId: 3, setUser: setDeviceOneUser }) }} deleteObj={deleteObj} record={record} setUserShow={setUserShow} deviceOneUser={deviceOneUser} setDeviceOneUser={setDeviceOneUser} />
                    </div>
                    <div className='add'
                        onClick={() => {
                            setIsModalAssocOpen(true)
                            getAllDeviceSUser({ id: record.deviceId, roleId: 3 })
                        }}
                    >新增</div>
                </div>
            )
        }
    },
    {
        title: '关联家属',
        dataIndex: 'family',
        key: 'family',
        render: (text: any, record: any, index: any) => {

            return (
                <div style={{ display: 'flex', color: '#0256FF', cursor: 'pointer' }}>
                    <div className='see' style={{ marginRight: '1rem', position: 'relative', }} onClick={() => {
                        getDeviceSUser({ id: record.deviceId, roleId: 4, setUser: setFamilyOneUser })
                        setFamilyShow(true)
                    }}>查看
                        <SeeUser userShow={familyShow} deleteEquip={(obj: any) => { deleteEquip({ ...obj, roleId: 4, setUser: setFamilyOneUser }) }} deleteObj={deleteObj} record={record} setUserShow={setFamilyShow} deviceOneUser={familyOneUser} setDeviceOneUser={setFamilyOneUser} />
                    </div>
                    <div className='add'
                        onClick={() => {
                            setIsModalAssocOpen(true)
                            getAllDeviceSUser({ id: record.deviceId, roleId: 4 })
                        }}
                    >新增</div>
                </div>
            )
        }
    },

    ]
    const [deviceOneUser, setDeviceOneUser] = useState<Array<any>>([])
    const [familyOneUser, setFamilyOneUser] = useState<Array<any>>([])
    const onChange = (value: string) => {
        console.log(`selected ${value}`);
        setBindUser(value)
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    const getAllDeviceSUser = ({ id, roleId }: any) => {
        Instancercv({
            method: "get",
            url: "/organize/getManagerListByOrganizeId",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: localStorage.getItem('organizeId'),
                deviceId: id,
                roleIds: roleId
            }
        }).then((res) => {

            setDeviceUser(res.data.data)


        })
    }
    const getDeviceSUser = ({ id, roleId, setUser, deleteText }: any) => {
        Instancercv({
            method: "get",
            url: "/organize/getUserListByDeviceIdAndOrganizeId",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                organizeId: localStorage.getItem('organizeId'),
                deviceId: id,
                roleId: roleId
            }
        }).then((res) => {
            if (!deleteText && !res.data.data.length) {
                message.info('暂未绑定,请前去添加')
            } else {
                let data = [...res.data.data]

                const phoneArr = data.map((a: any) => a.username)

                if (phoneArr.includes(phone)) {
                    data.splice(phoneArr.indexOf(phone), 1)
                }

                // setDeviceOneUser(data)
                setUser(data)
            }

        })
    }
    const deleteEquip = ({ did, index, user, roleId, setUser }: any) => {
        Instancercv({
            method: "post",
            url: "/device/cancelBindManual",

            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
            data: {
                phone: user,
                deviceId: did,
            }
        }).then((e) => {

            message.success('解绑成功')

            const device = [...deviceUser]
            device.splice(index, 1)
            setDeviceUser(device)
            getDeviceSUser({ id: did, roleId, setUser, deleteText: '13' })
        })

    }
    const bindDevice = ({ did, index, user }: any) => {
        Instancercv({
            method: "post",
            url: "/device/addBindManual",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "token": token
            },
            params: {
                phone: user,
                deviceId: did,
            },
        }).then((res) => {
            if (res.data.code == 0) {
                message.success('绑定成功')
                setBindUser(undefined)
            } else if (res.data.code == 500) {
                message.success(res.data.msg)
            }
        })
    }
    const handleAssocOk = () => {
        bindDevice({ user: bindUser, did: deleteObj.deviceId })
        setIsModalAssocOpen(false)
        setBindUser(undefined)
    }
    const handleDeviceDeleteOk = () => {
        deleteEquip({ ...deleteDeviceObj, roleId: 3, setUser: setDeviceOneUser })
        setIsModalDeviceDeleteOpen(false)
    }
    const handleDeviceDeleteCancel = () => {
        setIsModalDeviceDeleteOpen(false)
    }
    const handleAssocCancel = () => {
        setIsModalAssocOpen(false)
        setBindUser(undefined)
    }


    return (
        <>
            <Modal title="删除" open={isModalDeviceDeleteOpen} onOk={handleDeviceDeleteOk} onCancel={handleDeviceDeleteCancel}>
                确定要删除关联用户“{deleteDeviceObj.user}”吗?
            </Modal>
            <Modal title="添加关联用户" open={isModalAssocOpen} onOk={handleAssocOk} onCancel={handleAssocCancel}>
                <Select
                    showSearch
                    placeholder="选择一个用户"
                    optionFilterProp="label"
                    value={bindUser}
                    style={{ width: '140px' }}
                    onChange={onChange}
                    onSearch={onSearch}
                    options={deviceUser.map((a) => { return { value: a.username, label: a.nickname } })}
                />
            </Modal>

            <div className="projectContent">
                {
                    roleId == 0 ? <div>1</div> : <>
                        <div className="projectTitle">设备管理</div>
                        <Table dataSource={props.deviceSource} onRow={(record: any) => {
                            return {
                                onClick: (e: any) => {
                                    setDelete(record)
                                }
                            }
                        }} columns={device} />
                    </>
                }

            </div>
        </>
    )
}
