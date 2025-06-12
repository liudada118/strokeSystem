
import { closeMqtt } from "@/redux/Middleware/constant";
import { message } from "antd";
import axios from "axios";

export const web = 'juqiao.bodyta.com'
// export const web = 'sensor.bodyta.com'

// export const netUrl = `http://${web}:8080/rcv`;
// export const netRepUrl = `http://${web}:8081`;
// export const voiceUrl = `http://${web}`

export const netUrl = `https://${web}/rcv`;
export const netRepUrl = `https://${web}`;
export const voiceUrl = `https://${web}`

// export const netUrl = "https://sensor.bodyta.com/rcv";
// export const netRepUrl = "https://sensor.bodyta.com";
// export const voiceUrl = 'https://sensor.bodyta.com'

// export const netUrl = "http://10.100.14.214:8080/rcv";
// export const netRepUrl = "http://10.100.14.214:8081";

export const Instancercv = axios.create({
  baseURL: netUrl
})
export const instance = axios.create({
  baseURL: netRepUrl
})
instance.interceptors.response.use(function (response) {
  return response
}, function (err) {
  console.log(err, 'err')
  if (err.response.status === 401) {
    closeMqtt()
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
    localStorage.removeItem('roleId')
    localStorage.removeItem('organizeId')
    localStorage.removeItem('loglevel')
    localStorage.removeItem('device')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('loglevel')
    localStorage.removeItem('time')
    message.config({
    top: 100,       // 消息显示在距离顶部100px的位置
    duration: 10,  // 消息自动关闭延时为1.5秒
    maxCount: 1,    // 同时最多显示3条消息
    rtl: true       // 从右向左的布局(适合阿拉伯语等从右向左阅读的语言)
});
    message.success('登录过期，请重新登录')
    window.location.hash = '#/login'
  }
  if(err){
    // message.error('服务器错误')
    return
  }
})
instance.interceptors.request.use(function (config: any) {
  let token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      "token": token
    }
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

Instancercv.interceptors.request.use(function (config: any) {
  let token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      "token": token,
      ...(config.headers || {})
    }
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

Instancercv.interceptors.response.use(function (response) {
  return response
}, function (err) {
  console.log(err, 'err')
  if (err.response.status === 401) {
    closeMqtt()
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
    localStorage.removeItem('roleId')
    localStorage.removeItem('organizeId')
    localStorage.removeItem('loglevel')
    localStorage.removeItem('device')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('loglevel')
    localStorage.removeItem('time')
    message.config({
    top: 100,       // 消息显示在距离顶部100px的位置
    duration: 10,  // 消息自动关闭延时为1.5秒
    maxCount: 1,    // 同时最多显示3条消息
    rtl: true       // 从右向左的布局(适合阿拉伯语等从右向左阅读的语言)
    });
    message.success('登录过期，请重新登录')
    window.location.hash = '#/login'
  }
})
export async function fetchDatarcv(options: any) {
  const res:any = await Instancercv(options)
  return res
}
// export default Instancercv
export default instance
export async function fetchData(options: any) {
  const res = await instance(options)
  return res
}
export const messagePageAdded=async(key:any,addshuju: any, addResponseTime: string)=>{
  return instance({
    method: "POST",
    url: "https://sensor.bodyta.com/sleep/log/addAlarmConfirmer",
    data: {
      logid:key,
      confirmer:addshuju,
      confirmTime:addResponseTime
    },
  })
}