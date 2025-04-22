import { message, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import voice from "@/assets/audio/y2284.mp3";
import { Dialog, DotLoading, ErrorBlock } from "antd-mobile";
import "./index.scss";
// import { DemoBlock } from 'demos'
let first = true;
export default function VoicePremission() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(first);
  const [isOffLine, setIsOffLine] = useState(false);
  const voiceRef = useRef<any>(null);
  const handleVoiceOk = () => {
    // if(voiceRef.current)
    firstPlay();
  };
  const handleVoiceCancel = () => {
    firstPlay();
  };

  const checkOutNetwork = () => {
    // 初始检查网络状态
    if (!navigator.onLine) {
      setIsOffLine(true);
    }
    window.addEventListener("offline", () => {
      setIsOffLine(true);
    });
    window.addEventListener("online", () => {
        setIsOffLine(false);
    });
  };
  const firstPlay = () => {
    // if (voiceRef.current) {
    //     voiceRef.current.play()
    // }else{
    //     message.info('加载音频')
    // }
    const audio: any = document.getElementById("audio");
    audio.setAttribute("src", voice);
    if (audio) {
      audio.play();
      setIsVoiceModalOpen(false);
      first = false;
    } else {
      message.info("加载音频");
    }
  };
  useEffect(() => {
    checkOutNetwork()
  }, [])
  return (
    <div>
      {isOffLine ? (
        <div style={{}} className="is_offline_box">
          <ErrorBlock
            style={{
              width: "100vw",
              height: "100vh",
            }}
            title="网络异常"
            description="您的网络已断开，请检查连接。"
            status="disconnected"
          />
        </div>
      ) : (
        <Modal
          zIndex={100000000}
          title="是否允许网页发出声音"
          okText="允许"
          cancelText="不允许"
          open={isVoiceModalOpen}
          onOk={handleVoiceOk}
          onCancel={handleVoiceCancel}
        ></Modal>
      )}

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
  );
}
