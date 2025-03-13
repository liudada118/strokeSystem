import instance from './api'
import netUrl from './api'

const token = localStorage.getItem("token")
const phone = localStorage.getItem("phone")
export const unbindHheDevice = async (deviceId: any) => {
    return await instance({
        url: netUrl + "/device/cancelBindManual",
        method: "post",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "token": token
        },
        data: {
            phone,
            deviceId,
        }

    })
}
