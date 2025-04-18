import { Input, Select } from "antd";
import searchImg from "@/assets/image/search.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeDisplayEquip, equipConstantSelect } from "@/redux/equip/equipSlice";
import { initEquipPc } from "@/redux/equip/equipUtil";
import { showTabsTabs } from '../../redux/Nurse/Nurse'
import useWindowSize from '../../hooks//useWindowSize'
const homeSelect = [
    { value: 'patientName', label: '姓名' },
    { value: 'roomNum', label: '床号' },
    { value: 'chargeMan', label: '护理员' },
    { value: 'deviceId', label: 'mac' },
]

export const HomeRightTitle = () => {
    const [selectType, setSelectType] = useState('patientName');
    const equips = useSelector(equipConstantSelect)
    const dispatch = useDispatch()
    const windowSize = useWindowSize()
    const search = (e: any) => {
        const value = e.target.value.trim()
        if (value) {
            const res = equips.filter((equip: any) => {
                return equip[selectType].toString().includes(value)
            })
            const equipPc = initEquipPc(res)
            dispatch(changeDisplayEquip({ equips: res, equipPc }))
        } else {
            const res = equips
            const equipPc = initEquipPc(res)
            dispatch(changeDisplayEquip({ equips: res, equipPc }))
        }
    };
    let timer: any;
    const debounce = (fn: Function, ms: number) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn()
        }, ms);
    }
    return (
        <div className="searchInput" onClick={(e) => {
            if (windowSize) {
                // e.preventDefault()
                e.stopPropagation()
                dispatch(showTabsTabs(false))
            }

        }}>
            <Input
                type="text"
                onChange={(e) =>

                    debounce(search.bind(this, e), 300)
                }
            />
            <img src={searchImg} alt="" />
            <Select
                className="searchSelect"
                defaultValue={selectType}
                style={{ width: 80 }}
                onChange={(e) => { setSelectType(e) }}
                options={homeSelect}
            />
        </div>
    )

}