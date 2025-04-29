import { Input, Select } from "antd";
import searchImg from "@/assets/image/search.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeDisplayEquip, equipConstantSelect } from "@/redux/equip/equipSlice";
import { initEquipPc } from "@/redux/equip/equipUtil";
import { showTabsTabs } from '../../redux/Nurse/Nurse'
import { setHomeSelectValue, setHomeSelectType } from '../../redux/home/home'
import useWindowSize from '../../hooks//useWindowSize'
const homeSelect = [
    { value: 'patientName', label: '姓名' },
    { value: 'roomNum', label: '床号' },
    // { value: 'chargeMan', label: '护理员' },
    { value: 'deviceId', label: 'mac' },
]

export const HomeRightTitle = () => {
    const [selectType, setSelectType] = useState('patientName');
    const equips = useSelector(equipConstantSelect)
    const dispatch = useDispatch()
    const windowSize = useWindowSize()
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        const res = equips
        const equipPc = initEquipPc(res)
        dispatch(changeDisplayEquip({ equips: res, equipPc }))
    }, [])
    const search = (e: any) => {

        const value = e ? e.target.value.trim() : ''
        setSearchValue(value)
        dispatch(setHomeSelectValue(value))
        console.log(value, '..........equips...11111.....222222.....')
        // if (value) {
        //     const res = equips.filter((equip: any) => {
        //         console.log(equip[selectType].toString().includes(value), 'equip[selectType].toString().includes(value).....222.....equips...11111.....222222.....')
        //         return equip[selectType].toString().includes(value)
        //     })
        //     console.log(res, '.....222.....equips...11111.....222222.....')
        //     const equipPc = initEquipPc(res)
        //     dispatch(changeDisplayEquip({ equips: res, equipPc }))
        // } else {
        //     console.log(equips, '..........equips...11111..........')
        //     const res = equips
        //     const equipPc = initEquipPc(res)
        //     dispatch(changeDisplayEquip({ equips: res, equipPc }))
        // }

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
                // style={{ fontSize: "1.4rem" }}
                type="text"
                // value={searchValue}
                onChange={(e) =>

                    debounce(search.bind(this, e), 0)
                }
            />
            {/* <img src={searchImg} alt="" /> */}
            <Select
                className="searchSelect"
                defaultValue={selectType}
                style={{ width: 80 }}
                onChange={(e) => {
                    dispatch(setHomeSelectType(e))
                    setSelectType(e)
                }}
                options={homeSelect}
            />
        </div>
    )

}