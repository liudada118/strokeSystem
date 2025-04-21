import React from 'react'

interface CapZeroUtilProps {
    value: number,
    util : string
}

export default function CapZeroUtil(props: CapZeroUtilProps) {
    return (
        <>{props.value
            ? <div><span className="sleepDataNum">{props.value}</span><span className="sleepDataUtil">{props.util}</span></div>
            : <div><span className="sleepDataNum">--</span></div>}</>
    )
}
