import { useEffect, useState } from "react";
import logo from "../../assets/image/logo.png";
// import xnLogo from "../../assets/image/xnLogo.png";
// import xbxLogo from "../../assets/image/xbxLogo.jpg";
import "./index.scss";
import { Input, Select, Button, message } from "antd";
import { netUrl } from "@/api/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VerCode from "./verCode/VerCode";
import { useDispatch, useSelector } from "react-redux";
import { reduxSetPhone, reduxSetToken } from "@/redux/token/tokenSlice";
import { loginOut } from '../../redux/premission/premission'
import useWindowSize from '@/hooks/useWindowSize'
import { startMqtt } from "@/redux/Middleware/constant";
const { Option } = Select;

const loginType = ["账号登录"];

export default function Login() {

  message.config({
    top: 100,
    duration: 10,
    maxCount: 1,
    rtl: true,
  });
  const dispatch = useDispatch()
  const token = localStorage.getItem('token') || ''
  const company = localStorage.getItem('company') || '/JQ'
  const status = useSelector((state: any) => state.equip.status)
  const permissionStatus = useSelector((state: any) => state.premission.status)
  let navigate = useNavigate();
  useEffect(() => {
    document.documentElement.style.fontSize = `${window.innerWidth / 100}px`;
    window.addEventListener("resize", function () {
      document.documentElement.style.fontSize = `${window.innerWidth / 100}px`;
    });
  });
  const [nowType, setNowType] = useState<number>(1);
  const [phone, setPhone] = useState<string>('');
  const [verCode, setVerCode] = useState<string>('')

  const img = localStorage.getItem('headImg') ? localStorage.getItem('headImg') : logo
  const [headImg, setHeadImg] = useState(img)
  // 获取头像
  // useEffect(() => {
  //   if (!localStorage.getItem('headImg')) {
  //     axios({
  //       method: "get",
  //       url: netUrl + "/organize/getUserAuthority",
  //       headers: {
  //         "content-type": "multipart/form-data",
  //         "token": token
  //       },
  //       params: {
  //         username: phone,
  //       }
  //     }).then((res) => {
  //       const image = res.data.commonConfig.image
  //       const roleId = res.data.data.roleId
  //       localStorage.setItem('roleId', roleId)
  //       if (image) {
  //         setHeadImg(image)
  //         localStorage.setItem('headImg', image)
  //       }
  //     }
  //     ).catch((err) => {
  //       console.log(err)
  //     })
  //   }
  // }, [])

  const getVerCode = () => {
    axios({
      method: "get",
      url: netUrl + "/login/sendSmsCode",
      params: {
        phone: phone,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    }).then((res) => {


      if (res.status == 200) {
        message.success('验证码发送成功')
      } else {
        message.success('验证码发送失败')
      }

    });
  }
  const dispale = useDispatch()
  const login = () => {
    if (!phone) {
      return message.info('账号不能为空')
    }
    if (!verCode && nowType === 0) {
      return message.info('验证码不能为空')
    }
    if (!verCode && nowType === 1) {
      return message.info('密码不能为空')
    }
    // if (!phone && !verCode) return message.info(nowType === 1 ? '手机号和验证码不能为空' : '手机号和密码不能为空')
    // if (!verCode) return message.info(nowType === 0 ? '手机号和验证码不能为空' : '手机号和密码不能为空')
    // 管理员
    if (nowType) {
      axios({
        method: "post",
        url: netUrl + "/login/loginWithPwd",
        params: {
          username: phone,
          password: verCode
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {


        // reStartMqtt

        if (res.data.code === 0) {
          const obj = res.data.authority.reduce((acc: any, curr: any, index: number) => {
            acc[index] = curr;
            return acc;
          },);
          startMqtt()
          localStorage.setItem('roleId', res.data.authority[0].roleId);
          localStorage.setItem('organizeId', obj.organizeId)
          dispale(loginOut(obj.organizeId))
          const token = res.data.token
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('phone', phone)
          dispatch(reduxSetPhone(phone))
          dispatch(reduxSetToken(token))
          navigate('/')
          message.success('登录成功')
        } else {
          message.error(res.data.msg)
        }
      });
    }
    // 手机号
    else {
      axios({
        method: "get",
        url: netUrl + "/login/smsCodeLogin",
        params: {
          phone: phone,
          smsCode: verCode
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        const obj = res.data.authority.reduce((acc: any, curr: any, index: number) => {
          acc[index] = curr;
          return acc;
        },);
        localStorage.setItem('organizeId', obj.organizeId)
        dispale(loginOut(obj.organizeId))
        if (res.data.code === 0) {
          const token = res.data.token
          // localStorage.setItem('token', res.data.token)
          // localStorage.setItem('phone', phone)
          dispatch(reduxSetPhone(phone))
          dispatch(reduxSetToken(token))
          startMqtt()
          navigate('/')
          message.success('登录成功')
        } else {
          message.error('登录失败')
        }
      });
    }
  }
  let timer: any;
  // const 
  const debounce = (fn: Function, ms: number) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, ms);
  }
  const windowSize = useWindowSize()
  return (
    <div className="loginContainer">
      <div className="loginContent">
        <div className={`${!windowSize.isMobile ? '' : 'loginContentImg'}`} style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <img style={{ width: '70%', marginLeft: "15%", marginRight: "15%" }} src={logo} alt="" />
          <div className="loginTypes">
            {
              !windowSize.isMobile ? ' 账号登录' : ''
            }
          </div>
        </div>
        <div className="">
          <Input
            className="verifiValue py-[0.35rem] mb-[1rem] rounded-3xl"
            value={phone}
            onChange={(e) => { setPhone(e.target.value) }}
            placeholder={"请输入账号"}
          />
          <Input.Password className="verifiValue py-[0.35rem] rounded-3xl flex items-center" placeholder={"请输入密码"} value={verCode}
            onChange={(e) => { setVerCode(e.target.value) }} />
          <Button
            shape="round"
            className="loginButton"
            style={{ color: "#0033A1" }}
            block
            type="primary"
            onClick={() => { debounce(login, 1000) }}
          >
            登录
          </Button>
        </div>
      </div>
      <div className="foot">
        {/* <div className={`${windowSize.isMobile === false ? 'footCompany' : 'footCompanyWeb'}`}> */}
        <div className={`${windowSize.isMobile === false ? 'footItems' : 'footItemsWeb'}`}>
          <div className={`${windowSize.isMobile === false ? 'footItem' : 'footItemsWeb'}`}>帮助</div>
          <div className={`${windowSize.isMobile === false ? 'footItem' : 'footItemsWeb'}`}>隐私</div>
          <div className={`${windowSize.isMobile === false ? 'footItem' : 'footItemsWeb'}`}>条款</div>
        </div>
        <div className={`${windowSize.isMobile === false ? 'footCompany' : 'footCompanyWeb'}`}>
          copyright@威海矩侨工业科技有限公司
        </div>
      </div>
    </div>
  );
}
