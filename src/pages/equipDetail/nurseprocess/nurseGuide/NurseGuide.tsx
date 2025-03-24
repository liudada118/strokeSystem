import React from 'react'
import nurse from "@/assets/image/nurse.png";
import './index.scss'
const guideContent = [
    {
        title: '第一步，将患者平移到床边',
        content: ['将患者头部、臀部和腿部依次完成平移，这一步是为了为翻身提供空间'],
        img: nurse
    }, {
        title: '第二步，将患者手臂、腿部弯曲',
        content: ['将患者左侧手臂放在枕头侧面，右侧手臂放胸前。这一步是防止患者在翻身的过程中被压住手臂。', '将腿部弯曲，护理者可以更轻松的完成翻身动作。'],
        img: nurse
    }, {
        title: '第三步，双手放在肩部和髋部完成翻身',
        content: ['一手握住患者肩部，一手放在患者髋部，同时翻身，即可完成一次翻身。'],
        img: nurse
    }
]

export default function NurseGuide() {
    return (
        <div className="pfBold" style={{ backgroundColor: '#F7F8FD', width: '100%', padding: '1rem' }}>
            {guideContent.map((a, indexs) => {
                return <div key={indexs} style={{ backgroundColor: '#fff', borderRadius: '5px', padding: '2rem 1rem', marginBottom: '1rem' }}>
                    <div className="guideTitle">
                        {a.title}
                    </div>
                    <ul style={{ paddingLeft: '1.12rem' }} className="guideContent">
                        {a.content.map((b, indexss) => {
                            return <li key={indexss}>
                                {b}
                            </li>
                        })}
                    </ul>

                    <img className="guideContentImg" src={a.img} />

                </div>
            })}
        </div>
    )
}
