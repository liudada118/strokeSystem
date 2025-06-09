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
import { message } from 'antd';

import { useGetWindowSize } from '../../hooks/hook';
import show from './ScanCode/utils/show';
import { instance, netUrl, Instancercv, netRepUrl } from '@/api/api';
import ImgUpload from '../imgUpload/ImgUpload';
import { useDispatch, useSelector } from 'react-redux';
import { headImgSelect } from '@/redux/premission/premission';
import { fetchEquips } from '@/redux/equip/equipSlice';
import AddUseModla from '../Modal/addUseModla'
import useWindowSize from '../../hooks/useWindowSize'
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
  { name: '消息', route: '/message', unImg: messageIcon, img: onMessage },
  { name: '设置', route: '/setting', unImg: set, img: onSet }
]

const pcBottomArr = [
  { name: '首页', route: '/', unImg: unhomepc, img: homepc },
  { name: '消息', route: '/message', unImg: unmessagepc, img: messagepc },
  { name: '设置', route: '/setting', unImg: unsetpc, img: setpc }
]

let bottomArr = mobileBottomArr


const Bottom = forwardRef((props: bottomProps, refs: any) => {
  const [macType, setMacType] = useState('')
  const windowSize = useWindowSize()
  const tab = useSelector((state: any) => state.nurse.showTabs)

  const dispatch: any = useDispatch()
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
  const [mac, setMac] = useState('')
  function parseJson(json: string) {
    let res = json
    while (typeof res == 'string') {
      res = JSON.parse(res)
    }
    return res
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

      if (e?.data?.unreadFlag == 1) {
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

  const showModal = () => {
    console.log('showModal', '............', isModalOpen);
    setIsModalOpen(true);
  };
  const onMessage = (val: any) => {
    navigate('/message')
  }
  const timeArr = [
    new Date(new Date().toLocaleDateString()).getTime(),
    new Date().getTime(),
  ];
  return (
    <div className="bottomContent" style={{ cursor: 'pointer' }}>
      {
        isModalOpen == true ? <AddUseModla isAddModalOpen={isModalOpen} onClose={(val: boolean) => setIsModalOpen(val)}></AddUseModla> : null
      }
      <div className="bottomItemContent">
        {!isMobile ? <div className="bottomItem">  {<img style={{ width: '2rem', borderRadius: '3px' }} src={headImg ? headImg : logo} alt="" onClick={() => { navigate('/') }} />}</div> : ''}
        {bottomArr.map((a, index) => <div key={index + 'Bottom'} className={`bottomItem ${onIndex == index ? 'bottonSelectItem' : ''} ${!isMobile && onIndex == index ? 'selectItempc' : ''}`} onClick={() => {
          navigate(a.route)
          setIndex(index)

          if (index == 0) {
            // dispatch(fetchEquips())
          }
          if (index == 1) {
            try {
              instance({
                method: "get",
                url: "/sleep/log/selectAlarm",
                params: {
                  phone: phone,
                  pageNum: 1,
                  pageSize: 10,
                  startMills: timeArr[0],
                  endMills: timeArr[1],
                  types: "nursing,fallbed,outOffBed,situp,offline,sos",
                },
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                  token: token,
                },
              }).then(() => {

              })


            } catch (err) { }
            instance({
              url: netRepUrl + "/sleep/log/clearUnread",
              method: "get",
              params: { phone: phone, }
            }).then((e) => {
              if (e?.data?.code == 0) {
                setRead(false)
              }
            })
          }
        }}>
          <div style={{ position: 'relative' }}>

            {tab === true && a.name == '提醒' && (read) ? (
              <div
                className="readMessage"
                style={{ position: 'absolute', right: 0, top: 0, borderRadius: '50%', backgroundColor: 'red' }}
              ></div>
            ) : (
              <>
                <img
                  className="setImg"
                  style={{ display: onIndex == index ? 'unset' : 'none' }}
                  src={a.img}
                  alt=""
                />
                <img
                  className="setImg"
                  style={{ display: onIndex == index ? 'none' : 'unset' }}
                  src={a.unImg}
                  alt=""
                />
              </>
            )}
          </div>
          <div className="bottomName" onClick={(index) => onMessage(index)}>{a.name}</div>
        </div>)}
      </div>
      {
        // 扫码功能暂时取消
      }
      <div className={`bottomAdd ${!isMobile ? 'bottomItem' : ''}`} onClick={showModal}>
        <div className="bottomAddContentbg"></div>
        <div className='bottomAddContent'>
          <img className='setImg' src={isMobile ? addwithe : addBlue} alt="" />
        </div>
      </div>
    </div >
  )
})
export default Bottom