import service from '@/apis/requests'


export function login(data={}) {
    return service({
        url: '/users/login', // 相对路径
        method: 'post',
        data,
    })
}