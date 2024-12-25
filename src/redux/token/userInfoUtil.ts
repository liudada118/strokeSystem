export const TOKENKEY = "token";
export const PHONEKEY = 'phone'

function setToken(token: any) {
    return localStorage.setItem(TOKENKEY, token);
}

function getToken() {
    return localStorage.getItem(TOKENKEY);
}

function clearToken() {
    return localStorage.removeItem(TOKENKEY);
}

function setPhone(phone: any) {
    return localStorage.setItem(PHONEKEY, phone);
}

function getPhone() {
    return localStorage.getItem(PHONEKEY);
}

function clearPhone() {
    return localStorage.removeItem(PHONEKEY);
}

export { setToken, getToken, clearToken, setPhone, getPhone, clearPhone };
