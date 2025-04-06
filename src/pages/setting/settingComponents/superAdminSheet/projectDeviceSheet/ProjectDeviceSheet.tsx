import { message, Table } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
// import { netUrl } from '../../../../assets/util'
import SeeUser from '../../seeUser/SeeUser'
import { Instancercv } from '@/api/api'

interface projectDeviceSheetProps {
    // deleteObj: any
    deviceSource: any
}

export default function ProjectDeviceSheet(props: projectDeviceSheetProps) {
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
        title: '关联用户',
        dataIndex: 'operate',
        key: 'operate',
        render: (text: any, record: any, index: any) => {

            return (
                <div style={{ display: 'flex', color: '#0256FF' }}>
                    <div className='see' style={{ marginRight: '1rem', position: 'relative', }} onClick={() => {

                        setUserShow(true)
                    }}>查看

                        <SeeUser userShow={userShow} deleteEquip={(obj: any) => { deleteEquip({ ...obj, roleId: 3, setUser: setDeviceOneUser }) }} deleteObj={deleteObj} record={record} setUserShow={setUserShow} deviceOneUser={deviceOneUser} setDeviceOneUser={setDeviceOneUser} />
                    </div>
                    <div className='add'>新增</div>
                </div>
            )
        }
    },


    ]


    const [userShow, setUserShow] = useState(false)
    const [isModalDeviceDeleteOpen, setIsModalDeviceDeleteOpen] = useState(false)
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [deviceOneUser, setDeviceOneUser] = useState<Array<any>>([])
    const [isModalAssocOpen, setIsModalAssocOpen] = useState(false)
    const [deviceUser, setDeviceUser] = useState<Array<any>>([{}])
    const [deleteObj, setDelete] = useState<any>({})
    const getAllDeviceSUser = (id: any) => {
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
                roleIds: `${[3, 4]}`
            }
        }).then((res) => {

            setDeviceUser(res.data.data)
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
    const getDeviceSUser = (id: any) => {
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
                roleId: `${[3, 4]}`
            }
        }).then((res) => {

            let data = [...res.data.data]
            if (data.includes(phone)) {
                data.splice(data.indexOf(phone), 1)
            }
            setDeviceOneUser(data)
        })
    }
    return (
        <div>

            <div>超级管理员  {deleteObj.userName}</div>
            <Table dataSource={props.deviceSource} onRow={(record: any) => {
                return {
                    onClick: (e: any) => {
                        setDelete(record)
                        if (e.target.className === 'see') {

                            console.log(record, 'see')
                            getDeviceSUser(record.deviceId)
                        }

                        if (e.target.className === 'add') {

                            console.log(record, 'add')

                            setIsModalAssocOpen(true)
                            getAllDeviceSUser(record.deviceId)
                        }
                    }
                }
            }} columns={device} />
        </div>
    )
}
