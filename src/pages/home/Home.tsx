import Title from '@/components/title/Title'
import { equipPcSelect, equipSelect, fetchEquips } from '../../redux/equip/equipSlice'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Equip from './Equip'
import './index.scss'
import Bottom from '@/components/bottom/Bottom'
// import Bottom from '@/components/bottom/Bottom'
// import { selectAllPosts, fetchPosts } from '@/redux/requireEquip'



export default function Home() {

  return (
    <div className='homeContent pf'>
      <Title />
      <Equip />
      <Bottom />
    </div>
  )
}
