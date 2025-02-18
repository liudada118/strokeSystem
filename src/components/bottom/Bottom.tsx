import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import './bottom.scss'
import { useLocation, useNavigate } from 'react-router-dom';

import nullImg from '../../assets/image/null.png'
import addwithe from "../../assets/image/addwithe.png";
import addBlue from "../../assets/image/addBlue.png";
import photo from '../../assets/image/scan.png'

import home from '../../assets/icon/home.svg'
import logo from '../../assets/icon/logo.png'
import onHome from '../../assets/icon/onHome.svg'
import messageIcon from '../../assets/icon/message.svg'
import onMessage from '../../assets/icon/onMessage.svg'
import messagepc from '../../assets/icon/messagepc.png'
import unmessagepc from '../../assets/icon/unmessagepc.png'
import setpc from '../../assets/icon/setpc.png'
import unsetpc from '../../assets/icon/unsetpc.png'
import homepc from '../../assets/icon/homepc.png'
import unhomepc from '../../assets/icon/unhomepc.png'
import set from '../../assets/icon/set.svg'
import onSet from '../../assets/icon/onSet.svg'

import { Input, Modal, Radio, message, Select } from 'antd';

import { useGetWindowSize } from '../../hooks/hook';
import show from './ScanCode/utils/show';
import { instance, Instancercv, netRepUrl } from '@/api/api';
import ImgUpload from '../imgUpload/ImgUpload';
import { useDispatch, useSelector } from 'react-redux';
import { headImgSelect } from '@/redux/premission/premission';
import { fetchEquips } from '@/redux/equip/equipSlice';


let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;



interface bottomProps {
  setEquips?: Function
  // setSelect?: Function
  read?: boolean
  setNewEquips?: Function
  getEquipList?: Function
}


const mobileBottomArr = [
  { name: '首页', route: '/', unImg: home, img: onHome },
  { name: '提醒', route: '/message', unImg: messageIcon, img: onMessage },
  { name: '设置', route: '/setting', unImg: set, img: onSet }
]

const pcBottomArr = [
  { name: '首页', route: '/', unImg: unhomepc, img: homepc },
  { name: '提醒', route: '/message', unImg: unmessagepc, img: messagepc },
  { name: '设置', route: '/setting', unImg: unsetpc, img: setpc }
]

let bottomArr = mobileBottomArr


const Bottom = forwardRef((props: bottomProps, refs: any) => {
  const [macType, setMacType] = useState('')

  const dispatch:any = useDispatch()
  /**
   * 
   * @param value 用户输入的设备后六位
   * @param callback 将服务器检索出来的设备列表赋值给展示列表
   * 
   * 
   */
  const fetch = (value: string, callback: (data: { value: string; text: string }[]) => void) => {
    const token = localStorage.getItem('token') || ''
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    const fake = () => {
      Instancercv({
        method: "get",
        url: "/device/selectSensorIndex",
        headers: {
          "content-type": "multipart/form-data",
          "token": token
        },
        params: {
          mac: value
        }
      }).then((res) => {

        const device = res.data.data
        if (device.length) {
          if (currentValue === value) {
            let data = device.map((item: any) => ({
              value: item.mac,
              text: item.mac,
            }));
            setMacType(device[0].type)
            callback(data)
          }
        } else {
          message.error('该设备未入库,请联系管理员')
        }
      })

    };
    if (value) {
      timeout = setTimeout(fake, 300);
    } else {
      callback([]);
    }
  };

  const phone = localStorage.getItem('phone') || ''
  const token = localStorage.getItem('token') || ''
  const isMobile = useGetWindowSize()

  const location = useLocation()
  let index = 0
  if (location.pathname == "/") {
    index = 0
  } else if (location.pathname == "/message") {
    index = 1
  } else if (location.pathname == "/setting" || location.pathname == "/nurseSetting") {
    index = 2
  }
  const [onIndex, setIndex] = useState(index)
  const navigate = useNavigate();
  const [userinfo, setUserInfo] = useState<any>({
    patientName: '',
    chargeMan: phone?.slice(-4),
    roomNum: '',
    sex: 1,
    age: '',
    did: '',
    img: null,
    type: 'large'
  })

  const [read, setRead] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [didData, setDidData] = useState<any>([])
  const [data, setData] = useState<Array<any>>([]);
  const [value, setValue] = useState<string>();

  const headImg = useSelector(headImgSelect)

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };


  /**
   * @param newValue 用户输入设备后六位 然后从数据库选择的完整mac地址
   */
  const handleChange = (newValue: string) => {
    setValue(newValue);
    setMac(newValue)
    const value = { ...userinfo, did: newValue, type: macType }
    setUserInfo(value)
    Instancercv({
      method: "get",
      url: "/device/selectOneDeviceWithPatient",
      headers: {
        "content-type": "multipart/form-data",
        "token": token
      },
      params: {
        mac: newValue,
      }
    }).then((res) => {
      if (res.data.data.length) {
        setDidData(res.data.data)
      } else {
        setDidData([])
      }
    })
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 确认添加设备弹窗
   */
  const handleOk = () => {

    if (mac || userinfo.did.length == 12) {
      const arr = ['patientName', 'roomNum', 'age', 'did']
      const zeroArr = []
      arr.forEach((a) => {
        if (userinfo[a] == '') {
          zeroArr.push(a)
        }
      })

      if ((didData.length && userinfo['did'] == '') || (!didData.length && zeroArr.length)) {
        message.error('信息不能为空')
      } else if (userinfo['did'].length != 12) {
        console.log(userinfo['did'].length)
        message.error('请输入正确的mac地址')
      } else {
        // if(Object.values(userinfo).some((a)))
        addEquip()
        setIsModalOpen(false);
      }
    } else {
      message.error('正在搜索设备')
    }

  };

  const [mac, setMac] = useState('')

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * 将用户输入信息清空
   */
  const clearInfo = () => {
    setValue('')
    setMac('')
    setDidData([])
  }

  /**
   * 如果识别为老设备  那么直接添加
   */
  const addOldEquip = () => {
    Instancercv({
      method: "post",
      url: "/device/addBindManual",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
      params: {
        phone: phone,
        deviceId: didData[0]?.sensorName,
      },
    }).then((res) => {
      addEquipResule(res)
    })
  }

  /**
   * 如果是新设备  那么获取用户输入的信息  添加到数据库
   */
  const addNewEquip = () => {
    Instancercv({
      method: "post",
      url: "/device/add",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "token": token
      },
      params: {
        phone: phone,
        ...userinfo,
        headImg: userinfo.img,
        type: (userinfo.type).trim(),
        mac: (userinfo.did).trim(),
        did: (userinfo.did).trim(),
      },
    }).then((res) => {
      addEquipResule(res)
    });
  }

  /**
   * @param res 服务器返回
   * 绑定设备成功或者失败之后的操作 
   */
  const addEquipResule = (res : any) => {
    if (res.data.code == 0) {
      message.success('添加成功')

      // 清空用户输入
      clearInfo()
      // if (props.getEquipList) props.getEquipList()
      dispatch(fetchEquips())
    } else {
      message.error('设备绑定失败')
    }
  }

  const addEquip = () => {
    console.log('addEquip')
    if (didData.length) {
      addOldEquip()
    } else {
      addNewEquip()
    }
  }


  function parseJson(json: string) {
    let res = json
    while (typeof res == 'string') {
      res = JSON.parse(res)
    }
    return res
  }

  /**
   * 
   * @param multiple 
   * 扫码
   */
  function handleScan(multiple: boolean) {
    show({
      multiple,
      onOk: (code: any, close) => {

        if (!code.includes('{')) {
          // alert('obj')
          const did = code
          const value = { ...userinfo, did: did }
          setUserInfo(value)
          if (did.length == 12) {
            Instancercv({
              method: "get",
              url: "/device/selectOneDeviceWithPatient",
              headers: {
                "content-type": "multipart/form-data",
                "token": token
              },
              params: {
                mac: did,
              }
            }).then((res) => {

              if (res.data.data.length) {
                setDidData(res.data.data)
              } else {
                setDidData([])
              }
            })
          }
          close()
        } else {
          const res: any = parseJson(code)
          const did = res.mac
          const type = parseInt(res.type) == 66 ? 'large' : 'small'
          const value = { ...userinfo, did: did, type: type }
          setUserInfo(value)
          setValue(res.mac)
          if (did.length == 12) {
            Instancercv({
              method: "get",
              url: "/device/selectOneDeviceWithPatient",
              headers: {
                "content-type": "multipart/form-data",
                "token": token
              },
              params: {
                mac: did,
              }
            }).then((res) => {

              if (res.data.data.length) {
                setDidData(res.data.data)
              } else {
                setDidData([])
              }
            })
          }
          close()
        }

        // const did = typeof code === 'string' ? code : JSON.parse(code).mac

        // const value = { ...userinfo, did: did }
        // setUserInfo(value)


      },
      onCancel: (close) => {
        // alert('cancel')
        close()
      }
    })
  }

  setBottomInfo()

  /**
   * 设置不同分栏的图片
   */
  function setBottomInfo() {
    if (!isMobile) {
      bottomArr = pcBottomArr
    } else {
      bottomArr = mobileBottomArr
    }
  }



  useEffect(() => {
    window.addEventListener("resize", setBottomInfo);

    instance({
      url: "/sleep/log/getUnreadCount",
      method: "get",
      params: { phone: phone, }
    }).then((e) => {

      if (e.data.unreadFlag == 1) {
        setRead(true)
      }
    }).catch((err) => {
      // message.error('服务器错误')
    })

    return () => {
      window.removeEventListener('resize', setBottomInfo)
    }
  }, [isMobile]);

  const img = localStorage.getItem('headImg') ? localStorage.getItem('headImg') : logo
  // const [headImg, setHeadImg] = useState(img)
  // // const [headImg , setHeadImg] = useState(logo)

  // // 获取头像
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
  //     const image = res.data.commonConfig.image
  //     // if(image){
  //     setHeadImg(image)
  //     localStorage.setItem('headImg', image)
  //   }
  //   )
  // }, []
  // )





  // const changeImg = (img: any) => {
  //   setHeadImg(img)
  // }

  // useImperativeHandle(refs, () => ({
  //   changeImg
  // }));

  /**
   * 
   * @param img uploadImg组件返回的头像
   */
  const loadImg = (img: any) => {
    const value = { ...userinfo }
    setUserInfo({
      ...value,
      img: img
    })
  }

  return (
    <div className="bottomContent">
      <Modal title="为新设备添加信息" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ display: 'flex', alignItems: 'center' }} className='deviceItem'><div style={{ width: '4rem', }}> 头像:</div>
          <ImgUpload img={userinfo.img} finish={loadImg} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'>
          <div className="deviceTitle">设备号:</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>

            <Select
              showSearch
              value={value}
              placeholder={'请输入6位SN码'}
              style={{ width: '100%' }}
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
              options={(data || []).map((d) => ({
                value: d.value,
                label: d.text,
              }))}
            />


            <img style={{ height: '1.6rem', marginLeft: '0.5rem' }} src={photo} onClick={() => { handleScan(false) }} alt="" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle"> 姓名:</div>
          {didData.length ? <div style={{ flex: 1 }}>{didData[0].patientName}</div> : <Input style={{ flex: 1 }} value={userinfo.patientName} onChange={(e) => {

            const value = { ...userinfo, patientName: e.target.value }
            setUserInfo(value)
          }} />}

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle">年龄:</div>
          {didData.length ? <div style={{ flex: 1 }}>{didData[0].age}</div> : <Input style={{ flex: 1 }} value={userinfo.age} onChange={(e) => {

            const value = { ...userinfo, age: e.target.value }
            setUserInfo(value)
          }} />}

        </div>

        <div style={{ display: 'flex', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle">护理员:</div>
          {phone?.slice(-4)}</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='deviceItem'><div className="deviceTitle">房号:</div>
          {didData.length ? <div style={{ flex: 1 }}>{didData[0].roomNum}</div> : <Input style={{ flex: 1 }} value={userinfo.roomNum} onChange={(e) => {

            const value = { ...userinfo, roomNum: e.target.value }
            setUserInfo(value)
          }} />}

        </div>


        <div style={{
          display: 'flex', //justifyContent: 'center', alignItems: 'center' 
        }} className='deviceItem'><div className="deviceTitle">床垫类型:</div>
          {didData.length ? <div style={{ flex: 1 }}>{didData[0].type == 'small' ? '安护' : '智护'}</div> : <Radio.Group onChange={(e) => {

            const value = { ...userinfo, type: e.target.value }
            setUserInfo(value)
          }} value={userinfo.type}>
            <Radio value={'large'} disabled={true}>智护</Radio>
            <Radio value={'small'} disabled={true}>安护</Radio>
          </Radio.Group>
          }
        </div>
      </Modal>
      <div className="bottomItemContent">
        {!isMobile ? <div className="bottomItem">  { <img style={{ width: '2rem', borderRadius: '3px' }} src={headImg ? headImg : logo} alt="" onClick={() => { navigate('/') }} /> }</div> : ''}
        {bottomArr.map((a, index) => <div className={`bottomItem ${onIndex == index ? 'bottonSelectItem' : ''} ${!isMobile && onIndex == index ? 'selectItempc' : ''}`} onClick={() => {
          navigate(a.route)
          setIndex(index)
          if (index == 1) {
            instance({
              url: netRepUrl + "/sleep/log/clearUnread",
              method: "get",
              params: { phone: phone, }
            }).then((e) => {

              if (e.data.code == 0) {
                setRead(false)
              }
            })
          }
        }}>

          <div style={{ position: 'relative' }}>
            {a.name == '提醒' && (read) ? <div className='readMessage' style={{ position: 'absolute', right: 0, top: 0, borderRadius: '50%', backgroundColor: 'red' }}></div> : ''}
            <img className='setImg' style={{ display: onIndex == index ? 'unset' : 'none' }} src={a.img} alt="" />
            <img className='setImg' style={{ display: onIndex == index ? 'none' : 'unset' }} src={a.unImg} alt="" />
          </div>
          <div className="bottomName">{a.name}</div>
        </div>)}
      </div>
      <div className={`bottomAdd ${!isMobile ? 'bottomItem' : ''}`} onClick={showModal}>
        <div className="bottomAddContentbg"></div>
        <div className='bottomAddContent'>
          <img className='setImg' src={isMobile ? addwithe : addBlue} alt="" />
        </div>

      </div>
    </div>
  )
})


export default Bottom