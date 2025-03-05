import { message } from "antd";
import axios from "axios";

export const netUrl = "http://sensor.bodyta.com:8080/rcv";
export const netRepUrl = "http://sensor.bodyta.com:8081";
export const voiceUrl = 'http://sensor.bodyta.com'
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
      "token": token
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
    window.location.hash = '#/login'
  }
})

export async function fetchDatarcv(options: any) {
  const res = await Instancercv(options)
  return res
}

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