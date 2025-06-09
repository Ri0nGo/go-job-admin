import service from '@/apis/axios'

export function getGithubAuthUrl() {
    return service({
        url: '/oauth2/github/authurl', // 相对路径
        method: 'get',
    })
}

export function getQQAuthUrl() {
    return service({
        url: '/oauth2/qq/authurl', // 相对路径
        method: 'get',
    })
}