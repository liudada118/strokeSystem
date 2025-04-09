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
const { Option } = Select;

const loginType = ["账号登录"];

export default function Login() {

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
  console.log(nowType, '................................................................nowType')
  const img = localStorage.getItem('headImg') ? localStorage.getItem('headImg') : logo
  const [headImg, setHeadImg] = useState(img)
  console.log(phone, '................................................................phoneyyyds');

  // 获取头像
  useEffect(() => {

    if (!localStorage.getItem('headImg')) {
      axios({
        method: "get",
        url: netUrl + "/organize/getUserAuthority",
        headers: {
          "content-type": "multipart/form-data",
          "token": token
        },
        params: {
          username: phone,
        }
      }).then((res) => {
        const image = res.data.commonConfig.image
        const roleId = res.data.data.roleId
        localStorage.setItem('roleId', roleId)
        if (image) {
          setHeadImg(image)
          localStorage.setItem('headImg', image)
        }
      }
      ).catch((err) => {
        console.log(err)
      })
    }


  }, [])

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
      return message.info('手机号不能为空')
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

        const obj = res.data.authority.reduce((acc: any, curr: any, index: number) => {
          acc[index] = curr;
          return acc;
        },);
        localStorage.setItem('organizeId', obj.organizeId)
        dispale(loginOut(obj.organizeId))

        if (res.data.code === 0) {
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
  return (
    <div className="loginContainer sy">
      <div className="loginContent">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {/* <img style={{ width: '70%' }} src={company == '/XBX' ? xbxLogo : company == '/JQ' ? logo : xnLogo} alt="" /> */}
          <img style={{ width: '70%' }} src={logo} alt="" />
        </div>
        <div style={{ width: '100%' }}>
          <div className="loginTypes">
            {loginType.map((item, index) => {
              return (
                <div className="w-full">
                  <div
                    onClick={() => {
                      setNowType(index);
                    }}
                    style={{ color: index == nowType ? "#0033A1" : "#000", fontWeight: 'bold', width: "100%", textAlign: "center", marginBottom: "2rem" }}
                  >
                    {item}
                  </div>
                  {index == nowType ? (
                    <div className="loginTypeBorderContent">
                      <div className="loginTypeBorder"></div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <Input.Group className="phoneInput" compact>
          {/* <Select defaultValue="Zhejiang">
            <Option value="Zhejiang">Zhejiang</Option>
            <Option value="Jiangsu">Jiangsu</Option>
          </Select> */}
          <Input
            style={{ width: "50%" }}
            // defaultValue="Xihu District, Hangzhou"
            value={phone}
            onChange={(e) => { setPhone(e.target.value) }}
            placeholder={!nowType ? "请输入手机号" : "请输入管理员账号"}
          />
        </Input.Group>
        <div className="verifi">
          {!nowType ? <Input className="verifiValue" placeholder={!nowType ? "请输入验证码" : "请输入密码"}
            value={verCode}
            onChange={(e) => { setVerCode(e.target.value) }}
          /> : <Input.Password className="verifiValue" placeholder={"请输入密码"} value={verCode}
            onChange={(e) => { setVerCode(e.target.value) }} />}
          {/* <div className="verifiText" onClick={() => { getVerCode() }}>获取短信验证码</div> */}
          {!nowType ? <VerCode phone={phone} /> : ''}
        </div>
        <Button
          shape="round"
          className="loginButton"
          // color="#0033A1"
          style={{ color: "#0033A1" }}
          block
          type="primary"
          onClick={() => { debounce(login, 1000) }}
        >
          登录
        </Button>
      </div>
      <div className="foot">
        <div className="footItems">
          <div className="footItem">帮助</div>
          <div className="footItem">隐私</div>
          <div className="footItem">条款</div>
        </div>
        <div className="footCompany">
          copyright@威海矩侨工业科技有限公司
        </div>
      </div>
    </div>
  );
}

//  connect(null, {})()