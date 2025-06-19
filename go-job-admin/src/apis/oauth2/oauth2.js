import service from '@/apis/axios'

export function getGithubAuthUrl(params={}) {
    return service({
        url: '/oauth2/github/authurl', // 相对路径
        params: params,
        method: 'get',
    })
}

export function getQQAuthUrl(params={}) {
    return service({
        url: `/oauth2/qq/authurl`, // 相对路径
        params: params,
        method: 'get',
    })
}

