import React from 'react'
import './index.scss'
export default function UserInfo(props: any) {
    const { sysIntroObj } = props
    return (

        <>
            <p style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1.18rem', }}>{sysIntroObj.title.name}</p>
            <p className='lineHeight'>{sysIntroObj.title.info}</p>
            {sysIntroObj.smallTitle.map((a: any, index: any) => {
                return (
                    <>
                        <div style={{ fontSize: '0.97rem', fontWeight: 'bold', marginBottom: '1.18rem' }}>{a.name}</div>
                        {
                            a.info.info ? <p style={{ marginBottom: '1.18rem' }} className='lineHeight'>{a.info.info}</p> : ''
                        }
                        {
                            a.info.imgArr ? <div>
                                {a.info.imgArr.map((b: any, indexb: any) => {
                                    return (
                                        <img className={`userInfoImg`} style={{width : `${b.width}%`}} src={b.src} alt="" />
                                    )
                                })}
                            </div> : ''
                        }
                        {
                            a.info.smallTitle ? <>{
                                a.info.smallTitle.map((c: any, index: any) => {
                                    console.log(a.info.smallTitle, c)
                                    return (
                                        <>
                                            <div style={{ marginBottom: '1.18rem' }}>{c.name ? c.name : ''}</div>
                                            {
                                                c.info && c.info.info ? <p className='lineHeight'>{c.info.info}</p> : ''
                                            }
                                            {
                                                c.info && c.info.imgArr ? <div>
                                                    {c.info.imgArr.map((d: any, indexb: any) => {
                                                        return (
                                                            <img className={`userInfoImg`} style={{width : `${d.width}%`}} src={d.src} alt="" />
                                                        )
                                                    })}
                                                </div> : ''
                                            }

                                        </>

                                    )
                                })
                            }</> : ''
                        }
                    </>

                )
            })}
        </>
    )
}
