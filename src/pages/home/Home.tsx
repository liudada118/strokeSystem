import Title from '@/components/title/Title'
import Equip from './Equip'
import './index.scss'
import Bottom from '@/components/bottom/Bottom'


export default function Home() {

  return (
    <div className='homeContent pf'>
      <Title />
      <Equip />
      <Bottom />
    </div>
  )
}
