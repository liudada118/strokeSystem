import React from 'react'
import okWhite from "@/assets/image/okWhite.png";
import './index.scss'
export default function Selected(props : any) {
  return (
    <div className='select' style={{borderWidth : props.select ? '0' : '2px'}}>
        <div style={{ transform : props.select ? 'scale(1.1)' : 'scale(0)',display : 'flex' , alignItems : 'center' , justifyContent : 'center' }}>
            {props.select ? <img src={okWhite} style={{width : '100%' , height : '100%'  }} alt="" /> : ''}
        </div>
      
    </div>
  )
}
