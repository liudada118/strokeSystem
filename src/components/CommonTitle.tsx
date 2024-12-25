import React from "react";

interface CommonTitleProps {
    name: string;
    type?: 'square' | 'rect'
}
const CommonTitle: (props: CommonTitleProps) => React.JSX.Element = (props) => {
    const { name, type = 'square' } = props
    return (
        <div className='flex items-center mb-[1rem]'>
            <span className={`bg-[#0072EF] ${type === 'square' ? 'w-[10px] h-[10px]' : 'w-[4px] h-[13px] rounded-[2px]'} mr-[10px]`}/>
            <span className={`${type === 'square' ? 'text-[#32373E] text-lg font-semibold' : 'text-[#3D3D3D] font-medium md:font-semibold text-base'}`}>{name}</span>
        </div>
    )
}

export default CommonTitle;