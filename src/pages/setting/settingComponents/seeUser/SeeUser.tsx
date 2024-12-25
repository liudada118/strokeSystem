import React, { useState } from 'react'
import no from "@/assets/icon/no.png";
import { message, Modal } from 'antd';
import axios from 'axios';
interface deleteObj {
    deviceId: string
    [propName: string]: any;
}
interface seeUserProps {
    userShow: boolean
    deviceOneUser: Array<any>
    deleteObj: deleteObj
    record: deleteObj
    // deleteClick: boolean
    // setDeleteDeviceObj: Function
    // setIsModalDeviceDeleteOpen: Function
    setUserShow: Function
    // setDeleteClick: Function
    setDeviceOneUser: Function
    deleteEquip: Function
}

export default function SeeUser(props: seeUserProps) {
    const phone = localStorage.getItem('phone') || ''
    const token = localStorage.getItem('token') || ''
    const [deviceUser, setDeviceUser] = useState<Array<any>>([{}])
    const [isModalDeviceDeleteOpen, setIsModalDeviceDeleteOpen] = useState(false)
    const [deviceOneUser, setDeviceOneUser] = useState<Array<any>>([])
    const [deleteDeviceObj, setDeleteDeviceObj] = useState<any>({})
    const [deleteClick, setDeleteClick] = useState(false)

    const handleDeviceDeleteOk = () => {
        props.deleteEquip(deleteDeviceObj)
        setIsModalDeviceDeleteOpen(false)
    }
    const handleDeviceDeleteCancel = () => {
        setIsModalDeviceDeleteOpen(false)
    }
    return (
        <>
            <Modal title="删除" open={isModalDeviceDeleteOpen} onOk={handleDeviceDeleteOk} onCancel={handleDeviceDeleteCancel}>
                确定要删除关联用户“{deleteDeviceObj.nick}”吗?
            </Modal>

            {props.userShow && props.deleteObj.deviceId == props.record.deviceId && Object.keys(props.deviceOneUser).length ?
                <>
                    <div className='seeItem' >
                        {props.deleteObj.deviceId == props.record.deviceId && props.deviceOneUser.map((a: any, index: any) => {
                            return (
                                <div className='sureDelete' >
                                    {index + 1}.{a.nickname} {deleteClick ? <div onClick={() => {
                                        setDeleteDeviceObj({ did: props.record.deviceId, index: index, user: a.username ,nick : a.nickname })
                                        setIsModalDeviceDeleteOpen(true)
                                    }} className='sureDeleteButton' >
                                        <img style={{ width: '0.6rem' }} src={no} alt="" />
                                    </div> : ''} </div>
                            )
                        })}
                        <div className='openDelete' style={{ fontSize: '1rem', width: '5rem', textAlign: 'center' }} onClick={() => { setDeleteClick(!deleteClick) }}>删除用户</div>
                    </div>
                    {props.userShow ? <div className="modal" style={{ position: 'fixed', zIndex: '999', width: '100%', height: '100%', top: 0, left: 0 }}
                        onClickCapture={() => {
                            props.setUserShow(false)
                            props.setDeviceOneUser([])
                        }}>

                    </div> : ''}
                </> : ''}
        </>
    )
}
