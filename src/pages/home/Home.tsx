import Title from '@/components/title/Title'
import Equip from './Equip'
import './index.scss'
import Bottom from '@/components/bottom/Bottom'
import { useDispatch } from 'react-redux'
import { showTabsTabs } from '../../redux/Nurse/Nurse'
import useWindowSize from '../../hooks//useWindowSize'
export default function Home() {
  const dispatch = useDispatch()
  const windowSize = useWindowSize()
  return (
    <div className='homeContent pf' onClick={() => {
      if (windowSize) {
        dispatch(showTabsTabs(true))
      }
    }}>
      <Title />
      <Equip />
      <Bottom />
    </div>
  )
}
