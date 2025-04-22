import service from '@/apis/requests'

// 发送邮箱验证码
export function sendEmailCode(email) {
    return service({
        url: '/users/email/code',
        method: 'post',
        data: { email }
    })
}

// 绑定邮箱
export function bindEmail(data) {
    return service({
        url: '/users/email/bind',
        method: 'post',
        data
    })
}