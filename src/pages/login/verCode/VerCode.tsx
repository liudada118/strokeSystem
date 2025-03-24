import { Button, message } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { instance, netUrl } from '@/api/api'
import './index.scss'

interface Props {
  phone: string
}

export default function VerCode(props: Props) {
  const timerCount = 60
  const [count, setCount] = useState<number>(timerCount)
  const timerRef = useRef<any>(null)

  const cutCount = () => {
    setCount((prevState) => prevState - 1) // 为什么这里要用函数- 如果用count 发现count闭包了 不会发生变化了
  }
  const sendCode = () => {
    // message.success('验证码发送成功')
    getVerCode()
    // 要发送验证码
    cutCount()
    timerRef.current = setInterval(cutCount, 1000)
  }

  const getVerCode = () => {
    instance({
      method: "get",
      url: netUrl + "/login/sendSmsCode",
      params: {
        phone: props.phone,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    }).then(() => {

    });
  }

  useEffect(() => {
    if (count === 0) {
      clearInterval(timerRef.current) // 清空定时器
      setCount(timerCount) // 重新将技术器设置为60秒
    }
  }, [count])

  return (
    <div
      className='verifiText'
      // type="primary"
      // disabled={count < timerCount}
      style={{ color: count === timerCount ? 'unset' : '#aaa' }}
      onClick={count === timerCount ? sendCode : undefined}
    >
      {count === timerCount ? "发送验证码" : `还剩${count}秒`}
    </div>
  )
}
