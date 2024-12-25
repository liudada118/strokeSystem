import { useEffect, useState } from "react";
import { setRem, windowWidthReturnType } from './hookUtil'
export function useGetWindowSize() {
    const widthType = windowWidthReturnType()
    const [width, setWidth] = useState(widthType)
    const changeRem = () => {
        // alert(`${window.innerWidth} , ${window.innerHeight}`)
        // console.log(width)
        setRem(setWidth)
    }
    useEffect(() => {
        setRem(setWidth)
        window.addEventListener("resize", changeRem)
        return () => {
            window.removeEventListener('resize', changeRem)
        }
    }, [])
    return width == 'pc' || width == 'Pad' ? false : true
}