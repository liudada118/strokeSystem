import { message, Modal } from 'antd'
import React, { useRef, useState } from 'react'
import voice from '@/assets/audio/y2284.mp3'
let first = true
export default function VoicePremission() {
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(first)
    const voiceRef = useRef<any>(null)
    const handleVoiceOk = () => {
        // if(voiceRef.current)
        firstPlay()

    };
    const handleVoiceCancel = () => {
        firstPlay()

    };
    const firstPlay = () => {
        // if (voiceRef.current) {
        //     voiceRef.current.play()
        // }else{
        //     message.info('加载音频')
        // }
        const audio: any = document.getElementById('audio')
        audio.setAttribute('src', voice);
        if (audio) {
            audio.pause()
            setIsVoiceModalOpen(false);
            first = false
        } else {
            message.info('加载音频')
        }

    }
    return (
        <div >
            <Modal zIndex={100000000} title="是否允许网页发出声音" okText="允许" cancelText="不允许" open={isVoiceModalOpen} onOk={handleVoiceOk} onCancel={handleVoiceCancel}>

            </Modal>

            {/* <div
                style={{ visibility: 'hidden', position: 'fixed' }}
            >
                <audio ref={voiceRef}>
                    <source src={voice} type="" />
                </audio>
                <button id="play" onClick={() => {
                    // voiceRef.current?.play()
                    if (voiceRef.current) {
                        voiceRef.current.play()
                    }
                }}>声音</button>
                <button onClick={() => {
                    // voiceRef.current?.play()
                    if (voiceRef.current) {
                        voiceRef.current.pause()
                    }
                }}>关闭</button>
            </div> */}
        </div>
    )
}
