import { Instancercv } from "@/api/api"
import { useEffect, useState } from "react"


export function useGetTurnConfig() {

}

interface getUserPermissionParam {
    phone: string
    token: string
}

export function useGetUserPermission({ phone, token }: getUserPermissionParam) {
    const roleIdToPermission = {
        1: 'superManage',
        2: 'manage',
        3: 'careMan',
        4: 'familyMan'
    }

    const roleIdInit = localStorage.getItem('roleId') ? localStorage.getItem('roleId') : 0
    const headImgInit = localStorage.getItem('headImg') ? localStorage.getItem('headImg') : ''

    const [roleId, setRoleId] = useState(roleIdInit)
    const [headImg, setHeadImg] = useState(headImgInit)

    if (roleId && headImg) {
        return { roleId, headImg }
    }

    useEffect(() => {
        Instancercv({
            method: "get",
            url: "/organize/getUserAuthority",
            headers: {
                "content-type": "multipart/form-data",
                "token": token
            },
            params: {
                username: phone,
            }
        }).then((res) => {
            const image = res.data.commonConfig.image
            const roleId = res.data.data.roleId
            setRoleId(roleId)
            setHeadImg(image)
            localStorage.setItem('headImg', image)
            localStorage.setItem('roleId', roleId)
        })

    }, [])

    return { roleId, headImg }
}

