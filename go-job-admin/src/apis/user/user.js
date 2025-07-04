import service from '@/apis/axios'
import {defaultPageSize} from "../common/common.js";

export function login(data={}) {
    return service({
        url: '/users/login', // 相对路径
        method: 'post',
        data,
    })
}


export function getUsers(params = defaultPageSize) {
    return service({
        url: '/users', // 相对路径
        method: 'get',
        params,
    })
}

// 查询单个用户
export function getUser() {
    return service({
        url: `/users/profile`,
        method: 'get',
    })
}

// 创建用户
export function createUser(data) {
    return service({
        url: `/users/add`,
        method: 'post',
        data,
    })
}

// 更新用户
export function updateUser(data) {
    return service({
        url: `/users/update`,
        method: 'put',
        data,
    })
}

// 删除用户
export function deleteUser(id) {
    return service({
        url: `/users/${id}`,
        method: 'delete',
    })
}

// 发送邮箱验证码
export function sendEmailCode(email) {
    return service({
        url: `/users/bind/email/code_send`,
        method: 'post',
        data: {
            email,
        },
    })
}

// 绑定邮箱验证码
export function bindEmail(data) {
    return service({
        url: `/users/bind/email`,
        method: 'post',
        data,
    })
}

export function bindOAuth2(data={}) {
    return service({
        url: `/users/oauth2/bind`,
        data: data,
        method: 'post',
    })
}

export function unbindOAuth2(data={}) {
    return service({
        url: `/users/oauth2/unbind`,
        method: 'post',
        data,
    })
}

export function getAccountSecurity() {
    return service({
        url: `/users/security`,
        method: 'get',
    })
}

export function oauth2Code(data={}){
    return service({
        url: '/users/oauth2/code',
        method: 'post',
        data: data,
    })
}