import request from "../../request"
export function loginApi(data:object){
    return request({
        url: 'login/password',
        method: 'post',
        data
    })
}

// 退出系统
export function loginOutApi(){
    return request({
        url: 'logOut'
    })
}
