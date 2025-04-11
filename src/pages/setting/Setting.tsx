import React, { useEffect, useRef, useState } from 'react'
// import Bottom from '../../phoneComponents/bottom/Bottom'
// import Title from '../../phoneComponents/title/Title'
import goRight from "../../assets/image/goRight.png";
import problem from "../../assets/icon/problem.svg";
import setItem from "../../assets/icon/setItem.svg";
import './set.scss'
import { Drawer, Menu, type DrawerProps, MenuProps, Table, Modal, Input, Breadcrumb, Select, message, Button, Radio, } from 'antd';
import { useNavigate } from 'react-router-dom';

import img101 from '../../assets/info/1.1/1.工作台.png'
import img102 from '../../assets/info/1.1/2.设备管理.png'
import img103 from '../../assets/info/1.1/3.修改信息.png'
import img104 from '../../assets/info/1.1/4.护理项.png'

import img105 from '../../assets/info/1.2/1.二维码.jpg'
import img106 from '../../assets/info/1.2/2.登陆.png'
import img107 from '../../assets/info/1.2/3.监测垫.png'

import img201 from '../../assets/info/2.1/1.铺设位置.png'
import img202 from '../../assets/info/2.1/2.铺设位置.png'
import img203 from '../../assets/info/2.2/1.进入配网.png'
import img204 from '../../assets/info/2.2/2.按键.png'
import img205 from '../../assets/info/2.2/3.配置wifi.png'
import img206 from '../../assets/info/2.2/4.连接成功.png'


import img207 from '../../assets/info/2.3/1.账号登录.png'
import img208 from '../../assets/info/2.3/2.扫码.png'
// import User from '../user/User';
// import UserInfo from '../../phoneComponents/user/UserInfo';
// import DeviceSheet from '../../phoneComponents/settingComponents/deivceSheet/DeviceSheet';
// import UserSheet from '../../phoneComponents/settingComponents/userSheet/UserSheet';
// import FamilySheet from '../../phoneComponents/settingComponents/familySheet/FamilySheet';
// import SeeUser from '../../phoneComponents/settingComponents/seeUser/SeeUser';
// import CustomOption from '../../phoneComponents/settingComponents/customOption/CustomOption';
import { useGetWindowSize } from '../../hooks/hook';
import { instance, Instancercv } from '@/api/api';
import SeeUser from './settingComponents/seeUser/SeeUser';
import { compressionFile } from '@/utils/imgCompressUtil';
// import Title from 'antd/es/skeleton/Title';
import DeviceSheet from './settingComponents/deivceSheet/DeviceSheet';
import CustomOption from './settingComponents/customOption/CustomOption';
import UserSheet from './settingComponents/userSheet/UserSheet';
import FamilySheet from './settingComponents/familySheet/FamilySheet';
import Bottom from '@/components/bottom/Bottom';
import UserInfo from './user/UserInfo';
import UploadImg from './uploadImg/UploadImg';
// import NurseSetting from './nurseSetting/NurseSetting';
import Title from '@/components/title/Title';
import { useDispatch, useSelector } from 'react-redux';
import { loginOut, roleIdSelect } from '@/redux/premission/premission';
import { equipLoginOut } from '@/redux/equip/equipSlice';
import { tokenLoginout } from '@/redux/token/tokenSlice';
import { mqttLoginout } from '@/redux/mqtt/mqttSlice';


const sysIntroObj = {
  title: {
    name: '1系统简介',
    info: '矩侨关怀智能褥疮预防监测系统是一套专为活动能力下降、长期卧床的人群以及术后恢复期人群的褥疮预防而设计的预防监测系统，系统由监测垫、矩侨关怀小程序、管理平台组成。'
  },
  smallTitle: [
    {
      name: '1.1矩侨管理平台',
      info: {
        info: '该平台主要功能：设备管理、护理员管理、护理计划设置、离床提醒设置、坠床提醒设置、坐起提醒设置、护理选项自定义。',
        imgArr: [{ src: img101 }, { src: img102 },]
      },
    },
    {
      name: '1.2矩侨小程序',
      info: {
        info: '主要功能：监测护理对象生命体征、接收各类提醒（护理超时提醒、离床提醒、坠床提醒、坐起提醒）、记录各类提醒、提供护理指导、查看护理报告、查看日报。',
        smallTitle: [
          {
            name: '1.2.1扫描下方二维码进入小程序',
            info: {
              imgArr: [{ src: img105, width: 16 }]
            }
          },
          {
            name: '1.2.2 点击手机号快捷登录，该操作用于新用户身份验证。',
            info: {
              imgArr: [{ src: img106 },]
            }
          }
        ]
      },
    },
    {
      name: '1.3监测垫',
      info: {
        info: '用于采集数据的柔性织物传感器。集成了柔性传感器、传输模块、USB供电接口',
        imgArr: [{ src: img107, width: 70 }]
      }
    }
  ]
}

const product = {
  title: {
    name: '2.产品铺设、配网、绑定',
  },
  smallTitle: [
    {
      name: '2.1 产品铺设',
      info: {
        info: '该平台主要功能：设备管理、护理员管理、护理计划设置、离床提醒设置、坠床提醒设置、坐起提醒设置、护理选项自定义。',
        smallTitle: [
          {
            name: '1.将褥疮监测垫完全打开展平，平铺于床面。'
          },
          {
            name: '2.将监测垫垫于枕下，确保上边缘与枕头上边缘重叠，并覆盖被监测人身体活动区域。',
            info: {
              imgArr: [{ src: img201, width: 40 }]
            }
          },
          {
            name: '3.监测垫确保平整、无褶皱或松垂。'
          },
          {
            name: '4.上层可覆盖累计不超过1.5cm厚的床单、隔尿垫、褥垫。',
            info: {
              imgArr: [{ src: img202 }]
            }
          }
        ]
      },
    },
    {
      name: '2.2 配网',
      info: {
        smallTitle: [
          {
            name: '1.微信扫描矩侨关怀小程序二维码。',
            info: {
              imgArr: [{ src: img203 }]
            }
          },
          {
            name: '2.进入小程序页面点击设备配网做配网准备。',
          },
          {
            name: '3.将监测垫接上5V电源适配器，通电。指示灯闪烁后开始配网。指示灯如未闪烁，此时需要按配网键5秒以上，待指示灯闪烁后开始配网。',
            info: {
              imgArr: [{ src: img204, width: 50 }]
            }
          },
          {
            name: '4.按照小程序页面提示打开蓝牙，选中全部选项，点击下一步，准备连接WiFi。',
          },
          {
            name: '5.如果收到“请打开蓝牙”提醒，为微信开启蓝牙权限参考如下：',
          },
          {
            name: '5.1.1打开手机的“设置”应用。',
            info: {
              imgArr: [{ src: img205 }]
            }
          },
          {
            name: '5.1.2滚动并点击“隐私”选项。',
          },
          {
            name: '5.1.3在隐私设置界面中，找到并点击“蓝牙“选项。',
          },
          {
            name: '5.1.4在蓝牙设置界面中，找到“微信”并开启对应的开关按钮。',
          },
          {
            name: '6.按照小程序页面提示打开蓝输入WiFi密码，点击下一步，等待连接，配网成功后返回连接成功页。',

          },
          {
            name: '7.配网成功后指示灯常亮。',
            info: {
              imgArr: [{ src: img206 }]
            }
          }
        ]
      },
    },
    {
      name: '2.3 绑定',
      info: {
        smallTitle: [
          {
            name: '1.微信扫码进入矩侨关怀小程序。',
            info: {
              imgArr: [{ src: img207 }]
            }
          },
          {
            name: '2.使用账号登录小程序，如果是新用户，需要先用手机号快捷登录验证身份。',
          },
          {
            name: '选择账号登录，输入用户名、密码。',
          },
          {
            name: '3.登录成功后可以看到名字为“老陈-示例”的设备数据。点击右下角的“+”可添加设备。',
            info: {
              imgArr: [{ src: img208 }]
            }
          },
          {
            name: '4.单击设备号输入框的二维码扫描图标，弹出“使用你的摄像头和麦克风？”窗口，选择“允许”。扫描传输模块外壳的二维码录入设备号，将信息补充完整后点击“OK”。添加完成。',
          },
        ]

      }
    }
  ]
}

export default function Setting() {
  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''

  const dispatch: any = useDispatch()

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('bottom');
  let navigate = useNavigate();
  const showDrawer = () => {
    // setOpen(true);
    navigate('/login')
    localStorage.removeItem('phone')
    localStorage.removeItem('token')
    dispatch(loginOut({}))
    dispatch(equipLoginOut({}))
    dispatch(tokenLoginout({}))
    dispatch(mqttLoginout({}))
  };

  const onClose = () => {
    setOpen(false);
  };


  const isMobile = useGetWindowSize()

  useEffect(() => {
    if (phone == 'admin') {
      getProjectList()
    } else {

    }
  }, [])

  const [userOrganizeId, setUserOrganizeId] = useState()
  const [userOrganizeName, setUserOrganizeName] = useState()

  // 查看权限
  // useEffect(() => {
  //   Instancercv({
  //     method: "get",
  //     url: "/organize/getUserAuthority",
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       "token": token
  //     },
  //     params: {
  //       username: phone,
  //     }
  //   }).then((res) => {
  //     if (res.data.code == 500) return
  //     const roleId = res.data.data.roleId
  //     const organizeId = res.data.data.organizeId
  //     const name = res.data.data.userName
  //     const img = res.data.commonConfig.image
  //     setHeadImg(img)
  //     console.log(roleId)
  //     setUserOrganizeId(organizeId)
  //     setUserOrganizeName(name)

  //     localStorage.setItem('organizeId', organizeId)
  //     // 管理
  //     if (roleId == 2 || roleId == 1) {
  //       setItems([{
  //         label: '使用说明',
  //         key: 'use',
  //         children: [
  //           { key: 'sysIntro', label: '系统简介' },
  //           { key: 'product', label: '产品铺设、配网、绑定' },
  //           { key: 'userInfo', label: '小程序使用说明' },
  //           { key: 'platform', label: '管理平台使用说明' },
  //         ],
  //       },
  //       {
  //         label: '护理选项',
  //         key: 'nurse',
  //       },
  //       {
  //         label: '自定义选项',
  //         key: 'customOption',
  //       },
  //       {
  //         label: '上传LOGO',
  //         key: 'loadImg',
  //       },
  //       {
  //         label: '项目管理',
  //         key: 'projectTitle',
  //         children: [
  //           { key: 'equip', label: '设备管理' },
  //           { key: 'user', label: '护工管理' },
  //           { key: 'person', label: '家属管理' },
  //         ],
  //       },
  //       ])
  //     }
  //   })
  // }, [])


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

  const [headImg, setHeadImg] = useState('')

  const [current, setCurrent] = useState('use');
  type MenuItem = Required<MenuProps>['items'][number];
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if (e.key == 'project') {
      setNavIndex(0)
      setNav([{
        title: <div onClick={() => { setNavIndex(0) }}>项目管理</div>,
      },])
    }
    if (e.key == 'equip') {
      getItemDevice(localStorage.getItem('organizeId'))
    }

    if (e.key == 'user') {
      getItemManage(localStorage.getItem('organizeId'))
    }
    if (e.key === 'person') {
      setProjectManItem('person')
      getItemPerson(localStorage.getItem('organizeId'))
    }
  };
  // const items: MenuItem[] = 


  let allTitle: any = {
    factoryAdmin: [
      {
        label: '使用说明',
        key: 'use',
        children: [
          { key: 'sysIntro', label: '系统简介' },
          { key: 'product', label: '产品铺设、配网、绑定' },
          { key: 'userInfo', label: '小程序使用说明' },
          { key: 'platform', label: '管理平台使用说明' },
        ],
      },
      {
        label: '设备入库',
        key: 'warehouse',
      },
      {
        label: '删除设备',
        key: 'delete',
      },
    ],
    superManage: [{
      label: '使用说明',
      key: 'use',
      children: [
        { key: 'sysIntro', label: '系统简介' },
        { key: 'product', label: '产品铺设、配网、绑定' },
        { key: 'userInfo', label: '小程序使用说明' },
        { key: 'platform', label: '管理平台使用说明' },

        // { key: 'equip', label: '设备管理' },
        // { key: 'user', label: '护工管理' },
      ],
    },
    {
      label: '设备入库',
      key: 'warehouse',
    },
    {
      label: '删除设备',
      key: 'delete',
    },],
    manage: [{
      label: '使用说明',
      key: 'use',
      children: [
        { key: 'sysIntro', label: '系统简介' },
        { key: 'product', label: '产品铺设、配网、绑定' },
        { key: 'userInfo', label: '小程序使用说明' },
        { key: 'platform', label: '管理平台使用说明' },
      ],
    },
    {
      label: '护理选项',
      key: 'nurse',
    },
    {
      label: '配置翻身流程',
      key: 'customOption',
    },
    {
      label: '上传LOGO',
      key: 'loadImg',
    },
    {
      label: '项目管理',
      key: 'projectTitle',
      children: [
        { key: 'equip', label: '设备管理' },
        { key: 'user', label: '护工管理' },
        { key: 'person', label: '家属管理' },
      ],
    },
    ],
    member: [{
      label: '使用说明',
      key: 'use',
      children: [
        { key: 'sysIntro', label: '系统简介' },
        { key: 'product', label: '产品铺设、配网、绑定' },
        { key: 'userInfo', label: '小程序使用说明' },
        { key: 'platform', label: '管理平台使用说明' },
      ],
    }]
  }

  const roleId = useSelector(roleIdSelect)

  const calRoleIdToPermissions = (roleId: number, phone: string): string => {
    if (phone == 'factoryAdmin') {
      return 'factoryAdmin'
    } else {
      if (roleId == 0) {
        return 'superManage'
      } else if (roleId == 1 || roleId == 2) {
        return 'manage'
      } else {
        return 'member'
      }
    }
  }

  const premission = calRoleIdToPermissions(roleId, phone)

  const items = allTitle[premission]


  const [strokeSource, setStrokeSource] = useState([])
  const [manageSource, setManageSource] = useState([])
  const [personSource, setPersonSource] = useState([])
  const [projectManageSource, setProjectManageSource] = useState<Array<any>>([])
  const [deviceSource, setDeviceSource] = useState<Array<any>>([{}])
  const [deleteClick, setDeleteClick] = useState(false)
  console.log(deviceSource, 'deviceSourcedeviceSource');
  const deleteEquip = ({ did, index, user }: any) => {
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
      getDeviceSUser(did)
      // navigator.
      // navigate('/', { replace: true })
    })

  }


  const project = [
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
      render: (record: any) => {

        return (
          <div style={{ display: 'flex', color: '#0256FF', justifyItems: 'center' }}>
            <div className='edit' style={{ marginRight: '1rem' }} onClick={() => {
              console.log(record)
            }}>编辑 </div>
            <div className='delete'>删除</div>
          </div>
        )
      }
    },

  ]

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


    })
  }

  const [userShow, setUserShow] = useState(false)

  const [deleteDeviceObj, setDeleteDeviceObj] = useState<any>({})
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

            {/* {userShow && deleteObj.deviceId == record.deviceId && Object.keys(deviceOneUser).length ?
              <>
                <div className='seeItem' style={{}}>
                  {deleteObj.deviceId == record.deviceId && deviceOneUser.map((a: any, index: any) => {
                    return (
                      <div className='sureDelete' >
                        {index + 1}.{a} {deleteClick ? <div onClick={() => {
                          setDeleteDeviceObj({ did: record.deviceId, index: index, user: a })
                          console.log({ did: record.deviceId, index: index, user: a })
                          setIsModalDeviceDeleteOpen(true)
                          // deleteEquip({did : record.deviceId , user: a})
                        }} className='sureDeleteButton'
                        >
                          <img style={{ width: '0.6rem' }} src={no} alt="" />
                        </div> : ''} </div>
                    )
                  })}
                  <div className='openDelete' style={{ fontSize: '1rem', width: '5rem', textAlign: 'center' }} onClick={() => { setDeleteClick(!deleteClick) }}>删除用户</div>
                </div>
                {userShow ? <div className="modal" style={{ position: 'fixed', zIndex: '999', width: '100%', height: '100%', top: 0, left: 0 }} onClick={() => {
                  console.log('11111click')
                  setUserShow(false)
                }}>

                </div> : ''}
              </> : ''} */}

            <SeeUser userShow={userShow} deleteEquip={(obj: any) => { deleteEquip({ ...obj, roleId: 3, setUser: setDeviceOneUser }) }} deleteObj={deleteObj} record={record} setUserShow={setUserShow} deviceOneUser={deviceOneUser} setDeviceOneUser={setDeviceOneUser} />
          </div>
          <div className='add'>新增</div>
        </div>
      )
    }
  },
    // {
    //   title: '关联家属',
    //   dataIndex: 'family',
    //   key: 'family',
    //   render: (text: any, record: any, index: any) => {

    //     return (
    //       <div style={{ display: 'flex', color: '#0256FF' }}>
    //         <div className='see' style={{ marginRight: '1rem', position: 'relative', }} onClick={() => {

    //           setUserShow(true)
    //         }}>查看

    //           {userShow && deleteObj.deviceId == record.deviceId && Object.keys(deviceOneUser).length ?
    //             <>
    //               <div className='seeItem' style={{ position: 'absolute', top: '100%', zIndex: '10000', backgroundColor: '#fff' }}>
    //                 {deleteObj.deviceId == record.deviceId && deviceOneUser.map((a: any, index: any) => {
    //                   return (
    //                     <div className='sureDelete' style={{ fontSize: '1.12rem', color: '#000', display: 'flex', alignItems: 'center' }}>{index + 1}.{a} {deleteClick ? <div onClick={() => {
    //                       setDeleteDeviceObj({ did: record.deviceId, index: index, user: a })
    //                       console.log({ did: record.deviceId, index: index, user: a })
    //                       setIsModalDeviceDeleteOpen(true)
    //                       // deleteEquip({did : record.deviceId , user: a})
    //                     }} style={{ backgroundColor: '#aaa', borderRadius: '50%', height: '1rem', width: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img style={{ width: '0.6rem' }} src={no} alt="" /></div> : ''} </div>
    //                   )
    //                 })}
    //                 <div className='openDelete' style={{ fontSize: '1rem', width: '5rem', textAlign: 'center' }} onClick={() => { setDeleteClick(!deleteClick) }}>删除用户</div>
    //               </div>
    //               {userShow ? <div className="modal" style={{ position: 'fixed', zIndex: '999', width: '100%', height: '100%', top: 0, left: 0 }} onClick={() => {
    //                 console.log('11111click')
    //                 setUserShow(false)
    //               }}>

    //               </div> : ''}
    //             </> : ''}
    //         </div>
    //         <div className='add'>新增</div>
    //       </div>
    //     )
    //   }
    // },

  ]

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
              console.log(deleteObj, '关联成功关联成功关联成功关联成功')
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
            }}>

              一键关联


            </div>
          </div>
        )
      }
    },
  ]

  const [deviceUser, setDeviceUser] = useState<Array<any>>([{}])
  const [deviceOneUser, setDeviceOneUser] = useState<Array<any>>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalManOpen, setIsModalManOpen] = useState(false)

  const bottomRef = useRef<any>({})

  const [isModalNurseOpen, setIsModalNurseOpen] = useState(false)
  const [isModalPersonOpen, setIsModalPersonOpen] = useState(false)
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
        if (res.data.msg == "add Manager Success") {
          message.info('添加成功')
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

  const handleManOk = () => {
    if (manUser.user.length > 5) {
      Instancercv({
        method: "post",
        url: "/organize/addOrganizeManager",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "token": token
        },
        params: {
          userName: manUser.user,
          password: manUser.password,
          nickName: manUser.name,
          organizeId: deleteManObj.id,
          roleId: 2
        },
      }).then((res) => {
        getProjectManage({ id: manId, user: manUseruser })
        if (res.data.msg == "add Manager Success") {
          message.info('添加成功')
        }
        if (res.data.code == 500) {
          message.error('该用户已绑定过其他的项目')
        }
      }).catch((e) => {
        message.error('服务器异常')
      })

      setIsModalManOpen(false)
    } else {
      message.error('用户名长度需要大于5')
    }
  }

  const handleManCancel = () => {
    setIsModalManOpen(false)
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

  const handleCancel = () => {
    setIsModalOpen(false)
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


      setManageSource(res.data.data)
    })
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
  const organizeIdq = useSelector((state: any) => state.premission.organizeId)


  useEffect(() => {
    getItemDevice(organizeIdq)
  }, [])

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
      console.log(res, res.data.data.map((a: any) => { return { value: a.username, label: a.username } }))
      let data = res.data.data
      data.map((a: any, index: any) => {
        a.id = index + 1
        return a
      })

      // message.info('添加成功')


      setDeviceSource(res.data.data)
    })
  }

  const [projectName, setProjectName] = useState('')
  const [projectNum, setProjectNum] = useState('')
  const [projectAddress, setProjectAddress] = useState('')
  const [deleteObj, setDelete] = useState<any>({})
  const [deleteManObj, setManDelete] = useState<any>({})
  const [manId, setManId] = useState(0)
  const [manUseruser, setManUseruser] = useState('')
  const [projectItem, setProjectItem] = useState('')
  const [nav, setNav] = useState(
    [
      {
        title: <div onClick={() => {
          setNavIndex(0)
          setNav([nav[0]])
        }}>项目管理</div>,
      },

    ])
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
  const [navIndex, setNavIndex] = useState(0)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  const [isModalAssocOpen, setIsModalAssocOpen] = useState(false)
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [isModalDeviceDeleteOpen, setIsModalDeviceDeleteOpen] = useState(false)
  const [isModalDeviceUserOpen, setIsModalDeviceUserOpen] = useState(false)
  const [isModalDeletePersonOpen, setIsModalDeletePersonOpen] = useState(false)

  const [projectManItem, setProjectManItem] = useState('')

  const [projectUser, setProjectUser] = useState<any>({})
  const [nurseUser, setnurseUser] = useState<any>({})
  const [manUser, setmanUser] = useState<any>({})

  const handleNurseOk = () => {
    if (nurseUser.user.length > 5) {
      try {
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
         

        }).catch((e) => {
          message.error('服务器异常')
        })


      } catch (error) {

      }


      setIsModalNurseOpen(false)
    } else {
      message.error('用户的长度需要大于5')
    }

  }

  // const getNurseList = () => {
  //   axios({
  //     method: "get",
  //     url: netUrl + "/organize/getManagerListByOrganizeId",
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       "token": token
  //     },
  //     params: {
  //       organizeId: deleteObj.id,
  //     }
  //   }).then(() => {

  //   })
  // }

  const handleNurseCancel = () => {
    setIsModalNurseOpen(false)
  }

  const handlePersonOk = () => {
    if (!nurseUser.user || !nurseUser.name) {
      return message.info('用户名长度需要大于5')
    }
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
       

        if (res.data.msg == 'add Manager Success') {
          message.info('添加成功')
        }

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


  const handleAssocOk = () => {
    bindDevice({ user: bindUser, did: deleteObj.deviceId })
    setIsModalAssocOpen(false)
  }

  const handleAssocCancel = () => {
    setIsModalAssocOpen(false)
  }

  const handleDeviceDeleteOk = () => {
    deleteEquip(deleteDeviceObj)
    setIsModalDeviceDeleteOpen(false)
  }

  const handleDeviceDeleteCancel = () => {
    setIsModalDeviceDeleteOpen(false)
  }

  const handleDeviceUserOk = () => {
    deleteUserByOrganizeIdAndUsername({ user: deleteObj.username, id: localStorage.getItem('organizeId'), type: 'device' })
    setIsModalDeviceUserOpen(false)
  }

  const handleDeletePersonOk = () => {
    deleteUserByOrganizeIdAndUsername({ user: deleteObj.username, id: localStorage.getItem('organizeId'), type: 'person' })
    setIsModalDeletePersonOpen(false)
  }

  const handleDeletePersonCancel = () => {
    setIsModalDeletePersonOpen(false)
  }

  const handleDeviceUserCancel = () => {
    setIsModalDeviceUserOpen(false)
  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setBindUser(value)
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const [bindUser, setBindUser] = useState('')
  const [userArr, setUserArr] = useState([])

  useEffect(() => {
    // document.querySelector('.seeItem')?.addEventListener('click', (e) => {
    //   console.log('seee' ,e)
    //   e.stopPropagation()
    //   setUserShow(true)
    // }, false)
    // document.querySelector('.setContent')?.addEventListener('click', (e) => {
    //   console.log('.setContent')
    //   setUserShow(false)
    //   // if(e.target){
    //   //   if('see' !== e.target.className) {
    //   //     console.log(`success`);
    //   //   }
    //   // }

    // }, false)

    document.querySelector('.modal')?.addEventListener('click', (e) => {
      console.log('.setContent')
      setUserShow(false)
      // if(e.target){
      //   if('see' !== e.target.className) {
      //     console.log(`success`);
      //   }
      // }

    }, false)


  })

  const [mac, setMac] = useState('')
  const [type, setType] = useState(66)
  // const phone = localStorage.getItem('phone') || ''
  // const token = localStorage.getItem('token') || ''
  const [didData, setDidData] = useState<any>([])
  // const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {

  }, [])
  const deleteMac = () => {
    Instancercv({
      method: "post",
      url: `/device/clearDeviceInfo`,
      params: {
        mac: mac
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {
      console.log(res, '=---')
      if (res.data.msg == "success") {
        message.success('删除成功')
        instance({
          method: "post",
          url: `/sleep/log/deleteAlarmLog`,
          params: {
            deviceId: res.data.deviceId
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
          },
        }).then((res) => {
          console.log(res, 'deleteAlarmLog')
          if (res.data.msg == "success") {
            message.success('设备信息删除成功')
          }
        })
      }

    })
  }



  const fetchMac = () => {
    setIsModalAdminDeleteDeviceOpen(true)
    Instancercv({
      method: "get",
      url: "/device/selectOneDeviceWithPatient",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        mac: mac,
      }
    }).then((res) => {

      if (res.data.data.length) {
        setDidData(res.data.data)
      } else {
        setDidData([])
      }
    })
  }

  const warehouse = () => {
    // localhost:8080/rcv/device/addSensorIndex?mac=AC6C&type=dd
    instance({
      method: "post",
      url: `/device/addSensorIndex`,
      params: {
        mac: (mac).trim(),
        type: type
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
    }).then((res) => {

      if (res.data.msg == "success") {
        message.success('入库成功')
      }
    })

  }

  const [isModalDeleteDeviceOpen, setIsModalDeleteDeviceOpen] = useState(false)
  const [isModalAdminDeleteDeviceOpen, setIsModalAdminDeleteDeviceOpen] = useState(false)
  const handleAdminDeleteDeviceOk = () => {
    const arr = ['patientName', 'roomNum', 'age', 'did']
    const zeroArr = []

    deleteMac()
    setIsModalAdminDeleteDeviceOpen(false);
  };

  const handleAdminDeleteDeviceCancel = () => {
    setIsModalAdminDeleteDeviceOpen(false);
  };

  const [manPassword, setmanPassword] = useState('')
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)

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
    })

  }

  const handleChangePasswordCancel = () => {
    setIsModalChangePasswordOpen(false)
  }

  const [spinning, setSpinning] = useState<boolean>(false);
  const [img, setImg] = useState('https://images.bodyta.com/327d1a0e38e64f1588731239bf534c77.png')
  console.log(bottomRef.current, 'bottomRef.current')
  const changeHeadImg = (headImg: any) => {

    if (bottomRef.current) {
      bottomRef.current.changeImg(headImg)
    }
  }

  return (
    <>
      <Modal title="是否删除当前设备" open={isModalAdminDeleteDeviceOpen} onOk={handleAdminDeleteDeviceOk} onCancel={handleAdminDeleteDeviceCancel}>


        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'>
          <div className="deviceTitle">设备号:</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {mac}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle"> 姓名:</div>

          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {didData.length ? <div style={{ flex: 1 }}>{didData[0].patientName}</div> :
              ''
            }
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle">年龄:</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {didData.length ? <div style={{ flex: 1 }}>{didData[0].age}</div> :
              ''
            }
          </div>

        </div>

        <div style={{ display: 'flex', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle">护理员:</div>
          {phone?.slice(-4)}</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle">房号:</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {didData.length ? <div style={{ flex: 1 }}>{didData[0].roomNum}</div> :
              ''
            }
          </div>

        </div>


        <div style={{
          display: 'flex', //justifyContent: 'center', alignItems: 'center' 
        }} className='deviceItem'><div className="deviceTitle">床垫类型:</div>
          {didData.length ? <div style={{ flex: 1 }}>{didData[0].type == 'small' ? '安护' : '智护'}</div> :
            ''
          }
        </div>
      </Modal>

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

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 组织性质:</div>
            <Input value={projectUser.name} style={{ flex: 1 }} onChange={(e) => {
              let obj = { ...projectUser }
              obj.name = e.target.value
              setProjectUser(obj)
            }} />
          </div>
        </div>
      </Modal>

      <Modal title="添加新管理" open={isModalManOpen} onOk={handleManOk} onCancel={handleManCancel}>
        <div style={{ padding: '0.5rem 3rem' }}>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 用户名:</div> <Input value={manUser.user} style={{ flex: 1 }} onChange={(e) => {
            // setProjectAddress(e.target.value)
            let obj = { ...manUser }
            obj.user = e.target.value
            setmanUser(obj)
          }} /></div>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 密码:</div> <Input value={manUser.password} style={{ flex: 1 }} onChange={(e) => {
            // setProjectAddress(e.target.value)

            let obj = { ...manUser }
            obj.password = e.target.value
            setmanUser(obj)
          }} /></div>

          {/* <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 护工名:</div> <Input value={manUser.name} style={{ flex: 1 }} onChange={(e) => {

            let obj = { ...manUser }
            obj.name = e.target.value
            setmanUser(obj)
            // setProjectAddress(e.target.value)
          }} /></div>    */}
        </div>
      </Modal>

      <Modal title="添加新护工" okText='确认' cancelText='取消' open={isModalNurseOpen} onOk={handleNurseOk} onCancel={handleNurseCancel}>
        <div style={{ padding: '0.5rem 3rem' }}>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 用户名:</div> <Input value={nurseUser.user} style={{ flex: 1 }} onChange={(e) => {
            // setProjectAddress(e.target.value)
            let obj = { ...nurseUser }
            obj.user = e.target.value
            setnurseUser(obj)
          }} /></div>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 密码:</div> <Input value={nurseUser.password} style={{ flex: 1 }} onChange={(e) => {
            // setProjectAddress(e.target.value)

            let obj = { ...nurseUser }
            obj.password = e.target.value
            setnurseUser(obj)
          }} /></div>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 护工名:</div> <Input value={nurseUser.name} style={{ flex: 1 }} onChange={(e) => {

            let obj = { ...nurseUser }
            obj.name = e.target.value
            setnurseUser(obj)
            // setProjectAddress(e.target.value)
          }} /></div>
        </div>
      </Modal>

      <Modal title="添加新家属" okText='确认' cancelText='取消' open={isModalPersonOpen} onOk={handlePersonOk} onCancel={handlePersonCancel}>
        <div style={{ padding: '0.5rem 3rem' }}>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 手机号:</div> <Input value={nurseUser.user} style={{ flex: 1 }} onChange={(e) => {
            // setProjectAddress(e.target.value)
            let obj = { ...nurseUser }
            obj.user = e.target.value
            setnurseUser(obj)
          }} /></div>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 姓名:</div> <Input value={nurseUser.name} style={{ flex: 1 }} onChange={(e) => {
            // setProjectAddress(e.target.value)
            let obj = { ...nurseUser }
            obj.name = e.target.value
            setnurseUser(obj)
          }} /></div>

        </div>
      </Modal>

      <Modal title="修改项目" okText='确认' cancelText='取消' open={isChangeModalOpen} onOk={handleChangeOk} onCancel={handleChangeCancel}>
        <div style={{ padding: '0.5rem 3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 项目名称:</div> <Input value={projectName} style={{ flex: 1 }} onChange={(e) => {
            setProjectName(e.target.value)
          }} /></div>

          <div style={{ display: 'flex', alignItems: 'center' }} className="deviceItem"><div style={{ width: '5rem', }}> 项目地址:</div> <Input value={projectAddress} style={{ flex: 1 }} onChange={(e) => {
            setProjectAddress(e.target.value)
          }} /></div>
        </div>
      </Modal>

      <Modal title="删除项目" okText='确认' cancelText='取消' open={isModalDeleteOpen} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
        是否要删除<span style={{ fontWeight: 'bold' }}>{deleteManObj.organizeName}</span> 项目
      </Modal>

      <Modal title="添加关联用户" okText='确认' cancelText='取消' open={isModalAssocOpen} onOk={handleAssocOk} onCancel={handleAssocCancel}>
        <Select
          showSearch
          placeholder="Select a person"
          optionFilterProp="label"
          onChange={onChange}
          onSearch={onSearch}
          options={deviceUser.map((a) => { return { value: a.username, label: a.nickname } })}
        />
      </Modal>

      <Modal okText='确认' cancelText='取消' title="删除" open={isModalDeviceDeleteOpen} onOk={handleDeviceDeleteOk} onCancel={handleDeviceDeleteCancel}>
        确定要删除关联用户“{deleteDeviceObj.user}”吗?
      </Modal>

      <Modal okText='确认' cancelText='取消' title="删除" open={isModalDeviceUserOpen} onOk={handleDeviceUserOk} onCancel={handleDeviceUserCancel}>
        确定要删除护工“{deleteObj.username}”以及下面所属的设备吗?
      </Modal>

      <Modal okText='确认' cancelText='取消' title="删除" open={isModalDeletePersonOpen} onOk={handleDeletePersonOk} onCancel={handleDeletePersonCancel}>
        确定要删除家属“{deleteObj.username}”不再推送吗?
      </Modal>

      <Modal okText='确认' cancelText='取消' title="请输入新的密码" open={isModalChangePasswordOpen} onOk={handleChangePasswordOk} onCancel={handleChangePasswordCancel}>
        <Input onChange={(e) => {
          setmanPassword(e.target.value)
        }} />
      </Modal>



      <Drawer
        title="Drawer with extra actions"
        placement={placement}
        width={500}
        // size={200}
        onClose={onClose}
        open={open}
      // extra={
      //   <Space>
      //     <Button onClick={onClose}>Cancel</Button>
      //     <Button type="primary" onClick={onClose}>
      //       OK
      //     </Button>
      //   </Space>
      // }
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>


      <div className='setContent pf'>
        <Title />
        {isMobile ? <div className='setBox'>



          <div className='setTitle' onClick={() => {
            navigate('/userInfo')
          }}><div className="setTitleInfo flex"><img className='setTitleImg' src={setItem} alt="" /> 使用说明</div> <img src={goRight} alt="" /></div>

          <div className='setTitle' onClick={() => {
            navigate('/productInfo')
          }}><div className="setTitleInfo flex"><img className='setTitleImg' src={setItem} alt="" /> 产品功能介绍</div> <img src={goRight} alt="" /></div>

          {/* <div className='setTitle' onClick={() => {
            navigate('/nurseSetting')
          }}><div className="setTitleInfo"><img className='setTitleImg' src={setItem} alt="" /> 护理选项</div> <img src={goRight} alt="" /></div> */}

          {
            phone == 'admin' ? <div onClick={() => {
              navigate('/nurseSetting')
            }} className='setTitle'><div className="setTitleInfo"><img className='setTitleImg' src={problem} alt="" /> 项目管理</div> <img src={goRight} alt="" /></div>
              : ''}

          {
            phone == 'admin' || phone == 'factoryAdmin' ? <div onClick={() => {
              navigate('/delete')
            }} className='setTitle'><div className="setTitleInfo"><img className='setTitleImg' src={problem} alt="" /> 删除设备信息</div> <img src={goRight} alt="" /></div>
              : ''}

          {
            phone == 'factoryAdmin' ? <div></div> : ''
          }
          <div className='loginOut' onClick={showDrawer}>
            <div className="loginOutButton">退出登录</div>
          </div>
        </div>
          :
          <div className='setBoxPc'>
            <div className="selectBox">
              <Menu onClick={onClick} selectedKeys={[current]} mode="inline" items={items} />
              <div className='loginOut' onClick={showDrawer}>
                <div className="loginOutButton">退出登录</div>
              </div>
            </div>
            <div className="contentBox">
              {
                current == 'use' ?
                  // <video width="80%" controls>
                  //   <source src="https://images.bodyta.com/nursing.mp4" type="video/mp4" />
                  //   <source src="movie.ogg" type="video/ogg" />

                  // </video>
                  ''
                  : current == 'project' || current == 'projectTitle' ?

                    <>
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
                          <Table dataSource={strokeSource} onRow={(record: any) => {
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
                          }} columns={project} /> : projectManItem == 'projectMan' ?
                            <Table dataSource={projectManageSource} onRow={(record: any) => {
                              return {
                                onClick: (e: any) => {
                                  setDelete(record)

                                  // if (e.target.className === 'edit') {

                                  //   console.log(record, 'edit')
                                  // }

                                  // if (e.target.className === 'projectName') {

                                  //   setCurrent('projectItem')
                                  //   console.log(record, 'projectName')
                                  // }


                                }
                              }
                            }} columns={projectManage} /> :
                            <div>

                              <div>超级管理员  {deleteObj.userName}</div>
                              <Table dataSource={deviceSource} onRow={(record: any) => {
                                return {
                                  onClick: (e: any) => {
                                    setDelete(record)
                                    if (e.target.className === 'see') {

                                      console.log(record, 'see')
                                      getDeviceSUser(record.deviceId)
                                    }

                                    if (e.target.className === 'add') {

                                      console.log(record, 'add')
                                      // getDeviceSUser(record.deviceId)
                                      setIsModalAssocOpen(true)
                                      getAllDeviceSUser(record.deviceId)
                                    }





                                  }
                                }
                              }} columns={device} />
                            </div>
                        }

                      </div>
                    </>

                    :
                    current == 'equip' ?

                      <DeviceSheet deviceSource={deviceSource} />
                      :
                      current == 'customOption' ? <CustomOption /> :

                        current == 'user' ?

                          <UserSheet setManageSource={setManageSource} manageSource={manageSource} />

                          :
                          current == 'person' ?

                            <FamilySheet setPersonSource={setPersonSource} personSource={personSource} />
                            :

                            current == 'delete' ?
                              <div className="projectContent">
                                <Input onChange={(e) => {
                                  console.log(e.target.value)
                                  setMac(e.target.value)
                                }} />
                                <Button onClick={() => {
                                  // deleteMac()
                                  fetchMac()
                                }}>删除</Button>
                                <Button onClick={() => { window.history.back() }}>返回</Button>

                              </div> : current == 'warehouse' ?
                                <div className="projectContent">
                                  <Input onChange={(e) => {
                                    console.log(e.target.value)
                                    setMac(e.target.value)
                                  }} />
                                  <Radio.Group onChange={(e) => { setType(e.target.value) }} value={type} >
                                    <Radio value={'large'}>智护</Radio>
                                    <Radio value={'small'}>安护</Radio>
                                  </Radio.Group>

                                  <Button onClick={() => {
                                    // deleteMac()
                                    // fetchMac()
                                    warehouse()
                                  }}>入库</Button>
                                  <Button onClick={() => { window.history.back() }}>返回</Button>

                                </div>
                                // : current == 'nurse' ? <NurseSetting type="project" organizeId={userOrganizeId} organizeName={userOrganizeName} />
                                : current == 'loadImg' ? <UploadImg changeHeadImg={changeHeadImg} userId={userOrganizeId} username={userOrganizeName} img={headImg} />
                                  : current == 'sysIntro' ?

                                    <div className="projectContent">
                                      <UserInfo sysIntroObj={sysIntroObj} />
                                    </div>
                                    : current == 'product' ?

                                      <div className="projectContent">
                                        <UserInfo sysIntroObj={product} />
                                      </div>
                                      : current == 'userInfo' ?

                                        <div className="projectContent">
                                          <UserInfo sysIntroObj={sysIntroObj} />
                                        </div>
                                        : current == 'platform' ?

                                          <div className="projectContent">
                                            <UserInfo sysIntroObj={sysIntroObj} />
                                          </div>
                                          : ''
              }
            </div>
          </div>}
        <Bottom ref={bottomRef} />
      </div>
    </>
  )
}

// { key: 'sysIntro', label: '系统简介' },
// { key: 'product', label: '产品铺设、配网、绑定' },
// { key: 'userInfo', label: '小程序使用说明' },
// { key: 'platform', label: '管理平台使用说明' },
