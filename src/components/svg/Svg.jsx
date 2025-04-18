import React from 'react'
import './index.css'


const CountedDown = (props ) => {
    // const [color, setColor] = React.useState("green");
    const {speed , progress} = props
    // const [speed, setSpeed] = React.useState('120s');
    // const [progress] = React.useState('1');
    return (
        <div className='borderProgress absolute scale-[1.1] h-full'>
            <div className="father h-full">
                <svg className="progressSvg" style={{ '--speed': speed, '--progress': progress }}>
                    <rect width="100%" height="100%" x="0" y="0" rx="10" ry="10" stroke-width="5"/>
                </svg>
                {/* <span class="son">{props.svg}</span> */}
            </div>
        </div>
    );
};


export function BorderProgress(props) {
    const {speed , progress} = props
    return (
        <CountedDown speed={speed} progress={progress} />
    );
}  