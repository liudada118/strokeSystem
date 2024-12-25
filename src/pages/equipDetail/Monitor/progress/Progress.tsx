import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Progress } from 'antd';
import './index.scss'
const ProgressCom = React.forwardRef((props: any, refs) => {
    const timerCount = 0
    const [count, setCount] = useState<number>(timerCount)
    const timerRef = useRef<any>(null)
    const cutCount = () => {
        // console.log(111)
        setCount((prevState) => prevState + 1) // 为什么这里要用函数- 如果用count 发现count闭包了 不会发生变化了
      }

      useEffect(() => {

        cutCount()
        timerRef.current = setInterval(cutCount, 1000)
      } , [])
    
    useEffect(() => {
        
        if (count === 62) {
            // clearInterval(timerRef.current) // 清空定时器
            setCount(timerCount) // 重新将技术器设置为60秒
        }
    }, [count])
    useEffect(() => {
        // return () =>{
        //    
        // }
    })

    const setCountZero = () => {
        setCount(0)
    }

    const clearTime = () => {
        clearInterval(timerRef.current)
    }

    useImperativeHandle(refs, () => ({
        setCountZero,
        clearTime
    }));

    return (
        <Progress type="circle" percent={Math.round(count*(100/62))} trailColor='#888' />
    )
})
export default ProgressCom
// export default function ProgressCom() {
    
// }
